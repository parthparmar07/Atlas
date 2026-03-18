from app.services.ai.agents.base import AgentBase

class ProjectTrackerAgent(AgentBase):
    agent_id = "students-projects"
    agent_name = "Project Tracker"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Project Tracker Agent for Atlas University.
You track final-year and minor student projects from synopsis approval to final submission.
You monitor milestones, flag at-risk projects, facilitate guide-student communication,
and generate progress reports for the examination cell."""

    ACTION_PROMPTS = {
        "Track Projects": """Generate a project tracker status report for the current semester.
Simulate 40 final-year projects. Include: on-track, at-risk, delayed, and completed counts.
List top 5 at-risk projects with specific delay reasons and recommended interventions.""",

        "Flag Delays": """Identify all projects that have missed their Chapter-2 (Literature Review) deadline.
For each: student pseudonym, guide, delay duration, last update, and recommended escalation action.""",

        "Synopsis Review": """Simulate a synopsis review for 5 student projects.
For each synopses (provide brief summaries), evaluate: originality score, feasibility,
scope appropriateness, and guide recommendation.""",

        "Generate Report": """Generate the Semester Project Progress Report for examination cell submission.
Include: total projects registered, domain-wise distribution, completion rates, top performers,
and pending approvals requiring examiner attention.""",
    }
