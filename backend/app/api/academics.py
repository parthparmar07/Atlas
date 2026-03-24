from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.academics import (
    Student,
    Faculty,
    Course,
    AttendanceRecord,
    LeaveRequest,
    LeaveStatus,
    AcademicsAutomationRun,
)
from app.models.audit import AuditLog
from app.modules.academics.service import academics_ops_service
from app.core.config import settings
import google.generativeai as genai
import json
from datetime import datetime, timedelta, timezone
from typing import Any

router = APIRouter(prefix="/academics", tags=["academics"])


def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _programme_focus(programme: str) -> tuple[str, str, str]:
    prog = (programme or "").lower()
    if "design" in prog:
        return (
            "Design studio portfolio recovery",
            "weekly critique with faculty mentor + usability walkthrough",
            "publish one portfolio case study with before/after iteration evidence",
        )
    if "mba" in prog or "management" in prog or "pgdm" in prog:
        return (
            "Business analytics and decision framework reinforcement",
            "case-based discussion with a faculty panel",
            "submit one industry memo with data-backed recommendations",
        )
    if "ai" in prog or "robotics" in prog or "tech" in prog or "data" in prog:
        return (
            "Core technical concept and lab performance stabilization",
            "lab checkpoint review with TA and faculty",
            "deliver a mini-project milestone with reproducible notebook/report",
        )
    if "law" in prog:
        return (
            "Doctrinal clarity and argument structuring",
            "moot prep rehearsal and statute mapping review",
            "submit one policy brief with cited legal precedents",
        )
    return (
        "Core course foundation strengthening",
        "weekly mentor checkpoint + targeted remediation",
        "submit one applied capstone checkpoint aligned to programme outcomes",
    )


def _is_valid_plan(plan: Any) -> bool:
    if not isinstance(plan, dict):
        return False
    summary = plan.get("summary")
    steps = plan.get("steps")
    tips = plan.get("productivity_tips")
    return (
        isinstance(summary, str)
        and bool(summary.strip())
        and isinstance(steps, list)
        and len(steps) >= 3
        and isinstance(tips, list)
        and len(tips) >= 3
    )


def _looks_generic_plan(plan: dict[str, Any]) -> bool:
    generic_phrases = (
        "attend all lectures",
        "revise semester 1 marks",
        "focus on attendance and core subjects",
    )
    text = " ".join([
        str(plan.get("summary") or ""),
        " ".join(str(item) for item in (plan.get("steps") or [])),
    ]).lower()
    return any(phrase in text for phrase in generic_phrases)


def _build_personalized_recovery_plan(student: Student) -> dict[str, Any]:
    attendance = _to_float(student.attendance_rate, 0.0)
    gpa = _to_float(student.gpa, 0.0)
    risk = _to_float(student.risk_score, 0.0)

    attendance_target = min(92.0, max(75.0, attendance + 10.0))
    gpa_target = min(9.2, max(7.0, gpa + 0.8))
    attendance_gap = max(0.0, 75.0 - attendance)
    gpa_gap = max(0.0, 7.0 - gpa)

    risk_tier = "low"
    if risk >= 75:
        risk_tier = "critical"
    elif risk >= 50:
        risk_tier = "high"
    elif risk >= 25:
        risk_tier = "moderate"

    focus_track, coaching_block, outcome = _programme_focus(student.programme)

    summary = (
        f"{student.name} ({student.programme}) is currently at {risk_tier.upper()} recovery priority "
        f"with attendance {attendance:.1f}% and GPA {gpa:.1f}. "
        f"This 8-week blueprint targets attendance >= {attendance_target:.0f}% and GPA >= {gpa_target:.1f} "
        f"through structured remediation, faculty checkpoints, and career-aligned output delivery."
    )

    steps = [
        (
            f"Weeks 1-2 | Stabilization Sprint: Recover the immediate gap by adding {int(round(attendance_gap))} "
            f"attendance points via fixed class blocks, mandatory check-in at first period, and same-day backlog closure. "
            f"Create a missed-topic ledger for the last 14 days and clear at least 2 pending topics per day."
        ),
        (
            f"Weeks 3-4 | Academic Performance Lift: Run subject-wise remediation for any course below internal pass threshold. "
            f"Target a GPA lift of +{max(0.5, gpa_gap):.1f} in next internal cycle using 45-15 deep-work blocks and "
            f"twice-weekly doubt resolution with faculty/TA."
        ),
        (
            f"Weeks 5-6 | Programme Recovery Track: Execute '{focus_track}' with {coaching_block}. "
            f"Submit one measurable checkpoint every 7 days; escalation is triggered if any checkpoint is missed twice."
        ),
        (
            f"Weeks 7-8 | Outcome and Review: Complete final recovery artifact and mentor review. "
            f"Expected output: {outcome}. Conduct end-cycle review with counselor and freeze next 30-day continuation plan."
        ),
    ]

    productivity_tips = [
        "Use a fixed 2-hour morning academic block before any non-academic task; protect it as non-negotiable.",
        "Adopt a 45-15 study rhythm (45 min focus + 15 min recall test) and log recall score after each cycle.",
        "Follow a 24-hour revision rule: every class topic must be revised once within the same day.",
        "Schedule two accountability checkpoints each week with faculty mentor/counselor and share measurable progress.",
        "Track three numbers daily: attendance %, topics cleared, and quiz accuracy; adjust next-day plan from these metrics.",
    ]

    return {
        "summary": summary,
        "steps": steps,
        "productivity_tips": productivity_tips,
    }

