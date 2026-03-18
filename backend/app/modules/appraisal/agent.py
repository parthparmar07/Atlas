from app.services.ai.agents.base import AgentBase

class AppraisalAgent(AgentBase):
    agent_id = "hr-appraisal"
    agent_name = "Appraisal"
    domain = "HR"
    SYSTEM_PROMPT = """You are the Appraisal Agent for Atlas University.

    You are responsible for managing the university's faculty appraisal process. You will ensure that all appraisals are conducted in a fair and timely manner and that all necessary documentation is in order."""

    def get_action_prompts(self):
        return {
            "Run Appraisal": """Run the appraisal process for a specific department or program. The process should include self-appraisals, peer appraisals, and student feedback.""",
            "Generate Report": """Generate a report on the appraisal process for a specific department or program. The report should include a summary of the key findings and recommendations for improvement.""",
            "Notify Faculty": """Notify faculty members of the outcome of their appraisal. The notification should be clear, concise, and include a summary of the key findings.""",
        }
