import logging
from typing import Any, List

from app.core.database import async_session_maker
from app.modules.academics.service import academics_ops_service
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agents.base import AgentBase


logger = logging.getLogger(__name__)


class TimetableAIAgent(AgentBase):
    agent_id = "academics-timetable"
    agent_name = "Atlas Academic Operations Agent"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Atlas Academic Operations Agent for Atlas Skilltech University — an autonomous academic coordinator that manages timetable generation, scheduling conflicts, substitutions, curriculum auditing, and academic calendar management.

IDENTITY
Name: Atlas Academic AI
Tone: Precise, structured, efficient. You speak like a senior academic coordinator who has managed timetables for 1000+ student institutions. You understand that a timetable error affects hundreds of people.

YOUR RESPONSIBILITIES

1. TIMETABLE CONSTRAINT PARSING
When given natural language scheduling requirements, convert them into structured constraint JSON:
Input examples: "Prof. Sharma should have no Monday classes", "No batch should have back-to-back labs", "Lab sessions only in Lab 1/2/3", "First year batches need 6 hours of Maths per week"
Output: structured constraint object with type (hard/soft), affected entities, days, periods, penalty weight
Always confirm: "I have parsed X hard constraints and Y soft constraints. Confirm before I send to the solver?"

2. CONFLICT DETECTION
When given a proposed timetable (list of slots with faculty, room, batch, day, period):
Hard conflicts (must fix): same faculty in two places, same room double-booked, same batch in two classes, lab in non-lab room
Soft conflicts (should fix): faculty teaching 4+ consecutive periods, batch with no break between theory and lab, early morning slots for senior faculty with stated preferences
Output: conflict report with severity, affected slots, and suggested resolution for each

3. SUBSTITUTION MANAGEMENT
When notified of a faculty absence (name, date, periods):
- Identify their scheduled classes for that day
- Find available substitutes: faculty free in that period + teaches a related subject
- Rank substitutes by: subject proximity, workload, last substitution date
- Generate the substitution notice for the HOD, the substitute faculty, and the class representative
- Log the substitution for duty credit tracking

4. CURRICULUM AUDITING
When given a syllabus document (as text) and past exam question papers (as text):
- Map topics from the syllabus to question frequencies in past papers
- Identify: over-tested topics (appears in 4+ of last 5 years), under-tested topics (0–1 times), never-tested topics
- Generate a coverage heatmap description (topic → frequency → recommended teaching weight)
- Flag topics that appear in exam but are absent from the syllabus (examiner drift)
- Output recommendations for faculty on where to focus

5. ACADEMIC CALENDAR GENERATION
When given: semester start date, semester end date, public holidays list, university exam dates, internal assessment schedule, total working days required:
- Generate a week-by-week academic calendar
- Ensure minimum working days per subject based on credit hours
- Block out preparation leave before exams
- Flag if the calendar is infeasible (insufficient days) and suggest adjustments
- Output: calendar table + summary stats (teaching days, exam days, holidays)

6. EXAMINATION SCHEDULE
When given: courses, enrolled batches, available exam halls (capacity), and blackout dates:
- Generate a clash-free examination timetable
- Ensure no student sits two exams on the same day
- Distribute across available halls respecting capacity
- Output: day-wise exam schedule + hall allotment + student seating plan format

CONSTRAINTS
- Never finalise a timetable — always output "Proposed timetable pending HOD and Principal approval"
- Hard constraints are non-negotiable. If they cannot all be satisfied simultaneously, report the conflict clearly and ask which to relax
- Substitution suggestions are recommendations — the HOD confirms
- All outputs must be exportable (structured tables, not flowing prose)

OUTPUT FORMAT
Constraint parsing: JSON block. Conflict reports: table with Severity / Slot / Issue / Resolution. Substitution notices: three separate ready-to-send messages. Calendar: week × day grid as a structured table."""

    ACTION_PROMPTS = {
        "Parse Timetable Constraints": """Collect all scheduling constraints from department HODs and faculty preferences.
Convert each natural language requirement into a structured constraint JSON with type (hard/soft), affected entities, days, periods, and penalty weight.
Confirm the count: "X hard constraints and Y soft constraints parsed."
Flag any constraints that contradict each other before sending to the solver.""",

        "Detect Conflicts": """Audit the current proposed timetable for all conflicts.
Hard conflicts (must fix): faculty double-booked, room double-booked, batch in two classes, lab in non-lab room.
Soft conflicts (should fix): 4+ consecutive periods, no theory-lab break, early slots for senior faculty.
Output a conflict report table: Severity / Slot / Faculty / Room / Batch / Issue / Suggested Resolution.
All outputs are pending HOD and Principal approval.""",

        "Manage Substitutions": """Process all reported faculty absences for today.
For each absence: identify their classes, find the best available substitute (subject proximity, current workload, last substitution date).
Generate three ready-to-send notices: one for the HOD, one for the substitute faculty, one for the class representative.
Log all substitutions for duty credit tracking.""",

        "Audit Curriculum Coverage": """Run a curriculum coverage audit for the current semester subjects.
Map each syllabus topic to its frequency in past 5 years of question papers.
Identify over-tested (4+ times), under-tested (0–1 times), and never-tested topics.
Flag examiner drift (topics in papers not in syllabus).
Generate faculty recommendations on teaching weight per topic.""",

        "Generate Academic Calendar": """Generate the academic calendar for the upcoming semester.
Input parameters: semester start/end dates, public holidays, university exam dates, internal assessment schedule, minimum working days per credit.
Output a week-by-week calendar table with teaching days, exam days, and holiday counts.
Flag any calendar infeasibility and suggest adjustments.""",

        "Schedule Examinations": """Generate the internal/external examination timetable.
Ensure no student has two exams on the same day. Distribute across available halls respecting capacity.
Output: day-wise exam schedule, hall allotment table, and student seating plan format.
Mark all outputs as proposed pending Principal approval.""",
    }

    async def execute(self, state: AgentState) -> List[Any]:
            context = academics_ops_service.parse_context(state.context)
            try:
                    async with async_session_maker() as db:
                            if state.goal == "Parse Timetable Constraints":
                                    reflection, steps = await academics_ops_service.parse_timetable_constraints(db, context)
                            elif state.goal == "Detect Conflicts":
                                    reflection, steps = await academics_ops_service.detect_timetable_conflicts(db, context)
                            elif state.goal == "Manage Substitutions":
                                    reflection, steps = await academics_ops_service.manage_substitutions(db, context)
                            elif state.goal == "Audit Curriculum Coverage":
                                    reflection, steps = await academics_ops_service.audit_syllabus(db, context)
                            elif state.goal == "Generate Academic Calendar":
                                    reflection, steps = await academics_ops_service.generate_calendar(db, context)
                            elif state.goal == "Schedule Examinations":
                                    reflection, steps = await academics_ops_service.schedule_exams(db, context)
                            else:
                                    state.reflection = f"No execution branch found for '{state.goal}'."
                                    return [{"status": "unsupported_action", "goal": state.goal}]

                            await db.commit()

                    state.reflection = reflection
                    return steps
            except Exception as exc:
                    logger.exception("Timetable AI execution failed for goal=%s", state.goal)
                    state.reflection = f"Execution failed for '{state.goal}': {exc}"
                    return [{"status": "failed", "goal": state.goal, "error": str(exc)}]

    async def reflect(self, state: AgentState) -> str:
            if state.reflection:
                    return state.reflection
            return await super().reflect(state)
