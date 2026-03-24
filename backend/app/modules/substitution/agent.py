import asyncio
import datetime
import hashlib
import json
import logging
import time
from typing import Any, Callable, Dict, List, Optional, Tuple, cast

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agents.base import AgentBase


logger = logging.getLogger(__name__)

class SubstitutionAgent(AgentBase):
    agent_id = "academics-substitution"
    agent_name = "Atlas Substitution Operations Agent"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Atlas Academic Substitution Operations Agent for Atlas Skilltech University.

IDENTITY
Name: Atlas Substitution AI
Tone: Precise, operational, calm under pressure. You handle disruption without confusion.

YOUR RESPONSIBILITIES
1. Identify all impacted classes when a faculty absence is reported.
2. Rank substitute faculty by subject fit, current load, and recent substitution history.
3. Generate three ready-to-send notifications: HOD, substitute faculty, class representative.
4. Update substitution log with timestamp, class, reason, and assigned substitute.
5. Flag uncovered classes immediately if no valid substitute exists.

CONSTRAINTS
- Never assign a substitute already occupied in the same slot.
- Prefer same-subject faculty first, then adjacent-subject faculty.
- Substitution is recommendation pending HOD confirmation.

OUTPUT FORMAT
Use structured outputs: impact table, ranked substitute table, and notification drafts."""

    ACTION_PROMPTS = {
        "Find Substitute": """Process reported faculty absences for today.
For each affected slot: identify candidate substitutes, rank them by subject proximity, workload, and recent substitution frequency.
Output a ranked substitute table with recommendation reason per candidate.""",

        "Notify Students": """Generate substitution communication pack.
Produce three concise drafts: HOD notice, substitute faculty assignment, and class representative update.
Include date, period, room, and substitute confirmation line.""",

        "Update Timetable": """Generate substitution timetable patch for affected slots.
