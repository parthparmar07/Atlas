import json, base64
from typing import Any
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
    def _get_text_client(self):
        if groq_client.is_available():
            return groq_client
        if gemini_client.is_available():
            return gemini_client
        return None

    async def parse_document(self, file_bytes: bytes, mime_type: str) -> dict[str, Any]:
        """Use Gemini Vision to extract structured data from resume/marksheet."""
        if not settings.gemini_api_key:
            return {
                "name": "",
                "email": "",
                "phone": "",
                "class_10_percent": 0.0,
                "class_12_percent": 0.0,
                "class_12_stream": "Unknown",
                "entrance_scores": {},
                "skills": [],
                "extracurriculars": [],
                "achievements": [],
                "gaps_in_education": False,
                "certifications": [],
                "doc_bytes": len(file_bytes),
                "mime_type": mime_type,
            }

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
            return json.loads(raw.strip())
        except Exception as e:
            print(f"Error parsing document: {e}")
            return {}

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

        prompt = f"""
You are an admissions counsellor at Atlas Skilltech University.
Write a warm, concise {channel} message (max 80 words for WhatsApp, 150 for email).
Prospect: {lead_name}, interested in {programme}.
Context: {context or 'Initial follow-up after enquiry.'}
Do not use generic phrases. Be specific and human.
"""
        return await ai_client.generate_text(prompt, temperature=0.7)

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
        return await ai_client.generate_text(prompt, temperature=0.3)

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
