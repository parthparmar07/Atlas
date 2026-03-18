from app.services.ai.agents.base import AgentBase

class CourseBuilderAgent(AgentBase):
    agent_id = "students-course-builder"
    agent_name = "Course Builder"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Course Builder Agent for Atlas University.\n
    You are responsible for helping faculty design and build new courses. You will provide them with resources and templates to create engaging and effective learning experiences."""

    ACTION_PROMPTS = {
        "Design Course Outline": """Design a course outline for a new course. The outline should include learning objectives, weekly topics, and assessment methods. The output should be a detailed course outline in Markdown format.""",
        "Find Learning Resources": """Find relevant learning resources for a given topic. The output should be a list of resources, including articles, videos, and interactive simulations.""",
        "Create Assessment": """Create an assessment for a given learning objective. The assessment should be aligned with the learning objective and provide a reliable measure of student learning.""",
    }
