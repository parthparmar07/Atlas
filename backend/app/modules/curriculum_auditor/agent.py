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

class CurriculumAuditorAgent(AgentBase):
    agent_id = "academics-curriculum"
    agent_name = "Curriculum Auditor"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Curriculum Auditor Agent for Atlas University.
You analyse syllabi against industry requirements, AICTE guidelines, NEP 2020 compliance,
and exam question patterns. You flag curriculum gaps, suggest topic additions, 
and recommend pedagogy improvements per programme."""

    ACTION_PROMPTS = {
        "Audit Syllabus": """Audit the B.Tech CSE 5th Semester syllabus against:
(1) NASSCOM FutureSkills requirements, (2) GATE 2025 exam pattern, (3) NEP 2020 credit framework.
Return: compliance score, critical gaps, recommended additions, and topics to retire.""",

        "NEP Compliance": """Check the PG MBA programme for NEP 2020 compliance.
Include: internship credit mapping, multidisciplinary elective availability,
academic bank of credits readiness, and outcome-based education documentation status.""",

        "Industry Alignment": """Compare the current Data Science elective track against
current industry roles (Data Engineer, ML Engineer, Data Analyst) on LinkedIn India.
Return: skills gap analysis, topics to add, labs to introduce, and certification alignment.""",

        "Generate Audit Report": """Generate the Annual Curriculum Audit Report for all B.Tech programmes.
Include: programme-wise compliance score, top 5 gaps per programme, and an action plan for the next semester.""",
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
            if action == "Audit Syllabus":
                reflection, steps = await academics_ops_service.audit_syllabus(db, payload)
            elif action == "NEP Compliance":
                reflection, steps = await academics_ops_service.nep_compliance(db, payload)
            elif action == "Industry Alignment":
                reflection, steps = await academics_ops_service.industry_alignment(db, payload)
            elif action == "Generate Audit Report":
                reflection, steps = await academics_ops_service.generate_curriculum_report(db, payload)
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

        if action == "Audit Syllabus":
            updated = cast(List[Dict[str, Any]], by_status.get("syllabus_audit_completed", {}).get("updated_entries") or [])
            scope = cast(Dict[str, Any], by_status.get("curriculum_scope_resolved", {}))
            need_update = len([row for row in updated if str(row.get("status") or "") in {"needs_update", "non_compliant"}])
            return {
                "kind": "syllabus_audit",
                "kpis": [
                    {"label": "Entries Audited", "value": int(scope.get("entry_count") or len(updated))},
                    {"label": "Needs Update", "value": need_update},
                    {"label": "Programme Scope", "value": str(scope.get("programme_filter") or "all")},
                ],
                "table": {
                    "columns": ["course_code", "course_name", "alignment_score", "status", "gaps"],
                    "rows": updated,
                },
            }

        if action == "NEP Compliance":
            assessed = cast(Dict[str, Any], by_status.get("nep_compliance_assessed", {}))
            metrics = cast(Dict[str, Any], assessed.get("metrics") or {})
            rows = [
                {"metric": "multidisciplinary_readiness", "score": metrics.get("multidisciplinary_readiness")},
                {"metric": "academic_bank_readiness", "score": metrics.get("academic_bank_readiness")},
                {"metric": "obe_documentation", "score": metrics.get("obe_documentation")},
            ]
            return {
                "kind": "nep_compliance",
                "kpis": [
                    {"label": "Overall Score", "value": assessed.get("overall_score") or 0},
                    {"label": "Status", "value": str(assessed.get("status_label") or "unknown")},
                    {"label": "Metrics", "value": len(rows)},
                ],
                "table": {
                    "columns": ["metric", "score"],
                    "rows": rows,
                },
            }

        if action == "Industry Alignment":
            benchmark = cast(Dict[str, Any], by_status.get("industry_benchmark_loaded", {}))
            recs = cast(List[Dict[str, Any]], by_status.get("industry_alignment_report", {}).get("recommendations") or [])
            return {
                "kind": "industry_alignment",
                "kpis": [
                    {"label": "Avg Relevance", "value": benchmark.get("avg_industry_relevance") or 0},
                    {"label": "Entries", "value": int(benchmark.get("entry_count") or 0)},
                    {"label": "Recommendations", "value": len(recs)},
                ],
                "table": {
                    "columns": ["course_code", "course_name", "industry_relevance", "recommendation"],
                    "rows": recs,
                },
            }

        summaries = cast(List[Dict[str, Any]], by_status.get("programme_rollup_created", {}).get("programme_summaries") or [])
        gaps = cast(List[Dict[str, Any]], by_status.get("annual_audit_report_ready", {}).get("top_gap_courses") or [])
        rows: List[Dict[str, Any]] = []
        for row in summaries:
            rows.append({"row_type": "programme", **row})
        for row in gaps:
            rows.append({"row_type": "gap_course", **row})
        return {
            "kind": "curriculum_audit_report",
            "kpis": [
                {"label": "Programmes", "value": len(summaries)},
                {"label": "Top Gap Courses", "value": len(gaps)},
                {"label": "Report Rows", "value": len(rows)},
            ],
            "table": {
                "columns": ["row_type", "programme", "entry_count", "avg_alignment", "needs_update", "course_code", "course_name", "alignment_score", "gaps"],
                "rows": rows,
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
        await self._emit_step(step_callback, "PERCEIVING", "Parsing curriculum context...")
        payload = self._parse_context(context)

        await self._emit_step(step_callback, "EXECUTING", f"Running {action} workflow...")
        start_ts = time.time()
        reflection, steps = await self._run_action(action, payload)

        for step in steps:
            status = str(step.get("status") or "completed")
            detail = status.replace("_", " ").title()
            await self._emit_step(step_callback, "EXECUTING", f"[{status}] {detail}")

        await self._emit_step(step_callback, "REFLECTING", "Compiling curriculum artifact...")
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

        await self._emit_step(step_callback, "SUCCESS", "Curriculum operation completed successfully.")
        return {
            "status": "SUCCESS",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": result,
            "telemetry": {"duration": duration_ms, "steps": len(steps)},
            "cascades": [],
            "execution_details": steps,
        }