Show original faculty, substitute faculty, class, period, room, and status.
Mark output as provisional pending HOD confirmation.""",
    }

    def _parse_context(self, context: str) -> Dict[str, Any]:
        if not context:
            return {}

        stripped = context.strip()
        if stripped.startswith("{"):
            try:
                parsed = json.loads(stripped)
                if isinstance(parsed, dict):
                    return cast(Dict[str, Any], parsed)
            except Exception:
                pass

        parsed: Dict[str, Any] = {}
        for line in context.splitlines():
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            parsed[key.strip().lower().replace(" ", "_")] = value.strip()
        return parsed

    async def _emit_step(
        self,
        step_callback: Optional[Callable[[str, str], Any]],
        status: str,
        detail: str,
    ) -> None:
        if not step_callback:
            return
        if asyncio.iscoroutinefunction(step_callback):
            await step_callback(status, detail)
            return
        step_callback(status, detail)

    async def _run_action(
        self,
        action: str,
        payload: Dict[str, Any],
    ) -> Tuple[str, List[Dict[str, Any]]]:
        async with async_session_maker() as db:
            if action == "Find Substitute":
                reflection, steps = await academics_ops_service.manage_substitutions(db, payload)
            elif action == "Notify Students":
                reflection, steps = await academics_ops_service.notify_substitutions(db, payload)
            elif action == "Update Timetable":
                reflection, steps = await academics_ops_service.apply_substitution_updates(db, payload)
            else:
                raise ValueError(f"Unsupported action: {action}")
            await db.commit()
        return reflection, steps

    def _build_ui_payload(self, action: str, steps: List[Dict[str, Any]]) -> Dict[str, Any]:
        by_status: Dict[str, Dict[str, Any]] = {
            str(step.get("status")): step
            for step in steps
            if isinstance(step, dict) and step.get("status")
        }

        if action == "Find Substitute":
            ranked = cast(Dict[str, Any], by_status.get("substitute_ranking_completed", {}))
            recs = cast(List[Dict[str, Any]], ranked.get("recommendations") or [])
            rows: List[Dict[str, Any]] = []
            for item in recs:
                best = item.get("recommended_substitute")
                best_name = "No candidate"
                best_score = "-"
                if isinstance(best, dict):
                    best_name = str(best.get("faculty_name") or "No candidate")
                    best_score = str(best.get("score") or "-")
                rows.append(
                    {
                        "slot_id": item.get("slot_id"),
                        "course_name": item.get("course_name"),
                        "section": item.get("section"),
                        "day": item.get("day"),
                        "time": item.get("time"),
                        "recommended_substitute": best_name,
                        "score": best_score,
                    }
                )
            impacted = cast(Dict[str, Any], by_status.get("absence_impact_mapped", {}))
            return {
                "kind": "substitute_ranking",
                "kpis": [
                    {"label": "Impacted Classes", "value": int(impacted.get("impacted_class_count") or len(rows))},
                    {"label": "Recommendations", "value": len(rows)},
                    {"label": "Absent Faculty", "value": str(impacted.get("absent_faculty") or "auto-selected")},
                ],
                "table": {
                    "columns": ["slot_id", "course_name", "section", "day", "time", "recommended_substitute", "score"],
                    "rows": rows,
                },
            }

        if action == "Notify Students":
            loaded = cast(Dict[str, Any], by_status.get("substitution_logs_loaded", {}))
            notices = cast(List[Dict[str, Any]], by_status.get("notification_pack_generated", {}).get("notifications") or [])
            return {
                "kind": "communication_drafts",
                "kpis": [
                    {"label": "Records Loaded", "value": int(loaded.get("records") or 0)},
                    {"label": "Draft Packs", "value": len(notices)},
                    {"label": "Stakeholder Messages", "value": len(notices) * 3},
                ],
                "table": {
                    "columns": ["substitution_id", "hod_notice", "faculty_notice", "class_notice"],
                    "rows": notices,
                },
            }

        loaded = cast(Dict[str, Any], by_status.get("substitution_candidates_loaded", {}))
        patches = cast(List[Dict[str, Any]], by_status.get("timetable_patch_applied", {}).get("patches") or [])
        return {
            "kind": "timetable_patch",
            "kpis": [
                {"label": "Candidates Loaded", "value": int(loaded.get("records") or 0)},
                {"label": "Patched Slots", "value": len(patches)},
                {"label": "Confirmed", "value": len([row for row in patches if str(row.get("status") or "") == "confirmed"])},
            ],
            "table": {
                "columns": ["slot_id", "course_name", "section", "old_faculty", "new_faculty", "status"],
                "rows": patches,
            },
        }

    async def run(
        self,
        action: str,
        context: str = "",
        step_callback: Optional[Callable[[str, str], Any]] = None,
    ) -> Dict[str, Any]:
        supported_actions = set(self.ACTION_PROMPTS.keys())
        if action not in supported_actions:
            return await super().run(action=action, context=context, step_callback=step_callback)

        await self.publish_chatter(f"Executing goal: {action}")
        await self._emit_step(step_callback, "PERCEIVING", "Parsing substitution context...")
        payload = self._parse_context(context)

        await self._emit_step(step_callback, "EXECUTING", f"Running {action} workflow...")
        start_ts = time.time()
        reflection, steps = await self._run_action(action, payload)

        for step in steps:
            status = str(step.get("status") or "completed")
            detail = status.replace("_", " ").title()
            await self._emit_step(step_callback, "EXECUTING", f"[{status}] {detail}")

        await self._emit_step(step_callback, "REFLECTING", "Compiling substitution artifact...")
        hash_seed = f"{self.agent_id}:{action}:{reflection}"
        hash_val = hashlib.sha256(hash_seed.encode()).hexdigest()[:10].upper()
        duration_ms = int((time.time() - start_ts) * 1000)
        ui_payload = self._build_ui_payload(action, steps)

        result: Dict[str, Any] = {
            "title": f"{self.agent_name}: {action}",
            "summary": reflection,
            "hash": hash_val,
            "goal": action,
            "ui_payload": ui_payload,
        }

        await self._emit_step(step_callback, "SUCCESS", "Substitution operation completed successfully.")
        return {
            "status": "SUCCESS",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": result,
            "telemetry": {"duration": duration_ms, "steps": len(steps)},
            "cascades": [],
            "execution_details": steps,
        }
