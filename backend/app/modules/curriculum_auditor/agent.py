import logging
from typing import Any, List

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agentic.pipeline import AgentState
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
