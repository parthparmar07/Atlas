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

class ExamSchedulerAgent(AgentBase):
    agent_id = "academics-exams"
    agent_name = "Atlas Examination Scheduling Agent"
    domain = "Academics"
    SYSTEM_PROMPT = """You are the Atlas Examination Scheduling Agent for Atlas Skilltech University.

IDENTITY
Name: Atlas Exam Ops AI
Tone: Structured, deterministic, no ambiguity.

YOUR RESPONSIBILITIES
1. Build clash-free exam timetables for internal and end-semester cycles.
2. Validate conflicts at student, faculty, room, and batch level.
3. Allocate halls based on capacity and operational constraints.
4. Optimize schedule spread to reduce same-day student load.
5. Produce an auditable schedule revision log.

CONSTRAINTS
- No student can have two exams in one slot.
- Hall capacities are non-negotiable.
- Blackout dates and holidays must be respected.
- Final publication is pending Controller of Examinations approval.

OUTPUT FORMAT
Return day-wise exam schedule table, clash report, and hall allocation summary."""

    ACTION_PROMPTS = {
        "Schedule Exams": """Generate a proposed exam schedule from course, batch, and hall inputs.
Ensure no student-level clash and valid hall capacity assignment.
Output day-wise schedule plus hall mapping.""",

        "Check for Clashes": """Audit an existing exam schedule.
Detect student/faculty/room clashes and report severity with remediation suggestions.
Output a clash table with slot identifiers.""",

        "Optimize Schedule": """Optimize the current exam schedule for balanced load and room utilization.
Reduce same-day burden where possible without violating hard constraints.
Output optimized schedule delta and utilization metrics.""",
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
            if action == "Schedule Exams":
                reflection, steps = await academics_ops_service.schedule_exams(db, payload)
            elif action == "Check for Clashes":
                reflection, steps = await academics_ops_service.check_exam_clashes(db, payload)
            elif action == "Optimize Schedule":
                reflection, steps = await academics_ops_service.optimize_exam_schedule(db, payload)
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

        if action == "Schedule Exams":
            generated = cast(List[Dict[str, Any]], by_status.get("exam_schedule_generated", {}).get("created_schedules") or [])
            inputs = cast(Dict[str, Any], by_status.get("exam_inputs_resolved", {}))
            capacity_issues = len([item for item in generated if not bool(item.get("capacity_ok"))])
            return {
                "kind": "exam_schedule",
                "kpis": [
                    {"label": "Scheduled Exams", "value": len(generated)},
                    {"label": "Capacity Risks", "value": capacity_issues},
                    {"label": "Cycle", "value": str(inputs.get("cycle") or "N/A")},
                ],
                "table": {
                    "columns": ["exam_name", "date", "time", "hall", "capacity_ok"],
                    "rows": generated,
                },
            }

        if action == "Check for Clashes":
            report = cast(Dict[str, Any], by_status.get("exam_clash_report", {}))
            clashes = cast(List[Dict[str, Any]], report.get("clashes") or [])
            critical = len([row for row in clashes if str(row.get("severity", "")).lower() == "critical"])
            capacity_overflow = len([row for row in clashes if str(row.get("type", "")) == "capacity_overflow"])
            return {
                "kind": "clash_audit",
                "kpis": [
                    {"label": "Total Clashes", "value": int(report.get("clash_count") or len(clashes))},
                    {"label": "Critical", "value": critical},
                    {"label": "Capacity Overflow", "value": capacity_overflow},
                ],
                "table": {
                    "columns": ["type", "severity", "day", "start", "hall", "section", "exam_name", "exam_ids"],
                    "rows": clashes,
                },
            }

        optimization = cast(Dict[str, Any], by_status.get("exam_optimization_completed", {}))
        adjustments = cast(List[Dict[str, Any]], optimization.get("adjustments") or [])
        rescheduled = len([row for row in adjustments if row.get("old_day") and row.get("new_day")])
        hall_changes = len([row for row in adjustments if row.get("old_hall") and row.get("new_hall")])
        return {
            "kind": "schedule_optimization",
            "kpis": [
                {"label": "Total Adjustments", "value": len(adjustments)},
                {"label": "Rescheduled", "value": rescheduled},
                {"label": "Hall Changes", "value": hall_changes},
            ],
            "table": {
                "columns": ["exam_name", "reason", "old_day", "new_day", "old_hall", "new_hall"],
                "rows": adjustments,
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
        await self._emit_step(step_callback, "PERCEIVING", "Parsing exam operations context...")
        payload = self._parse_context(context)

        await self._emit_step(step_callback, "EXECUTING", f"Running {action} workflow...")
        start_ts = time.time()
        reflection, steps = await self._run_action(action, payload)

        for step in steps:
            status = str(step.get("status") or "completed")
            detail = status.replace("_", " ").title()
            await self._emit_step(step_callback, "EXECUTING", f"[{status}] {detail}")

        await self._emit_step(step_callback, "REFLECTING", "Compiling exam operations artifact...")

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

        await self._emit_step(step_callback, "SUCCESS", "Exam operation completed successfully.")
        return {
            "status": "SUCCESS",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": result,
            "telemetry": {"duration": duration_ms, "steps": len(steps)},
            "cascades": [],
            "execution_details": steps,
        }
