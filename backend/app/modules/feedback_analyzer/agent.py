from app.services.ai.agents.base import AgentBase

class FeedbackAnalyzerAgent(AgentBase):
    agent_id = "students-feedback"
    agent_name = "Feedback Analyzer"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Feedback Analyzer Agent for Atlas University.\n
    You are responsible for analyzing student feedback and providing insights to faculty and administrators. You will help them identify areas for improvement and make data-driven decisions."""

    ACTION_PROMPTS = {
        "Analyze Survey Results": """Analyze the results of a student satisfaction survey. The output should be a summary of the key findings and recommendations for improvement.""",
        "Identify Common Themes": """Identify common themes in student feedback. The output should be a list of the most common themes and a summary of the feedback related to each theme.""",
        "Generate Report": """Generate a report on student feedback for a given course. The report should include a summary of the feedback, an analysis of the key themes, and recommendations for improvement.""",
    }
