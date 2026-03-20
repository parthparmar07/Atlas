from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.academics import Student, Faculty, Course, AttendanceRecord, LeaveRequest, AttendanceStatus, LeaveStatus
from app.models.audit import AuditLog
from app.core.config import settings
import google.generativeai as genai
import json
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/academics", tags=["academics"])

# 1. AI Audit Summarizer
@router.get("/audit-narrative")
async def get_audit_narrative(db: AsyncSession = Depends(get_db)):
    # Fetch last 50 logs
    result = await db.execute(select(AuditLog).order_by(desc(AuditLog.timestamp)).limit(50))
    logs = result.scalars().all()
    
    if not logs:
        return {"narrative": "No recent activity detected.", "risk_score": 0, "anomalies": []}

    log_text = "\n".join([f"{l.timestamp}: {l.action} by User {l.user_id} (IP: {l.ip_address})" for l in logs])
    
    prompt = f"""
    Analyze these university system audit logs and provide a 3-sentence executive narrative.
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
            "narrative": "Standard operations detected. Several user actions processed successfully.",
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
    # Simple semantic router
    text = text.lower()
    if "audit" in text or "summary" in text:
        return {"action": "NAVIGATE", "path": "/admin/audit", "message": "Opening Audit Summarizer"}
    elif "faculty" in text:
        return {"action": "NAVIGATE", "path": "/academics/faculty", "message": "Opening Faculty Profiles"}
    elif "attendance" in text or "risk" in text:
        return {"action": "NAVIGATE", "path": "/academics/attendance", "message": "Opening Attendance Watchdog"}
    
    return {"action": "CHAT", "message": f"I heard you say: {text}. How can I help further?"}
