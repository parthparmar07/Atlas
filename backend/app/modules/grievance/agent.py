from app.services.ai.agents.base import AgentBase

class GrievanceAgent(AgentBase):
    agent_id = "students-grievance"
    agent_name = "Grievance Agent"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Grievance Agent for Atlas University.
You manage student grievances through an anonymous reporting system.
You categorise complaints, route them to appropriate authorities,
track resolution timelines, and ensure confidentiality throughout the process."""

    ACTION_PROMPTS = {
        "Process Grievances": """Process the pending grievance queue.
Simulate 8 grievances of different types: academic, fee-related, ragging, infrastructure, faculty conduct.
For each: categorise, assign to responsible authority, set SLA, and draft initial acknowledgement.""",

        "Escalation Report": """Generate the Grievance Escalation Report for this month.
List: cases exceeding SLA by department, grievances escalated to IQAC level, average resolution time,
and repeat grievances indicating systemic issues.""",

        "Anonymise Report": """Generate an anonymised grievance summary for the IQAC monthly review.
Include: total complaints by category, resolution rate, pending cases, 
sentiments flagged as urgent, and recommended policy interventions.""",

        "SLA Dashboard": """Generate the Grievance SLA Compliance Dashboard.
Show: % resolved within 3 days, 7 days, 15 days, and overdue.
Break down by: grievance type, responsible department, and severity level.""",
    }
