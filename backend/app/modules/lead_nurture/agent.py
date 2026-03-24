import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, List

from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.admissions import Lead, LeadInteraction, LeadStage
from app.modules.admissions.scholarship_service import scholarship_service
from app.modules.admissions.service import admissions_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase

logger = logging.getLogger(__name__)


class LeadNurtureAgent(AgentBase):
    agent_id = "admissions-leads"
    agent_name = "Lead Nurture Agent"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Lead Nurture Agent for Atlas University.
You personalise outreach messages for prospective students, segment them by interest,
predict drop-off risk, and trigger automated communication workflows.
Focus on conversion optimisation and personalisation."""

    ACTION_PROMPTS = {
        "Send Campaigns": """Draft personalised outreach messages for three lead segments:
(1) Engineering aspirants from Tier-2 cities, (2) MBA prospects with 2+ years work experience,
(3) Scholarship-eligible students from rural districts.
Each message should include a personalised hook, program highlight, and call to action.""",
        "Check Drop-offs": """Identify leads at high drop-off risk based on engagement signals.
Return: leads not opened last 3 emails, leads who visited fee page but didn't apply,
leads dormant for 14+ days. Include recommended re-engagement sequence.""",
        "Segment Leads": """Segment the current lead database into 5 behavioural cohorts.
For each cohort define: size, key traits, recommended nurture track, and expected conversion rate.""",
        "Match Scholarships": """For the top 30 high-intent leads, identify matching scholarship schemes
