import logging
from typing import Any, List

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agentic.pipeline import AgentState
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

    async def execute(self, state: AgentState) -> List[Any]:
        context = academics_ops_service.parse_context(state.context)
        try:
            async with async_session_maker() as db:
                if state.goal == "Find Substitute":
                    reflection, steps = await academics_ops_service.manage_substitutions(db, context)
                elif state.goal == "Notify Students":
                    reflection, steps = await academics_ops_service.notify_substitutions(db, context)
                elif state.goal == "Update Timetable":
                    reflection, steps = await academics_ops_service.apply_substitution_updates(db, context)
                else:
                    state.reflection = f"No execution branch found for '{state.goal}'."
                    return [{"status": "unsupported_action", "goal": state.goal}]

                await db.commit()

            state.reflection = reflection
            return steps
        except Exception as exc:
            logger.exception("Substitution agent execution failed for goal=%s", state.goal)
            state.reflection = f"Execution failed for '{state.goal}': {exc}"
            return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

    async def reflect(self, state: AgentState) -> str:
        if state.reflection:
            return state.reflection
        return await super().reflect(state)
