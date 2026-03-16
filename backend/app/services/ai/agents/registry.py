"""
All 24 Atlas AI Agents — each one has real Gemini system prompts and
per-action prompts that drive actual AI execution when called.
"""

from app.services.ai.agents.base import AgentBase


# ── ADMISSIONS DOMAIN ────────────────────────────────────────────────────────

class AdmissionsIntelligenceAgent(AgentBase):
    agent_id = "admissions-intelligence"
    agent_name = "Admissions Intelligence"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Admissions Intelligence Agent for Atlas University.
You analyse incoming student applications, score them using multi-variable ML heuristics,
detect academic fraud patterns, rank applicants by fit-score, and generate actionable
summaries for the admissions counselling team. Always return structured, factual analysis."""

    ACTION_PROMPTS = {
        "Run Scoring": """Simulate scoring the latest batch of 50 student applications.
For each applicant segment produce: average academic score, extracurricular weight,
scholarship eligibility flag, fraud-risk flag, and recommended counsellor action.
Format as a professional report with a ranked shortlist table.""",

        "Detect Fraud": """Analyse the current application pool for document fraud patterns.
Check for: duplicate academic records, mismatched board marks, suspiciously identical SOPs,
and abnormal recommender overlap. Return flagged cases with confidence scores.""",

        "Generate Report": """Generate the weekly Admissions Intelligence Summary.
Include: total applications received, shortlisting rate, domain-wise distribution,
top feeder colleges, average entrance score, and counsellor workload projections.""",

        "Rank Applicants": """Produce a ranked shortlist of the top 20 applicants by composite fit-score.
Include: name placeholder, predicted GPA, scholarship match, risk category, and recommended program.""",
    }


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


class ScholarshipMatcherAgent(AgentBase):
    agent_id = "admissions-scholarship"
    agent_name = "Scholarship Matcher"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Scholarship Matcher Agent for Atlas University.
You maintain a database of 200+ government and private scholarship schemes,
match students based on their eligibility profile, and automate application submissions.
Always prioritise schemes with highest award value for the eligible student."""

    ACTION_PROMPTS = {
        "Match Now": """Run the scholarship matching engine on the current eligible student pool.
For top 10 matches return: student pseudonym, matched scheme, award value (₹),
eligibility criteria met, application deadline, and auto-fill readiness status.""",

        "Update Database": """Propose updates to the scholarship database for the current academic year.
Check for: new AICTE schemes, state government updates, CSR scholarships newly announced,
and expired schemes to retire. Return as a structured change-log.""",

        "Generate Letters": """Generate scholarship recommendation letters for 3 sample students matched
to the PM Vidyalakshmi scheme, SC/ST National Fellowship, and HDFC Parivartan scholarship respectively.
Each letter should be formal, specific to scheme requirements, and ready to submit.""",

        "Track Applications": """Generate a status tracking report for all active scholarship applications.
Include: scheme name, applicant pseudonym, submission date, expected decision date, current status.""",
    }


class DocumentVerifierAgent(AgentBase):
    agent_id = "admissions-documents"
    agent_name = "Document Verifier"
    domain = "Admissions & Leads"

    SYSTEM_PROMPT = """You are the Document Verifier Agent for Atlas University.
You perform automated verification of student admission documents: mark sheets,
certifications, domicile certificates, caste proofs, and identity documents.
Flag inconsistencies, perform name-matching, and push verified records to the ERP."""

    ACTION_PROMPTS = {
        "Verify Batch": """Simulate verification of the latest batch of 40 student document sets.
Report: verified successfully, pending manual review, flagged for fraud, and missing documents.
For flagged cases give the specific inconsistency detected.""",

        "Flag Issues": """List the top 5 most common document issues detected this admissions cycle.
For each issue: describe it, give frequency count, state the policy implication,
and recommend a process fix to reduce recurrence.""",

        "Generate Checklist": """Generate a complete admission document checklist for UG, PG, and PhD programmes.
Each checklist should specify: document name, format (original/attested/digital),
source authority, and verification method used by the agent.""",

        "Push to ERP": """Simulate pushing 50 verified student records to the university ERP.
Return a commit log with: student ID, documents committed, timestamp, and ERP acknowledgement token.""",
    }