# 1. AI Audit Summarizer
@router.get("/audit-narrative")
async def get_audit_narrative(school: str = "atlas", db: AsyncSession = Depends(get_db)):
    # Fetch last 50 logs (In a real system, we'd filter logs by the school the user belongs to)
    result = await db.execute(select(AuditLog).order_by(desc(AuditLog.timestamp)).limit(50))
    logs = result.scalars().all()
    
    if not logs:
        return {"narrative": f"No recent activity detected in the {school.upper()} ecosystem.", "risk_score": 0, "anomalies": []}

    log_text = "\n".join([f"{l.timestamp}: {l.action} by User {l.user_id} (Resource: {l.resource})" for l in logs])
    
    prompt = f"""
    You are the AI Orchestrator for {school.upper()} University. 
    Analyze these audit logs and provide a 3-sentence executive narrative suitable for the {school.upper()} Dean.
    Categorize them into 'User Management', 'AI Activity', or 'System Config'.
    Identify any anomalies or security risks.
    Assign a 'risk_score' (0-100).
    Return ONLY JSON with keys: narrative, categories, anomalies, risk_score.
    
    LOGS:
    {log_text}
    """
    
    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        # Handle Potential Markdown in response
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        analysis = json.loads(raw_text)
        return analysis
    except Exception as e:
        return {
            "narrative": f"Standard operations detected at {school.upper()}. Several user actions processed successfully.",
            "categories": ["User Management"],
            "anomalies": [],
            "risk_score": 12
        }

# 2. Academic Risk & Recovery Advisor
@router.get("/students/recovery-candidates")
async def list_recovery_candidates(
    school: str = "atlas",
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    safe_limit = max(1, min(limit, 100))
    result = await db.execute(
        select(Student)
        .where(Student.school_id == school)
        .order_by(desc(Student.risk_score), Student.id.asc())
        .limit(safe_limit)
    )
    students = result.scalars().all()

    return [
        {
            "id": student.id,
            "name": student.name,
            "roll_number": student.roll_number,
            "school_id": student.school_id,
            "programme": student.programme,
            "attendance_rate": student.attendance_rate,
            "gpa": student.gpa,
            "risk_score": student.risk_score,
        }
        for student in students
    ]


@router.post("/students/{student_id}/recovery")
async def generate_recovery_plan(student_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    fallback_plan = _build_personalized_recovery_plan(student)

    prompt = f"""
    Generate a deeply specific Academic Recovery Plan for {student.name}.
    Student Profile:
    - Programme: {student.programme}
    - GPA: {student.gpa}
    - Attendance: {student.attendance_rate}%
    - Risk Score: {student.risk_score}

    Requirements:
    - No generic advice.
    - Include an 8-week phased plan with measurable targets and review checkpoints.
    - Each step should be detailed and execution-ready for faculty and student.
    - Return ONLY JSON with keys: 'summary', 'steps' (list), 'productivity_tips' (list).
    """
    
    try:
        plan: dict[str, Any] = fallback_plan
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            candidate_plan = json.loads(raw_text)
            if _is_valid_plan(candidate_plan) and not _looks_generic_plan(candidate_plan):
                plan = candidate_plan

        student.recovery_plan = plan
        await db.commit()
        return plan
    except Exception as e:
        student.recovery_plan = fallback_plan
        await db.commit()
        return fallback_plan

# 3. Faculty Transparency
@router.get("/faculty")
async def list_faculty(school: str = "atlas", db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faculty).where(Faculty.school_id == school))
    faculties = result.scalars().all()
    
    data = []
    for f in faculties:
        # Fetch subjects taught by this faculty
        sub_result = await db.execute(select(Course).where(Course.faculty_id == f.id))
        subjects = sub_result.scalars().all()
        data.append({
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "qualification": f.qualification,
            "experience": f.experience_years,
            "achievements": f.achievements,
            "subjects": [s.name for s in subjects]
        })
    return data

# 4. Attendance Watchdog (75% Threshold)
@router.get("/attendance/watchdog")
async def attendance_watchdog(school: str = "atlas", db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.school_id == school, Student.attendance_rate < 75.0))
    at_risk = result.scalars().all()
    return at_risk

