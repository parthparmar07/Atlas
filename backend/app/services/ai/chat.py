from typing import List, Dict, Any, Optional
from sqlalchemy.future import select
from app.services.ai.gemini import gemini_client
from app.services.ai.groq_service import groq_client
from app.services.ai.tools import get_chat_tools, execute_tool
from app.core.database import async_session_maker
from app.models.policy import Policy


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
        
        # Priority: Groq -> Gemini
        ai_client = None
        if groq_client.is_available():
            ai_client = groq_client
        elif gemini_client.is_available():
            ai_client = gemini_client

        if not ai_client:
            return {
                "role": "assistant",
                "content": "AI Manager is currently unavailable. Please configure Groq or Gemini API keys to enable AI features.",
                "tool_calls": []
            }

        kb_context = await self._get_knowledge_base()

        system_instruction = self.SYSTEM_INSTRUCTION.format(
            user_email=user_email,
            user_role=user_role,
            current_page=current_page,
            knowledge_base=kb_context,
        )

        try:
            tools = get_chat_tools()
            response = await ai_client.chat(
                messages=messages,
                system_instruction=system_instruction,
                tools=tools,
            )

            # Execute any function calls
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
            return {
                "role": "assistant",
                "content": f"I encountered an error: {str(e)}. Please try again.",
                "tool_calls": []
            }


chat_service = ChatService()
