import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, List

from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.admissions import Lead, Scholarship, ScholarshipMatch
from app.modules.admissions.scholarship_service import scholarship_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase

logger = logging.getLogger(__name__)

class ScholarshipMatcherAgent(AgentBase):
    agent_id = "admissions-scholarship"
    agent_name = "Atlas Scholarship Intelligence Agent"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Atlas Scholarship Intelligence Agent for Atlas Skilltech University.

IDENTITY
Name: Atlas Scholarship AI
Tone: Eligibility-precise, student-supportive, deadline-aware.

YOUR RESPONSIBILITIES
1. Match student profiles to central, state, and institutional scholarship schemes.
2. Explain eligibility rationale clearly and transparently.
3. Track application status lifecycle and deadline risk.
4. Maintain scheme catalog currency and deprecate expired schemes.
5. Generate recommendation/cover-letter drafts aligned to scheme requirements.

CONSTRAINTS
- Never mark a student as finally approved; only eligible/provisionally eligible.
- Always include required documents and deadline context.
- Flag missing profile fields that block eligibility decisions.

OUTPUT FORMAT
Return ranked scholarship match table with score, matched conditions, pending conditions, required documents, and deadline urgency."""

    ACTION_PROMPTS = {
        "Match Now": """Run scholarship matching for current student pool.
Output top matches with student, scheme, score, criteria-met, required-documents, and deadline urgency.""",

        "Update Database": """Generate scholarship catalog update proposal for current cycle.
Include new schemes, changed criteria, deadline updates, and expired scheme retirement list.""",

        "Generate Letters": """Generate scholarship recommendation letters tailored to matched scheme requirements.
Ensure each draft references profile strengths and required eligibility alignment.""",

        "Track Applications": """Generate scholarship application tracking report.