from the catalogue. Return: lead pseudonym, matched scheme name, eligibility confidence, and application deadline.""",
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

    async def _send_campaigns(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        channel = str(context.get("channel") or "whatsapp").strip().lower() or "whatsapp"
        limit_per_segment = self._to_int(context.get("limit_per_segment") or 4, 4)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]))
                .order_by(Lead.score.desc(), Lead.last_activity_at.asc())
                .limit(120)
            )
            leads = rows.scalars().all()

            segments = {
                "high_intent": [lead for lead in leads if (lead.score or 0) >= 80][:limit_per_segment],
                "warm_intent": [lead for lead in leads if 50 <= (lead.score or 0) < 80][:limit_per_segment],
                "cold_intent": [lead for lead in leads if (lead.score or 0) < 50][:limit_per_segment],
            }

            sent = 0
            campaign_log: list[dict[str, Any]] = []
            for segment, segment_leads in segments.items():
                for lead in segment_leads:
                    message = await admissions_service.generate_followup_message(
                        lead.name,
                        lead.programme_interest,
                        channel,
                        f"Campaign segment: {segment}. Focus on relevance and clear CTA.",
                    )
                    db.add(
                        LeadInteraction(
                            lead_id=lead.id,
                            interaction_type=f"campaign_{channel}",
                            notes=message,
                            next_action="await_response",
                        )
                    )
                    lead.nurture_step = int(lead.nurture_step or 0) + 1
                    lead.last_activity_at = datetime.now(timezone.utc)
                    sent += 1

                    if len(campaign_log) < 8:
                        campaign_log.append(
                            {
                                "lead_id": lead.id,
                                "segment": segment,
                                "channel": channel,
                                "preview": message[:130],
                            }
                        )

            await db.commit()

        state.reflection = f"Dispatched {sent} nurture campaign messages across 3 lead segments."
        return [
            {
                "status": "campaign_segments_prepared",
                "channel": channel,
                "limit_per_segment": limit_per_segment,
                "segments": {
                    "high_intent": len(segments["high_intent"]),
                    "warm_intent": len(segments["warm_intent"]),
                    "cold_intent": len(segments["cold_intent"]),
                },
            },
            {
                "status": "campaigns_dispatched",
                "messages_sent": sent,
                "sample_dispatch": campaign_log,
            },
        ]

    async def _check_dropoffs(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        stale_days = self._to_int(context.get("stale_days") or 14, 14)
        drop_days = self._to_int(context.get("drop_days") or 30, 30)
        now = datetime.now(timezone.utc)
        stale_cutoff = now - timedelta(days=stale_days)
        drop_cutoff = now - timedelta(days=drop_days)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(
                    Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]),
                    Lead.last_activity_at < stale_cutoff,
                )
                .order_by(Lead.last_activity_at.asc())
                .limit(100)
            )
            stale_leads = rows.scalars().all()

            at_risk: list[dict[str, Any]] = []
            dropped: list[dict[str, Any]] = []

            for lead in stale_leads:
                inactive_days = int((now - lead.last_activity_at).total_seconds() // 86400)
                lead_payload = {
                    "lead_id": lead.id,
                    "name": lead.name,
                    "stage": lead.stage.value if hasattr(lead.stage, "value") else str(lead.stage),
                    "inactive_days": inactive_days,
                    "score": lead.score,
                }

                if lead.last_activity_at < drop_cutoff:
                    lead.stage = LeadStage.DROPPED
                    lead.nurture_active = False
                    dropped.append(lead_payload)
                else:
                    at_risk.append(lead_payload)

            await db.commit()

        state.reflection = (
            f"Drop-off analysis complete: {len(at_risk)} leads at risk, "
            f"{len(dropped)} auto-marked as dropped."
        )
        return [
            {
                "status": "dropoff_candidates_identified",
                "stale_after_days": stale_days,
                "drop_after_days": drop_days,
                "candidate_count": len(stale_leads),
            },
            {
                "status": "dropoff_analysis_completed",
                "at_risk": at_risk,
                "dropped": dropped,
            },
        ]

    async def _segment_leads(self, state: AgentState) -> List[Any]:
        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]))
                .order_by(Lead.score.desc())
            )
            leads = rows.scalars().all()

        segment_counts = {
            "hot": 0,
            "warm": 0,
            "cold": 0,
            "new_enquiries": 0,
            "applied_ready": 0,
        }
        source_mix: dict[str, int] = {}
        programme_mix: dict[str, int] = {}

        for lead in leads:
            tier = admissions_service.get_tier(float(lead.score or 0))
            segment_counts[tier] += 1
            if lead.stage == LeadStage.NEW:
                segment_counts["new_enquiries"] += 1
            if lead.stage in {LeadStage.CONTACTED, LeadStage.APPLIED, LeadStage.DOCS_PENDING} and (lead.score or 0) >= 70:
                segment_counts["applied_ready"] += 1

            source_key = lead.source.value if hasattr(lead.source, "value") else str(lead.source)
            source_mix[source_key] = source_mix.get(source_key, 0) + 1
            programme_mix[lead.programme_interest] = programme_mix.get(lead.programme_interest, 0) + 1

        total = max(1, len(leads))
        expected_conversion = round(
            (
                (segment_counts["hot"] * 0.42)
                + (segment_counts["warm"] * 0.22)
                + (segment_counts["cold"] * 0.06)
            )
            / total
            * 100,
            1,
        )

        top_programmes = sorted(programme_mix.items(), key=lambda x: x[1], reverse=True)[:5]
        state.reflection = (
            f"Segmented {len(leads)} active leads into behavioural cohorts. "
            f"Expected conversion baseline: {expected_conversion}%."
        )

        return [
            {
                "status": "segmentation_completed",
                "total_active_leads": len(leads),
                "segments": segment_counts,
                "source_mix": source_mix,
                "top_programmes": [{"programme": p, "count": c} for p, c in top_programmes],
                "expected_conversion_pct": expected_conversion,
            }
        ]

    async def _match_scholarships(self, state: AgentState, context: dict[str, Any]) -> List[Any]:
        limit = self._to_int(context.get("limit") or 30, 30)

        async with async_session_maker() as db:
            rows = await db.execute(
                select(Lead)
                .where(
                    Lead.score >= 65,
                    Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.REJECTED, LeadStage.DROPPED]),
                )
                .order_by(Lead.score.desc())
                .limit(limit)
            )
            leads = rows.scalars().all()

            leaderboard: list[dict[str, Any]] = []
            for lead in leads:
                matches = await scholarship_service.match_lead_to_scholarships(lead.id, db)
                leaderboard.append(
                    {
                        "lead_id": lead.id,
                        "name": lead.name,
                        "score": lead.score,
                        "matches": len(matches),
                        "top_match": matches[0] if matches else None,
                    }
                )

        total_matches = sum(item["matches"] for item in leaderboard)
        state.reflection = f"Scholarship mapping complete for {len(leaderboard)} high-intent leads."
        return [
            {
                "status": "scholarship_candidates_selected",
                "lead_count": len(leaderboard),
                "limit": limit,
            },
            {
                "status": "scholarship_mapping_completed",
                "total_matches": total_matches,
                "lead_results": leaderboard,
            },
        ]