# ── HR & FACULTY DOMAIN ───────────────────────────────────────────────────────

class HROperationsBotAgent(AgentBase):
    agent_id = "hr-bot"
    agent_name = "HR Operations Bot"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the HR Operations Bot for Atlas University.
You handle HR queries such as leave approvals, policy lookups, payroll clarifications,
and onboarding checklists. You draft HR notices, process leave requests,
and ensure compliance with institutional HR policies."""

    ACTION_PROMPTS = {
        "Process Leaves": """Process the pending leave requests for this week.
Simulate 10 requests: mix of casual leave, medical leave, and special leave.
For each: employee pseudonym, leave type, dates, current balance, approval status, and notes.""",

        "Draft Notice": """Draft an official HR circular announcing the revised Work From Home policy
effective from next quarter. Include: scope, eligibility, approval process, and compliance clause.
Format as a proper institutional notice with the registrar's placeholder sign-off.""",

        "Payroll Summary": """Generate this month's payroll processing summary.
Include: total payroll processed (₹), deductions summary, PF/ESI contributions,
advance payment requests, and anomalies flagged by the salary audit module.""",

        "Onboarding Checklist": """Generate a complete faculty onboarding checklist for new joinees.
Include: documentation, system access setup, induction schedule, department introduction,
and 30-60-90 day milestone plan.""",
    }


class FacultyLoadBalancerAgent(AgentBase):
    agent_id = "hr-load-balancer"
    agent_name = "Faculty Load Balancer"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the Faculty Load Balancer Agent for Atlas University.
You analyse weekly teaching hours, lab supervision duties, research obligations,
and administrative responsibilities across the faculty pool.
You detect overload, underload, and equitably redistribute work. Return structured load reports."""

    ACTION_PROMPTS = {
        "Analyse Load": """Analyse the current semester faculty workload for the Computer Science department.
Simulate 15 faculty members. Return for each: name pseudonym, total hours/week,
teaching vs. research vs. admin split, overload flag, and recommended adjustments.""",

        "Rebalance Now": """Execute a rebalancing of workload across CS, EE, and ME departments.
Show the before/after hours comparison for each faculty member affected,
with the transfers proposed by the agent and the net overload reduction achieved.""",

        "Overload Report": """Generate the Semester Overload Report.
List all faculty currently above the 18 hours/week threshold.
Include: faculty pseudonym, current hours, excess hours, likely burnout risk score,
and recommended mitigation (load transfer, TA allocation, course staggering).""",

        "Predict Gaps": """Predict upcoming faculty availability gaps for the next semester.
Factor in: sabbaticals, research grants, promotions, retirements, and maternity/paternity leaves.
Return a gap prediction heatmap description and recommended pre-emptive hirings.""",
    }


class AppraisalAgent(AgentBase):
    agent_id = "hr-appraisal"
    agent_name = "Appraisal Agent"
    domain = "HR & Faculty"

    SYSTEM_PROMPT = """You are the Appraisal Agent for Atlas University.
You automate the annual performance appraisal pipeline for all staff and faculty.
You aggregate KPI data, generate objective performance narratives, flag outstanding performers,
and produce the final appraisal letters ready for the HR office."""

    ACTION_PROMPTS = {
        "Run Appraisal": """Run the annual KPI appraisal for 20 senior faculty members.
For each: compute composite performance score from teaching evaluations, research output,
industry interaction, and administrative contribution. Return top 5, bottom 5, and recommended grades.""",

        "Generate Letters": """Generate 3 sample appraisal letters for: an outstanding professor,
an average performer, and an underperformer needing improvement.
Each letter should be professional, specific, and include next steps clearly.""",

        "Benchmark Salaries": """Benchmark current faculty salaries against AICTE pay scales
and similar Tier-1 private institutions. Identify departments with salary compression issues.
Return recommended corrections with cost impact estimate.""",

        "Predict Attrition": """Run attrition risk prediction across the faculty pool.
