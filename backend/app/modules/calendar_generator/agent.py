import logging
from typing import Any, List

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase


logger = logging.getLogger(__name__)

class CalendarGeneratorAgent(AgentBase):
    agent_id = "academics-calendar"
    agent_name = "Calendar Generator"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Academic Calendar Generator Agent for Atlas University.
You generate the complete institutional academic calendar for each academic year.
You factor in: UGC/AICTE minimum working day norms, university examination schedules,
public holidays, cultural events, and internship windows."""

    ACTION_PROMPTS = {
        "Generate Calendar": """Generate the Academic Calendar for the year 2026–2027 for Atlas University.
Include: Odd semester (July–Nov), Even semester (Jan–May), exam blocks, 
recess periods, internship windows, convocation, and Annual Day.
Format as a month-wise structured calendar.""",

        "Add Event": """Add the following approved events to the current academic calendar:
(1) National Science Day — 28 Feb (Half day), (2) Industry Conclave — 15 March (Full day),
(3) Hackathon — 22–23 March.
Return the updated calendar segment with conflict check.""",

        "Holiday Mapping": """Map all gazetted public holidays for 2026–27 against the current calendar.
Identify: teaching days lost, compensatory working Saturday recommendations, and updated total working days per semester.""",

        "Export Calendar": """Generate a formatted exportable academic calendar document for 2026–27.
Structure: month-by-month table with date, day, event/activity, and type (teaching/exam/holiday/recess).""",
    }

    async def execute(self, state: AgentState) -> List[Any]:
            context = academics_ops_service.parse_context(state.context)
            try:
                    async with async_session_maker() as db:
                            if state.goal == "Generate Calendar":
                                    reflection, steps = await academics_ops_service.generate_calendar(db, context)
                            elif state.goal == "Add Event":
                                    reflection, steps = await academics_ops_service.add_calendar_event(db, context)
                            elif state.goal == "Holiday Mapping":
                                    reflection, steps = await academics_ops_service.holiday_mapping(db, context)
                            elif state.goal == "Export Calendar":
                                    reflection, steps = await academics_ops_service.export_calendar(db, context)
                            else:
                                    state.reflection = f"No execution branch found for '{state.goal}'."
                                    return [{"status": "unsupported_action", "goal": state.goal}]

                            await db.commit()

                    state.reflection = reflection
                    return steps
            except Exception as exc:
                    logger.exception("Calendar generator execution failed for goal=%s", state.goal)
                    state.reflection = f"Execution failed for '{state.goal}': {exc}"
                    return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

    async def reflect(self, state: AgentState) -> str:
            if state.reflection:
                    return state.reflection
            return await super().reflect(state)
