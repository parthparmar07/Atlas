import base64
import io
import json
import re
from typing import Any
import pdfplumber
from app.services.ai.gemini import gemini_client
from app.services.ai.groq_service import groq_client
from app.core.config import settings

RESUME_PARSE_PROMPT = """
You are an admissions document parser. Extract the following from the document image/text.
Return ONLY valid JSON, no explanation.

{
  "name": "Full name",
  "email": "email if found",
  "phone": "phone if found",
  "class_10_percent": 0.0,
  "class_12_percent": 0.0,
  "class_12_stream": "Science/Commerce/Arts",
  "entrance_scores": {"JEE": null, "MHT-CET": null, "NEET": null},
  "skills": ["Python", "..."],
  "extracurriculars": ["..."],
  "achievements": ["..."],
  "gaps_in_education": false,
  "certifications": ["..."]
}
"""

SCORE_WEIGHTS = {
    "academics": 0.35,
    "programme_fit": 0.25,
    "engagement": 0.20,
    "location": 0.10,
    "source_quality": 0.10,
}

SOURCE_QUALITY = {
    "referral": 1.0, "walk_in": 0.9,
    "web_form": 0.7, "whatsapp": 0.6,
    "social": 0.5, "agent": 0.4,
}

class AdmissionsService:
    _EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
    _PHONE_RE = re.compile(r"(?:\+?91[\s-]?)?[6-9]\d{9}")

    def _get_text_client(self):
        if groq_client.is_available():
            return groq_client
        if gemini_client.is_available():
            return gemini_client
        return None

    def _extract_text(self, file_bytes: bytes, mime_type: str) -> str:
        if not file_bytes:
            return ""

        low_mime = (mime_type or "").lower()

        if "pdf" in low_mime or file_bytes[:4] == b"%PDF":
            try:
                with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                    chunks = [p.extract_text() or "" for p in pdf.pages]
                return "\n".join(c.strip() for c in chunks if c and c.strip())
            except Exception:
                return ""

        if "text" in low_mime or "json" in low_mime:
            try:
                return file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                return ""

        # Some image uploads still contain text-like binary chunks from OCR/export pipelines.
        try:
            raw = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            raw = ""
        return re.sub(r"\s+", " ", raw).strip()

    def _extract_percentage(self, text: str, label_patterns: list[str]) -> float:
        if not text:
            return 0.0

        for p in label_patterns:
            m = re.search(p, text, flags=re.IGNORECASE)
            if m:
                try:
                    val = float(m.group(1))
                    if 0 <= val <= 100:
                        return round(val, 2)
                except Exception:
                    continue

        for m in re.finditer(r"(\d{2}(?:\.\d{1,2})?)\s*%", text):
            val = float(m.group(1))
            if 0 <= val <= 100:
                return round(val, 2)
        return 0.0

    def _extract_list_after_label(self, text: str, labels: list[str]) -> list[str]:
        if not text:
            return []

        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        for line in lines:
            for label in labels:
                if re.match(rf"^{label}\s*[:\-]", line, flags=re.IGNORECASE):
                    line_val = re.sub(rf"^{label}\s*[:\-]\s*", "", line, flags=re.IGNORECASE)
                    items = [i.strip(" .") for i in re.split(r",|\||;", line_val) if i.strip()]
                    deduped = []
                    seen = set()
                    for item in items:
                        low = item.lower()
                        if low not in seen:
                            deduped.append(item)
                            seen.add(low)
                    return deduped[:12]

        for label in labels:
            m = re.search(
                rf"{label}\s*[:\-]\s*(.+?)(?:\b(?:achievements?|certifications?|projects?|education|experience|phone|email|name|class\s*\d{{2}})\b|$)",
                text,
                flags=re.IGNORECASE,
            )
            if m:
                line = m.group(1).strip()
                items = [i.strip(" .") for i in re.split(r",|\||;", line) if i.strip()]
                deduped = []
                seen = set()
                for item in items:
                    low = item.lower()
                    if low not in seen:
                        deduped.append(item)
                        seen.add(low)
                return deduped[:12]
        return []

    def _rule_parse_document(self, file_bytes: bytes, mime_type: str) -> dict[str, Any]:
        text = self._extract_text(file_bytes, mime_type)
        compact = re.sub(r"\s+", " ", text).strip()

        email_match = self._EMAIL_RE.search(compact)
        phone_match = self._PHONE_RE.search(compact)

        name = ""
        m_name = re.search(
            r"(?:name|candidate)\s*[:\-]\s*([A-Za-z][A-Za-z .'-]{1,50}?)(?=\s+(?:email|phone|class|address|skills|education)\b|$)",
            compact,
            flags=re.IGNORECASE,
        )
        if m_name:
            name = m_name.group(1).strip()
        else:
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            if lines:
                top = lines[0]
                if 3 <= len(top.split()) <= 5 and len(top) <= 60 and not re.search(r"resume|curriculum|vitae", top, flags=re.IGNORECASE):
                    name = top

        class_10 = self._extract_percentage(
            compact,
            [
                r"(?:class\s*10|ssc|x)(?:[^\d]{0,15})(\d{2}(?:\.\d{1,2})?)\s*%?",
                r"(?:10th)(?:[^\d]{0,15})(\d{2}(?:\.\d{1,2})?)\s*%?",
            ],
        )
        class_12 = self._extract_percentage(
            compact,
            [
                r"(?:class\s*12|hsc|xii)(?:[^\d]{0,15})(\d{2}(?:\.\d{1,2})?)\s*%?",
                r"(?:12th)(?:[^\d]{0,15})(\d{2}(?:\.\d{1,2})?)\s*%?",
            ],
        )

        stream = "Unknown"
        if re.search(r"science|pcm|pcb", compact, flags=re.IGNORECASE):
            stream = "Science"
        elif re.search(r"commerce|account", compact, flags=re.IGNORECASE):
            stream = "Commerce"
        elif re.search(r"arts|humanities", compact, flags=re.IGNORECASE):
            stream = "Arts"

        entrance_scores = {}
        for exam in ["JEE", "MHT-CET", "NEET", "CET", "CAT", "GATE"]:
            pattern = rf"{re.escape(exam)}(?:\s*(?:score|percentile|rank))?\s*[:\-]?\s*(\d{{1,3}}(?:\.\d{{1,2}})?)"
            m_exam = re.search(pattern, compact, flags=re.IGNORECASE)
            if m_exam:
                entrance_scores[exam] = float(m_exam.group(1))

        skills = self._extract_list_after_label(compact, ["skills", "technical skills", "core skills"])
        if not skills:
            known = [
                "Python", "Java", "C++", "SQL", "Excel", "Power BI", "Tableau", "Machine Learning",
                "React", "Node", "AutoCAD", "MATLAB", "Communication", "Leadership",
            ]
            skills = [k for k in known if re.search(rf"\b{re.escape(k)}\b", compact, flags=re.IGNORECASE)]

        extracurriculars = self._extract_list_after_label(compact, ["extracurricular", "activities", "co-curricular"])
        achievements = self._extract_list_after_label(compact, ["achievements", "awards", "accomplishments"])
        certifications = self._extract_list_after_label(compact, ["certifications", "certificates"])

        gaps = bool(re.search(r"gap\s*year|drop\s*year|education\s*gap", compact, flags=re.IGNORECASE))

        return {
            "name": name,
            "email": email_match.group(0) if email_match else "",
            "phone": phone_match.group(0) if phone_match else "",
            "class_10_percent": class_10,
            "class_12_percent": class_12,
            "class_12_stream": stream,
            "entrance_scores": entrance_scores,
            "skills": skills,
            "extracurriculars": extracurriculars,
            "achievements": achievements,
            "gaps_in_education": gaps,
            "certifications": certifications,
            "parser_mode": "rules",
            "text_length": len(compact),
            "doc_bytes": len(file_bytes),
            "mime_type": mime_type,
        }

    def _merge_parsed(self, base: dict[str, Any], ai_parsed: dict[str, Any]) -> dict[str, Any]:
        merged = dict(base)
        for key, val in ai_parsed.items():
            if val in (None, "", [], {}):
                continue
            if key in ("skills", "extracurriculars", "achievements", "certifications"):
                existing = merged.get(key) or []
                combined = existing + [x for x in val if isinstance(x, str)]
                dedup = []
                seen = set()
                for item in combined:
                    low = item.strip().lower()
                    if low and low not in seen:
                        dedup.append(item.strip())
                        seen.add(low)
                merged[key] = dedup[:20]
                continue
            merged[key] = val
        merged["parser_mode"] = "rules+ai" if ai_parsed else "rules"
        return merged

    async def parse_document(self, file_bytes: bytes, mime_type: str) -> dict[str, Any]:
        """Extract structured data from real document content with optional AI enrichment."""
        parsed = self._rule_parse_document(file_bytes, mime_type)

        if not settings.gemini_api_key:
            return parsed

        b64 = base64.b64encode(file_bytes).decode()
        import google.generativeai as genai
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(settings.ai_model)
        
        try:
            response = await model.generate_content_async([
                {"mime_type": mime_type, "data": b64},
                RESUME_PARSE_PROMPT
            ])
            raw = response.text.strip()
            if raw.startswith("```json"): raw = raw[7:]
            if raw.startswith("```"): raw = raw[3:]
            if raw.endswith("```"): raw = raw[:-3]
            ai_parsed = json.loads(raw.strip())
            return self._merge_parsed(parsed, ai_parsed)
        except Exception as e:
            print(f"Error parsing document: {e}")
            return parsed

    def calculate_score(self, parsed: dict, programme: str, source: str, engagement_events: int) -> tuple[float, dict]:
        breakdown = {}

        # Academics
        pct = max(
            parsed.get("class_12_percent", 0) or 0,
            parsed.get("class_10_percent", 0) or 0,
        )
        academic_score = min(pct / 100, 1.0) * 35
        # Bonus for entrance
        for score in (parsed.get("entrance_scores") or {}).values():
            if score and score > 90:
                academic_score = min(academic_score + 5, 35)
        breakdown["academics"] = round(academic_score, 1)

        # Programme fit
        PROGRAMME_KEYWORDS = {
            "B.Tech CSE": ["python", "coding", "programming", "java", "c++", "cs"],
            "MBA Finance": ["finance", "accounting", "economics", "ca", "commerce"],
            "B.Tech ECE": ["electronics", "circuit", "embedded", "arduino"],
        }
        keywords = PROGRAMME_KEYWORDS.get(programme, [])
        skills = [s.lower() for s in (parsed.get("skills") or [])]
        if keywords:
            matches = sum(1 for k in keywords if any(k in s for s in skills))
            fit_score = min(matches / len(keywords), 1.0) * 25
        else:
            fit_score = 12.5
        breakdown["programme_fit"] = round(fit_score, 1)

        # Engagement
        eng_score = min(engagement_events / 5, 1.0) * 20
        breakdown["engagement"] = round(eng_score, 1)

        # Location
        breakdown["location"] = 5.0

        # Source quality
        src_score = SOURCE_QUALITY.get(source, 0.5) * 10
        breakdown["source_quality"] = round(src_score, 1)

        total = sum(breakdown.values())
        return round(min(total, 100), 1), breakdown

    def get_tier(self, score: float) -> str:
        if score >= 75: return "hot"
        if score >= 45: return "warm"
        return "cold"

    async def generate_followup_message(self, lead_name: str, programme: str, channel: str, context: str = "") -> str:
        ai_client = self._get_text_client()
        if ai_client is None:
            prefix = "Hi" if channel.lower() == "whatsapp" else "Dear"
            suffix = "Please reply here and our admissions team will assist you." if channel.lower() == "whatsapp" else "Please reply to this email and we will guide you with the next steps."
            safe_context = context.strip() or "application progress"
            return (
                f"{prefix} {lead_name}, this is Atlas Admissions regarding {programme}. "
                f"We are following up on {safe_context}. {suffix}"
            )

        def _fallback_message() -> str:
            prefix = "Hi" if channel.lower() == "whatsapp" else "Dear"
            suffix = "Please reply here and our admissions team will assist you." if channel.lower() == "whatsapp" else "Please reply to this email and we will guide you with the next steps."
            safe_context = context.strip() or "application progress"
            return (
                f"{prefix} {lead_name}, this is Atlas Admissions regarding {programme}. "
                f"We are following up on {safe_context}. {suffix}"
            )

        prompt = f"""
You are an admissions counsellor at Atlas Skilltech University.
Write a warm, concise {channel} message (max 80 words for WhatsApp, 150 for email).
Prospect: {lead_name}, interested in {programme}.
Context: {context or 'Initial follow-up after enquiry.'}
Do not use generic phrases. Be specific and human.
"""
        try:
            return await ai_client.generate_text(prompt, temperature=0.7)
        except Exception:
            return _fallback_message()

    async def ai_profile_summary(self, lead: dict, parsed: dict) -> str:
        ai_client = self._get_text_client()
        if ai_client is None:
            score = float(lead.get("score") or 0)
            stage = lead.get("stage") or "new"
            programme = lead.get("programme") or "Unknown Programme"
            risk = "Low" if score >= 75 else "Medium" if score >= 45 else "High"
            return (
                f"- Programme interest: {programme}\n"
                f"- Current stage: {stage}\n"
                f"- Lead score: {score} ({self.get_tier(score)})\n"
                f"- Counsellor action: prioritize {'direct call' if score >= 75 else 'nurture follow-up'}; risk level {risk}."
            )

        prompt = f"""
Summarise this admissions lead for a counsellor in 4 bullet points.
Cover: academic strength, programme fit, risk factors, suggested approach.
Lead: {json.dumps({**lead, 'parsed_data': parsed}, indent=2)}
Be direct and specific. No generic advice.
"""
        try:
            return await ai_client.generate_text(prompt, temperature=0.3)
        except Exception:
            score = float(lead.get("score") or 0)
            stage = lead.get("stage") or "new"
            programme = lead.get("programme") or "Unknown Programme"
            risk = "Low" if score >= 75 else "Medium" if score >= 45 else "High"
            return (
                f"- Programme interest: {programme}\n"
                f"- Current stage: {stage}\n"
                f"- Lead score: {score} ({self.get_tier(score)})\n"
                f"- Counsellor action: prioritize {'direct call' if score >= 75 else 'nurture follow-up'}; risk level {risk}."
            )

    async def calculate_scholarship(self, lead_data: dict) -> dict:
        ai_client = self._get_text_client()
        if ai_client is None:
            return {}
        prompt = f"Based on this lead data: {json.dumps(lead_data)}, determine eligible scholarships. Consider academic scores, location, and program. Return JSON with 'amount', 'scholarship_name', and 'reasoning'."
        response = await ai_client.generate_text(prompt, temperature=0.1)
        try:
            return json.loads(response)
        except:
            return {}

admissions_service = AdmissionsService()
