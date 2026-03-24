import json
import logging
import mimetypes
import os
from datetime import datetime, timedelta, timezone
from typing import Any, List

from sqlalchemy import func, select

from app.core.database import async_session_maker
from app.models.admissions import Lead, LeadDocument, LeadInteraction, LeadStage
from app.modules.admissions.scholarship_service import scholarship_service
from app.modules.admissions.service import admissions_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase

logger = logging.getLogger(__name__)

class AdmissionsIntelligenceAgent(AgentBase):
    agent_id = "admissions-intelligence"
    agent_name = "Admissions Intelligence"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Admissions Intelligence Agent for Atlas University.
    You autonomously decompose admissions goals into actionable data queries and analysis steps.
    You use available Python tools to fetch applicant data, run ML heuristics, and generate reports."""

    def get_action_prompts(self) -> dict[str, str]:
        # Keep for UI compatibility, but these are now "Goals"
        return {
            "Qualify Leads": "Score recent applications",
            "Parse Documents": "Extract structured data from transcripts",
            "Track Funnel": "Show stage-wise counts and conversion rates",
            "Generate Follow-Up Messages": "Create personalised WhatsApp/Email nurture text",
            "Match Scholarships": "Check eligibility against Central, State, and Institutional schemes",
            "Brief Counsellors": "Generate pre-call briefing packs with objections and talking points"
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

    async def _qualify_leads(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        batch_size = self._to_int(context.get("batch_size") or context.get("batch") or 50, 50)
        programme_filter = str(context.get("programme_filter") or context.get("programme") or "").strip()
        if programme_filter.lower() in {"all", "all_programmes", "all programmes"}:
            programme_filter = ""

        async with async_session_maker() as db:
            query = select(Lead).order_by(Lead.last_activity_at.desc(), Lead.id.desc()).limit(batch_size)
            if programme_filter:
                query = query.where(Lead.programme_interest.ilike(f"%{programme_filter}%"))

            lead_rows = await db.execute(query)
            leads = lead_rows.scalars().all()
            if not leads:
                state.reflection = "No leads available to score for the selected filter."
                return [{"status": "lead_batch_loaded", "records": 0, "programme_filter": programme_filter or "all"}]

            lead_ids = [lead.id for lead in leads]
            interaction_rows = await db.execute(
                select(LeadInteraction.lead_id, func.count())
                .where(LeadInteraction.lead_id.in_(lead_ids))
                .group_by(LeadInteraction.lead_id)
            )
            interactions = {row[0]: int(row[1]) for row in interaction_rows.all()}

            tier_distribution = {"hot": 0, "warm": 0, "cold": 0}
            updated_scores = 0
            scored_payload: list[dict[str, Any]] = []

            for lead in leads:
                parsed_blob = {}
                if isinstance(lead.parsed_resume, dict):
                    first_doc = next((v for v in lead.parsed_resume.values() if isinstance(v, dict)), {})
                    if isinstance(first_doc, dict):
                        parsed_blob = first_doc

                source_val = lead.source.value if hasattr(lead.source, "value") else str(lead.source)
                score, breakdown = admissions_service.calculate_score(
                    parsed_blob,
                    lead.programme_interest,
                    source_val,
                    interactions.get(lead.id, 0),
                )

                if abs((lead.score or 0.0) - score) > 0.01:
                    updated_scores += 1

                lead.score = score
                lead.score_breakdown = breakdown

                tier = admissions_service.get_tier(score)
                tier_distribution[tier] += 1

                if tier == "hot" and lead.stage == LeadStage.NEW:
                    lead.stage = LeadStage.CONTACTED

                scored_payload.append(
                    {
                        "lead_id": lead.id,
                        "name": lead.name,
                        "programme": lead.programme_interest,
                        "score": score,
                        "tier": tier,
                        "interactions": interactions.get(lead.id, 0),
                    }
                )

            await db.commit()

        ranked = sorted(scored_payload, key=lambda x: float(x.get("score") or 0), reverse=True)
        state.reflection = (
            f"Qualified {len(scored_payload)} leads. "
            f"Hot:{tier_distribution['hot']} Warm:{tier_distribution['warm']} Cold:{tier_distribution['cold']}."
        )

        return [
            {
                "status": "lead_batch_loaded",
                "records": len(scored_payload),
                "programme_filter": programme_filter or "all",
            },
            {
                "status": "scoring_completed",
                "records_processed": len(scored_payload),
                "updated_scores": updated_scores,
                "tier_distribution": tier_distribution,
                "top_candidates": ranked[:5],
            },
        ]

    async def _parse_documents(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or context.get("batch_size") or 10, 10)
        doc_type = str(context.get("doc_type") or "").strip().lower()
        if doc_type in {"all", "all documents"}:
            doc_type = ""

        async with async_session_maker() as db:
            query = select(LeadDocument).order_by(LeadDocument.uploaded_at.desc(), LeadDocument.id.desc()).limit(limit)
            if doc_type:
                query = query.where(LeadDocument.doc_type.ilike(f"%{doc_type}%"))

            doc_rows = await db.execute(query)
            docs = doc_rows.scalars().all()
            if not docs:
                state.reflection = "No documents found for parsing."
                return [{"status": "documents_selected", "records": 0, "doc_type": doc_type or "all"}]

            parsed_count = 0
            missing_files = 0
            updated_leads = 0
            sample: list[dict[str, Any]] = []

            for doc in docs:
                if not os.path.exists(doc.file_path):
                    missing_files += 1
                    continue

                with open(doc.file_path, "rb") as fh:
                    payload = fh.read()

                guessed_mime, _ = mimetypes.guess_type(doc.file_path)
                mime_type = guessed_mime or "application/octet-stream"

                parsed = await admissions_service.parse_document(payload, mime_type)
                doc.ai_extracted = parsed
                parsed_count += 1

                lead = await db.scalar(select(Lead).where(Lead.id == doc.lead_id))
                if lead:
                    existing = lead.parsed_resume or {}
                    if not isinstance(existing, dict):
                        existing = {}
                    existing[str(doc.id)] = parsed
                    lead.parsed_resume = existing

                    interactions = await db.scalar(
                        select(func.count()).select_from(LeadInteraction).where(LeadInteraction.lead_id == lead.id)
                    )
                    source_val = lead.source.value if hasattr(lead.source, "value") else str(lead.source)
                    score, breakdown = admissions_service.calculate_score(
                        parsed,
                        lead.programme_interest,
                        source_val,
                        int(interactions or 0),
                    )
                    lead.score = score
                    lead.score_breakdown = breakdown
                    updated_leads += 1

                if len(sample) < 4:
                    sample.append(
                        {
                            "doc_id": doc.id,
                            "lead_id": doc.lead_id,
                            "doc_type": doc.doc_type,
                            "name": parsed.get("name", ""),
                            "class_12_percent": parsed.get("class_12_percent", 0),
                            "skills_detected": len(parsed.get("skills", [])),
                        }
                    )

            await db.commit()

        state.reflection = (
            f"Parsed {parsed_count} documents and refreshed scoring for {updated_leads} lead profiles."
        )
        return [
            {
                "status": "documents_selected",
                "records": len(docs),
                "doc_type": doc_type or "all",
            },
            {
                "status": "document_parsing_completed",
                "parsed_count": parsed_count,
                "missing_files": missing_files,
                "updated_leads": updated_leads,
                "sample_extractions": sample,
            },
        ]

    async def _track_funnel(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        now = datetime.now(timezone.utc)
        stale_days = self._to_int(context.get("stale_after_days") or 5, 5)
        stale_cutoff = now - timedelta(days=stale_days)

        async with async_session_maker() as db:
            stage_rows = await db.execute(select(Lead.stage, func.count()).group_by(Lead.stage))
            stage_counts = {
                (row[0].value if hasattr(row[0], "value") else str(row[0])): int(row[1])
                for row in stage_rows.all()
            }
            total = int(sum(stage_counts.values()))

            stalled_rows = await db.execute(
                select(Lead)
                .where(
                    Lead.last_activity_at < stale_cutoff,
                    Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]),
                )
                .order_by(Lead.last_activity_at.asc())
                .limit(10)
            )
            stalled = stalled_rows.scalars().all()

        applied = stage_counts.get("applied", 0)
        contacted = stage_counts.get("contacted", 0)
        enrolled = stage_counts.get("enrolled", 0)
        new = stage_counts.get("new", 0)

        conversion = {
            "new_to_contacted_pct": round((contacted / new) * 100, 1) if new else 0.0,
            "contacted_to_applied_pct": round((applied / contacted) * 100, 1) if contacted else 0.0,
            "applied_to_enrolled_pct": round((enrolled / applied) * 100, 1) if applied else 0.0,
        }

        stalled_payload = [
            {
                "lead_id": lead.id,
                "name": lead.name,
                "stage": lead.stage.value if hasattr(lead.stage, "value") else str(lead.stage),
                "days_inactive": max(0, int((now - lead.last_activity_at).total_seconds() // 86400)),
            }
            for lead in stalled
        ]

        state.reflection = (
            f"Tracked funnel across {total} leads. "
            f"Found {len(stalled_payload)} stalled leads needing intervention (>{stale_days} days inactive)."
        )
        return [
            {
                "status": "funnel_snapshot_ready",
                "total_leads": total,
                "stage_counts": stage_counts,
                "stale_after_days": stale_days,
            },
            {
                "status": "funnel_analysis_completed",
                "conversion_rates": conversion,
                "stalled_leads": stalled_payload,
            },
        ]

    async def _generate_followups(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        channel = str(context.get("channel") or "whatsapp").strip().lower() or "whatsapp"
        stale_after_days = self._to_int(context.get("days_stale") or 3, 3)
        custom_context = str(context.get("additional_instructions") or context.get("context") or "").strip()
        cutoff = datetime.now(timezone.utc) - timedelta(days=stale_after_days)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(
                    Lead.nurture_active.is_(True),
                    Lead.last_activity_at < cutoff,
                    Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]),
                )
                .order_by(Lead.score.desc(), Lead.id.desc())
                .limit(20)
            )
            leads = rows.scalars().all()

            sent = 0
            samples: list[dict[str, Any]] = []
            for lead in leads:
                message = await admissions_service.generate_followup_message(
                    lead.name,
                    lead.programme_interest,
                    channel,
                    custom_context or "Follow up on application status and missing requirements.",
                )
                db.add(
                    LeadInteraction(
                        lead_id=lead.id,
                        interaction_type=f"auto_followup_{channel}",
                        notes=message,
                        next_action="await_response",
                    )
                )
                lead.nurture_step = int(lead.nurture_step or 0) + 1
                lead.last_activity_at = datetime.now(timezone.utc)
                sent += 1

                if len(samples) < 5:
                    samples.append({"lead_id": lead.id, "name": lead.name, "preview": message[:140]})

            await db.commit()

        state.reflection = f"Generated {sent} personalized {channel} follow-up messages for stale leads."
        return [
            {
                "status": "stale_leads_selected",
                "channel": channel,
                "stale_after_days": stale_after_days,
                "candidate_count": sent,
            },
            {
                "status": "followup_generation_completed",
                "messages_generated": sent,
                "sample_messages": samples,
            },
        ]

    async def _match_scholarships(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        min_score = float(context.get("min_score") or 50)
        limit = self._to_int(context.get("limit") or 10, 10)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(Lead.score >= min_score)
                .order_by(Lead.score.desc(), Lead.id.desc())
                .limit(limit)
            )
            leads = rows.scalars().all()

            leaderboard: list[dict[str, Any]] = []
            total_matches = 0
            for lead in leads:
                matches = await scholarship_service.match_lead_to_scholarships(lead.id, db)
                total_matches += len(matches)
                leaderboard.append(
                    {
                        "lead_id": lead.id,
                        "name": lead.name,
                        "lead_score": lead.score,
                        "matches": len(matches),
                        "top_match": matches[0] if matches else None,
                    }
                )

        state.reflection = f"Matched {len(leads)} leads against scholarship schemes with {total_matches} total matches."
        return [
            {"status": "scholarship_candidates_selected", "lead_count": len(leads), "min_score": min_score},
            {
                "status": "scholarship_matching_completed",
                "total_matches": total_matches,
                "lead_results": leaderboard,
            },
        ]

    async def _brief_counsellors(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or 8, 8)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]))
                .order_by(Lead.score.desc(), Lead.last_activity_at.asc())
                .limit(limit)
            )
            leads = rows.scalars().all()

        briefs: list[dict[str, Any]] = []
        for lead in leads:
            summary = await admissions_service.ai_profile_summary(
                {
                    "name": lead.name,
                    "programme": lead.programme_interest,
                    "score": lead.score,
                    "stage": lead.stage.value if hasattr(lead.stage, "value") else str(lead.stage),
                },
                lead.parsed_resume or {},
            )
            briefs.append(
                {
                    "lead_id": lead.id,
                    "name": lead.name,
                    "score": lead.score,
                    "programme": lead.programme_interest,
                    "brief": summary,
                    "recommended_next_action": "priority_call" if (lead.score or 0) >= 75 else "nurture_followup",
                }
            )

        state.reflection = f"Prepared counsellor briefings for {len(briefs)} active leads."
        return [
            {"status": "lead_briefing_scope_ready", "records": len(briefs)},
            {"status": "counsellor_briefings_completed", "briefings": briefs},
        ]
