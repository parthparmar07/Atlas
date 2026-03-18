from typing import Dict, Any


AGENT_ACTION_CONTRACTS: Dict[str, Dict[str, Dict[str, Any]]] = {
    "admissions-intelligence": {
        "Qualify Leads": {"handler": "admissions_qualify", "required_inputs": ["leads[].name", "leads[].programme_interest", "leads[].source", "leads[].score(optional)"]},
        "Parse Documents": {"handler": "admissions_parse_documents", "required_inputs": ["documents[].text|parsed", "documents[].doc_type"]},
        "Track Funnel": {"handler": "admissions_funnel", "required_inputs": ["leads[].stage", "leads[].last_activity_at"]},
        "Generate Follow-Up Messages": {"handler": "admissions_followup", "required_inputs": ["lead.name", "lead.programme", "channel", "context"]},
        "Match Scholarships": {"handler": "admissions_scholarship", "required_inputs": ["lead.score", "lead.category(optional)", "lead.annual_income(optional)"]},
        "Brief Counsellors": {"handler": "admissions_brief", "required_inputs": ["lead.name", "lead.programme", "lead.score", "lead.stage"]},
    },
    "admissions-scholarship": {
        "Match Now": {"handler": "admissions_scholarship", "required_inputs": ["candidates[]"]},
        "Update Database": {"handler": "finance_compliance_calendar", "required_inputs": ["scheme_updates[]"]},
        "Generate Letters": {"handler": "admissions_followup", "required_inputs": ["student.name", "scheme_name"]},
        "Track Applications": {"handler": "admissions_funnel", "required_inputs": ["applications[].status", "applications[].deadline"]},
    },
    "hr-leave-manager": {
        "Process Leave Requests": {"handler": "hr_leave", "required_inputs": ["leave_requests[].name", "leave_requests[].leave_days", "leave_requests[].leave_balance"]},
        "Analyse Faculty Load": {"handler": "hr_load", "required_inputs": ["faculty[].teaching_hours"]},
        "Run Appraisals": {"handler": "hr_appraisal", "required_inputs": ["faculty[].teaching_feedback", "faculty[].research_output"]},
        "Screen Recruitment": {"handler": "hr_recruitment", "required_inputs": ["candidates[].name", "candidates[].experience_years", "candidates[].phd|net"]},
        "Generate Onboarding": {"handler": "hr_onboarding", "required_inputs": ["employees[].name", "employees[].role", "employees[].department"]},
        "HR Policy Lookup": {"handler": "hr_policy", "required_inputs": ["query"]},
    },
    "hr-load-balancer": {
        "Analyse Load": {"handler": "hr_load", "required_inputs": ["faculty[].teaching_hours"]},
        "Generate Report": {"handler": "hr_load", "required_inputs": ["faculty[]"]},
        "Recommend Changes": {"handler": "hr_load", "required_inputs": ["faculty[]"]},
    },
    "hr-appraisal": {
        "Run Appraisal": {"handler": "hr_appraisal", "required_inputs": ["faculty[]"]},
        "Generate Report": {"handler": "hr_appraisal", "required_inputs": ["faculty[]"]},
        "Notify Faculty": {"handler": "hr_appraisal", "required_inputs": ["faculty[]"]},
    },
    "hr-recruitment": {
        "Screen Candidates": {"handler": "hr_recruitment", "required_inputs": ["candidates[]"]},
        "Generate Interview Questions": {"handler": "placement_interview", "required_inputs": ["candidate_profile", "role"]},
        "Draft Call Letters": {"handler": "hr_recruitment", "required_inputs": ["shortlisted_candidates[]"]},
    },
    "academics-timetable": {
        "Parse Timetable Constraints": {"handler": "academics_constraints", "required_inputs": ["constraint_text"]},
        "Detect Conflicts": {"handler": "academics_conflicts", "required_inputs": ["slots[]"]},
        "Manage Substitutions": {"handler": "academics_substitution", "required_inputs": ["absence[]", "slots[]"]},
        "Audit Curriculum Coverage": {"handler": "academics_curriculum", "required_inputs": ["syllabus_topics[]", "exam_topics[]"]},
        "Generate Academic Calendar": {"handler": "academics_calendar", "required_inputs": ["start_date", "end_date", "holidays[]"]},
        "Schedule Examinations": {"handler": "academics_exams", "required_inputs": ["courses[]", "halls[]"]},
    },
    "academics-substitution": {
        "Find Substitute": {"handler": "academics_substitution", "required_inputs": ["absence[]", "faculty[]"]},
        "Notify Students": {"handler": "academics_substitution", "required_inputs": ["affected_classes[]"]},
        "Update Timetable": {"handler": "academics_substitution", "required_inputs": ["replacement_slots[]"]},
    },
    "academics-exams": {
        "Schedule Exams": {"handler": "academics_exams", "required_inputs": ["courses[]", "halls[]"]},
        "Check for Clashes": {"handler": "academics_conflicts", "required_inputs": ["exam_slots[]"]},
        "Optimize Schedule": {"handler": "academics_exams", "required_inputs": ["exam_slots[]"]},
    },
    "placement-intelligence": {
        "Analyse Job Descriptions": {"handler": "placement_jd", "required_inputs": ["jds[]"]},
        "Match Students to Jobs": {"handler": "placement_match", "required_inputs": ["students[]", "jobs[]"]},
        "Analyse Batch Skill Gaps": {"handler": "placement_skill_gap", "required_inputs": ["batch_skills[]", "jd_skills[]"]},
        "Review Resumes": {"handler": "placement_resume", "required_inputs": ["resume_text", "target_jd"]},
        "Prepare for Interviews": {"handler": "placement_interview", "required_inputs": ["student_profile", "target_role", "round_type"]},
        "Manage Company Pipeline": {"handler": "placement_pipeline", "required_inputs": ["companies[]"]},
    },
    "placement-interview": {
        "Generate Questions": {"handler": "placement_interview", "required_inputs": ["student_profile", "target_role"]},
        "Review Answers": {"handler": "placement_interview", "required_inputs": ["answers[]", "questions[]"]},
        "Provide Tips": {"handler": "placement_interview", "required_inputs": ["target_company", "role"]},
    },
    "placement-alumni": {
        "Find Mentors": {"handler": "placement_alumni", "required_inputs": ["student_goal", "alumni[]"]},
        "Post Job Opening": {"handler": "placement_pipeline", "required_inputs": ["job", "alumni_segment[]"]},
        "Organize Networking Event": {"handler": "placement_alumni", "required_inputs": ["theme", "attendees[]"]},
    },
    "students-projects": {
        "Track Projects": {"handler": "students_projects", "required_inputs": ["projects[]"]},
        "Monitor Dropout Risk": {"handler": "students_dropout", "required_inputs": ["students[]"]},
        "Manage Grievances": {"handler": "students_grievance", "required_inputs": ["grievances[]"]},
        "Manage Internships": {"handler": "students_internships", "required_inputs": ["internships[]"]},
        "Generate Attendance Alerts": {"handler": "students_attendance", "required_inputs": ["attendance[]"]},
        "Flag Delays": {"handler": "students_projects", "required_inputs": ["projects[]"]},
    },
    "students-dropout": {
        "Run Prediction": {"handler": "students_dropout", "required_inputs": ["students[]"]},
        "Intervention Plan": {"handler": "students_dropout", "required_inputs": ["high_risk_students[]"]},
        "Early Warning": {"handler": "students_dropout", "required_inputs": ["students[]"]},
        "Trend Analysis": {"handler": "students_dropout", "required_inputs": ["historical[]"]},
    },
    "students-grievance": {
        "Process Grievances": {"handler": "students_grievance", "required_inputs": ["grievances[]"]},
        "Escalation Report": {"handler": "students_grievance", "required_inputs": ["grievances[]"]},
        "Anonymise Report": {"handler": "students_grievance", "required_inputs": ["grievances[]"]},
        "SLA Dashboard": {"handler": "students_grievance", "required_inputs": ["grievances[]"]},
    },
    "students-internships": {
        "Match Now": {"handler": "students_internships", "required_inputs": ["students[]", "companies[]"]},
        "Add Partner": {"handler": "students_internships", "required_inputs": ["partner_details"]},
        "Monthly Reports": {"handler": "students_internships", "required_inputs": ["internships[]"]},
        "Template Library": {"handler": "students_internships", "required_inputs": ["template_type"]},
    },
    "students-course-builder": {
        "Design Course Outline": {"handler": "academics_curriculum", "required_inputs": ["course", "outcomes"]},
        "Find Learning Resources": {"handler": "academics_curriculum", "required_inputs": ["course", "topic"]},
        "Create Assessment": {"handler": "academics_curriculum", "required_inputs": ["course", "topics[]"]},
    },
    "students-wellbeing": {
        "Connect with a Counselor": {"handler": "wellbeing_support", "required_inputs": ["student_issue"]},
        "Find a Support Group": {"handler": "wellbeing_support", "required_inputs": ["student_issue"]},
        "Access Self-Help Resources": {"handler": "wellbeing_support", "required_inputs": ["student_issue"]},
    },
    "finance-fees": {
        "Collect Dues": {"handler": "finance_fee", "required_inputs": ["fees[]"]},
        "NAAC Readiness Check": {"handler": "finance_naac", "required_inputs": ["criteria_data[]"]},
        "Monitor Budgets": {"handler": "finance_budget", "required_inputs": ["budgets[]"]},
        "Track Grants": {"handler": "finance_grants", "required_inputs": ["grants[]"]},
        "Support Audit": {"handler": "finance_audit", "required_inputs": ["audit_queries[]"]},
        "Compliance Calendar": {"handler": "finance_compliance_calendar", "required_inputs": ["current_date(optional)"]},
    },
    "finance-budget": {
        "Analyze Burn Rate": {"handler": "finance_budget", "required_inputs": ["budgets[]"]},
        "Detect Anomalies": {"handler": "finance_budget", "required_inputs": ["transactions[]"]},
    },
    "finance-accreditation": {
        "Audit Compliance": {"handler": "finance_naac", "required_inputs": ["criteria_data[]"]},
        "Prepare Documentation": {"handler": "finance_naac", "required_inputs": ["criteria_data[]"]},
        "Generate Report": {"handler": "finance_naac", "required_inputs": ["criteria_data[]"]},
    },
    "finance-procurement": {
        "Process Requests": {"handler": "finance_procurement", "required_inputs": ["requests[]"]},
        "Track Orders": {"handler": "finance_procurement", "required_inputs": ["orders[]"]},
        "Pay Vendors": {"handler": "finance_procurement", "required_inputs": ["invoices[]"]},
    },
    "it-support": {
        "Troubleshoot Issue": {"handler": "it_support", "required_inputs": ["issue"]},
        "Request Equipment": {"handler": "it_support", "required_inputs": ["equipment_request"]},
        "Access IT Services": {"handler": "it_support", "required_inputs": ["service_request"]},
    },
    "research-assistant": {
        "Find Literature": {"handler": "research_assistant", "required_inputs": ["topic"]},
        "Analyze Data": {"handler": "research_assistant", "required_inputs": ["dataset_summary"]},
        "Prepare Manuscript": {"handler": "research_assistant", "required_inputs": ["findings"]},
    },
}


def get_action_contract(agent_id: str, action: str) -> Dict[str, Any] | None:
    return AGENT_ACTION_CONTRACTS.get(agent_id, {}).get(action)