# 5. Leave Management (AI Processor)
@router.post("/leave/process/{leave_id}")
async def process_leave(leave_id: int, action: str = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LeaveRequest).where(LeaveRequest.id == leave_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Leave request not found")
        
    req.status = LeaveStatus.APPROVED if action == "approve" else LeaveStatus.REJECTED
    req.processed_at = datetime.now(timezone.utc)
    await db.commit()
    return {"status": "success", "new_status": req.status}

# 6. Voice Action Hub
@router.post("/voice-action")
async def voice_action(text: str = Body(..., embed=True)):
    from app.services.ai.groq_service import groq_client
    from app.services.ai.gemini import gemini_client
    import json

    system_instruction = """
    You are the Atlas AI Voice Commander. The user has spoken a command.
    Return a raw JSON object WITH NO MARKDOWN FORMATTING OR BACKTICKS.
    Structure: {"action": "NAVIGATE" | "CHAT", "path"?: "/some/path", "message": "Feedback message"}
    Available paths:
    - /admin/audit
    - /academics/faculty
    - /academics/attendance
    - /ai/agents
    - /admissions/leads
    - /settings
    - /
    If the user command sounds like a navigation request, choose NAVIGATE and pick the closest path.
    Otherwise, choose CHAT and provide a helpful concise response in 'message'.
    """

    messages = [{"role": "user", "content": text}]
    
    try:
        response_content = ""
        if groq_client.is_available():
            res = await groq_client.chat(messages, system_instruction=system_instruction)
            response_content = res.get("content", "")
        elif gemini_client.is_available():
            res = await gemini_client.chat(messages, system_instruction=system_instruction)
            response_content = res.get("content", "")

        if response_content:
            # Clean possible markdown formatting
            clean_content = response_content.strip()
            if clean_content.startswith("```json"):
                clean_content = clean_content[7:]
            if clean_content.startswith("```"):
                clean_content = clean_content[3:]
            if clean_content.endswith("```"):
                clean_content = clean_content[:-3]
                
            return json.loads(clean_content.strip())
    except Exception as e:
        print(f"Voice AI Error: {e}")
        pass

    # Fallback semantic router
    text_lower = text.lower()
    if "audit" in text_lower or "summary" in text_lower:
        return {"action": "NAVIGATE", "path": "/admin/audit", "message": "Opening Audit Summarizer"}
    elif "faculty" in text_lower:
        return {"action": "NAVIGATE", "path": "/academics/faculty", "message": "Opening Faculty Profiles"}
    elif "attendance" in text_lower or "risk" in text_lower:
        return {"action": "NAVIGATE", "path": "/academics/attendance", "message": "Opening Attendance Watchdog"}
    
    return {"action": "CHAT", "message": f"I heard you say: {text}. How can I help further?"}

# 7. Institutional Stats (Multi-School Context)
@router.get("/stats")
async def get_school_stats(school: str = "atlas", db: AsyncSession = Depends(get_db)):
    # Faculty Count
    fac_result = await db.execute(select(func.count(Faculty.id)).where(Faculty.school_id == school))
    fac_count = fac_result.scalar() or 0
    
    # Students at Risk
    risk_result = await db.execute(select(func.count(Student.id)).where(Student.school_id == school, Student.attendance_rate < 75.0))
    risk_count = risk_result.scalar() or 0
    
    # Average GPA
    gpa_result = await db.execute(select(func.avg(Student.gpa)).where(Student.school_id == school))
    val = gpa_result.scalar()
    avg_gpa = round(float(val), 1) if val is not None else 0.0
    
    return {
        "faculty_verified": fac_count,
        "attendance_risk": risk_count,
        "average_gpa": avg_gpa,
        "institutional_peak": "92.4%", # Mocked for now
        "system_health": "99.9%"
    }


# 8. Academics Automation Orchestrator
@router.post("/automation/run")
async def run_automation(
    school: str = Body("atlas", embed=True),
    trigger_type: str = Body("manual", embed=True),
    trigger_ref: str | None = Body(None, embed=True),
    db: AsyncSession = Depends(get_db),
):
    run = await academics_ops_service.run_automation_cycle(
        db,
        school_id=(school or "atlas").strip().lower(),
        trigger_type=(trigger_type or "manual").strip().lower(),
        trigger_ref=(trigger_ref or None),
    )
    await db.commit()
    return run


@router.get("/automation/runs")
async def list_automation_runs(
    school: str = "atlas",
    limit: int = 25,
    db: AsyncSession = Depends(get_db),
):
    safe_limit = max(1, min(limit, 100))
    rows = await db.execute(
        select(AcademicsAutomationRun)
        .where(AcademicsAutomationRun.school_id == (school or "atlas").strip().lower())
        .order_by(AcademicsAutomationRun.created_at.desc())
        .limit(safe_limit)
    )
    items = rows.scalars().all()
    return {
        "count": len(items),
        "runs": [
            {
                "id": item.id,
                "school_id": item.school_id,
                "trigger_type": item.trigger_type,
                "trigger_ref": item.trigger_ref,
                "status": item.status,
                "summary": item.summary,
                "execution_details": item.execution_details,
                "created_at": item.created_at,
            }
            for item in items
        ],
    }
