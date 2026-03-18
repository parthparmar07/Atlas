from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, users, agents, telemetry, admin, ai, admissions
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

@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.secret_key == "change-me-in-production":
        import logging
        logging.getLogger("uvicorn.error").warning(
            "SECRET_KEY is default; set a secure value in production (e.g. openssl rand -base64 32)"
        )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    scheduler.add_job(run_nurture_drip, "interval", hours=1)
    scheduler.start()
    
    yield
    
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

# Explicit origins when using credentials (browsers reject credentials + "*")
_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from app.middleware.audit import AuditLoggingMiddleware
app.add_middleware(AuditLoggingMiddleware)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(telemetry.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(agent_exec.router, prefix="/api")
app.include_router(admissions.router, prefix="/api")


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