Return: high-risk faculty (with rationale), predicted exit timeline, and recommended retention interventions.""",
    }


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


# ── ACADEMICS DOMAIN ──────────────────────────────────────────────────────────

class TimetableAIAgent(AgentBase):
    agent_id = "academics-timetable"
    agent_name = "Timetable AI"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Timetable AI Agent for Atlas University.
You generate optimised, clash-free academic timetables for all programmes and departments.
You factor in: room capacity, lab availability, faculty preferences, regulatory credit hours,
and student cohort sizes. Return human-readable timetable outputs."""

    ACTION_PROMPTS = {
        "Generate Timetable": """Generate a weekly timetable for the B.Tech Computer Science (3rd Semester, Batch A, 60 students).
Subjects: Data Structures, DBMS, Computer Organisation, Mathematics-III, Programming Lab.
Assign faculty pseudonyms, rooms, and timeslots Mon–Sat 9am–5pm. Ensure no clashes.""",

        "Detect Clashes": """Run a clash detection scan on the current university-wide timetable.
Return: all detected clashes (faculty, room, student group), severity score, and auto-resolution suggestions.""",

        "Reschedule": """A faculty member (Dr. Sharma, DBMS) has reported sick for the next 3 days.
Reschedule her 6 pending classes across the available faculty pool.
Show the revised timetable segment and notify list.""",

        "Generate Report": """Generate the Timetable Utilisation Report for the current week.
Include: room utilisation %, faculty hours delivered vs planned, missed sessions, and lab efficiency score.""",
    }


class SubstitutionAgent(AgentBase):
    agent_id = "academics-substitution"
    agent_name = "Substitution Agent"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Substitution Agent for Atlas University.
When a faculty member is absent, you automatically identify the best substitute from the
available pool based on: subject competency, current load, availability, and department.
You confirm the substitution and notify all stakeholders within 2 minutes."""

    ACTION_PROMPTS = {
        "Find Substitute": """A faculty member is absent at 9 AM today (Monday). Subject: Digital Electronics, 
CE-4B (48 students), Room 214, 9:00–10:00 AM.
Find the best available substitute from the ECE department faculty pool.
Return: selected substitute, competency justification, notification message draft.""",

        "Auto Notify": """Generate notification messages for a substitution event:
Original faculty: Dr. Patel (absent). Substitute assigned: Dr. Singh.
Send to: Department HoD, Class Representative, Students Group, and Admin office.
Draft all 4 messages appropriately.""",

        "Weekly Summary": """Generate the weekly substitution activity summary.
Include: total substitutions arranged, average response time, most substituted faculty,
departments with highest absence rates, and on-time substitution success rate.""",

        "Build Coverage Pool": """Build a ranked coverage pool for the Mathematics department.
List 8 faculty with their subject competency map, current teaching hours, and substitution readiness score.""",
    }


class CurriculumAuditorAgent(AgentBase):
    agent_id = "academics-curriculum"
    agent_name = "Curriculum Auditor"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Curriculum Auditor Agent for Atlas University.
You analyse syllabi against industry requirements, AICTE guidelines, NEP 2020 compliance,
and exam question patterns. You flag curriculum gaps, suggest topic additions, 
and recommend pedagogy improvements per programme."""

    ACTION_PROMPTS = {
        "Audit Syllabus": """Audit the B.Tech CSE 5th Semester syllabus against:
(1) NASSCOM FutureSkills requirements, (2) GATE 2025 exam pattern, (3) NEP 2020 credit framework.
Return: compliance score, critical gaps, recommended additions, and topics to retire.""",

        "NEP Compliance": """Check the PG MBA programme for NEP 2020 compliance.
Include: internship credit mapping, multidisciplinary elective availability,
academic bank of credits readiness, and outcome-based education documentation status.""",

        "Industry Alignment": """Compare the current Data Science elective track against
current industry roles (Data Engineer, ML Engineer, Data Analyst) on LinkedIn India.
Return: skills gap analysis, topics to add, labs to introduce, and certification alignment.""",

        "Generate Audit Report": """Generate the Annual Curriculum Audit Report for all B.Tech programmes.
Include: programme-wise compliance score, top 5 gaps per programme, and an action plan for the next semester.""",
    }


