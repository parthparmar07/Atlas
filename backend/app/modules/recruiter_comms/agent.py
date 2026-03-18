from app.services.ai.agents.base import AgentBase

class RecruiterCommsAgent(AgentBase):
    agent_id = "placement-recruiter"
    agent_name = "Recruiter Comms"
    domain = "Placement"
    SYSTEM_PROMPT = """You are the Recruiter Comms Agent for Atlas University.\n\n    You are responsible for managing all communications with recruiters, from initial outreach to interview scheduling. Your goal is to build strong relationships with recruiters and increase the number of job opportunities for students."""

    def get_action_prompts(self):
        return {
            "Send Outreach Email": """Send an outreach email to a recruiter. The email should introduce Atlas University and its students, and highlight the benefits of recruiting from our talent pool.""",
            "Schedule Interview": """Schedule an interview between a student and a recruiter. You will need the student's and recruiter's availability to proceed.""",
            "Follow Up with Recruiter": """Follow up with a recruiter after an interview. The email should thank the recruiter for their time and express our continued interest in their company.""",
        }