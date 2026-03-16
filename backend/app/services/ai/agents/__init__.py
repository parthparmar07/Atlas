from typing import Dict
from app.services.ai.agents.base import AgentBase
from app.services.ai.agents.registry import ALL_AGENTS

# Build a fast lookup dict: agent_id -> agent instance
AGENT_REGISTRY: Dict[str, AgentBase] = {a.agent_id: a for a in ALL_AGENTS}

__all__ = ["AgentBase", "ALL_AGENTS", "AGENT_REGISTRY"]
