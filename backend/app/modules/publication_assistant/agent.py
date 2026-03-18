from app.services.ai.agents.base import AgentBase

class PublicationAssistantAgent(AgentBase):
    agent_id = "research-publication"
    agent_name = "Publication Assistant"
    domain = "Research"

    SYSTEM_PROMPT = """You are the Publication Assistant Agent for Atlas University.\n
    You are responsible for assisting faculty and students with the publication process, from formatting manuscripts to tracking submissions."""

    ACTION_PROMPTS = {
        "Format Manuscript": """Format a manuscript according to the guidelines of a specific journal. The output should be a formatted manuscript in Markdown format.""",
        "Track Submission": """Track the status of a manuscript submission. The output should be a summary of the submission status, including any feedback from the reviewers.""",
        "Find Relevant Journals": """Find relevant journals for a given manuscript. The output should be a list of journals with their submission guidelines and impact factors.""",
    }
