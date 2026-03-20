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
        "school_id": lead.school_id,
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
        school_id=body.get("school_id", "atlas"),
        source=source,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    await broadcast.broadcast({"type": "new_lead", "lead_id": lead.id, "name": lead.name, "programme": lead.programme_interest, "school": lead.school_id})
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
async def list_leads(stage: str | None = None, tier: str | None = None, school: str = "atlas",
                     db: AsyncSession = Depends(get_db)):
    """List leads — filtered by school to ensure institutional isolation."""
    q = select(Lead).order_by(desc(Lead.score))
    
    # Strictly filter by school unless Global (atlas) is requested
    if school != "atlas":
        q = q.where(Lead.school_id == school)
        
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

    interaction = LeadInteraction(
        lead_id=lead_id,
        counsellor_id=body.get("counsellor_id"),
        interaction_type=f"message_{body.get('channel', 'whatsapp')}",
        notes=msg,
        next_action=body.get("next_action"),
    )
    db.add(interaction)
    await db.commit()

    return {"message": msg}


@router.patch("/leads/{lead_id}")
async def update_lead(lead_id: int, body: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if "name" in body and body["name"] is not None:
        lead.name = body["name"]
    if "email" in body and body["email"] is not None:
        lead.email = body["email"]
    if "phone" in body and body["phone"] is not None:
        lead.phone = body["phone"]
    if "programme_interest" in body and body["programme_interest"] is not None:
        lead.programme_interest = body["programme_interest"]
    if "score" in body and body["score"] is not None:
        lead.score = float(body["score"])

    if "source" in body and body["source"] is not None:
        lead.source = _normalize_source(body["source"])

    if "stage" in body and body["stage"] is not None:
        stage_value = str(body["stage"]).strip().lower()
        stage_map = {s.value: s for s in LeadStage}
        if stage_value in stage_map:
            lead.stage = stage_map[stage_value]

    lead.last_activity_at = func.now()
    await db.commit()
    await db.refresh(lead)
    return _serialize_lead(lead)


@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    await db.delete(lead)
    await db.commit()
    return {"message": "Lead deleted successfully"}


@router.get("/leads/{lead_id}/interactions")
async def list_lead_interactions(lead_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LeadInteraction)
        .where(LeadInteraction.lead_id == lead_id)
        .order_by(desc(LeadInteraction.created_at))
    )
    items = result.scalars().all()
    return [
        {
            "id": item.id,
            "lead_id": item.lead_id,
            "counsellor_id": item.counsellor_id,
            "interaction_type": item.interaction_type,
            "notes": item.notes,
            "next_action": item.next_action,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in items
    ]


@router.post("/leads/{lead_id}/interactions")
async def create_lead_interaction(lead_id: int, body: dict, db: AsyncSession = Depends(get_db)):
    lead_result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = lead_result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    interaction = LeadInteraction(
        lead_id=lead_id,
        counsellor_id=body.get("counsellor_id"),
        interaction_type=body.get("interaction_type", "note"),
        notes=body.get("notes"),
        next_action=body.get("next_action"),
    )
    db.add(interaction)
    lead.last_activity_at = func.now()
    await db.commit()
    await db.refresh(interaction)

    return {
        "id": interaction.id,
        "lead_id": interaction.lead_id,
        "interaction_type": interaction.interaction_type,
        "notes": interaction.notes,
        "next_action": interaction.next_action,
        "created_at": interaction.created_at.isoformat() if interaction.created_at else None,
    }

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