class CalendarGeneratorAgent(AgentBase):
    agent_id = "academics-calendar"
    agent_name = "Calendar Generator"
    domain = "Academics"

    SYSTEM_PROMPT = """You are the Academic Calendar Generator Agent for Atlas University.
You generate the complete institutional academic calendar for each academic year.
You factor in: UGC/AICTE minimum working day norms, university examination schedules,
public holidays, cultural events, and internship windows."""

    ACTION_PROMPTS = {
        "Generate Calendar": """Generate the Academic Calendar for the year 2026–2027 for Atlas University.
Include: Odd semester (July–Nov), Even semester (Jan–May), exam blocks, 
recess periods, internship windows, convocation, and Annual Day.
Format as a month-wise structured calendar.""",

        "Add Event": """Add the following approved events to the current academic calendar:
(1) National Science Day — 28 Feb (Half day), (2) Industry Conclave — 15 March (Full day),
(3) Hackathon — 22–23 March.
Return the updated calendar segment with conflict check.""",

        "Holiday Mapping": """Map all gazetted public holidays for 2026–27 against the current calendar.
Identify: teaching days lost, compensatory working Saturday recommendations, and updated total working days per semester.""",

        "Export Calendar": """Generate a formatted exportable academic calendar document for 2026–27.
Structure: month-by-month table with date, day, event/activity, and type (teaching/exam/holiday/recess).""",
    }


# ── PLACEMENT DOMAIN ──────────────────────────────────────────────────────────

class PlacementIntelligenceAgent(AgentBase):
    agent_id = "placement-intelligence"
    agent_name = "Placement Intelligence"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Placement Intelligence Agent for Atlas University.
You analyse placement trends, predict student-company match probabilities, identify
high-demand skill clusters, and optimise the company outreach calendar.
You generate actionable reports for the Training & Placement cell."""

    ACTION_PROMPTS = {
        "Run Predictor": """Run the placement prediction engine for the current final-year batch (BTech CSE, 2026).
For each student segment: predict placement probability, most suitable company tier,
expected CTC range, and recommended skill gap to bridge.
Summarise cohort-level predictions.""",

        "Match Companies": """Match the current eligible student pool to the 15 companies visiting next month.
For each company: return top 5 student profiles matched, match score, and recommended preparation track.""",

        "Outreach Calendar": """Generate a 3-month company outreach calendar for Q1 2026.
Include: 20 target companies, contact strategy, JD collection deadline, pre-placement talk schedule,
and drives calendar. Prioritise by expected offer count and CTC.""",

        "Generate Report": """Generate the Monthly Placement Bulletin for March 2026.
Include: offers made, companies visited, highest/average/lowest CTC, sector-wise distribution,
pending backlogs, and upcoming drives this month.""",
    }


class InterviewPrepAgent(AgentBase):
    agent_id = "placement-interview-prep"
    agent_name = "Interview Prep Agent"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Interview Prep Agent for Atlas University.
You generate company-specific interview preparation content: aptitude questions,
technical question banks, coding challenges, HR question sets, and mock interview schedules.
Content is personalised per student role target and company tier."""

    ACTION_PROMPTS = {
        "Generate Questions": """Generate a 30-question interview preparation set for a student targeting
a Data Analyst role at a Tier-1 company.
Include: 10 aptitude (quantitative), 10 SQL/Python technical, 5 case study, 5 HR behavioural.
Provide answers/hints for each.""",

        "Mock Interview": """Design a complete mock interview schedule for a student targeting SDE roles at FAANG.
Include: 2 coding rounds (DSA), 1 system design round, 1 behavioural round.
Provide sample questions, evaluation rubric, and 30-minute time allocations.""",

        "Prep Roadmap": """Create a 30-day interview preparation roadmap for a student targeting product management roles.
Include: daily topic plan, resource links (placeholder), weekly milestones, and mock test schedule.""",

        "Company Profile": """Generate a detailed company profile preparation sheet for Google India (2026).
Include: hiring process, typical DSA question patterns, recent interview reports summary,
company culture insights, and recommended prep timeline.""",
    }


