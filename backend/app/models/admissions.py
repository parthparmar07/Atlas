from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
import enum
from app.core.database import Base

class LeadSource(str, enum.Enum):
    WEB_FORM = "web_form"
    WHATSAPP = "whatsapp"
    WALK_IN = "walk_in"
    REFERRAL = "referral"
    SOCIAL = "social"
    AGENT = "agent"

class LeadStage(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    APPLIED = "applied"
    DOCS_PENDING = "docs_pending"
    DOCS_COMPLETE = "docs_complete"
    ENROLLED = "enrolled"
    REJECTED = "rejected"
    DROPPED = "dropped"

class Lead(Base):
    __tablename__ = "leads"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(20))
    programme_interest: Mapped[str] = mapped_column(String(100))
    school_id: Mapped[str] = mapped_column(String(20), index=True, default="atlas")
    source: Mapped[LeadSource] = mapped_column(Enum(LeadSource))
    stage: Mapped[LeadStage] = mapped_column(Enum(LeadStage), default=LeadStage.NEW)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    score_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)
    parsed_resume: Mapped[dict] = mapped_column(JSON, default=dict)
    assigned_counsellor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    nurture_step: Mapped[int] = mapped_column(Integer, default=0)
    nurture_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                    default=lambda: datetime.now(timezone.utc))
    last_activity_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                    default=lambda: datetime.now(timezone.utc))

class LeadDocument(Base):
    __tablename__ = "lead_documents"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    doc_type: Mapped[str] = mapped_column(String(50))
    file_path: Mapped[str] = mapped_column(String(500))
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    ai_extracted: Mapped[dict] = mapped_column(JSON, default=dict)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                    default=lambda: datetime.now(timezone.utc))

class LeadInteraction(Base):
    __tablename__ = "lead_interactions"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    counsellor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    interaction_type: Mapped[str] = mapped_column(String(50))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    next_action: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),
                    default=lambda: datetime.now(timezone.utc))

class NurtureTemplate(Base):
    __tablename__ = "nurture_templates"
    id: Mapped[int] = mapped_column(primary_key=True)
    step: Mapped[int] = mapped_column(Integer)
    channel: Mapped[str] = mapped_column(String(20))
    delay_days: Mapped[int] = mapped_column(Integer)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body_template: Mapped[str] = mapped_column(Text)
    min_score: Mapped[float] = mapped_column(Float, default=0.0)

class Scholarship(Base):
    __tablename__ = "scholarships"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    provider: Mapped[str] = mapped_column(String(255))
    amount_max: Mapped[float] = mapped_column(Float, default=0.0)
    criteria_json: Mapped[dict] = mapped_column(JSON, default=dict)
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True) 

class ScholarshipMatch(Base):
    __tablename__ = "scholarship_matches"
    id: Mapped[int] = mapped_column(primary_key=True)
    lead_id: Mapped[int] = mapped_column(ForeignKey("leads.id", ondelete="CASCADE"))
    scholarship_id: Mapped[int] = mapped_column(ForeignKey("scholarships.id", ondelete="CASCADE"))
    match_score: Mapped[float] = mapped_column(Float) 
    match_reasons: Mapped[dict] = mapped_column(JSON, default=dict)
    applied: Mapped[bool] = mapped_column(Boolean, default=False)

