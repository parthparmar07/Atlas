import json
import base64
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.admissions import LeadDocument
from app.modules.admissions.service import admissions_service
from app.services.ai.gemini import gemini_client
from app.core.config import settings
import google.generativeai as genai

class DocumentService:
    def _rule_verify(self, doc_type: str, file_bytes: bytes, mime_type: str, parsed: dict) -> dict:
        issues = []
        quality_points = 0

        text_len = int(parsed.get("text_length") or 0)
        has_identity = bool(parsed.get("name") or parsed.get("email") or parsed.get("phone"))
        has_academics = bool(
            (parsed.get("class_10_percent") or 0) > 0
            or (parsed.get("class_12_percent") or 0) > 0
            or parsed.get("entrance_scores")
        )

        if len(file_bytes) < 300:
            issues.append("File appears too small or truncated")
        else:
            quality_points += 20

        if text_len < 40:
            issues.append("Very low extractable text content")
        elif text_len < 150:
            quality_points += 10
        else:
            quality_points += 20

        if has_identity:
            quality_points += 20
        else:
            issues.append("Missing identity fields (name/email/phone)")

        if has_academics:
            quality_points += 20
        else:
            issues.append("No academic metrics detected")

        if "pdf" in (mime_type or "").lower():
            quality_points += 10

        doc_type_low = (doc_type or "").lower()
        if "marksheet" in doc_type_low and not has_academics:
            issues.append("Marksheet expected academic percentages or scores")

        if "resume" in doc_type_low:
            if not parsed.get("skills"):
                issues.append("Resume has no detected skills section")
            else:
                quality_points += 10

        confidence = max(0, min(100, quality_points - (len(issues) * 5)))
        is_valid = confidence >= 65 and not any("truncated" in i.lower() for i in issues)

        return {
            "is_valid": is_valid,
            "confidence_score": confidence,
            "issues_found": issues,
            "extracted_key_info": {
                "doc_type": doc_type,
                "mime_type": mime_type,
                "bytes": str(len(file_bytes)),
                "name": parsed.get("name", ""),
                "email": parsed.get("email", ""),
                "phone": parsed.get("phone", ""),
                "class_10_percent": parsed.get("class_10_percent", 0),
                "class_12_percent": parsed.get("class_12_percent", 0),
                "skills": parsed.get("skills", [])[:8],
                "parser_mode": parsed.get("parser_mode", "rules"),
                "text_length": text_len,
            },
        }

    async def verify_document(self, doc_id: int, file_bytes: bytes, mime_type: str, db: AsyncSession):
        # 1. Fetch document
        result = await db.execute(select(LeadDocument).where(LeadDocument.id == doc_id))
        doc = result.scalar_one_or_none()
        if not doc:
            return {
                "is_valid": False,
                "confidence_score": 0,
                "issues_found": ["Document record not found"],
                "extracted_key_info": {},
            }

        parsed = await admissions_service.parse_document(file_bytes, mime_type)
        fallback_res = self._rule_verify(doc.doc_type, file_bytes, mime_type, parsed)

        if not settings.gemini_api_key:
            res_data = fallback_res
            doc.verified = res_data.get("is_valid", False)
            doc.ai_extracted = res_data
            await db.commit()
            return res_data

        b64 = base64.b64encode(file_bytes).decode()
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.ai_model)

        prompt = f"""
        You are an admissions fraud detection and document verification agent.
        Analyze this {doc.doc_type} document carefully.
        Return ONLY a valid JSON object:
        {{
            "is_valid": true/false,
            "confidence_score": 0-100,
            "issues_found": ["Missing university stamp", "Date mismatch", or empty if good],
            "extracted_key_info": {{"school_name": "...", "passing_year": "..."}}
        }}
        """

        try:
            response = await model.generate_content_async([
                {"mime_type": mime_type, "data": b64},
                prompt
            ])
            raw = response.text.strip()
            if raw.startswith("```json"): raw = raw[7:]
            if raw.startswith("```"): raw = raw[3:]
            if raw.endswith("```"): raw = raw[:-3]
            res_data = json.loads(raw.strip())
            
            merged_info = dict(fallback_res.get("extracted_key_info", {}))
            merged_info.update(res_data.get("extracted_key_info") or {})

            if not isinstance(res_data.get("issues_found"), list):
                res_data["issues_found"] = []
            for issue in fallback_res.get("issues_found", []):
                if issue not in res_data["issues_found"]:
                    res_data["issues_found"].append(issue)

            if not isinstance(res_data.get("confidence_score"), (int, float)):
                res_data["confidence_score"] = fallback_res.get("confidence_score", 0)
            res_data["confidence_score"] = int(
                min(100, max(0, (float(res_data["confidence_score"]) + fallback_res.get("confidence_score", 0)) / 2))
            )
            res_data["extracted_key_info"] = merged_info

            doc.verified = bool(res_data.get("is_valid", False))
            doc.ai_extracted = res_data
            
            await db.commit()
            return res_data
        except Exception as e:
            print(f"Error verifying document {doc_id}: {e}")
            res_data = fallback_res
            res_data["issues_found"] = res_data.get("issues_found", []) + ["AI verification unavailable, rule fallback used"]
            doc.verified = res_data.get("is_valid", False)
            doc.ai_extracted = res_data
            await db.commit()
            return res_data

document_service = DocumentService()