class AlumniNetworkAgent(AgentBase):
    agent_id = "placement-alumni"
    agent_name = "Alumni Network Agent"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Alumni Network Agent for Atlas University.
You maintain and leverage the alumni database for placement referrals, mentoring connections,
guest lecture coordination, and industry partnership development.
You generate engagement campaigns and match current students to relevant alumni."""

    ACTION_PROMPTS = {
        "Find Mentors": """Find 10 suitable alumni mentors for final-year students targeting Software roles.
For each mentor: pseudonym, current company, designation, batch year, expertise,
and mentoring availability. Include a personalised outreach message template.""",

        "Send Campaign": """Draft an alumni engagement campaign email for the Annual Placement Drive 2026.
Request: referral leads, mock interview volunteers, and company introductions.
Segment into: alumni at product companies, at consulting firms, and self-employed.""",

        "Map Network": """Generate a network map summary showing alumni distribution across:
(1) Top 20 companies by headcount, (2) Geographies (cities), (3) Industry sectors.
Identify the 5 highest-leverage alumni nodes for placement outcomes.""",

        "Referral Pipeline": """Activate the referral pipeline for current openings.
Match 5 open positions at alumni companies to eligible graduating students.
Return: position, company, alumni contact, matched student profiles, and outreach draft.""",
    }


class ResumeIntelligenceAgent(AgentBase):
    agent_id = "placement-resume"
    agent_name = "Resume Intelligence"
    domain = "Placement"

    SYSTEM_PROMPT = """You are the Resume Intelligence Agent for Atlas University.
You analyse, score, and optimise student resumes for ATS compatibility and role-specific targeting.
You generate personalised improvement suggestions, rewrite weak sections,
and track student resume improvement over time."""

    ACTION_PROMPTS = {
        "Score Resumes": """Score 10 student resumes against a Software Engineer JD at a Tier-1 company.
For each: ATS score (0–100), keyword match %, key missing skills, formatting issues, and recommended fixes.""",

        "Optimise Resume": """Rewrite the work experience section of a sample student resume for a Data Engineer role.
Original (sample): 'Worked on data projects using Python.'
Rewrite to be: quantified, action-verb led, ATS-optimised, and role-specific.""",

        "Bulk Audit": """Run a bulk audit of resumes for the 2026 graduating CSE batch.
Return: distribution of ATS scores, most common weaknesses, students needing urgent help, and recommended workshops.""",

        "JD Matcher": """Given a sample JD for a Product Analyst role, identify: top 5 keywords,
required skills vs. nice-to-have, hidden criteria, and generate a matching checklist
students should verify before applying.""",
    }


# ── STUDENT LIFECYCLE DOMAIN ─────────────────────────────────────────────────

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


class InternshipAgent(AgentBase):
    agent_id = "students-internships"
    agent_name = "Internship Agent"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Internship Agent for Atlas University.
You source internships from industry partners, match students based on skill profiles,
manage MOUs, track student progress logs, and process final reports through a
plagiarism-checked pipeline. You coordinate between students, guides, and company mentors."""

    ACTION_PROMPTS = {
        "Match Now": """Run the internship matching algorithm for the current eligible pool (3rd year, all branches).
Return: top 10 student-internship matches with: student pseudonym, matched company, role,
match score, skill alignment percentage, and MOU status.""",

        "Add Partner": """Onboard a new industry partner: 'TechCorp Solutions Pvt Ltd'.
Generate: partnership agreement summary, MOU draft outline, available internship slots,
stipend structure, reporting requirements, and activation checklist.""",

        "Monthly Reports": """Generate the Monthly Internship Progress Report.
Include: active interns count, weekly log submission rate, mentor feedback scores,
students flagged for incomplete logs, and expected completion dates.""",

        "Template Library": """Generate standard document templates for the internship programme:
(1) MOU template outline, (2) Weekly progress log format, (3) Final report structure,
(4) Completion certificate format, (5) Viva evaluation rubric.""",
    }


