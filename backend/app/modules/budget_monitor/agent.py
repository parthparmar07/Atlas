import json
from typing import Any, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class BudgetMonitorAgent(AgentBase):
    agent_id = "finance-budget"
    agent_name = "Budget Monitor"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Budget Monitor Agent for Atlas University.
    You track departmental expenditures, analyze burn rates, and detect financial anomalies."""

    def get_action_prompts(self):
        return {
            "Analyze Burn Rate": "Analyze current burn rate for departments",
            "Detect Anomalies": "Detect anomalies in recent transactions",
        }

    async def tool_fetch_budget_data(self, department: str) -> str:
        # Simulated ERP Data
        data = {
            "Computer Science": {"allocated": 1500000, "spent": 1250000, "anomalies": 0},
            "Mechanical Engineering": {"allocated": 2000000, "spent": 1950000, "anomalies": 2},
            "Library": {"allocated": 500000, "spent": 200000, "anomalies": 0}
        }
        if department in data:
            return json.dumps({department: data[department]})
        return json.dumps(data)

    async def execute(self, state: AgentState) -> List[Any]:
        results = []
        for step in state.plan:
            self.memory.short_term.add_step(step)
            sl = step.lower()
            
            if "fetch" in sl or "get" in sl or "budget" in sl or "burn" in sl:
                # Extract department from context
                dept = "All Departments"
                if "Department: Computer Science" in state.context: dept = "Computer Science"
                elif "Department: Mechanical Engineering" in state.context: dept = "Mechanical Engineering"
                elif "Department: Library" in state.context: dept = "Library"
                
                data = await self.tool_fetch_budget_data(dept)
                results.append({"step": step, "tool": "tool_fetch_budget_data", "output": data})
                state.perception_data["budget"] = data
            elif "anomal" in sl or "detect" in sl:
                # Prompt the LLM to analyze the data for anomalies
                prompt = f"Analyze this financial data for anomalies and output a markdown report: {state.perception_data.get('budget', 'No data')}"
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_analysis", "output": res})
            else:
                prompt = f"Execute step '{step}' based on context: {state.perception_data}. Output markdown."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_fallback", "output": res})
                
        return results
