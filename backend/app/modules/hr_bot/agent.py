import json
from typing import Any, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class HROperationsBotAgent(AgentBase):
    agent_id = "hr-bot"
    agent_name = "HR Operations Bot"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the HR Operations Bot for Atlas University.
    You manage leave balances, HR queries, and payroll summaries. 
    Use the provided tools to fetch employee data and execute HR actions."""

    def get_action_prompts(self):
        return {
            "Process Leaves": "Process pending leave requests",
            "Draft Notice": "Draft official HR circulars",
            "Payroll Summary": "Generate monthly payroll report",
            "Onboarding Checklist": "Create task list for new joinees",
        }

    async def tool_fetch_employee_data(self, emp_id: str) -> str:
        """Simulate fetching employee details from ERP."""
        return json.dumps({
            "employee_id": emp_id,
            "name": "Dr. Ramesh Sharma",
            "department": "Computer Science",
            "leave_balance": {"casual": 4, "earned": 12, "sick": 6},
            "payroll": {"basic": 85000, "hra": 34000, "allowances": 15000}
        })

    async def execute(self, state: AgentState) -> List[Any]:
        results = []
        for step in state.plan:
            self.memory.short_term.add_step(step)
            sl = step.lower()
            
            if "fetch" in sl or "get" in sl or "employee" in sl:
                # Extract employee ID from context if present
                emp_id = "EMP-000"
                if "EMP-" in state.context:
                    import re
                    match = re.search(r'(EMP-\d{4}-\d{3})', state.context)
                    if match:
                        emp_id = match.group(1)
                
                data = await self.tool_fetch_employee_data(emp_id)
                results.append({"step": step, "tool": "tool_fetch_employee_data", "output": data})
                state.perception_data["employee_data"] = data
            elif "draft" in sl or "notice" in sl or "payroll" in sl or "leave" in sl:
                # Use LLM with context data
                prompt = f"Execute step '{step}' using this data: {state.perception_data.get('employee_data', 'None')}. Provide the final markdown output."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_generate", "output": res})
            else:
                prompt = f"Execute step '{step}'. Context: {state.perception_data}. Output markdown."
                res = await self._call_llm(prompt)
                results.append({"step": step, "tool": "llm_fallback", "output": res})
                
        return results
