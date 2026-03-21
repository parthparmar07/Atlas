import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
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

    def _extract_profile_signals(self, lead: Lead) -> dict:
        profile = {
            "class_12_percent": 0.0,
            "class_10_percent": 0.0,
            "skills_count": 0,
            "certifications_count": 0,
            "text_length": 0,
            "docs_detected": 0,
        }

        parsed_resume = lead.parsed_resume if isinstance(lead.parsed_resume, dict) else {}
        doc_records = [v for v in parsed_resume.values() if isinstance(v, dict)]
        profile["docs_detected"] = len(doc_records)

        for record in doc_records:
            profile["class_12_percent"] = max(float(record.get("class_12_percent") or 0), profile["class_12_percent"])
            profile["class_10_percent"] = max(float(record.get("class_10_percent") or 0), profile["class_10_percent"])
            profile["skills_count"] += len(record.get("skills") or [])
            profile["certifications_count"] += len(record.get("certifications") or [])
            profile["text_length"] = max(int(record.get("text_length") or 0), profile["text_length"])

        return profile

    def _rule_based_match(self, lead: Lead, scholarship: Scholarship) -> tuple[float, str]:
        criteria = scholarship.criteria_json or {}
        min_score = float(criteria.get("min_score", 0))
        programmes = [str(p).strip().lower() for p in criteria.get("programmes", [])]
        lead_programme = (lead.programme_interest or "").strip().lower()
        profile = self._extract_profile_signals(lead)

        inferred_merit = max(
            float(lead.score or 0),
            profile["class_12_percent"],
            profile["class_10_percent"],
        )

        programme_fit = 1.0 if not programmes or lead_programme in programmes else 0.4
        score_fit = min(max(inferred_merit / 100, 0.0), 1.0)
        profile_richness = min(1.0, (profile["skills_count"] * 0.04) + (profile["certifications_count"] * 0.06))
        threshold_bonus = 0.12 if inferred_merit >= min_score else -0.18

        # If we have no parsed profile evidence, apply reliability penalty.
        evidence_penalty = -0.10 if profile["docs_detected"] == 0 or profile["text_length"] < 40 else 0.0

        final_score = max(
            0.0,
            min(
                100.0,
                ((programme_fit * 0.40) + (score_fit * 0.45) + (profile_richness * 0.15) + threshold_bonus + evidence_penalty) * 100,
            ),
        )
        reason = (
            f"Programme fit {programme_fit:.2f}, merit {round(inferred_merit, 1)}, "
            f"profile docs {profile['docs_detected']}, min required {min_score}."
        )
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

        existing_result = await db.execute(
            select(ScholarshipMatch).where(ScholarshipMatch.lead_id == lead.id)
        )
        existing_by_scholarship = {
            m.scholarship_id: m for m in existing_result.scalars().all()
        }

        matches = []
        persist_threshold = 40
        for s in scholarships:
            match_score = 0.0
            reason = ""
            matched_by = "rule-engine"

            if ai_client is None:
                match_score, reason = self._rule_based_match(lead, s)
            else:
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
                    reason = str(res_data.get("reason", ""))
                    matched_by = "ai"
                except Exception:
                    match_score, reason = self._rule_based_match(lead, s)
                    matched_by = "rule-fallback"

            eligibility = "provisional_eligible" if match_score >= persist_threshold else "low_confidence"

            if match_score >= persist_threshold:
                existing = existing_by_scholarship.get(s.id)
                reasons = {"reason": reason, "matched_by": matched_by}

                if existing:
                    existing.match_score = match_score
                    existing.match_reasons = reasons
                else:
                    db.add(
                        ScholarshipMatch(
                            lead_id=lead.id,
                            scholarship_id=s.id,
                            match_score=match_score,
                            match_reasons=reasons,
                        )
                    )
            matches.append(
                {
                    "scholarship_id": s.id,
                    "name": s.name,
                    "provider": s.provider,
                    "amount_max": s.amount_max,
                    "score": round(match_score, 2),
                    "reason": reason,
                    "matched_by": matched_by,
                    "eligibility": eligibility,
                }
            )
                
        await db.commit()
        matches.sort(key=lambda m: m["score"], reverse=True)
        return matches

scholarship_service = ScholarshipService()