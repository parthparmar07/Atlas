"""
Base Agent — shared execution scaffold for all 24 Atlas AI agents.

Every agent subclass MUST:
  - Set `self.agent_id`   (slug used in API routes and frontend)
  - Set `self.agent_name` (human readable name)
  - Set `self.domain`     (domain label)
  - Override `SYSTEM_PROMPT`
  - Override `ACTION_PROMPTS` dict mapping action name → prompt template
"""

from typing import Any, Dict
import datetime

from app.services.ai.gemini import gemini_client


class AgentBase:
    agent_id: str = "base"
    agent_name: str = "Base Agent"
    domain: str = "Platform"

    # Subclasses override these
    SYSTEM_PROMPT: str = ""
    ACTION_PROMPTS: Dict[str, str] = {}

    async def run(self, action: str, context: str = "") -> Dict[str, Any]:
        """
        Main entry point.  Called by the API router with:
          action  — the quick-action label clicked by the user
          context — optional extra data (e.g. a student name, date, etc.)

        Returns a structured dict that the frontend renders.
        """
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        if not gemini_client.is_available():
            return self._fallback(action, now)

        prompt_template = self.ACTION_PROMPTS.get(action)
        if prompt_template is None:
            # Generic fallback — ask Gemini to handle any arbitrary action
            prompt_template = (
                "You are executing the action '{action}' for {agent_name}.\n"
                "Context provided: {context}\n\n"
                "Perform the action, return a detailed structured report including:\n"
                "1. Summary of what was done\n"
                "2. Key findings or output data\n"
                "3. Recommended next steps\n"
                "Format the output in clean markdown."
            )

        prompt = prompt_template.format(
            action=action,
            agent_name=self.agent_name,
            context=context or "None provided",
        )

        try:
            raw = await gemini_client.generate_text(
                prompt=prompt,
                system_instruction=self.SYSTEM_PROMPT,
                temperature=0.4,
            )
            return {
                "agent_id": self.agent_id,
                "agent_name": self.agent_name,
                "domain": self.domain,
                "action": action,
                "status": "SUCCESS",
                "timestamp": now,
                "result": raw,
            }
        except Exception as exc:
            return {
                "agent_id": self.agent_id,
                "agent_name": self.agent_name,
                "domain": self.domain,
                "action": action,
                "status": "ERROR",
                "timestamp": now,
                "result": f"Execution error: {exc}",
            }

    def _fallback(self, action: str, now: str) -> Dict[str, Any]:
        """Return a helpful error when Gemini is not configured."""
        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "domain": self.domain,
            "action": action,
            "status": "UNAVAILABLE",
            "timestamp": now,
            "result": (
                "Gemini API key is not configured. "
                "Set GEMINI_API_KEY in your .env file to activate real agent execution."
            ),
        }
