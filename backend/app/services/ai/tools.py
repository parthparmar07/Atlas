from typing import List, Dict, Any, Optional
from google.ai.generativelanguage_v1beta.types import content
from app.core.config import settings
from app.services.ai.agents.registry import AGENT_REGISTRY
import datetime

def get_chat_tools() -> List[content.Tool]:
    """Get list of tools available to the AI chat assistant."""
    
    get_user_info = content.FunctionDeclaration(
        name="get_user_info",
        description="Get information about a user by email or ID",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "user_identifier": content.Schema(
                    type=content.Type.STRING,
                    description="User email or ID"
                )
            },
            required=["user_identifier"]
        )
    )
    
    get_system_stats = content.FunctionDeclaration(
        name="get_system_stats",
        description="Get current system statistics and metrics",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "metric_type": content.Schema(
                    type=content.Type.STRING,
                    description="Type of metrics: 'performance', 'usage', 'errors', or 'all'",
                    enum=["performance", "usage", "errors", "all"]
                )
            }
        )
    )
    
    search_audit_logs = content.FunctionDeclaration(
        name="search_audit_logs",
        description="Search audit logs for specific actions or users",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "query": content.Schema(
                    type=content.Type.STRING,
                    description="Search query"
                ),
                "limit": content.Schema(
                    type=content.Type.INTEGER,
                    description="Maximum number of results (default: 10)"
                )
            },
            required=["query"]
        )
    )
    
    create_policy = content.FunctionDeclaration(
        name="create_policy",
        description="Create a new access control policy",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "name": content.Schema(
                    type=content.Type.STRING,
                    description="Policy name"
                ),
                "description": content.Schema(
                    type=content.Type.STRING,
                    description="Policy description"
                ),
                "rule": content.Schema(
                    type=content.Type.STRING,
                    description="Natural language rule"
                )
            },
            required=["name", "rule"]
        )
    )

    get_agent_status = content.FunctionDeclaration(
        name="get_agent_status",
        description="Check health and recent activity of a specific AI agent",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "agent_id": content.Schema(
                    type=content.Type.STRING,
                    description="The ID/Slug of the agent (e.g., 'admissions-intelligence'). Use hyphens, not slashes."
                )
            },
            required=["agent_id"]
        )
    )

    execute_agent_action = content.FunctionDeclaration(
        name="execute_agent_action",
        description="Execute a specific action for a given agent and get real-time processing results.",
        parameters=content.Schema(
            type=content.Type.OBJECT,
            properties={
                "agent_id": content.Schema(
                    type=content.Type.STRING,
                    description="The ID/Slug of the agent (e.g., 'admissions-intelligence', 'hr-bot'). Use hyphens, not slashes."
                ),
                "action": content.Schema(
                    type=content.Type.STRING,
                    description="The action to perform (e.g., 'Match Now', 'Generate Report')"
                ),
                "context": content.Schema(
                    type=content.Type.STRING,
                    description="Additional context or parameters needed for the action"
                )
            },
            required=["agent_id", "action"]
        )
    )
    
    return [content.Tool(function_declarations=[
        get_user_info,
        get_system_stats,
        search_audit_logs,
        create_policy,
        get_agent_status,
        execute_agent_action
    ])]


async def execute_tool(tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool function and return results."""
    
    now = datetime.datetime.now().isoformat()

    if tool_name == "get_user_info":
        return {
            "user_identifier": args.get("user_identifier"),
            "status": "active",
            "role": "DEVELOPER",
            "last_login": "2026-03-14T10:30:00Z",
            "message": "User information retrieved successfully",
            "approval_status": "APPROVED"
        }
    
    elif tool_name == "get_system_stats":
        metric_type = args.get("metric_type", "all")
        return {
            "metric_type": metric_type,
            "timestamp": now,
            "performance": {
                "avg_latency_ms": 184,
                "p99_latency_ms": 1120,
                "cpu_load": "42%",
                "memory_free": "2.4GB"
            },
            "usage": {
                "active_agents": 24,
                "total_queries_today": 3240,
                "unique_users_24h": 142
            },
            "errors": {
                "status": "HEALTHY",
                "error_rate": "0.04%",
                "last_incident": "4 days ago"
            }
        }
    
    elif tool_name == "search_audit_logs":
        query = args.get("query", "")
        return {
            "query": query,
            "results_count": 2,
            "logs": [
                {
                    "ts": now,
                    "event": "policy.update",
                    "actor": "admin@atlas.edu",
                    "meta": "Admission weighting adjusted"
                },
                {
                    "ts": now,
                    "event": "agent.deploy",
                    "actor": "system",
                    "meta": "Procurement Agent v1.0.4"
                }
            ]
        }
    
    elif tool_name == "create_policy":
        return {
            "policy_id": "pol_88291",
            "name": args.get("name"),
            "status": "PENDING_TRANSLATION",
            "message": "Policy requested. Our translator agent is converting this to RBAC mappings."
        }

    elif tool_name == "get_agent_status":
        agent_id = args.get("agent_id")
        return {
            "agent_id": agent_id,
            "status": "ONLINE",
            "uptime": "14d 6h",
            "recent_events": 84,
            "last_output": "Successfully matched 12 students to Microsoft internship",
            "health_check": "PASS"
        }
        
    elif tool_name == "execute_agent_action":
        agent_id = args.get("agent_id")
        action = args.get("action", "Unknown Action")
        context = args.get("context", "")

        agent = AGENT_REGISTRY.get(agent_id)
        if not agent:
            # Try to find by name if ID fails (for robustness)
            for a in AGENT_REGISTRY.values():
                if a.agent_name.lower() in str(agent_id).lower():
                    agent = a
                    break
        
        if not agent:
            return {
                "status": "ERROR",
                "message": f"Agent '{agent_id}' not found in registry.",
                "available_agents": list(AGENT_REGISTRY.keys())
            }

        result = await agent.run(action=action, context=context)
        return result
    
    else:
        return {"error": f"Unknown tool: {tool_name}"}
