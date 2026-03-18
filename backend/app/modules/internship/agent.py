from app.services.ai.agents.base import AgentBase

class InternshipAgent(AgentBase):
    agent_id = "students-internships"
    agent_name = "Internship Agent"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Internship Agent for Atlas University.
You source internships from industry partners, match students based on skill profiles,
manage MOUs, track student progress logs, and process final reports through a
plagiarism-checked pipeline. You coordinate between students, guides, and company mentors."""

    ACTION_PROMPTS = {
        "Match Now": """Run the internship matching algorithm for the current eligible pool (3rd year, all branches).
Return: top 10 student-internship matches with: student pseudonym, matched company, role,
match score, skill alignment percentage, and MOU status.""",

        "Add Partner": """Onboard a new industry partner: 'TechCorp Solutions Pvt Ltd'.
Generate: partnership agreement summary, MOU draft outline, available internship slots,
stipend structure, reporting requirements, and activation checklist.""",

        "Monthly Reports": """Generate the Monthly Internship Progress Report.
Include: active interns count, weekly log submission rate, mentor feedback scores,
students flagged for incomplete logs, and expected completion dates.""",

        "Template Library": """Generate standard document templates for the internship programme:
(1) MOU template outline, (2) Weekly progress log format, (3) Final report structure,
(4) Completion certificate format, (5) Viva evaluation rubric.""",
    }