Include submission state, pending documents, expected decision window, and escalation reminders.""",
    }

    def _parse_context(self, context: str) -> dict[str, Any]:
        if not context:
            return {}

        stripped = context.strip()
        if stripped.startswith("{"):
            try:
                parsed = json.loads(stripped)
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                pass

        parsed: dict[str, Any] = {}
        for line in context.splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            parsed[key.strip().lower().replace(" ", "_")] = value.strip()
        return parsed

    def _to_int(self, raw: Any, default: int) -> int:
        try:
            value = int(str(raw).strip())
            return value if value > 0 else default
        except Exception:
            return default

    def _extract_lead_id(self, context: dict[str, Any]) -> int | None:
        direct = context.get("lead_id") or context.get("leadid")
        if direct is not None:
            try:
                return int(str(direct).strip())
            except Exception:
                pass

        student = str(context.get("student_id") or "").strip()
        if student.isdigit():
            try:
                return int(student)
            except Exception:
                return None
        return None

    async def _match_now(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        lead_id = self._extract_lead_id(context)
        limit = self._to_int(context.get("limit") or 15, 15)

        async with async_session_maker() as db:
            if lead_id is not None:
                row = await db.execute(select(Lead).where(Lead.id == lead_id))
                single = row.scalar_one_or_none()
                if single:
                    leads = [single]
                else:
                    rows = await db.execute(select(Lead).order_by(Lead.score.desc(), Lead.id.desc()).limit(limit))
                    leads = rows.scalars().all()
            else:
                rows = await db.execute(select(Lead).order_by(Lead.score.desc(), Lead.id.desc()).limit(limit))
                leads = rows.scalars().all()

            if not leads:
                state.reflection = "No leads available for scholarship matching."
                return [{"status": "candidate_selection", "lead_count": 0}]

            lead_results: list[dict[str, Any]] = []
            total_matches = 0
            for lead in leads:
                matches = await scholarship_service.match_lead_to_scholarships(lead.id, db)
                total_matches += len(matches)
                lead_results.append(
                    {
                        "lead_id": lead.id,
                        "name": lead.name,
                        "lead_score": lead.score,
                        "matches_count": len(matches),
                        "top_match": matches[0] if matches else None,
                    }
                )

        state.reflection = f"Matched {len(lead_results)} leads against active scholarship catalog."
        return [
            {"status": "candidate_selection", "lead_count": len(lead_results), "requested_lead_id": lead_id},
            {
                "status": "matching_completed",
                "total_matches": total_matches,
                "lead_results": lead_results,
            },
        ]

    async def _update_database(self, state: AgentState) -> List[Any]:
        now = datetime.now(timezone.utc)

        async with async_session_maker() as db:
            scholarships = await scholarship_service._ensure_default_scholarships(db)

            updated = 0
            normalized: list[dict[str, Any]] = []
            for scheme in scholarships:
                criteria = scheme.criteria_json or {}
                if not isinstance(criteria, dict):
                    criteria = {}

                min_score = float(criteria.get("min_score") or 0)
                if min_score < 35:
                    criteria["min_score"] = 35
                    updated += 1

                programmes = criteria.get("programmes") or []
                if not programmes:
                    criteria["programmes"] = ["B.Tech CSE", "MBA Finance", "M.Sc Data Science"]
                    updated += 1

                scheme.criteria_json = criteria
                if scheme.deadline is None:
                    scheme.deadline = now + timedelta(days=45)
                    updated += 1

                normalized.append(
                    {
                        "scholarship_id": scheme.id,
                        "name": scheme.name,
                        "min_score": scheme.criteria_json.get("min_score"),
                        "deadline": scheme.deadline.isoformat() if scheme.deadline else None,
                    }
                )

            await db.commit()

        state.reflection = (
            f"Scholarship catalog synced: {len(normalized)} schemes reviewed, {updated} fields normalized."
        )
        return [
            {"status": "catalog_loaded", "scheme_count": len(normalized)},
            {"status": "catalog_updated", "updated_fields": updated, "schemes": normalized},
        ]

    async def _generate_letters(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or 12, 12)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(ScholarshipMatch, Lead, Scholarship)
                .join(Lead, Lead.id == ScholarshipMatch.lead_id)
                .join(Scholarship, Scholarship.id == ScholarshipMatch.scholarship_id)
                .order_by(ScholarshipMatch.match_score.desc())
                .limit(limit)
            )
            triples = rows.all()

        letters: list[dict[str, Any]] = []
        for match, lead, scholarship in triples:
            draft = (
                f"To the Selection Committee of {scholarship.name},\n\n"
                f"I am writing to recommend {lead.name} for consideration. "
                f"The applicant demonstrates a strong alignment for {lead.programme_interest} "
                f"with a current suitability score of {round(match.match_score, 1)}%.\n\n"
                f"Key strengths include academic consistency, programme fit, and continued engagement. "
                f"Please consider this as a recommendation for provisional eligibility."
            )
            letters.append(
                {
                    "lead_id": lead.id,
                    "lead_name": lead.name,
                    "scholarship": scholarship.name,
                    "provider": scholarship.provider,
                    "match_score": round(match.match_score, 1),
                    "draft": draft,
                }
            )

        state.reflection = f"Generated {len(letters)} scholarship recommendation drafts."
        return [
            {"status": "letter_candidates_loaded", "candidate_count": len(letters)},
            {"status": "letters_generated", "letters": letters},
        ]

    async def _track_applications(self, state: AgentState) -> List[Any]:
        now = datetime.now(timezone.utc)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(ScholarshipMatch, Lead, Scholarship)
                .join(Lead, Lead.id == ScholarshipMatch.lead_id)
                .join(Scholarship, Scholarship.id == ScholarshipMatch.scholarship_id)
                .order_by(ScholarshipMatch.match_score.desc())
            )
            triples = rows.all()

        tracker: list[dict[str, Any]] = []
        applied_count = 0
        high_urgency = 0

        for match, lead, scholarship in triples:
            deadline = scholarship.deadline
            days_to_deadline = None
            urgency = "low"

            if deadline is not None:
                days_to_deadline = int((deadline - now).total_seconds() // 86400)
                if days_to_deadline <= 7:
                    urgency = "high"
                    high_urgency += 1
                elif days_to_deadline <= 21:
                    urgency = "medium"

            if match.applied:
                applied_count += 1

            tracker.append(
                {
                    "lead_id": lead.id,
                    "lead_name": lead.name,
                    "scholarship": scholarship.name,
                    "match_score": round(match.match_score, 1),
                    "applied": bool(match.applied),
                    "deadline": deadline.isoformat() if deadline else None,
                    "days_to_deadline": days_to_deadline,
                    "deadline_urgency": urgency,
                }
            )

        state.reflection = (
            f"Tracked {len(tracker)} scholarship applications. "
            f"Applied: {applied_count}, high urgency: {high_urgency}."
        )
        return [
            {
                "status": "tracking_snapshot_ready",
                "total_records": len(tracker),
                "applied_count": applied_count,
                "high_urgency_count": high_urgency,
            },
            {"status": "tracking_completed", "applications": tracker},
        ]

    async def execute(self, state: AgentState) -> List[Any]:
        context = self._parse_context(state.context)
        try:
            if state.goal == "Match Now":
                return await self._match_now(state, context)
            if state.goal == "Update Database":
                return await self._update_database(state)
            if state.goal == "Generate Letters":
                return await self._generate_letters(state, context)
            if state.goal == "Track Applications":
                return await self._track_applications(state)
        except Exception as exc:
            logger.exception("Scholarship matcher execution failed for goal=%s", state.goal)
            state.reflection = f"Execution failed for '{state.goal}': {exc}"
            return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

        state.reflection = f"No execution branch found for '{state.goal}'."
        return [{"status": "unsupported_action", "goal": state.goal}]

    async def reflect(self, state: AgentState) -> str:
        if state.reflection:
            return state.reflection
        return await super().reflect(state)

