import logging
from typing import Any, List

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agentic.pipeline import AgentState
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

    async def execute(self, state: AgentState) -> List[Any]:
        context = academics_ops_service.parse_context(state.context)
        try:
            async with async_session_maker() as db:
                if state.goal == "Schedule Exams":
                    reflection, steps = await academics_ops_service.schedule_exams(db, context)
                elif state.goal == "Check for Clashes":
                    reflection, steps = await academics_ops_service.check_exam_clashes(db, context)
                elif state.goal == "Optimize Schedule":
                    reflection, steps = await academics_ops_service.optimize_exam_schedule(db, context)
                else:
                    state.reflection = f"No execution branch found for '{state.goal}'."
                    return [{"status": "unsupported_action", "goal": state.goal}]

                await db.commit()

            state.reflection = reflection
            return steps
        except Exception as exc:
            logger.exception("Exam scheduler execution failed for goal=%s", state.goal)
            state.reflection = f"Execution failed for '{state.goal}': {exc}"
            return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

    async def reflect(self, state: AgentState) -> str:
        if state.reflection:
            return state.reflection
        return await super().reflect(state)
