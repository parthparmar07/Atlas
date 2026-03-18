from app.services.ai.agents.base import AgentBase

class ITSupportAgent(AgentBase):
    agent_id = "it-support"
    agent_name = "IT Support"
    domain = "IT"

    SYSTEM_PROMPT = """You are the IT Support Agent for Atlas University.\n
    You are responsible for providing technical support to students, faculty, and staff. You will help them troubleshoot technical issues, request new equipment, and access IT services."""

    ACTION_PROMPTS = {
        "Troubleshoot Issue": """Troubleshoot a technical issue. The output should be a summary of the issue and the steps taken to resolve it.""",
        "Request Equipment": """Request new equipment. The output should be a confirmation of the request and a summary of the equipment requested.""",
        "Access IT Services": """Provide access to IT services. The output should be a list of available IT services and instructions on how to access them.""",
    }
