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


class TimetableAIAgent(AgentBase):
    agent_id = "academics-timetable"
    agent_name = "Atlas Academic Operations Agent"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Atlas Academic Operations Agent for Atlas Skilltech University — an autonomous academic coordinator that manages timetable generation, scheduling conflicts, substitutions, curriculum auditing, and academic calendar management.

IDENTITY
Name: Atlas Academic AI
Tone: Precise, structured, efficient. You speak like a senior academic coordinator who has managed timetables for 1000+ student institutions. You understand that a timetable error affects hundreds of people.

YOUR RESPONSIBILITIES

1. TIMETABLE CONSTRAINT PARSING
When given natural language scheduling requirements, convert them into structured constraint JSON:
Input examples: "Prof. Sharma should have no Monday classes", "No batch should have back-to-back labs", "Lab sessions only in Lab 1/2/3", "First year batches need 6 hours of Maths per week"
Output: structured constraint object with type (hard/soft), affected entities, days, periods, penalty weight
Always confirm: "I have parsed X hard constraints and Y soft constraints. Confirm before I send to the solver?"

2. CONFLICT DETECTION
When given a proposed timetable (list of slots with faculty, room, batch, day, period):
Hard conflicts (must fix): same faculty in two places, same room double-booked, same batch in two classes, lab in non-lab room
Soft conflicts (should fix): faculty teaching 4+ consecutive periods, batch with no break between theory and lab, early morning slots for senior faculty with stated preferences
Output: conflict report with severity, affected slots, and suggested resolution for each

3. SUBSTITUTION MANAGEMENT
When notified of a faculty absence (name, date, periods):
- Identify their scheduled classes for that day
- Find available substitutes: faculty free in that period + teaches a related subject
- Rank substitutes by: subject proximity, workload, last substitution date
- Generate the substitution notice for the HOD, the substitute faculty, and the class representative
- Log the substitution for duty credit tracking

4. CURRICULUM AUDITING
When given a syllabus document (as text) and past exam question papers (as text):
- Map topics from the syllabus to question frequencies in past papers
- Identify: over-tested topics (appears in 4+ of last 5 years), under-tested topics (0–1 times), never-tested topics
- Generate a coverage heatmap description (topic → frequency → recommended teaching weight)
- Flag topics that appear in exam but are absent from the syllabus (examiner drift)
- Output recommendations for faculty on where to focus

5. ACADEMIC CALENDAR GENERATION
When given: semester start date, semester end date, public holidays list, university exam dates, internal assessment schedule, total working days required:
- Generate a week-by-week academic calendar
- Ensure minimum working days per subject based on credit hours
- Block out preparation leave before exams
- Flag if the calendar is infeasible (insufficient days) and suggest adjustments
- Output: calendar table + summary stats (teaching days, exam days, holidays)

6. EXAMINATION SCHEDULE
When given: courses, enrolled batches, available exam halls (capacity), and blackout dates:
- Generate a clash-free examination timetable
- Ensure no student sits two exams on the same day
- Distribute across available halls respecting capacity
- Output: day-wise exam schedule + hall allotment + student seating plan format

CONSTRAINTS
- Never finalise a timetable — always output "Proposed timetable pending HOD and Principal approval"
- Hard constraints are non-negotiable. If they cannot all be satisfied simultaneously, report the conflict clearly and ask which to relax
- Substitution suggestions are recommendations — the HOD confirms
- All outputs must be exportable (structured tables, not flowing prose)

OUTPUT FORMAT
Constraint parsing: JSON block. Conflict reports: table with Severity / Slot / Issue / Resolution. Substitution notices: three separate ready-to-send messages. Calendar: week × day grid as a structured table."""

    ACTION_PROMPTS = {
        "Parse Timetable Constraints": """Collect all scheduling constraints from department HODs and faculty preferences.
Convert each natural language requirement into a structured constraint JSON with type (hard/soft), affected entities, days, periods, and penalty weight.
Confirm the count: "X hard constraints and Y soft constraints parsed."
Flag any constraints that contradict each other before sending to the solver.""",

        "Detect Conflicts": """Audit the current proposed timetable for all conflicts.
Hard conflicts (must fix): faculty double-booked, room double-booked, batch in two classes, lab in non-lab room.
Soft conflicts (should fix): 4+ consecutive periods, no theory-lab break, early slots for senior faculty.
Output a conflict report table: Severity / Slot / Faculty / Room / Batch / Issue / Suggested Resolution.
All outputs are pending HOD and Principal approval.""",

        "Manage Substitutions": """Process all reported faculty absences for today.
For each absence: identify their classes, find the best available substitute (subject proximity, current workload, last substitution date).
Generate three ready-to-send notices: one for the HOD, one for the substitute faculty, one for the class representative.
Log all substitutions for duty credit tracking.""",

        "Audit Curriculum Coverage": """Run a curriculum coverage audit for the current semester subjects.
Map each syllabus topic to its frequency in past 5 years of question papers.
Identify over-tested (4+ times), under-tested (0–1 times), and never-tested topics.
Flag examiner drift (topics in papers not in syllabus).
Generate faculty recommendations on teaching weight per topic.""",

        "Generate Academic Calendar": """Generate the academic calendar for the upcoming semester.
Input parameters: semester start/end dates, public holidays, university exam dates, internal assessment schedule, minimum working days per credit.
Output a week-by-week calendar table with teaching days, exam days, and holiday counts.
Flag any calendar infeasibility and suggest adjustments.""",

        "Schedule Examinations": """Generate the internal/external examination timetable.
