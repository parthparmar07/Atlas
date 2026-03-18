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
        return await super().execute(state)
