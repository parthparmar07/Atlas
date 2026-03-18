import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.admissions import Lead, Scholarship, ScholarshipMatch
from app.services.ai.gemini import gemini_client
from app.services.ai.groq_service import groq_client

class ScholarshipService:
    def _get_text_client(self):
        if groq_client.is_available():
            return groq_client
        if gemini_client.is_available():
            return gemini_client
        return None

    async def _ensure_default_scholarships(self, db: AsyncSession):
        s_result = await db.execute(select(Scholarship))
        scholarships = s_result.scalars().all()
        if scholarships:
            return scholarships

        defaults = [
            Scholarship(
                name="Atlas Merit Scholarship",
                provider="Atlas University",
                amount_max=100000,
                criteria_json={"min_score": 75, "programmes": ["B.Tech CSE", "MBA Finance", "M.Sc Data Science"]},
            ),
            Scholarship(
                name="Need Based Support Grant",
                provider="Atlas Foundation",
                amount_max=60000,
                criteria_json={"min_score": 45, "programmes": ["B.Tech CSE", "BBA", "MBA Finance"]},
            ),
            Scholarship(
                name="STEM Excellence Award",
                provider="Industry Consortium",
                amount_max=120000,
                criteria_json={"min_score": 80, "programmes": ["B.Tech CSE", "M.Sc Data Science", "B.Tech ECE"]},
            ),
        ]
        db.add_all(defaults)
        await db.commit()

        s_result = await db.execute(select(Scholarship))
        return s_result.scalars().all()

    def _rule_based_match(self, lead: Lead, scholarship: Scholarship) -> tuple[float, str]:
        criteria = scholarship.criteria_json or {}
        min_score = float(criteria.get("min_score", 0))
        programmes = [str(p).strip().lower() for p in criteria.get("programmes", [])]
        lead_programme = (lead.programme_interest or "").strip().lower()

        programme_fit = 1.0 if not programmes or lead_programme in programmes else 0.4
        score_fit = min(max((lead.score or 0) / 100, 0.0), 1.0)
        threshold_bonus = 0.15 if (lead.score or 0) >= min_score else -0.15
        final_score = max(0.0, min(100.0, ((programme_fit * 0.5) + (score_fit * 0.5) + threshold_bonus) * 100))
        reason = f"Programme fit {programme_fit:.2f}, score {lead.score or 0}, min required {min_score}."
        return final_score, reason

    async def match_lead_to_scholarships(self, lead_id: int, db: AsyncSession):
        # 1. Fetch lead
        result = await db.execute(select(Lead).where(Lead.id == lead_id))
        lead = result.scalar_one_or_none()
        if not lead: return []

        data = lead.parsed_resume or {}
        
        # 2. Fetch all scholarships
        scholarships = await self._ensure_default_scholarships(db)

        ai_client = self._get_text_client()
        matches = []
        for s in scholarships:
            if ai_client is None:
                match_score, reason = self._rule_based_match(lead, s)
                if match_score > 50:
                    sm = ScholarshipMatch(
                        lead_id=lead.id,
                        scholarship_id=s.id,
                        match_score=match_score,
                        match_reasons={"rule_reasoning": reason},
                    )
                    db.add(sm)
                    matches.append({"name": s.name, "score": match_score})
                continue

            prompt = f"""
            Determine if this student matches the scholarship criteria.
            Return ONLY a JSON dictionary: {{"match_score": 0-100, "reason": "brief reason"}}
            
            Student Profile:
            Programme: {lead.programme_interest}
            Score: {lead.score}
            Data: {json.dumps(data)}
            
            Scholarship Criteria:
            Name: {s.name}
            Provider: {s.provider}
            Criteria: {json.dumps(s.criteria_json)}
            """
            
            try:
                response = await ai_client.generate_text(prompt, temperature=0.1)
                raw = response.strip()
                if raw.startswith("```json"): raw = raw[7:]
                if raw.startswith("```"): raw = raw[3:]
                if raw.endswith("```"): raw = raw[:-3]
                res_data = json.loads(raw.strip())
                
                match_score = float(res_data.get("match_score", 0))
                if match_score > 50:
                    match_reasons = {"ai_reasoning": res_data.get("reason", "")}
                    sm = ScholarshipMatch(
                        lead_id=lead.id,
                        scholarship_id=s.id,
                        match_score=match_score,
                        match_reasons=match_reasons
                    )
                    db.add(sm)
                    matches.append({"name": s.name, "score": match_score})
            except Exception as e:
                print(f"Error matching scholarship {s.name}: {e}")
                
        await db.commit()
        return matches

scholarship_service = ScholarshipService()