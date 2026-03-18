from app.services.ai.agents.base import AgentBase

class SubstitutionAgent(AgentBase):
    agent_id = "academics-substitution"
    agent_name = "Substitution"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Substitution Agent for Atlas University.
You are responsible for finding substitutes for sick or absent faculty members. You will ensure that all classes are covered and that students' learning is not disrupted."""

    def get_action_prompts(self):
        return {
            "Find Substitute": """Find a substitute for a sick or absent faculty member. You should identify a suitable substitute from the faculty pool and notify them of the substitution.""",
            "Notify Students": """Notify students of a substitution. The notification should include the name of the substitute and the time and location of the class.""",
            "Update Timetable": """Update the timetable to reflect a substitution. The updated timetable should show the name of the substitute and the time and location of the class.""",
        }
