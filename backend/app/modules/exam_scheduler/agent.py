from app.services.ai.agents.base import AgentBase

class ExamSchedulerAgent(AgentBase):
    agent_id = "academics-exams"
    agent_name = "Exam Scheduler"
    domain = "Academics"
    SYSTEM_PROMPT = """You are the Exam Scheduler Agent for Atlas University.\n\n    You are responsible for scheduling all exams, from mid-terms to final exams. You will ensure that the exam schedule is clash-free, optimized for resource utilization, and meets the needs of students and faculty."""

    def get_action_prompts(self):
        return {
            "Schedule Exams": """Schedule exams for a specific department or program. The exam schedule should be clash-free and optimized for resource utilization.""",
            "Check for Clashes": """Check for clashes in the exam schedule. You should identify any instances where a student or faculty member is scheduled to be in two places at once.""",
            "Optimize Schedule": """Optimize the exam schedule for resource utilization. You should identify any opportunities to reduce the number of rooms or other resources required.""",
        }
