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
    """Seed initial data for all schools if DB is empty."""
    async with async_session_maker() as db:
        # Check if leads exist
        result = await db.execute(select(Lead).limit(1))
        if result.scalar_one_or_none():
            return
            
        print("Seeding initial leads for schools...")
        seeds = [
            {"school_id": "isme", "name": "Aditya Sharma", "email": "aditya@example.com", "phone": "9876543210", "programme": "MBA Finance", "source": "web_form", "score": 85},
            {"school_id": "isme", "name": "Priya Patel", "email": "priya@example.com", "phone": "9876543211", "programme": "BBA Digital", "source": "referral", "score": 62},
            {"school_id": "isdi", "name": "Rohan Das", "email": "rohan@example.com", "phone": "9876543212", "programme": "Communication Design", "source": "social", "score": 78},
            {"school_id": "isdi", "name": "Ananya Roy", "email": "ananya@example.com", "phone": "9876543213", "programme": "Fashion Design", "source": "walk_in", "score": 42},
            {"school_id": "ugdx", "name": "Vikram Singh", "email": "vikram@example.com", "phone": "9876543214", "programme": "B.Tech CSE", "source": "web_form", "score": 92},
            {"school_id": "ugdx", "name": "Sanya Malhotra", "email": "sanya@example.com", "phone": "9876543215", "programme": "UX Design", "source": "agent", "score": 55},
            {"school_id": "atlas", "name": "Global Applicant", "email": "global@example.com", "phone": "9876543216", "programme": "Interdisciplinary", "source": "web_form", "score": 88},
        ]
        
        from app.models.admissions import LeadSource
        for s in seeds:
            lead = Lead(
                name=s["name"], 
                email=s["email"], 
                phone=s["phone"],
                programme_interest=s["programme"],
                school_id=s["school_id"],
                score=float(s["score"]),
                source=LeadSource.REFERRAL if s["source"]=="referral" else LeadSource.WEB_FORM
            )
            db.add(lead)
        
        await db.commit()
        print("Seeding complete.")

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
