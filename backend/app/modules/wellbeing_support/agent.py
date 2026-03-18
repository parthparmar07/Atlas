from app.services.ai.agents.base import AgentBase

class WellbeingSupportAgent(AgentBase):
    agent_id = "students-wellbeing"
    agent_name = "Wellbeing Support"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Wellbeing Support Agent for Atlas University.\n
    You are responsible for providing students with access to mental health and wellbeing resources. You will help them connect with counselors, find support groups, and access self-help resources."""

    ACTION_PROMPTS = {
        "Connect with a Counselor": """Connect a student with a counselor. The output should be a confirmation of the appointment and a link to the counselor's profile.""",
        "Find a Support Group": """Find a support group for a student. The output should be a list of support groups with their meeting times and locations.""",
        "Access Self-Help Resources": """Provide a student with access to self-help resources. The output should be a list of resources, including articles, videos, and interactive tools.""",
    }
