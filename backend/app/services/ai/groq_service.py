from typing import Optional, List, Dict, Any
from groq import AsyncGroq
from app.core.config import settings
import json

class GroqClient:
    """Client for interacting with Groq's API."""

    def __init__(self):
        if settings.groq_api_key:
            self.client = AsyncGroq(api_key=settings.groq_api_key)
        else:
            self.client = None

    def is_available(self) -> bool:
        """Check if Groq API is configured."""
        return self.client is not None

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
    ) -> str:
        """Generate text using Groq."""
        if not self.is_available():
            raise ValueError("Groq API key not configured")

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        
        messages.append({"role": "user", "content": prompt})

        completion = await self.client.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
            temperature=temperature,
            max_tokens=2048,
        )
        return completion.choices[0].message.content or ""

    async def chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str] = None,
        tools: Optional[List[Any]] = None,
    ) -> Dict[str, Any]:
        """Chat with Groq, with optional tool calling."""
        if not self.is_available():
            raise ValueError("Groq API key not configured")

        full_messages: List[Dict[str, str]] = []
        if system_instruction:
            full_messages.append({"role": "system", "content": system_instruction})
        
        for msg in messages:
            full_messages.append({"role": msg["role"], "content": msg["content"]})

        call_args: Dict[str, Any] = {
            "model": settings.groq_model,
            "messages": full_messages,
        }
        
        if tools:
            groq_tools = []
            for t in tools:
                if hasattr(t, "function_declarations"):
                    for fd in t.function_declarations:
                        props = {}
                        required = []
                        if hasattr(fd, "parameters") and fd.parameters:
                            if hasattr(fd.parameters, "properties"):
                                for k, v in fd.parameters.properties.items():
                                    prop_type = "string"
                                    if getattr(v, "type", None):
                                        type_val = getattr(v, "type").name.lower()
                                        if type_val == "integer": prop_type = "integer"
                                        elif type_val == "boolean": prop_type = "boolean"
                                        
                                    props[k] = {
                                        "type": prop_type, 
                                        "description": getattr(v, "description", "")
                                    }
                            if hasattr(fd.parameters, "required"):
                                required = list(fd.parameters.required)

                        groq_tools.append({
                            "type": "function",
                            "function": {
                                "name": fd.name,
                                "description": fd.description,
                                "parameters": {
                                    "type": "object",
                                    "properties": props,
                                    "required": required
                                }
                            }
                        })
            
            if groq_tools:
                call_args["tools"] = groq_tools

        try:
            completion = await self.client.chat.completions.create(**call_args)
        except Exception as e:
            # Fallback if tool calling fails (e.g. invalid generation from Groq)
            if "tool_use_failed" in str(e):
                call_args.pop("tools", None)
                completion = await self.client.chat.completions.create(**call_args)
            else:
                raise e
        
        message = completion.choices[0].message
        
        # We define function_calls as a list explicitly to avoid linter confusion
        function_calls: List[Dict[str, Any]] = []

        if message.tool_calls:
            for tc in message.tool_calls:
                function_calls.append({
                    "name": tc.function.name,
                    "args": json.loads(tc.function.arguments),
                })
        
        return {
            "content": message.content or "",
            "function_calls": function_calls,
        }

groq_client = GroqClient()
