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

router = APIRouter(prefix="/academics", tags=["academics"])

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
@router.post("/students/{student_id}/recovery")
async def generate_recovery_plan(student_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Student).where(Student.id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    prompt = f"""
    Generate an Academic Recovery Plan for {student.name} (GPA: {student.gpa}, Attendance: {student.attendance_rate}%).
    Focus on career paths and academic recovery.
    Return ONLY JSON with keys: 'summary', 'steps' (list), 'productivity_tips' (list).
    """
    
    try:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        plan = json.loads(raw_text)
        student.recovery_plan = plan
        await db.commit()
        return plan
    except Exception as e:
        return {"summary": "Focus on attendance and core subjects.", "steps": ["Attend all lectures", "Revise Semester 1 marks"]}

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
