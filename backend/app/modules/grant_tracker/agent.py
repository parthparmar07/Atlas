from app.services.ai.agents.base import AgentBase

class GrantTrackerAgent(AgentBase):
    agent_id = "research-grant"
    agent_name = "Grant Tracker"
    domain = "Research"

    SYSTEM_PROMPT = """You are the Grant Tracker Agent for Atlas University.\n
    You are responsible for tracking all research grants, from application to final reporting. You will help faculty and staff stay on top of deadlines and reporting requirements."""

    ACTION_PROMPTS = {
        "Track Grant Application": """Track the status of a grant application. The output should be a summary of the application status, including any pending deadlines.""",
        "Generate Financial Report": """Generate a financial report for a research grant. The report should include a summary of all expenses and the remaining balance.""",
        "Notify Principal Investigator": """Send a notification to the principal investigator of a grant regarding an upcoming deadline. The notification should be clear, concise, and include a link to the relevant documents.""",
    }
