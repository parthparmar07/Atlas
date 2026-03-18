from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from app.core.database import get_db, async_session_maker
from app.models.admissions import Lead, LeadDocument, LeadInteraction, LeadStage, LeadSource, Scholarship
from app.modules.admissions.service import admissions_service
from app.api.telemetry import broadcast
import os

router = APIRouter(prefix="/admissions", tags=["admissions"])


def _to_enum_value(value):
    return value.value if hasattr(value, "value") else str(value)


def _serialize_lead(lead: Lead) -> dict:
    return {
        "id": lead.id,
        "name": lead.name,
        "email": lead.email,
        "phone": lead.phone,
        "programme_interest": lead.programme_interest,
        "source": _to_enum_value(lead.source),
        "stage": _to_enum_value(lead.stage),
        "score": lead.score,
        "score_breakdown": lead.score_breakdown,
        "parsed_resume": lead.parsed_resume,
        "assigned_counsellor_id": lead.assigned_counsellor_id,
        "nurture_step": lead.nurture_step,
        "nurture_active": lead.nurture_active,
        "created_at": lead.created_at,
        "last_activity_at": lead.last_activity_at,
    }


def _normalize_source(raw_source: str | None) -> LeadSource:
    if not raw_source:
        return LeadSource.WEB_FORM

    value = str(raw_source).strip().lower().replace("-", "_").replace(" ", "_")
    aliases = {
        "facebook_ad": LeadSource.SOCIAL,
        "organic_search": LeadSource.WEB_FORM,
        "instagram": LeadSource.SOCIAL,
        "google": LeadSource.WEB_FORM,
        "agent_referral": LeadSource.AGENT,
    }
    if value in aliases:
        return aliases[value]

    for item in LeadSource:
        if value == item.value or value == item.name.lower():
            return item
    return LeadSource.WEB_FORM

@router.post("/leads")
async def create_lead(body: dict, db: AsyncSession = Depends(get_db)):
    """Intake from web form, WhatsApp webhook, or manual entry."""
    source = _normalize_source(body.get("source"))
    lead = Lead(
        name=body.get("name"), 
        email=body.get("email"),
        phone=body.get("phone"), 
        programme_interest=body.get("programme"),
        source=source,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    await broadcast.broadcast({"type": "new_lead", "lead_id": lead.id, "name": lead.name, "programme": lead.programme_interest})
    return {"id": lead.id, "status": "created"}

@router.post("/leads/{lead_id}/documents")
async def upload_document(lead_id: int, doc_type: str,
                           file: UploadFile = File(...),
                           background_tasks: BackgroundTasks = None,
                           db: AsyncSession = Depends(get_db)):
    """Upload resume, marksheet etc — triggers async AI parsing."""
    contents = await file.read()
    
    # Save file (use GCS in prod, local for dev)
    upload_dir = f"app/uploads/leads/{lead_id}"
    os.makedirs(upload_dir, exist_ok=True)
    path = f"{upload_dir}/{doc_type}_{file.filename}"
    with open(path, "wb") as f: 
        f.write(contents)

    doc = LeadDocument(lead_id=lead_id, doc_type=doc_type, file_path=path)
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Parse in background — don't block upload response
    if background_tasks:
        background_tasks.add_task(_parse_and_score, lead_id, doc.id, contents, file.content_type)
    return {"doc_id": doc.id, "status": "parsing"}

async def _parse_and_score(lead_id, doc_id, contents, mime_type):
    parsed = await admissions_service.parse_document(contents, mime_type)
    async with async_session_maker() as db:
        result = await db.execute(select(Lead).where(Lead.id == lead_id))
        lead = result.scalar_one_or_none()
        if not lead:
            return

        interactions = await db.execute(
            select(func.count()).where(LeadInteraction.lead_id == lead_id)
        )
        eng_events = interactions.scalar() or 0

        source_val = lead.source.value if hasattr(lead.source, "value") else str(lead.source)
        score, breakdown = admissions_service.calculate_score(
            parsed, lead.programme_interest, source_val, eng_events
        )
        lead.score = score
        lead.score_breakdown = breakdown

        current_parsed = lead.parsed_resume or {}
        current_parsed[str(doc_id)] = parsed
        lead.parsed_resume = current_parsed

        await db.commit()

    await broadcast.broadcast({
        "type": "lead_scored",
        "lead_id": lead_id,
        "score": score,
        "tier": admissions_service.get_tier(score),
    })

@router.get("/leads")
async def list_leads(stage: str = None, tier: str = None,
                     db: AsyncSession = Depends(get_db)):
    q = select(Lead).order_by(desc(Lead.score))
    if stage: 
        q = q.where(Lead.stage == stage)
    result = await db.execute(q)
    leads = result.scalars().all()
    if tier:
        leads = [l for l in leads if admissions_service.get_tier(l.score) == tier]
    return [_serialize_lead(l) for l in leads]

@router.get("/leads/{lead_id}/profile")
async def get_lead_profile(lead_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead: 
        raise HTTPException(404, "Lead not found")
        
    stage_val = _to_enum_value(lead.stage)
    summary = await admissions_service.ai_profile_summary(
        {"name": lead.name, "programme": lead.programme_interest,
         "score": lead.score, "stage": stage_val},
        lead.parsed_resume or {}
    )
    lead_dict = _serialize_lead(lead)
    return {**lead_dict, "ai_summary": summary}

@router.post("/leads/{lead_id}/message")
async def generate_message(lead_id: int, body: dict,
                            db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead: 
        raise HTTPException(404)
        
    msg = await admissions_service.generate_followup_message(
        lead.name, lead.programme_interest,
        body.get("channel", "whatsapp"), body.get("context", ""))
    return {"message": msg}

@router.get("/funnel")
async def funnel_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Lead.stage, func.count()).group_by(Lead.stage))
    # format enum keys to string
    return {getattr(row[0], "value", str(row[0])): row[1] for row in result.all()}


@router.get("/provenance")
async def data_provenance(db: AsyncSession = Depends(get_db)):
    """Explain where admissions data comes from for demo/audit purposes."""
    source_result = await db.execute(
        select(Lead.source, func.count()).group_by(Lead.source)
    )
    total_result = await db.execute(select(func.count()).select_from(Lead))
    latest_result = await db.execute(select(func.max(Lead.created_at)))
    latest_created_at = latest_result.scalar()

    source_counts = {
        getattr(row[0], "value", str(row[0])): row[1]
        for row in source_result.all()
    }

    return {
        "dataset": "admissions.leads",
        "storage": "PostgreSQL",
        "api": "/api/admissions/leads",
        "total_records": total_result.scalar() or 0,
        "source_mix": source_counts,
        "latest_record_at": latest_created_at.isoformat() if latest_created_at else None,
        "note": "Records are created via Admissions UI/API (and optional test seed script in non-production setups).",
    }

from app.modules.admissions.scholarship_service import scholarship_service
from app.modules.admissions.document_service import document_service

@router.post("/leads/{lead_id}/scholarships/match")
async def match_scholarships_for_lead(lead_id: int, db: AsyncSession = Depends(get_db)):
    matches = await scholarship_service.match_lead_to_scholarships(lead_id, db)
    return {"lead_id": lead_id, "matches": matches, "count": len(matches)}


@router.get("/scholarships")
async def list_scholarships(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scholarship).order_by(desc(Scholarship.amount_max)))
    scholarships = result.scalars().all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "provider": s.provider,
            "amount_max": s.amount_max,
            "criteria_json": s.criteria_json,
            "deadline": s.deadline.isoformat() if s.deadline else None,
        }
        for s in scholarships
    ]


