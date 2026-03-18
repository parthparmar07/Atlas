import json
from typing import Any, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class TimetableAIAgent(AgentBase):
    agent_id = "academics-timetable"
    agent_name = "Timetable AI"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Timetable AI Agent.
    You use constraint satisfaction tools to generate conflict-free academic schedules."""

    def get_action_prompts(self):
        return {
            "Generate Timetable": "Generate semester timetable",
            "Resolve Conflicts": "Resolve overlapping faculty schedules",
            "Optimize Room Usage": "Optimize room allocation",
        }

    async def tool_fetch_constraints(self) -> str:
        return json.dumps({"rooms": 40, "faculty": 120, "courses": 80})

    async def tool_run_solver(self, constraints: str) -> str:
        return json.dumps({"status": "OPTIMAL", "conflicts": 0})

    async def execute(self, state: AgentState) -> List[Any]:
        results = []
        for step in state.plan:
            self.memory.short_term.add_step(step)
            sl = step.lower()
            if "constraint" in sl or "fetch" in sl:
                data = await self.tool_fetch_constraints()
                results.append({"step": step, "tool": "tool_fetch_constraints", "output": data})
                state.perception_data["constraints"] = data
            elif "solve" in sl or "generat" in sl or "schedul" in sl:
                c = state.perception_data.get("constraints", "{}")
                data = await self.tool_run_solver(c)
                results.append({"step": step, "tool": "tool_run_solver", "output": data})
            else:
                prompt = f"Execute step '{step}'. Context: {state.perception_data}. Output markdown."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_fallback", "output": res})
        return results
