"""
/api/agent-exec   — Real agent execution API router
"""
import datetime

from fastapi import APIRouter, HTTPException, status, Depends, Request
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.ai.agents.all_agents import ALL_AGENTS as AGENT_REGISTRY
from app.core.database import get_db
from app.models.audit import AuditLog

router = APIRouter(prefix="/agent-exec", tags=["agent-exec"])


from app.services.ai.agents.base import AgentBase

def _resolve_agent(agent_id: str) -> Optional[AgentBase]:
    """Resolve an agent by registry key or by the agent object's own agent_id."""
    # Fast path: direct key lookup
    direct = AGENT_REGISTRY.get(agent_id)
    if direct:
        return direct

    # Fallback: match against declared agent_id on each agent instance
    for agent in AGENT_REGISTRY.values():
        if getattr(agent, "agent_id", None) == agent_id:
            return agent
    return None


def _list_unique_agents() -> list[AgentBase]:
    """Return unique agents by agent_id to avoid duplicate rows from alias keys."""
    unique: dict[str, AgentBase] = {}
    for key, agent in AGENT_REGISTRY.items():
        aid = getattr(agent, "agent_id", None) or key
        unique[aid] = agent
    return list(unique.values())


class AgentRunRequest(BaseModel):
    agent_id: str
    action: str
    context: Optional[str] = ""
    dry_run: bool = False


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
    agent = _resolve_agent(body.agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{body.agent_id}' not found. Available: {list(AGENT_REGISTRY.keys())}",
        )

    if body.dry_run:
        return {
            "agent_id": getattr(agent, "agent_id", body.agent_id),
            "agent_name": getattr(agent, "agent_name", "Unknown Agent"),
            "domain": getattr(agent, "domain", "Unknown"),
            "action": body.action,
            "status": "SUCCESS",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": "Dry run executed successfully. Endpoint wiring is valid.",
            "telemetry": {
                "duration_ms": 0,
                "model": "dry-run",
                "steps_executed": 0,
            },
        }

    result = await agent.run(action=body.action, context=body.context or "")

    ctx_val = str(body.context) if body.context else "None"
    ctx_preview = ctx_val if len(ctx_val) <= 500 else ctx_val[:500]

    # Create audit log entry
    audit = AuditLog(
        user_id=1,  # Mock user ID for now
        action=f"AGENT_EXEC:{body.agent_id}:{body.action}",
        ip_address=request.client.host if request.client else "unknown",
        details=f"Context: {ctx_preview}",
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
        for a in _list_unique_agents()
    ]


@router.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get details about a specific agent."""
    agent = _resolve_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")
    return {
        "agent_id": agent.agent_id,
        "agent_name": agent.agent_name,
        "domain": agent.domain,
        "actions": list(agent.get_action_prompts().keys()),
    }
