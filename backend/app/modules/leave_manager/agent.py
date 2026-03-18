from app.services.ai.agents.base import AgentBase

class LeaveManagerAgent(AgentBase):
    agent_id = "hr-leave"
    agent_name = "Leave Manager"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the Leave Manager Agent for Atlas University.\n
    You are responsible for managing all leave requests from faculty and staff, ensuring that all requests are processed in a timely and efficient manner."""

    ACTION_PROMPTS = {
        "Process Leave Request": """Process a leave request from a faculty member. The request should be validated against the university's leave policy and the faculty member's leave balance. The output should be a confirmation of the leave request status.""",
        "View Leave Balance": """Retrieve the leave balance for a faculty member. The output should be a summary of the faculty member's leave balance.""",
        "Generate Leave Report": """Generate a report of all leave requests for a given period. The report should include the status of each request and the total number of leave days taken.""",
    }
