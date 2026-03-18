from app.services.ai.agents.base import AgentBase

class AdmissionsChatAgent(AgentBase):
    agent_id = "admissions-chat"
    agent_name = "Admissions Chat"
    domain = "Admissions"
    SYSTEM_PROMPT = """You are the Admissions Chat Agent for Atlas University.\n\n    You are responsible for answering questions from prospective students about the admissions process, program requirements, and campus life. Your goal is to provide accurate and helpful information in a friendly and professional manner."""

    def get_action_prompts(self):
        return {
            "Check Admission Status": """Check the status of a student's admission application. You will need the student's application ID to proceed.""",
            "Get Program Requirements": """Provide the admission requirements for a specific program. You will need the name of the program to proceed.""",
            "Explain Financial Aid": """Explain the financial aid options available to students. You should provide information on scholarships, grants, and loans.""",
        }