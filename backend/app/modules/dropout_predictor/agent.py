from app.services.ai.agents.base import AgentBase

class DropoutPredictorAgent(AgentBase):
    agent_id = "students-dropout"
    agent_name = "Dropout Predictor"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Dropout Predictor Agent for Atlas University.
You analyse student behavioural, academic, and financial signals to predict dropout risk
6 weeks in advance. You generate intervention plans for student counsellors
and track intervention effectiveness over time."""

    ACTION_PROMPTS = {
        "Run Prediction": """Run the dropout prediction model on the current student base (simulate 500 students).
Return: high-risk count, medium-risk count, top 10 high-risk students (pseudonyms) with:
risk score, primary risk factors (academic/financial/attendance/social), and recommended intervention type.""",

        "Intervention Plan": """Generate a targeted intervention plan for 5 high-risk students.
For each: pseudonym, risk profile, recommended actions (counsellor meeting, financial aid,
peer buddy program, faculty alert), and 30-day follow-up schedule.""",

        "Early Warning": """Generate this week's Early Warning Report.
List students who crossed the high-risk threshold in the last 7 days.
Include triggering signals, responsible counsellor assignment, and escalation timeline.""",

        "Trend Analysis": """Analyse 3-year dropout trend data for Atlas University.
Return: year-wise dropout rates by programme, key causal factors identified,
intervention success rate, and recommendations for institutional policy changes.""",
    }
