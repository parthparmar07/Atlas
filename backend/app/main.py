import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, users, agents, telemetry, admin, ai, admissions
from app.api import ops
from app.api import agent_exec
from app.models.admissions import Lead, LeadStage, NurtureTemplate
from app.core.database import async_session_maker
from sqlalchemy import select
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

async def send_whatsapp(phone, msg):
    # Mock WATI/Twilio integration
    print(f"Sending WhatsApp to {phone}: {msg}")

async def send_email(email, subject, msg):
    # Mock SendGrid integration
    print(f"Sending Email to {email}: {subject} - {msg}")

async def run_nurture_drip():
    """Runs every hour. Sends next drip step to eligible leads."""
    async with async_session_maker() as db:
        result = await db.execute(
            select(Lead).where(Lead.nurture_active == True,
                               Lead.stage.notin_([LeadStage.ENROLLED, LeadStage.DROPPED])))
        leads = result.scalars().all()
        templates_result = await db.execute(select(NurtureTemplate).order_by(NurtureTemplate.step))
        templates = templates_result.scalars().all()

        for lead in leads:
            next_templates = [t for t in templates
                              if t.step == lead.nurture_step
                              and lead.score >= t.min_score]
            for t in next_templates:
                msg = t.body_template.replace("{{name}}", lead.name)\
                                     .replace("{{programme}}", lead.programme_interest)
                if t.channel == "whatsapp":
                    await send_whatsapp(lead.phone, msg)
                elif t.channel == "email":
                    await send_email(lead.email, t.subject, msg)
            if next_templates:
                lead.nurture_step += 1
        await db.commit()

