from app.modules.admissions_chat.agent import AdmissionsChatAgent
from app.modules.admissions_intel.agent import AdmissionsIntelligenceAgent
from app.modules.lead_nurture.agent import LeadNurtureAgent
from app.modules.document_verifier.agent import DocumentVerifierAgent
from app.modules.scholarship_matcher.agent import ScholarshipMatcherAgent
from app.modules.career_advisor.agent import CareerAdvisorAgent
from app.modules.alumni_network.agent import AlumniNetworkAgent
from app.modules.recruiter_comms.agent import RecruiterCommsAgent
from app.modules.interview_prep.agent import InterviewPrepAgent
from app.modules.timetable_ai.agent import TimetableAIAgent
from app.modules.substitution.agent import SubstitutionAgent
from app.modules.exam_scheduler.agent import ExamSchedulerAgent
from app.modules.procurement.agent import ProcurementAgent
from app.modules.budget_monitor.agent import BudgetMonitorAgent
from app.modules.accreditation.agent import AccreditationAgent
from app.modules.faculty_load_balancer.agent import FacultyLoadBalancerAgent
from app.modules.appraisal.agent import AppraisalAgent
from app.modules.leave_manager.agent import LeaveManagerAgent
from app.modules.research_assistant.agent import ResearchAssistantAgent
from app.modules.grant_tracker.agent import GrantTrackerAgent
from app.modules.publication_assistant.agent import PublicationAssistantAgent
from app.modules.course_builder.agent import CourseBuilderAgent
from app.modules.feedback_analyzer.agent import FeedbackAnalyzerAgent
from app.modules.project_tracker.agent import ProjectTrackerAgent
from app.modules.events_coordinator.agent import EventsCoordinatorAgent
from app.modules.wellbeing_support.agent import WellbeingSupportAgent
from app.modules.it_support.agent import ITSupportAgent
from app.services.ai.agents.base import AgentBase

ALL_AGENTS: list[AgentBase] = [
    AdmissionsChatAgent(),
    AdmissionsIntelligenceAgent(),
    LeadNurtureAgent(),
    DocumentVerifierAgent(),
    ScholarshipMatcherAgent(),
    CareerAdvisorAgent(),
    AlumniNetworkAgent(),
    RecruiterCommsAgent(),
    InterviewPrepAgent(),
    TimetableAIAgent(),
    SubstitutionAgent(),
    ExamSchedulerAgent(),
    ProcurementAgent(),
    BudgetMonitorAgent(),
    AccreditationAgent(),
    FacultyLoadBalancerAgent(),
    AppraisalAgent(),
    LeaveManagerAgent(),
    ResearchAssistantAgent(),
    GrantTrackerAgent(),
    PublicationAssistantAgent(),
    CourseBuilderAgent(),
    FeedbackAnalyzerAgent(),
    ProjectTrackerAgent(),
    EventsCoordinatorAgent(),
    WellbeingSupportAgent(),
    ITSupportAgent(),
]

AGENT_REGISTRY = {a.agent_id: a for a in ALL_AGENTS}