class GrievanceAgent(AgentBase):
    agent_id = "students-grievance"
    agent_name = "Grievance Agent"
    domain = "Students"

    SYSTEM_PROMPT = """You are the Grievance Agent for Atlas University.
You manage student grievances through an anonymous reporting system.
You categorise complaints, route them to appropriate authorities,
track resolution timelines, and ensure confidentiality throughout the process."""

    ACTION_PROMPTS = {
        "Process Grievances": """Process the pending grievance queue.
Simulate 8 grievances of different types: academic, fee-related, ragging, infrastructure, faculty conduct.
For each: categorise, assign to responsible authority, set SLA, and draft initial acknowledgement.""",

        "Escalation Report": """Generate the Grievance Escalation Report for this month.
List: cases exceeding SLA by department, grievances escalated to IQAC level, average resolution time,
and repeat grievances indicating systemic issues.""",

        "Anonymise Report": """Generate an anonymised grievance summary for the IQAC monthly review.
Include: total complaints by category, resolution rate, pending cases, 
sentiments flagged as urgent, and recommended policy interventions.""",

        "SLA Dashboard": """Generate the Grievance SLA Compliance Dashboard.
Show: % resolved within 3 days, 7 days, 15 days, and overdue.
Break down by: grievance type, responsible department, and severity level.""",
    }


# ── FINANCE DOMAIN ────────────────────────────────────────────────────────────

class FeeCollectionAgent(AgentBase):
    agent_id = "finance-fees"
    agent_name = "Fee Collection Agent"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Fee Collection Agent for Atlas University.
You monitor fee collection status, generate demand notices, track defaulters,
automate instalment reminders, and produce financial recovery reports for the finance office."""

    ACTION_PROMPTS = {
        "Collect Dues": """Generate the fee collection status report for the current semester.
Simulate 1,200 students. Return: fully paid, partially paid, defaulters, scholarship-adjusted.
Top 20 defaulters (pseudonyms): amount due, days overdue, and recommended action (reminder/hold/legal).""",

        "Send Reminders": """Draft automated fee reminder messages for 3 segments:
(1) Students with dues < 7 days overdue (friendly reminder),
(2) Students 15–30 days overdue (formal notice), (3) Students 30+ days overdue (escalation notice).
Include: amount, payment link placeholder, and consequence clause for segment 3.""",

        "Defaulter Report": """Generate the Semester Fee Defaulter Report for Finance Committee.
Include: total outstanding amount (₹), programme-wise breakdown, scholarship deduction accounting,
hostel dues separately, and recommended write-off vs recovery list.""",

        "Recovery Plan": """Generate a fee recovery action plan for chronic defaulters (90+ days).
Include: legal notice timeline, instalment restructuring options, guarantor engagement steps,
and migration hold triggers.""",
    }


class AccreditationAgent(AgentBase):
    agent_id = "finance-accreditation"
    agent_name = "Accreditation Agent"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Accreditation Agent for Atlas University.
You track compliance metrics for NAAC, NBA, and NIRF rankings 365 days a year.
You monitor criterion-wise scores, prepare SSR draft content, identify evidence gaps,
and generate mock peer team review documents."""

    ACTION_PROMPTS = {
        "NAAC Score": """Calculate the current NAAC compliance score estimate.
Simulate scores across all 7 criteria: Curricular Aspects, T&L, Research,
Infrastructure, Student Support, Governance, Institutional Values.
Return: criterion-wise score, composite estimate, gap areas, and priority actions.""",

        "Prepare SSR": """Generate an outline and key content blocks for the NAAC Self-Study Report (SSR).
Include: Criterion-1 key evidence points, best practice nominations, DVV clarification checklist,
and data tables needed for the submission portal.""",

        "NIRF Ranking": """Generate the NIRF data submission summary for the current year.
Include: Teaching-Learning-Resources score, Research-Innovation score, Graduation Outcomes,
Outreach-Inclusivity, and Perception. Benchmark against top 50 private institutions.""",

        "Gap Analysis": """Perform a NAAC accreditation gap analysis.
Return: current estimated band (A/A+/A++), specific metrics below benchmark,
institutional strengths to highlight, and a 6-month action roadmap to improve score.""",
    }


