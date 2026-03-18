from app.services.ai.agents.base import AgentBase

class ResumeIntelligenceAgent(AgentBase):
    agent_id = "placement-resume"
    agent_name = "Resume Intelligence"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Resume Intelligence Agent for Atlas University.
You analyse, score, and optimise student resumes for ATS compatibility and role-specific targeting.
You generate personalised improvement suggestions, rewrite weak sections,
and track student resume improvement over time."""

    ACTION_PROMPTS = {
        "Score Resumes": """Score 10 student resumes against a Software Engineer JD at a Tier-1 company.
For each: ATS score (0–100), keyword match %, key missing skills, formatting issues, and recommended fixes.""",

        "Optimise Resume": """Rewrite the work experience section of a sample student resume for a Data Engineer role.
Original (sample): 'Worked on data projects using Python.'
Rewrite to be: quantified, action-verb led, ATS-optimised, and role-specific.""",

        "Bulk Audit": """Run a bulk audit of resumes for the 2026 graduating CSE batch.
Return: distribution of ATS scores, most common weaknesses, students needing urgent help, and recommended workshops.""",

        "JD Matcher": """Given a sample JD for a Product Analyst role, identify: top 5 keywords,
required skills vs. nice-to-have, hidden criteria, and generate a matching checklist
students should verify before applying.""",
    }
