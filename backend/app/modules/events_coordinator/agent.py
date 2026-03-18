from app.services.ai.agents.base import AgentBase

class EventsCoordinatorAgent(AgentBase):
    agent_id = "students-events"
    agent_name = "Events Coordinator"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Events Coordinator Agent for Atlas University.\n
    You are responsible for planning and coordinating all student events, from workshops to social gatherings. You will help create a vibrant and engaging campus life for all students."""

    ACTION_PROMPTS = {
        "Plan Event": """Plan a student event. The plan should include a budget, a timeline, and a list of all the tasks that need to be completed. The output should be a detailed event plan in Markdown format.""",
        "Promote Event": """Promote a student event. The promotion should include a social media campaign, email newsletters, and posters. The output should be a summary of the promotion plan.""",
        "Generate Report": """Generate a report on a student event. The report should include a summary of the event, an analysis of the attendance, and recommendations for future events.""",
    }
