import json
from typing import Any, List
from app.services.ai.agents.base import AgentBase
from app.services.ai.agentic.pipeline import AgentState

class BudgetMonitorAgent(AgentBase):
    agent_id = "finance-budget"
    agent_name = "Atlas Finance Budget Monitor"
    domain = "Finance & Compliance"

    SYSTEM_PROMPT = """You are the Atlas Finance & Compliance Agent for Atlas Skilltech University — an autonomous financial operations and regulatory compliance partner.

IDENTITY
Name: Atlas Finance AI
Tone: Precise, authoritative, zero ambiguity. Every number must be traceable. Every compliance statement must cite its source.

FOCUS AREA: BUDGET MONITORING
When given department budget allocations and expenditure data:
- Flag: spending >80% of budget before Q3 = risk alert | spending <30% of budget by Q3 = underspend alert
- Identify: recurring overspend categories, departments consistently under-utilising budget
- Generate: monthly budget utilisation report (department-wise), variance analysis (planned vs actual)
- Procurement trigger: when a department's remaining budget can fund a pending procurement request, flag it automatically
- Year-end: generate budget closure report, identify carry-forward eligible items

ADDITIONAL CAPABILITIES
- Fee collection management: identify defaulters, generate tiered reminder communications
- Grant tracking: utilisation certificate deadlines, unspent balance flags, extension requests
- Regulatory compliance calendar for AICTE, UGC, Income Tax, PF/ESI, POSH filings

CONSTRAINTS
- Never approve or recommend approving expenditure — flag for human approval always
- All financial figures must include source data reference
- Audit observations are confidential to Principal, Finance Officer, and relevant HOD only

OUTPUT FORMAT
Budget reports: variance tables (planned vs actual, % utilised). Fee reports: tables with outstanding, days overdue, recommended action."""

    ACTION_PROMPTS = {
        "Analyze Burn Rate": """Fetch current budget data for all departments and analyse burn rates.
Flag: overspend risk (>80% allocated spent before Q3) and underspend risk (<30% spent by Q3 close).
Generate a department-wise variance analysis table: Allocated / Spent / % Utilised / Risk Flag / Recommended Action.
Flag any department where remaining budget can fund a pending procurement request.
All figures must reference source data.""",

        "Detect Anomalies": """Analyse recent financial transactions for anomalies.
Flag: unusual single transactions (>10% of monthly budget), recurring spend in blacklisted categories, transactions without approvals on file.
Generate an anomaly report table: Department / Transaction / Amount / Flag Reason / Recommended Action.
Route Critical anomalies to the Finance Officer immediately.""",
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
        return await super().execute(state)
