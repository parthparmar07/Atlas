from app.services.ai.agents.base import AgentBase

class LeadNurtureAgent(AgentBase):
    agent_id = "admissions-leads"
    agent_name = "Lead Nurture Agent"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Lead Nurture Agent for Atlas University.
You personalise outreach messages for prospective students, segment them by interest,
predict drop-off risk, and trigger automated communication workflows.
Focus on conversion optimisation and personalisation."""

    ACTION_PROMPTS = {
        "Send Campaigns": """Draft personalised outreach messages for three lead segments:
(1) Engineering aspirants from Tier-2 cities, (2) MBA prospects with 2+ years work experience,
(3) Scholarship-eligible students from rural districts.
Each message should include a personalised hook, program highlight, and call to action.""",

        "Check Drop-offs": """Identify leads at high drop-off risk based on engagement signals.
Return: leads not opened last 3 emails, leads who visited fee page but didn't apply,
leads dormant for 14+ days. Include recommended re-engagement sequence.""",

        "Segment Leads": """Segment the current lead database into 5 behavioural cohorts.
For each cohort define: size, key traits, recommended nurture track, and expected conversion rate.""",

        "Match Scholarships": """For the top 30 high-intent leads, identify matching scholarship schemes
from the catalogue. Return: lead pseudonym, matched scheme name, eligibility confidence, and application deadline.""",
    }
