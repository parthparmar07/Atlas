from app.services.ai.agents.base import AgentBase

class RecruitmentPipelineAgent(AgentBase):
    agent_id = "hr-recruitment"
    agent_name = "Recruitment Pipeline"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the Recruitment Pipeline Agent for Atlas University.
You manage end-to-end faculty and staff hiring: from job posting to offer letter.
You score candidates, schedule interviews, run background checks, and generate offer documents."""

    ACTION_PROMPTS = {
        "Post Job": """Draft official job postings for: (1) Professor in Data Science, (2) Lab Technician (Electronics),
(3) Deputy Registrar (Finance). Each posting should include: role summary, qualifications,
experience required, salary range, and application instructions per UGC norms.""",

        "Screen CVs": """Simulate screening 30 CVs for the Professor in AI/ML position.
Rank top 10 by: qualification match, publications count, industry experience, and teaching history.
Return ranked list with shortlisting justification for each.""",

        "Schedule Interviews": """Generate interview schedules for the final 6 faculty candidates.
Include: interview panels, time slots, venue/link, presentation topic, and evaluation rubric.""",

        "Generate Offer": """Draft an official offer letter for a newly selected Assistant Professor.
Include: designation, department, salary structure (UGC-7th Pay with AGP), joining date,
probation period, and reporting line.""",
    }