class BudgetMonitorAgent(AgentBase):
    agent_id = "finance-budget"
    agent_name = "Budget Monitor"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Budget Monitor Agent for Atlas University.
You track departmental and institutional budgets in real-time,
flag overspend risks, generate budget utilisation reports,
and recommend reallocation when departments are under or over budget."""

    ACTION_PROMPTS = {
        "Budget Status": """Generate the current budget utilisation report for all departments.
Simulate 12 departments with Q3 budgets. Return: department, allocated (₹), spent (₹),
utilisation %, variance, and flag (on-track / at-risk / overspent).""",

        "Reallocate": """Recommend a budget reallocation exercise based on current utilisation.
Identify 3 underspending departments (likely to lapse funds) and 2 overspend-risk departments.
Propose transfers with amounts, approval requirements, and impacted line items.""",

        "Forecast": """Generate a budget forecast for Q4 of the current financial year.
Based on Q1–Q3 spending patterns, predict: total year-end spend, likely underspend (lapse risk),
capital vs. operational split, and recommended Q4 spending priorities.""",

        "Audit Report": """Generate the Internal Budget Audit Report for the Finance Committee.
Include: compliance with procurement norms, flagged irregular expenses (>₹5L without tender),
department-wise compliance score, and recommendations for process strengthening.""",
    }


class ProcurementAgent(AgentBase):
    agent_id = "finance-procurement"
    agent_name = "Procurement Agent"
    domain = "Finance"

    SYSTEM_PROMPT = """You are the Procurement Agent for Atlas University.
You manage the institutional procurement lifecycle: vendor identification, comparative quotations,
tender management, purchase order generation, delivery tracking, and inventory reconciliation.
You ensure GFR/institutional procurement norms compliance in every transaction."""

    ACTION_PROMPTS = {
        "New Purchase": """Process a new procurement request: 50 high-performance workstations for the AI Lab.
Generate: technical specifications, vendor shortlist criteria, estimated cost (₹), 
approval workflow, and comparative quotation header template.""",

        "Vendor Audit": """Audit the current empanelled vendor list for IT equipment.
Simulate 12 vendors. Return: vendor name, empanelment date, performance score, 
last order value, delivery compliance %, and renewal/blacklist recommendation.""",

        "Procurement Report": """Generate the Monthly Procurement Report for March 2026.
Include: total POs raised, aggregate value (₹), pending deliveries, delayed orders,
vendor-wise summary, and open PR to PO conversion rate.""",

        "Tender Analysis": """Analyse 4 tender responses received for the Library Management System upgrade.
Return: comparative scoring on: price (₹), technical compliance, vendor credentials,
support SLA, and recommended award decision with justification.""",
    }


# Registry of all agents
ALL_AGENTS: list[AgentBase] = [
    # Admissions
    AdmissionsIntelligenceAgent(),
    LeadNurtureAgent(),
    ScholarshipMatcherAgent(),
    DocumentVerifierAgent(),
    # HR
    HROperationsBotAgent(),
    FacultyLoadBalancerAgent(),
    AppraisalAgent(),
    RecruitmentPipelineAgent(),
    # Academics
    TimetableAIAgent(),
    SubstitutionAgent(),
    CurriculumAuditorAgent(),
    CalendarGeneratorAgent(),
    # Placement
    PlacementIntelligenceAgent(),
    InterviewPrepAgent(),
    AlumniNetworkAgent(),
    ResumeIntelligenceAgent(),
    # Students
    ProjectTrackerAgent(),
    DropoutPredictorAgent(),
    InternshipAgent(),
    GrievanceAgent(),
    # Finance
    FeeCollectionAgent(),
    AccreditationAgent(),
    BudgetMonitorAgent(),
    ProcurementAgent(),
]
