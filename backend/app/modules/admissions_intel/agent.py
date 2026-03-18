import json
from typing import Any, Dict, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class AdmissionsIntelligenceAgent(AgentBase):
    agent_id = "admissions-intelligence"
    agent_name = "Admissions Intelligence"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Admissions Intelligence Agent for Atlas University.
    You autonomously decompose admissions goals into actionable data queries and analysis steps.
    You use available Python tools to fetch applicant data, run ML heuristics, and generate reports."""

    def get_action_prompts(self) -> dict[str, str]:
        # Keep for UI compatibility, but these are now "Goals"
        return {
            "Run Scoring": "Score recent applications",
            "Detect Fraud": "Analyze current pool for document fraud",
            "Generate Report": "Generate weekly Admissions summary",
            "Rank Applicants": "Rank top 20 applicants",
        }

    # Unique Python Tools for this agent
    async def tool_fetch_applications(self, batch_size: int = 50) -> str:
        """Simulates fetching application data from the database."""
        # In a real app, this queries PostgreSQL
        return json.dumps([
            {"id": "APP001", "gpa": 3.8, "sop_score": 9.2, "flagged": False},
            {"id": "APP002", "gpa": 2.1, "sop_score": 4.5, "flagged": True},
            {"id": "APP003", "gpa": 3.9, "sop_score": 9.8, "flagged": False}
        ])

    async def tool_run_ml_scoring(self, data: str) -> str:
        """Simulates a complex ML scoring heuristic."""
        apps = json.loads(data)
        for app in apps:
            app["composite_score"] = (app["gpa"] * 0.6) + ((app["sop_score"]/10) * 4.0)
        return json.dumps(apps)

    # Overriding Execution Layer to use tools dynamically
    async def execute(self, state: AgentState) -> List[Any]:
        results = []
        
        # Simulated Tool-Use Negotiation based on plan
        for step in state.plan:
            self.memory.short_term.add_step(f"Executing step: {step}")
            step_lower = step.lower()
            
            if "fetch" in step_lower or "get" in step_lower:
                data = await self.tool_fetch_applications()
                results.append({"step": step, "tool": "tool_fetch_applications", "output": data})
                state.perception_data["raw_apps"] = data
                
            elif "score" in step_lower or "ml" in step_lower:
                raw = state.perception_data.get("raw_apps", "[]")
                scored = await self.tool_run_ml_scoring(raw)
                results.append({"step": step, "tool": "tool_run_ml_scoring", "output": scored})
                state.perception_data["scored_apps"] = scored
                
            else:
                # Fallback to LLM reasoning if no tool matches
                prompt = f"Execute step '{step}' based on context: {state.perception_data}. Generate the report section."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_fallback", "output": res})
                
        return results
