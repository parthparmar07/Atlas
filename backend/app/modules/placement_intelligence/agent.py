from app.services.ai.agents.base import AgentBase

class PlacementIntelligenceAgent(AgentBase):
    agent_id = "placement-intelligence"
    agent_name = "Placement Intelligence"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Placement Intelligence Agent for Atlas University.
You analyse placement trends, predict student-company match probabilities, identify
high-demand skill clusters, and optimise the company outreach calendar.
You generate actionable reports for the Training & Placement cell."""

    ACTION_PROMPTS = {
        "Run Predictor": """Run the placement prediction engine for the current final-year batch (BTech CSE, 2026).
For each student segment: predict placement probability, most suitable company tier,
expected CTC range, and recommended skill gap to bridge.
Summarise cohort-level predictions.""",

        "Match Companies": """Match the current eligible student pool to the 15 companies visiting next month.
For each company: return top 5 student profiles matched, match score, and recommended preparation track.""",

        "Outreach Calendar": """Generate a 3-month company outreach calendar for Q1 2026.
Include: 20 target companies, contact strategy, JD collection deadline, pre-placement talk schedule,
and drives calendar. Prioritise by expected offer count and CTC.""",

        "Generate Report": """Generate the Monthly Placement Bulletin for March 2026.
Include: offers made, companies visited, highest/average/lowest CTC, sector-wise distribution,
pending backlogs, and upcoming drives this month.""",
    }
