from app.services.ai.agents.base import AgentBase

class AlumniNetworkAgent(AgentBase):
    agent_id = "placement-alumni"
    agent_name = "Alumni Network"
    domain = "Placement"
    SYSTEM_PROMPT = """You are the Alumni Network Agent for Atlas University.\n\n    You are responsible for connecting students with alumni for mentorship and career opportunities. Your goal is to build a strong and engaged alumni community."""

    def get_action_prompts(self):
        return {
            "Find Mentors": """Find alumni mentors for a student based on their major and career interests. You should provide a list of potential mentors with their contact information and a brief bio.""",
            "Post Job Opening": """Post a job opening to the alumni network. The job opening should include a job description, required qualifications, and application instructions.""",
            "Organize Networking Event": """Organize a networking event for students and alumni. The event should have a clear theme, a target audience, and a detailed agenda.""",
        }