@router.post("/scholarships")
async def create_scholarship(body: dict, db: AsyncSession = Depends(get_db)):
    name = (body.get("name") or "").strip()
    provider = (body.get("provider") or "").strip()
    if not name or not provider:
        raise HTTPException(status_code=400, detail="name and provider are required")

    scholarship = Scholarship(
        name=name,
        provider=provider,
        amount_max=float(body.get("amount_max") or 0),
        criteria_json=body.get("criteria_json") or {},
    )
    db.add(scholarship)
    await db.commit()
    await db.refresh(scholarship)
    return {
        "id": scholarship.id,
        "name": scholarship.name,
        "provider": scholarship.provider,
        "amount_max": scholarship.amount_max,
        "criteria_json": scholarship.criteria_json,
    }


@router.get("/leads/{lead_id}/documents")
async def list_lead_documents(lead_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LeadDocument)
        .where(LeadDocument.lead_id == lead_id)
        .order_by(desc(LeadDocument.uploaded_at))
    )
    docs = result.scalars().all()
    return [
        {
            "id": d.id,
            "lead_id": d.lead_id,
            "doc_type": d.doc_type,
            "file_path": d.file_path,
            "verified": d.verified,
            "ai_extracted": d.ai_extracted or {},
            "uploaded_at": d.uploaded_at.isoformat() if d.uploaded_at else None,
        }
        for d in docs
    ]

@router.post("/documents/{doc_id}/verify")
async def verify_document_endpoint(doc_id: int, db: AsyncSession = Depends(get_db)):
    from app.models.admissions import LeadDocument
    import os
    import mimetypes
    result = await db.execute(select(LeadDocument).where(LeadDocument.id == doc_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    try:
        with open(doc.file_path, "rb") as f:
            file_bytes = f.read()
            guessed_mime, _ = mimetypes.guess_type(doc.file_path)
            mime_type = guessed_mime or ("application/pdf" if doc.file_path.endswith(".pdf") else "application/octet-stream")
            res = await document_service.verify_document(doc_id, file_bytes, mime_type, db)
            if not res:
                raise HTTPException(status_code=500, detail="Document verification returned empty response")
            return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

