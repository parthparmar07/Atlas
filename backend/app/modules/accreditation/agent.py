import json
from typing import Any, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class AccreditationAgent(AgentBase):
    agent_id = "finance-accreditation"
    agent_name = "Accreditation"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Accreditation Agent for Atlas University.
    You use specific Python tools to pull financial records, cross-reference them with external accreditation guidelines, and automatically identify compliance gaps."""

    def get_action_prompts(self):
        return {
            "Audit Compliance": "Audit university compliance for upcoming NAAC visit",
            "Prepare Documentation": "Compile financial documentation for accreditation",
            "Generate Report": "Generate NAAC readiness report",
        }

    async def tool_fetch_guidelines(self, body: str) -> str:
        """Fetch latest guidelines from vector DB (simulated)."""
        return json.dumps({
            "body": body,
            "requirements": ["Minimum 15% budget for R&D", "Faculty-Student ratio 1:15"]
        })

    async def tool_analyze_finances(self, criteria: list) -> str:
        """Query ERP system for financial metrics (simulated)."""
        return json.dumps({
            "rd_budget_percent": 12.5,
            "faculty_student_ratio": "1:18",
            "status": "NON_COMPLIANT"
        })

    async def execute(self, state: AgentState) -> List[Any]:
        results = []
        for step in state.plan:
            self.memory.short_term.add_step(step)
            step_lower = step.lower()
            
            if "guideline" in step_lower or "requirement" in step_lower:
                data = await self.tool_fetch_guidelines("NAAC")
                results.append({"step": step, "tool": "tool_fetch_guidelines", "output": data})
                state.perception_data["guidelines"] = data
            elif "financ" in step_lower or "budget" in step_lower or "ratio" in step_lower:
                metrics = await self.tool_analyze_finances([])
                results.append({"step": step, "tool": "tool_analyze_finances", "output": metrics})
            else:
                prompt = f"Execute step '{step}'. Context: {state.perception_data}. Output markdown."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_fallback", "output": res})
        return results
