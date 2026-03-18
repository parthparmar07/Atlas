from typing import List, Dict, Any, Optional
from sqlalchemy.future import select
from sqlalchemy import desc
from app.services.ai.gemini import gemini_client
from app.services.ai.groq_service import groq_client
from app.services.ai.tools import get_chat_tools, execute_tool
from app.core.database import async_session_maker
from app.models.policy import Policy
from app.models.user import User
from app.models.audit import AuditLog


class ChatService:
    """Service for AI Manager chat functionality."""

    SYSTEM_INSTRUCTION = """You are the Atlas AI Manager, an intelligent assistant for the Atlas AI Command Center.

Your capabilities:
- Help users understand system status and metrics
- Assist with user management and access control
- Explain policies and create new ones
- Search and analyze audit logs
- Provide insights and recommendations
- Answer questions about the platform

CRITICAL INSTRUCTION:
- If the user asks to "Execute action: [Action]" for an agent, YOU MUST IMMEDIATELY use the `execute_agent_action` tool to perform that specific task and report the result back. Do not ask for confirmation, just run it.

Current context:
- User: {user_email} ({user_role})
- Page: {current_page}

Knowledge Base (Policies):
{knowledge_base}

Be helpful, concise, and proactive. Use available tools when needed. If you don't have enough information, ask clarifying questions."""

    async def _get_knowledge_base(self) -> str:
        try:
            async with async_session_maker() as session:
                result = await session.execute(select(Policy).limit(10))
                policies = result.scalars().all()
                if not policies:
                    return "No policies found."
                kb = ""
                for p in policies:
                    kb += f"- {p.name}: {p.description} (Type: {p.policy_type})\n"
                return kb
        except Exception:
            return "Knowledge base unavailable."

    async def chat(
        self,
        messages: List[Dict[str, str]],
        user_email: str,
        user_role: str,
        current_page: str = "/",
    ) -> Dict[str, Any]:
        """Process a chat message and return response."""

        last_user = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_user = (m.get("content") or "").strip()
                break

        # Deterministic shortcuts for core admin workflows (no LLM needed).
        shortcut = await self._handle_shortcuts(last_user)
        if shortcut:
            return shortcut

        kb_context = await self._get_knowledge_base()

        system_instruction = self.SYSTEM_INSTRUCTION.format(
            user_email=user_email,
            user_role=user_role,
            current_page=current_page,
            knowledge_base=kb_context,
        )

        clients = []
        if groq_client.is_available():
            clients.append(groq_client)
        if gemini_client.is_available():
            clients.append(gemini_client)

        if not clients:
            return {
                "role": "assistant",
                "content": "AI Manager is currently unavailable. Please configure Groq or Gemini API keys to enable AI features.",
                "tool_calls": []
            }

        tools = get_chat_tools()
        last_error: Optional[str] = None

        for ai_client in clients:
            try:
                response = await ai_client.chat(
                    messages=messages,
                    system_instruction=system_instruction,
                    tools=tools,
                )

                tool_results = []
                for func_call in response.get("function_calls", []):
                    result = await execute_tool(func_call["name"], func_call["args"])
                    tool_results.append({
                        "tool": func_call["name"],
                        "result": result
                    })

                return {
                    "role": "assistant",
                    "content": response["content"],
                    "tool_calls": tool_results,
                }
            except Exception as e:
                last_error = str(e)
                continue

        if last_error and ("429" in last_error or "rate limit" in last_error.lower()):
            return {
                "role": "assistant",
                "content": "Model quota is temporarily exhausted. I switched to direct admin mode. Try commands like: 'List active users', 'Show pending users', 'Recent audit logs', or 'List security policies'.",
                "tool_calls": [],
            }

        return {
            "role": "assistant",
            "content": f"I encountered an error: {last_error or 'Unknown error'}. Please try again.",
            "tool_calls": []
        }

    async def _handle_shortcuts(self, text: str) -> Optional[Dict[str, Any]]:
        q = (text or "").strip().lower()
        if not q:
            return None

        wants_active_users = ("list" in q or "show" in q) and "active" in q and "user" in q
        wants_pending_users = "pending" in q and "user" in q
        wants_audit = "audit" in q and ("log" in q or "logs" in q or "recent" in q or "show" in q)
        wants_policies = ("security" in q or "policy" in q or "policies" in q) and ("list" in q or "show" in q)

        if wants_active_users:
            async with async_session_maker() as session:
                result = await session.execute(select(User).where(User.is_active == True).order_by(desc(User.created_at)).limit(20))
                users = result.scalars().all()
            if not users:
                content = "No active users found."
            else:
                lines = [f"Active users ({len(users)}):"] + [f"- {u.email} | role={u.role} | status={u.status.value if hasattr(u.status, 'value') else u.status}" for u in users]
                content = "\n".join(lines)
            return {"role": "assistant", "content": content, "tool_calls": []}

        if wants_pending_users:
            async with async_session_maker() as session:
                result = await session.execute(select(User).where(User.is_active == False).order_by(desc(User.created_at)).limit(20))
                users = result.scalars().all()
            if not users:
                content = "No pending users found."
            else:
                lines = [f"Pending users ({len(users)}):"] + [f"- {u.email} | role={u.role}" for u in users]
                content = "\n".join(lines)
            return {"role": "assistant", "content": content, "tool_calls": []}

        if wants_audit:
            async with async_session_maker() as session:
                result = await session.execute(select(AuditLog).order_by(desc(AuditLog.timestamp)).limit(20))
                logs = result.scalars().all()
            if not logs:
                content = "No audit logs found."
            else:
                lines = [f"Recent audit logs ({len(logs)}):"] + [f"- {l.timestamp.isoformat() if l.timestamp else 'n/a'} | {l.action} | {l.ip_address or '-'}" for l in logs]
                content = "\n".join(lines)
            return {"role": "assistant", "content": content, "tool_calls": []}

        if wants_policies:
            async with async_session_maker() as session:
                result = await session.execute(select(Policy).order_by(desc(Policy.priority), desc(Policy.created_at)).limit(20))
                policies = result.scalars().all()
            if not policies:
                content = "No security policies found."
            else:
                lines = [f"Security policies ({len(policies)}):"] + [f"- {p.name} | type={p.policy_type} | priority={p.priority}" for p in policies]
                content = "\n".join(lines)
            return {"role": "assistant", "content": content, "tool_calls": []}

        return None


chat_service = ChatService()
