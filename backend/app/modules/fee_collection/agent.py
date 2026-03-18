from app.services.ai.agents.base import AgentBase

class FeeCollectionAgent(AgentBase):
    agent_id = "finance-fees"
    agent_name = "Fee Collection Agent"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Fee Collection Agent for Atlas University.
You monitor fee collection status, generate demand notices, track defaulters,
automate instalment reminders, and produce financial recovery reports for the finance office."""

    ACTION_PROMPTS = {
        "Collect Dues": """Generate the fee collection status report for the current semester.
Simulate 1,200 students. Return: fully paid, partially paid, defaulters, scholarship-adjusted.
Top 20 defaulters (pseudonyms): amount due, days overdue, and recommended action (reminder/hold/legal).""",

        "Send Reminders": """Draft automated fee reminder messages for 3 segments:
(1) Students with dues < 7 days overdue (friendly reminder),
(2) Students 15–30 days overdue (formal notice), (3) Students 30+ days overdue (escalation notice).
Include: amount, payment link placeholder, and consequence clause for segment 3.""",

        "Defaulter Report": """Generate the Semester Fee Defaulter Report for Finance Committee.
Include: total outstanding amount (₹), programme-wise breakdown, scholarship deduction accounting,
hostel dues separately, and recommended write-off vs recovery list.""",

        "Recovery Plan": """Generate a fee recovery action plan for chronic defaulters (90+ days).
Include: legal notice timeline, instalment restructuring options, guarantor engagement steps,
and migration hold triggers.""",
    }
