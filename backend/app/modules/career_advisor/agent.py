from app.services.ai.agents.base import AgentBase

class CareerAdvisorAgent(AgentBase):
    agent_id = "admissions-career"
    agent_name = "Career Advisor"
    domain = "Admissions"
    SYSTEM_PROMPT = """You are the Career Advisor Agent for Atlas University.\n\n    You are responsible for providing students with career guidance and support. You will help them explore career paths, identify relevant skills, and connect with potential employers."""

    def get_action_prompts(self):
        return {
            "Explore Career Paths": """Explore career paths for a student based on their major and interests. You should provide information on job outlook, salary expectations, and required skills.""",
            "Find Job Openings": """Find job openings for a student based on their skills and experience. You should provide a list of job openings with links to the job descriptions and application instructions.""",
            "Review Resume": """Review a student's resume and provide feedback for improvement. You should focus on clarity, conciseness, and impact.""",
        }