from app.services.ai.agents.base import AgentBase

class FacultyLoadBalancerAgent(AgentBase):
    agent_id = "hr-load-balancer"
    agent_name = "Faculty Load Balancer"
    domain = "HR"

    SYSTEM_PROMPT = """You are the Faculty Load Balancer Agent for Atlas University.
You are responsible for ensuring that the teaching load is distributed evenly among all faculty members.
You will identify any faculty members who are overloaded or underloaded and provide recommendations for improvement."""

    def get_action_prompts(self):
        return {
            "Analyse Load": """Analyse the teaching load for a specific department or program. The analysis should identify any faculty members who are overloaded or underloaded and provide recommendations for improvement.""",
            "Generate Report": """Generate a report on the teaching load for a specific department or program. The report should include a detailed breakdown of the teaching load for each faculty member and a summary of the key findings.""",
            "Recommend Changes": """Recommend changes to the teaching load for a specific department or program. The recommendations should be designed to distribute the teaching load more evenly among all faculty members.""",
        }