async def seed_data():
    """Seed initial data with school contexts, user baselines, and granular tracking."""
    from app.models.academics import Student, Faculty, Course, StudentLevel
    from app.models.audit import AuditLog
    from app.models.user import User, UserRole, UserStatus
    from app.core.database import async_session_maker
    
    try:
        async with async_session_maker() as db:
            from sqlalchemy import delete
            # Clear existing logic-heavy data to ensure robust multi-tenant refresh
            await db.execute(delete(AuditLog))
            await db.execute(delete(Course))
            await db.execute(delete(Student))
            await db.execute(delete(Faculty))
            await db.commit()
            print("Cleanup complete. Regenerating institutional fabric...")

            # 1. Seed Faculty
            f_result = await db.execute(select(Faculty).limit(1))
            if not f_result.scalar_one_or_none():
                faculty_seeds = [
                    {"name": "Dr. Aarav Mehta", "email": "aarav.m@atlas.edu.in", "qualification": "Ph.D. in Strategic Design, MIT", "exp": 15, "achievements": "Lead Researcher for Urban Mobility 2025.", "school": "atlas", "dept": "Strategic Design"},
                    {"name": "Prof. Ishani Gupta", "email": "ishani.g@isme.in", "qualification": "MBA, Harvard Business School", "exp": 12, "achievements": "Winner of National Teaching Excellence 2023.", "school": "isme", "dept": "Management"},
                    {"name": "Ar. Vikram Singh", "email": "vikram.s@isdi.edu.in", "qualification": "M.Arch, AA London", "exp": 20, "achievements": "Red Dot Design Award Winner.", "school": "isdi", "dept": "Architecture"},
                    {"name": "Kyra Chen", "email": "kyra.c@dot.tech", "qualification": "M.S. in AI, Stanford", "exp": 8, "achievements": "Creator of the 'Nexus' Neural Engine.", "school": "dot", "dept": "Advanced Tech"},
                    {"name": "Father Joseph", "email": "joseph@vgs.edu.in", "qualification": "M.Ed, Cambridge", "exp": 25, "achievements": "Educational Reformist with 30+ schools under management.", "school": "vgs", "dept": "Pedagogy"},
                    {"name": "Sophia Rodriguez", "email": "sophia.r@ischool.in", "qualification": "B.Ed, NYU", "exp": 6, "achievements": "Early Childhood Specialist.", "school": "isdi_ischool", "dept": "Foundations"}
                ]
                for f in faculty_seeds:
                    fac_obj = Faculty(name=f["name"], email=f["email"], qualification=f["qualification"], experience_years=f["exp"], achievements=f["achievements"], school_id=f["school"], department=f["dept"])
                    db.add(fac_obj)
                    await db.flush() # Get ID for course assignment
                    
                    # Add a default course
                    db.add(Course(name=f"Advanced {f['dept']}", code=f"{str(f['school']).upper()}-101", credit_hours=4, faculty_id=fac_obj.id))
                
                print("Faculty & Courses seeded.")

            # 2. Seed Students
            s_result = await db.execute(select(Student).limit(1))
            if not s_result.scalar_one_or_none():
                student_seeds = [
                    # ATLAS
                    {"name": "Rahul Verma", "email": "rahul.v@student.atlas.edu.in", "roll": "AT2024-001", "level": StudentLevel.UNDERGRADUATE, "school": "atlas", "attendance": 64.5, "gpa": 6.8, "risk": 45, "prog": "B.Des (UI/UX)"},
                    {"name": "Ananya Iyer", "email": "ananya.i@student.atlas.edu.in", "roll": "AT2024-002", "level": StudentLevel.UNDERGRADUATE, "school": "atlas", "attendance": 92.1, "gpa": 9.4, "risk": 5, "prog": "B.Des (Fashion)"},
                    # ISME
                    {"name": "Priya Sharma", "email": "priya.s@student.isme.in", "roll": "IS2024-042", "level": StudentLevel.UNDERGRADUATE, "school": "isme", "attendance": 68.2, "gpa": 5.2, "risk": 78, "prog": "MBA (Global)"},
                    {"name": "Karan Malhotra", "email": "karan.m@student.isme.in", "roll": "IS2024-043", "level": StudentLevel.POSTGRADUATE, "school": "isme", "attendance": 85.0, "gpa": 8.1, "risk": 12, "prog": "PGDM (Finance)"},
                    # ISDI
                    {"name": "Zoya Khan", "email": "zoya.k@student.isdi.in", "roll": "ID2024-101", "level": StudentLevel.UNDERGRADUATE, "school": "isdi", "attendance": 71.5, "gpa": 7.3, "risk": 30, "prog": "Communication Design"},
                    # DOT
                    {"name": "Leo Zhang", "email": "leo.z@student.dot.tech", "roll": "DT2024-999", "level": StudentLevel.EXECUTIVE, "school": "dot", "attendance": 45.0, "gpa": 8.5, "risk": 90, "prog": "AI & Robotics Boot Camp"},
                    # VGS
                    {"name": "Master Arjun", "email": "arjun@vgs.edu.in", "roll": "VGS-501", "level": StudentLevel.UNDERGRADUATE, "school": "vgs", "attendance": 99.0, "gpa": 9.8, "risk": 0, "prog": "Grade 10 - ICSE"},
                    # iSchool
                    {"name": "Baby Diya", "email": "diya@ischool.in", "roll": "IS-001", "level": StudentLevel.UNDERGRADUATE, "school": "isdi_ischool", "attendance": 100.0, "gpa": 10.0, "risk": 0, "prog": "Pre-K"}
                ]
                for s in student_seeds:
                    db.add(Student(name=s["name"], email=s["email"], roll_number=s["roll"], level=s["level"], school_id=s["school"], attendance_rate=s["attendance"], gpa=s["gpa"], risk_score=float(s["risk"]), programme=s["prog"]))
                print("Students seeded.")

            # 3. Seed Root Admin (needed for Audit Log foreign keys)
            u_result = await db.execute(select(User).limit(1))
            admin_id = None
            if not u_result.scalar_one_or_none():
                admin_user = User(
                    email="admin@atlas.edu.in",
                    hashed_password="hashed_placeholder_pwd",
                    role=UserRole.ADMIN,
                    status=UserStatus.APPROVED,
                    is_active=True
                )
                db.add(admin_user)
                await db.flush() # Get the ID
                admin_id = admin_user.id
                print(f"Root Admin seeded with ID: {admin_id}")
            else:
                admin_id = (await db.execute(select(User.id))).scalar()

            # 4. Seed Audit Logs
            a_result = await db.execute(select(AuditLog).limit(1))
            if not a_result.scalar_one_or_none():
                audit_seeds = [
                    {"user_id": admin_id, "action": "LOGIN_SUCCESS", "resource": "AuthService", "ip": "192.168.1.1", "status": "SUCCESS", "school": "atlas"},
                    {"user_id": admin_id, "action": "UPDATE_STUDENT_PROFILE", "resource": "StudentService", "ip": "192.168.1.1", "status": "SUCCESS", "school": "atlas"},
                    {"user_id": admin_id, "action": "SUBMIT_LEAVE_REQUEST", "resource": "AcademicService", "ip": "192.168.1.42", "status": "SUCCESS", "school": "isme"},
                    {"user_id": admin_id, "action": "UNAUTHORIZED_ACCESS_ATTEMPT", "resource": "AdminSettings", "ip": "10.0.0.5", "status": "FAILED", "school": "isme"},
                    {"user_id": admin_id, "action": "DEPLOY_AI_AGENT", "resource": "Orchestrator", "ip": "10.0.0.10", "status": "SUCCESS", "school": "dot"},
                    {"user_id": admin_id, "action": "ACCESS_FACULTY_PORTAL", "resource": "FacultyService", "ip": "192.168.1.100", "status": "SUCCESS", "school": "isdi"},
                    {"user_id": admin_id, "action": "SYNC_PEDAGOGY_MODEL", "resource": "VGS-Core", "ip": "172.16.0.5", "status": "SUCCESS", "school": "vgs"},
                    {"user_id": admin_id, "action": "INITIALIZE_FOUNDATION", "resource": "iSchool-Sync", "ip": "172.16.0.12", "status": "SUCCESS", "school": "isdi_ischool"},
                ]
                for a in audit_seeds:
                    db.add(AuditLog(user_id=a["user_id"], action=a["action"], resource=a["resource"], ip_address=a["ip"], status=a["status"], school_id=a["school"]))
                print("Audit logs seeded.")

            await db.commit()
            print("Initial Seeding complete.")
    except Exception as e:
        print(f"Seeding failed: {type(e).__name__} - {e}")
        import traceback
        traceback.print_exc()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.secret_key == "change-me-in-production":
        import logging
        logging.getLogger("uvicorn.error").warning(
            "SECRET_KEY is default; set a secure value in production (e.g. openssl rand -base64 32)"
        )
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed data
    await seed_data()
    
    # Start scheduler
    if not scheduler.running:
        scheduler.add_job(run_nurture_drip, 'interval', hours=1)
        scheduler.start()
    
    yield
    
    if scheduler.running:
        scheduler.shutdown()
    await engine.dispose()


app = FastAPI(
    title=settings.app_name,
    description="Control Plane for the Atlas AI Command Center. Handles auth, agent registry, and telemetry.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Nuclear CORS Policy (Allows all origins for development and institutional pivoting)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom Failsafe CORS Middleware
class FailsafeCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = Response()
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "*"
            return response
        
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

app.add_middleware(FailsafeCORSMiddleware)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(telemetry.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(agent_exec.router, prefix="/api")
from app.api import signals
app.include_router(signals.router, prefix="/api")
from app.api import academics
app.include_router(academics.router, prefix="/api")
app.include_router(admissions.router, prefix="/api")
app.include_router(ops.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Atlas AI Command Center API is running",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
