"""
/api/agent-exec   — Real agent execution API router
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from app.services.ai.agents import AGENT_REGISTRY

router = APIRouter(prefix="/agent-exec", tags=["agent-exec"])


class AgentRunRequest(BaseModel):
    agent_id: str
    action: str
    context: Optional[str] = ""


@router.post("/run")
async def run_agent(body: AgentRunRequest):
    """
    Execute a named action on a specific agent.
    agent_id must match one of the 24 registered agent slugs.
    """
    agent = AGENT_REGISTRY.get(body.agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{body.agent_id}' not found. Available: {list(AGENT_REGISTRY.keys())}",
        )

    result = await agent.run(action=body.action, context=body.context or "")
    return result


@router.get("/agents")
async def list_agents():
    """List all registered agents and their available actions."""
    return [
        {
            "agent_id": a.agent_id,
            "agent_name": a.agent_name,
            "domain": a.domain,
            "actions": list(a.ACTION_PROMPTS.keys()),
        }
        for a in AGENT_REGISTRY.values()
    ]


@router.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get details about a specific agent."""
    agent = AGENT_REGISTRY.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")
    return {
        "agent_id": agent.agent_id,
        "agent_name": agent.agent_name,
        "domain": agent.domain,
        "actions": list(agent.ACTION_PROMPTS.keys()),
    }