Ensure no student has two exams on the same day. Distribute across available halls respecting capacity.
Output: day-wise exam schedule, hall allotment table, and student seating plan format.
Mark all outputs as proposed pending Principal approval.""",
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
            if action == "Parse Timetable Constraints":
                reflection, steps = await academics_ops_service.parse_timetable_constraints(db, payload)
            elif action == "Detect Conflicts":
                reflection, steps = await academics_ops_service.detect_timetable_conflicts(db, payload)
            elif action == "Manage Substitutions":
                reflection, steps = await academics_ops_service.manage_substitutions(db, payload)
            elif action == "Generate Academic Calendar":
                reflection, steps = await academics_ops_service.generate_calendar(db, payload)
            elif action == "Schedule Examinations":
                reflection, steps = await academics_ops_service.schedule_exams(db, payload)
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

        if action == "Parse Timetable Constraints":
            structured = cast(Dict[str, Any], by_status.get("constraints_structured", {}))
            hard = cast(List[Dict[str, Any]], structured.get("hard_constraints") or [])
            soft = cast(List[Dict[str, Any]], structured.get("soft_constraints") or [])
            merged = [{"type": "hard", **row} for row in hard] + [{"type": "soft", **row} for row in soft]
            return {
                "kind": "constraint_rules",
                "kpis": [
                    {"label": "Hard Rules", "value": len(hard)},
                    {"label": "Soft Rules", "value": len(soft)},
                    {"label": "Total Rules", "value": len(merged)},
                ],
                "table": {
                    "columns": ["type", "constraint", "weight"],
                    "rows": merged,
                },
            }

        if action == "Detect Conflicts":
            report = cast(Dict[str, Any], by_status.get("conflict_report_generated", {}))
            hard = cast(List[Dict[str, Any]], report.get("hard_conflicts") or [])
            soft = cast(List[Dict[str, Any]], report.get("soft_conflicts") or [])
            merged = [{"bucket": "hard", **row} for row in hard] + [{"bucket": "soft", **row} for row in soft]
            return {
                "kind": "conflict_scan",
                "kpis": [
                    {"label": "Hard Conflicts", "value": int(report.get("hard_conflict_count") or len(hard))},
                    {"label": "Soft Risks", "value": int(report.get("soft_conflict_count") or len(soft))},
                    {"label": "Total", "value": len(merged)},
                ],
                "table": {
                    "columns": ["bucket", "conflict_type", "severity", "day", "entity", "suggested_resolution"],
                    "rows": merged,
                },
            }

        if action == "Manage Substitutions":
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
                "kind": "substitution_plan",
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

        if action == "Generate Academic Calendar":
            generated = cast(Dict[str, Any], by_status.get("calendar_generated", {}))
            sample = cast(List[Dict[str, Any]], generated.get("sample_events") or [])
            resolved = cast(Dict[str, Any], by_status.get("calendar_inputs_resolved", {}))
            return {
                "kind": "academic_calendar",
                "kpis": [
                    {"label": "Teaching Days", "value": int(generated.get("teaching_days") or 0)},
                    {"label": "Preview Events", "value": len(sample)},
                    {"label": "Start", "value": str(resolved.get("start_date") or "N/A")},
                ],
                "table": {
                    "columns": ["date", "title", "event_type"],
                    "rows": sample,
                },
            }

        inputs = cast(Dict[str, Any], by_status.get("exam_inputs_resolved", {}))
        generated = cast(List[Dict[str, Any]], by_status.get("exam_schedule_generated", {}).get("created_schedules") or [])
        return {
            "kind": "exam_schedule",
            "kpis": [
                {"label": "Scheduled Exams", "value": len(generated)},
                {"label": "Capacity Risks", "value": len([row for row in generated if not bool(row.get("capacity_ok"))])},
                {"label": "Cycle", "value": str(inputs.get("cycle") or "N/A")},
            ],
            "table": {
                "columns": ["exam_name", "date", "time", "hall", "capacity_ok"],
                "rows": generated,
            },
        }

    async def run(
        self,
        action: str,
        context: str = "",
        step_callback: Optional[Callable[[str, str], Any]] = None,
    ) -> Dict[str, Any]:
        supported_actions = {
            "Parse Timetable Constraints",
            "Detect Conflicts",
            "Manage Substitutions",
            "Generate Academic Calendar",
            "Schedule Examinations",
        }
        if action not in supported_actions:
            return await super().run(action=action, context=context, step_callback=step_callback)

        await self.publish_chatter(f"Executing goal: {action}")
        await self._emit_step(step_callback, "PERCEIVING", "Parsing timetable operations context...")
        payload = self._parse_context(context)

        await self._emit_step(step_callback, "EXECUTING", f"Running {action} workflow...")
        start_ts = time.time()
        reflection, steps = await self._run_action(action, payload)

        for step in steps:
            status = str(step.get("status") or "completed")
            detail = status.replace("_", " ").title()
            await self._emit_step(step_callback, "EXECUTING", f"[{status}] {detail}")

        await self._emit_step(step_callback, "REFLECTING", "Compiling timetable operations artifact...")

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

        await self._emit_step(step_callback, "SUCCESS", "Timetable operation completed successfully.")
        return {
            "status": "SUCCESS",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": result,
            "telemetry": {"duration": duration_ms, "steps": len(steps)},
            "cascades": [],
            "execution_details": steps,
        }
