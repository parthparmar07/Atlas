"""
/api/agent-exec   — Real agent execution API router
"""
from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ai.agents.all_agents import ALL_AGENTS as AGENT_REGISTRY
from app.core.database import get_db
from app.models.audit import AuditLog

router = APIRouter(prefix="/agent-exec", tags=["agent-exec"])


class AgentRunRequest(BaseModel):
    agent_id: str
    action: str
    context: Optional[str] = ""


@router.post("/run")
async def run_agent(
    body: AgentRunRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
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

    # Create audit log entry
    audit = AuditLog(
        user_id=1,  # Mock user ID for now
        action=f"AGENT_EXEC:{body.agent_id}:{body.action}",
        ip_address=request.client.host if request.client else "unknown",
        details=f"Context: {body.context[:500] if body.context else 'None'}",
    )
    db.add(audit)
    await db.commit()

    return result


@router.get("/agents")
async def list_agents():
    """List all registered agents and their available actions."""
    return [
        {
            "agent_id": a.agent_id,
            "agent_name": a.agent_name,
            "domain": a.domain,
            "actions": list(a.get_action_prompts().keys()),
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
        "actions": list(agent.get_action_prompts().keys()),
    }
