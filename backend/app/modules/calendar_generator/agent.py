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
