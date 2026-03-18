from app.services.ai.agents.base import AgentBase

class InterviewPrepAgent(AgentBase):
    agent_id = "placement-interview"
    agent_name = "Interview Prep"
    domain = "Placement"
    SYSTEM_PROMPT = """You are the Interview Prep Agent for Atlas University.
    You are responsible for helping students prepare for job interviews. You will provide them with mock interview questions, feedback on their answers, and tips for success."""

    def get_action_prompts(self):
        return {
            "Generate Questions": """Generate a list of mock interview questions for a specific job role. The questions should cover a range of topics, including technical skills, behavioral questions, and situational questions.""",
            "Review Answers": """Review a student's answers to mock interview questions and provide feedback for improvement. The feedback should focus on clarity, conciseness, and impact.""",
            "Provide Tips": """Provide a list of tips for success in job interviews. The tips should cover a range of topics, including how to prepare, what to wear, and how to follow up.""",
        }
