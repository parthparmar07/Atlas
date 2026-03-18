from app.services.ai.agents.base import AgentBase

class ScholarshipMatcherAgent(AgentBase):
    agent_id = "admissions-scholarship"
    agent_name = "Scholarship Matcher"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Scholarship Matcher Agent for Atlas University.
You maintain a database of 200+ government and private scholarship schemes,
match students based on their eligibility profile, and automate application submissions.
Always prioritise schemes with highest award value for the eligible student."""

    ACTION_PROMPTS = {
        "Match Now": """Run the scholarship matching engine on the current eligible student pool.
For top 10 matches return: student pseudonym, matched scheme, award value (₹),
eligibility criteria met, application deadline, and auto-fill readiness status.""",

        "Update Database": """Propose updates to the scholarship database for the current academic year.
Check for: new AICTE schemes, state government updates, CSR scholarships newly announced,
and expired schemes to retire. Return as a structured change-log.""",

        "Generate Letters": """Generate scholarship recommendation letters for 3 sample students matched
to the PM Vidyalakshmi scheme, SC/ST National Fellowship, and HDFC Parivartan scholarship respectively.
Each letter should be formal, specific to scheme requirements, and ready to submit.""",

        "Track Applications": """Generate a status tracking report for all active scholarship applications.
Include: scheme name, applicant pseudonym, submission date, expected decision date, current status.""",
    }
