from app.services.ai.agents.base import AgentBase

class ResearchAssistantAgent(AgentBase):
    agent_id = "research-assistant"
    agent_name = "Research Assistant"
    domain = "Research"
    SYSTEM_PROMPT = """You are the Research Assistant Agent for Atlas University.\n\n    You are responsible for assisting faculty and students with their research projects. You will help them find relevant literature, collect and analyze data, and prepare manuscripts for publication."""

    def get_action_prompts(self):
        return {
            "Find Literature": """Find relevant literature for a research project. You should provide a list of articles, books, and other resources, along with a brief summary of each.""",
            "Analyze Data": """Analyze a dataset and provide a summary of the key findings. You should use appropriate statistical methods and visualize the results in a clear and concise way.""",
            "Prepare Manuscript": """Prepare a manuscript for publication. You should format the manuscript according to the guidelines of a specific journal and check for grammar and spelling errors.""",
        }