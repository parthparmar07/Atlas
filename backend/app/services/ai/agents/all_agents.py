from app.modules.admissions_chat.agent import AdmissionsChatAgent
from app.modules.lead_nurture.agent import LeadNurtureAgent
from app.modules.document_verifier.agent import DocumentVerifierAgent
from app.modules.scholarship_matcher.agent import ScholarshipMatcherAgent
from app.modules.career_advisor.agent import CareerAdvisorAgent
from app.modules.resume_intelligence.agent import ResumeIntelligenceAgent
from app.modules.alumni_network.agent import AlumniNetworkAgent
from app.modules.recruiter_comms.agent import RecruiterCommsAgent
from app.modules.interview_prep.agent import InterviewPrepAgent
from app.modules.timetable_ai.agent import TimetableAIAgent
from app.modules.substitution.agent import SubstitutionAgent
from app.modules.exam_scheduler.agent import ExamSchedulerAgent
from app.modules.calendar_generator.agent import CalendarGeneratorAgent
from app.modules.curriculum_auditor.agent import CurriculumAuditorAgent
from app.modules.procurement.agent import ProcurementAgent
from app.modules.budget_monitor.agent import BudgetMonitorAgent
from app.modules.accreditation.agent import AccreditationAgent
from app.modules.faculty_load_balancer.agent import FacultyLoadBalancerAgent
from app.modules.appraisal.agent import AppraisalAgent
from app.modules.leave_manager.agent import LeaveManagerAgent
from app.modules.hr_bot.agent import HROperationsBotAgent
from app.modules.research_assistant.agent import ResearchAssistantAgent
from app.modules.grant_tracker.agent import GrantTrackerAgent
from app.modules.publication_assistant.agent import PublicationAssistantAgent
from app.modules.course_builder.agent import CourseBuilderAgent
from app.modules.feedback_analyzer.agent import FeedbackAnalyzerAgent
from app.modules.project_tracker.agent import ProjectTrackerAgent
from app.modules.dropout_predictor.agent import DropoutPredictorAgent
from app.modules.internship.agent import InternshipAgent
from app.modules.grievance.agent import GrievanceAgent
from app.modules.fee_collection.agent import FeeCollectionAgent
from app.modules.events_coordinator.agent import EventsCoordinatorAgent
from app.modules.wellbeing_support.agent import WellbeingSupportAgent
from app.modules.it_support.agent import ITSupportAgent

from app.services.ai.agents.base import AgentBase

ALL_AGENTS: dict[str, AgentBase] = {
    # Admissions
    "admissions-intelligence": AdmissionsChatAgent(),
    "admissions-leads": LeadNurtureAgent(),
    "admissions-scholarship": ScholarshipMatcherAgent(),
    "admissions-documents": DocumentVerifierAgent(),

    # Placement
    "placement-alumni": AlumniNetworkAgent(),
    "placement-interview-prep": InterviewPrepAgent(),
    "placement-interview": InterviewPrepAgent(),
    "placement-intelligence": CareerAdvisorAgent(),
    "placement-resume": ResumeIntelligenceAgent(),

    # Academics
    "academics-timetable": TimetableAIAgent(),
    "academics-substitution": SubstitutionAgent(),
    "academics-exams": ExamSchedulerAgent(),
    "academics-calendar": CalendarGeneratorAgent(),
    "academics-curriculum": CurriculumAuditorAgent(),

    # Finance
    "finance-procurement": ProcurementAgent(),
    "finance-budget": BudgetMonitorAgent(),
    "finance-accreditation": AccreditationAgent(),
    "finance-fees": FeeCollectionAgent(),

    # HR
    "hr-load-balancer": FacultyLoadBalancerAgent(),
    "hr-appraisal": AppraisalAgent(),
    "hr-recruitment": RecruiterCommsAgent(),
    "hr-bot": HROperationsBotAgent(),
    "hr-leave-manager": LeaveManagerAgent(),

    # Students
    "students-projects": ProjectTrackerAgent(),
    "students-course-builder": CourseBuilderAgent(),
    "students-grievance": GrievanceAgent(),
    "students-wellbeing": WellbeingSupportAgent(),
    "students-dropout": DropoutPredictorAgent(),
    "students-internships": InternshipAgent(),
    "students-events": EventsCoordinatorAgent(),

    # Others
    "research-assistant": ResearchAssistantAgent(),
    "research-grant": GrantTrackerAgent(),
    "research-publication": PublicationAssistantAgent(),
    "it-support": ITSupportAgent(),
}
