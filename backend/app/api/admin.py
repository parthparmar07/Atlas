from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime, timezone
import json
from pathlib import Path
from pydantic import BaseModel
from app.core.security import get_password_hash
from app.models.user import UserRole

from app.core.database import get_db
from app.models.user import User, UserStatus
from app.models.audit import AuditLog
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])


class PlatformCoreItem(BaseModel):
    title: str
    href: str
    icon: str = "layout-dashboard"
    color: str = "text-slate-300"


class PlatformCoreUpdateRequest(BaseModel):
    items: list[PlatformCoreItem]


class PlatformSettingsUpdateRequest(BaseModel):
    platformName: str
    adminEmail: str
    maxTokens: str
    model: str
    dbUrl: str
    redisUrl: str
    mfa: bool
    sso: bool
    audit: bool
    emailAlerts: bool
    smsAlerts: bool
    systemLogs: bool


DEFAULT_PLATFORM_CORE = [
    {"title": "Command Center", "href": "/", "icon": "layout-dashboard", "color": "text-indigo-400"},
    {"title": "Active Directory", "href": "/admin/users", "icon": "users", "color": "text-slate-300"},
    {"title": "Administrator", "href": "/settings", "icon": "settings", "color": "text-slate-300"},
    {"title": "Audit Logs", "href": "/admin/audit", "icon": "activity", "color": "text-slate-300"},
    {"title": "Security Core", "href": "/ai/policies", "icon": "shield", "color": "text-slate-300"},
]


def _platform_core_file() -> Path:
    # backend/app/api/admin.py -> backend/app/config/platform_core.json
    return Path(__file__).resolve().parents[1] / "config" / "platform_core.json"


def _load_platform_core() -> list[dict]:
    path = _platform_core_file()
    if not path.exists():
        return DEFAULT_PLATFORM_CORE
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict) and isinstance(data.get("items"), list):
            return data["items"]
        if isinstance(data, list):
            return data
    except Exception:
        return DEFAULT_PLATFORM_CORE
    return DEFAULT_PLATFORM_CORE


def _save_platform_core(items: list[dict]) -> None:
    path = _platform_core_file()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"items": items}, indent=2), encoding="utf-8")


def _platform_settings_file() -> Path:
    return Path(__file__).resolve().parents[1] / "config" / "platform_settings.json"


DEFAULT_PLATFORM_SETTINGS = {
    "platformName": "Atlas University Ecosystem",
    "adminEmail": "admin@atlas.edu",
    "maxTokens": "1000000",
    "model": "llama-3.3-70b-versatile",
    "dbUrl": "postgresql://user:pass@localhost:5432/atlas",
    "redisUrl": "redis://localhost:6379",
    "mfa": True,
    "sso": False,
    "audit": True,
    "emailAlerts": True,
    "smsAlerts": False,
    "systemLogs": True,
}


def _load_platform_settings() -> dict:
    path = _platform_settings_file()
    if not path.exists():
        return DEFAULT_PLATFORM_SETTINGS
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            return {**DEFAULT_PLATFORM_SETTINGS, **data}
    except Exception:
        return DEFAULT_PLATFORM_SETTINGS
    return DEFAULT_PLATFORM_SETTINGS


def _save_platform_settings(settings_data: dict) -> None:
    path = _platform_settings_file()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(settings_data, indent=2), encoding="utf-8")


@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
):
    """Get all users."""
    result = await db.execute(select(User).order_by(desc(User.created_at)))
    users = result.scalars().all()
    return users


@router.post("/users", response_model=UserResponse)
async def create_user(
    body: dict,
    db: AsyncSession = Depends(get_db),
):
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or "Atlas@12345"
    role_raw = (body.get("role") or "USER").strip().upper()

    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email is required")

    exists_result = await db.execute(select(User).where(User.email == email))
    existing_user = exists_result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists")

    try:
        role = UserRole(role_raw)
    except Exception:
        role = UserRole.USER

    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        role=role,
        status=UserStatus.APPROVED,
        is_active=True,
        approved_at=datetime.now(timezone.utc),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"message": f"User {user.email} deleted successfully"}


@router.get("/users/pending", response_model=list[UserResponse])
async def get_pending_users(
    db: AsyncSession = Depends(get_db),
):
    """Get all pending users awaiting approval."""
    result = await db.execute(
        select(User)
        .where(User.status == UserStatus.PENDING)
        .order_by(desc(User.created_at))
    )
    users = result.scalars().all()
    return users


@router.post("/users/{user_id}/approve")
async def approve_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Approve a pending user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.status != UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already {user.status.value.lower()}",
        )

    user.status = UserStatus.APPROVED
    user.is_active = True
    user.approved_at = datetime.now(timezone.utc)

    await db.commit()
    return {"message": f"User {user.email} approved successfully"}


@router.post("/users/{user_id}/reject")
async def reject_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Reject a pending user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.status != UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already {user.status.value.lower()}",
        )

    user.status = UserStatus.REJECTED
    user.is_active = False

    await db.commit()
    return {"message": f"User {user.email} rejected successfully"}


@router.get("/audit")
async def get_audit_logs(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    """Get audit logs."""
    logs = await db.execute(
        select(AuditLog, User.email.label("user_email"))
        .outerjoin(User, AuditLog.user_id == User.id)
        .order_by(desc(AuditLog.timestamp))
        .limit(limit)
        .offset(offset)
    )
    
    result = []
    for log, user_email in logs:
        result.append({
            "id": log.id,
            "user_email": user_email or "system",
            "action": log.action,
            "resource": log.details or "-",
            "details": log.details,
            "status": "SUCCESS" if "failed" not in log.action.lower() else "ERROR",
            "ip_address": log.ip_address or "-",
            "created_at": log.timestamp.isoformat() if log.timestamp else datetime.now().isoformat()
        })
    return result


@router.get("/audit/export")
async def export_audit_logs(
    db: AsyncSession = Depends(get_db),
):
    """Export all audit logs as JSON."""
    result = await db.execute(
        select(AuditLog).order_by(desc(AuditLog.timestamp))
    )
    logs = result.scalars().all()

    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "total_logs": len(logs),
        "logs": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "action": log.action,
                "ip_address": log.ip_address,
                "details": log.details,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ],
    }


@router.get("/navigation/platform-core")
async def get_platform_core_navigation():
    """Get editable platform core navigation items."""
    return {"items": _load_platform_core()}


@router.put("/navigation/platform-core")
async def update_platform_core_navigation(body: PlatformCoreUpdateRequest):
    """Update platform core navigation items."""
    _save_platform_core([item.model_dump() for item in body.items])
    return {"message": "Platform core navigation updated", "items": _load_platform_core()}


@router.get("/settings")
async def get_platform_settings():
    """Get editable platform settings."""
    return {"settings": _load_platform_settings()}


@router.put("/settings")
async def update_platform_settings(body: PlatformSettingsUpdateRequest):
    """Update platform settings."""
    data = body.model_dump()
    _save_platform_settings(data)
    return {"message": "Platform settings updated", "settings": _load_platform_settings()}
