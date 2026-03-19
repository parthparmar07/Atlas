from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from pathlib import Path
import json
import os
import re
from html import escape

from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel


router = APIRouter(prefix="/ops", tags=["ops"])


class CommunicationRequest(BaseModel):
    channel: str
    recipient: str
    message: str


class ActionRunRequest(BaseModel):
    action: str
    context: str | None = None


def _slug(raw: str) -> str:
    value = re.sub(r"[^a-zA-Z0-9\-_]", "-", raw.strip().lower())
    value = re.sub(r"-+", "-", value).strip("-")
    if not value:
        raise HTTPException(status_code=400, detail="Invalid domain/module slug")
    return value


def _data_file(domain: str, module: str) -> Path:
    base = Path(__file__).resolve().parents[1] / "data" / "ops"
    return base / _slug(domain) / f"{_slug(module)}.json"


def _ops_data_root() -> Path:
    return Path(__file__).resolve().parents[1] / "data" / "ops"


def _read_payload(path: Path) -> dict:
    if not path.exists():
        return {"records": [], "actions": [], "communications": [], "created_at": datetime.now(timezone.utc).isoformat()}

    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(raw, dict):
            return {"records": [], "actions": [], "communications": [], "created_at": datetime.now(timezone.utc).isoformat()}
        return {
            "records": raw.get("records", []),
            "actions": raw.get("actions", []),
            "communications": raw.get("communications", []),
            "created_at": raw.get("created_at") or datetime.now(timezone.utc).isoformat(),
        }
    except Exception:
        return {"records": [], "actions": [], "communications": [], "created_at": datetime.now(timezone.utc).isoformat()}


def _write_payload(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def _next_record_id(records: list[dict]) -> int:
    if not records:
        return 1
    return max(int(r.get("id", 0) or 0) for r in records) + 1


async def _send_email_sendgrid(recipient: str, message: str) -> tuple[bool, str]:
    api_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("SENDGRID_FROM_EMAIL")
    if not api_key or not from_email:
        return False, "missing_sendgrid_config"

    payload = {
        "personalizations": [{"to": [{"email": recipient}]}],
        "from": {"email": from_email},
        "subject": "Atlas Notification",
        "content": [{"type": "text/plain", "value": message}],
    }
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=20.0) as client:
        res = await client.post("https://api.sendgrid.com/v3/mail/send", json=payload, headers=headers)
    if 200 <= res.status_code < 300:
        return True, "sendgrid_accepted"
    return False, f"sendgrid_http_{res.status_code}"


async def _send_twilio_message(channel: str, recipient: str, message: str) -> tuple[bool, str]:
    sid = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_FROM_NUMBER")
    whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")

    if not sid or not token:
        return False, "missing_twilio_auth"

    if channel == "sms":
        if not from_number:
            return False, "missing_twilio_from_number"
        data = {"To": recipient, "From": from_number, "Body": message}
    else:
        from_value = whatsapp_from or (f"whatsapp:{from_number}" if from_number else "")
        if not from_value:
            return False, "missing_twilio_whatsapp_from"
        to_value = recipient if recipient.startswith("whatsapp:") else f"whatsapp:{recipient}"
        data = {"To": to_value, "From": from_value, "Body": message}

    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
    async with httpx.AsyncClient(timeout=20.0, auth=(sid, token)) as client:
        res = await client.post(url, data=data)
    if 200 <= res.status_code < 300:
        return True, "twilio_message_accepted"
    return False, f"twilio_http_{res.status_code}"


async def _send_twilio_call(recipient: str, message: str) -> tuple[bool, str]:
    sid = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_CALL_FROM") or os.getenv("TWILIO_FROM_NUMBER")

    if not sid or not token:
        return False, "missing_twilio_auth"
    if not from_number:
        return False, "missing_twilio_call_from"

    twiml = f"<Response><Say>{escape(message)}</Say></Response>"
    data = {"To": recipient, "From": from_number, "Twiml": twiml}
    url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Calls.json"
    async with httpx.AsyncClient(timeout=20.0, auth=(sid, token)) as client:
        res = await client.post(url, data=data)
    if 200 <= res.status_code < 300:
        return True, "twilio_call_accepted"
    return False, f"twilio_http_{res.status_code}"


def _is_retryable(detail: str) -> bool:
    if detail.startswith("exception:"):
        return True
    if "_http_" in detail:
        try:
            code = int(detail.rsplit("_", 1)[-1])
            return code >= 500
        except Exception:
            return False
    return False


async def _single_delivery_attempt(channel: str, recipient: str, message: str) -> tuple[str, str, str]:
    if channel == "email":
        ok, detail = await _send_email_sendgrid(recipient, message)
        return ("delivered" if ok else ("queued" if "missing_" in detail else "failed"), "sendgrid", detail)

    if channel in {"sms", "whatsapp"}:
        ok, detail = await _send_twilio_message(channel, recipient, message)
        return ("delivered" if ok else ("queued" if "missing_" in detail else "failed"), "twilio", detail)

    if channel == "call":
        ok, detail = await _send_twilio_call(recipient, message)
        return ("delivered" if ok else ("queued" if "missing_" in detail else "failed"), "twilio", detail)

    return "failed", "none", "unsupported_channel"


async def _attempt_delivery(channel: str, recipient: str, message: str, max_attempts: int = 3) -> dict:
    attempts = 0
    receipts: list[dict] = []
    status = "failed"
    provider = "none"
    provider_detail = "not_attempted"

    while attempts < max_attempts:
        attempts += 1
        attempted_at = datetime.now(timezone.utc).isoformat()
        try:
            status, provider, provider_detail = await _single_delivery_attempt(channel, recipient, message)
        except Exception as exc:
            status, provider, provider_detail = "failed", "none", f"exception:{type(exc).__name__}"

        receipts.append(
            {
                "attempt": attempts,
                "attempted_at": attempted_at,
                "status": status,
                "provider": provider,
                "provider_detail": provider_detail,
            }
        )

        if status in {"delivered", "queued"}:
            break

        if not _is_retryable(provider_detail):
            break

        await asyncio.sleep(min(2 ** (attempts - 1), 4))

    return {
        "status": status,
        "provider": provider,
        "provider_detail": provider_detail,
        "attempts": attempts,
        "last_attempt_at": datetime.now(timezone.utc).isoformat(),
        "receipts": receipts,
    }


@router.get("/communications")
async def list_all_communications(status: str | None = None, limit: int = 300):
    root = _ops_data_root()
    if not root.exists():
        return {"items": [], "count": 0}

    items: list[dict] = []
    for domain_dir in root.iterdir():
        if not domain_dir.is_dir():
            continue
        domain = domain_dir.name
        for module_file in domain_dir.glob("*.json"):
            module = module_file.stem
            payload = _read_payload(module_file)
            for comm in payload.get("communications", []):
                row = {"domain": domain, "module": module, **comm}
                items.append(row)

    if status:
        status_value = status.strip().lower()
        items = [i for i in items if str(i.get("status", "")).lower() == status_value]

    items.sort(key=lambda x: x.get("created_at") or "", reverse=True)
    limited = items[: max(1, min(limit, 1000))]
    return {"items": limited, "count": len(limited)}


@router.get("/{domain}/{module}")
async def list_records(domain: str, module: str):
    path = _data_file(domain, module)
    payload = _read_payload(path)

    records = payload.get("records", [])
    records_sorted = sorted(
        records,
        key=lambda x: x.get("updated_at") or x.get("created_at") or "",
        reverse=True,
    )
    return {
        "records": records_sorted,
        "count": len(records_sorted),
    }


@router.post("/{domain}/{module}")
async def create_record(domain: str, module: str, body: dict):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    records = payload.get("records", [])

    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": _next_record_id(records),
        "title": body.get("title") or body.get("name") or "Untitled Record",
        "status": body.get("status") or "new",
        "owner": body.get("owner") or "system",
        "priority": body.get("priority") or "medium",
        "source": body.get("source") or "manual",
        "notes": body.get("notes") or "",
        "metadata": body.get("metadata") or {},
        "created_at": now,
        "updated_at": now,
    }

    records.append(record)
    payload["records"] = records
    _write_payload(path, payload)
    return record


@router.patch("/{domain}/{module}/{record_id}")
async def update_record(domain: str, module: str, record_id: int, body: dict):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    records = payload.get("records", [])

    found = None
    for record in records:
        if int(record.get("id", 0)) == record_id:
            found = record
            break

    if not found:
        raise HTTPException(status_code=404, detail="Record not found")

    for key in ["title", "status", "owner", "priority", "source", "notes", "metadata"]:
        if key in body:
            found[key] = body[key]
    found["updated_at"] = datetime.now(timezone.utc).isoformat()

    payload["records"] = records
    _write_payload(path, payload)
    return found


@router.delete("/{domain}/{module}/{record_id}")
async def delete_record(domain: str, module: str, record_id: int):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    records = payload.get("records", [])

    next_records = [r for r in records if int(r.get("id", 0)) != record_id]
    if len(next_records) == len(records):
        raise HTTPException(status_code=404, detail="Record not found")

    payload["records"] = next_records
    _write_payload(path, payload)
    return {"message": "Record deleted"}


@router.post("/{domain}/{module}/actions")
async def run_action(domain: str, module: str, body: ActionRunRequest):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    actions = payload.get("actions", [])

    action_event = {
        "id": len(actions) + 1,
        "action": body.action,
        "context": body.context or "",
        "status": "SUCCESS",
        "result": f"{body.action} executed successfully for {domain}/{module}",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    actions.append(action_event)
    payload["actions"] = actions
    _write_payload(path, payload)
    return action_event


@router.post("/{domain}/{module}/communications")
async def send_communication(domain: str, module: str, body: CommunicationRequest):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    items = payload.get("communications", [])

    channel = body.channel.lower().strip()
    if channel not in {"email", "whatsapp", "sms", "call"}:
        raise HTTPException(status_code=400, detail="Unsupported channel")

    delivery = await _attempt_delivery(channel, body.recipient, body.message)

    item = {
        "id": len(items) + 1,
        "channel": channel,
        "recipient": body.recipient,
        "message": body.message,
        "status": delivery["status"],
        "provider": delivery["provider"],
        "provider_detail": delivery["provider_detail"],
        "attempts": delivery["attempts"],
        "last_attempt_at": delivery["last_attempt_at"],
        "receipts": delivery["receipts"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    items.append(item)
    payload["communications"] = items
    _write_payload(path, payload)
    if delivery["status"] == "delivered":
        message = f"{channel.upper()} sent to {body.recipient}"
    elif delivery["status"] == "queued":
        message = f"{channel.upper()} queued for {body.recipient}"
    else:
        message = f"{channel.upper()} delivery failed for {body.recipient}"

    return {"message": message, "communication": item}


@router.post("/{domain}/{module}/communications/{communication_id}/retry")
async def retry_communication(domain: str, module: str, communication_id: int):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    items = payload.get("communications", [])

    target = None
    for comm in items:
        if int(comm.get("id", 0)) == communication_id:
            target = comm
            break

    if not target:
        raise HTTPException(status_code=404, detail="Communication not found")

    delivery = await _attempt_delivery(
        str(target.get("channel", "")),
        str(target.get("recipient", "")),
        str(target.get("message", "")),
    )

    target["status"] = delivery["status"]
    target["provider"] = delivery["provider"]
    target["provider_detail"] = delivery["provider_detail"]
    target["attempts"] = int(target.get("attempts", 0) or 0) + int(delivery["attempts"])
    target["last_attempt_at"] = delivery["last_attempt_at"]
    target["receipts"] = [*(target.get("receipts") or []), *delivery["receipts"]]

    payload["communications"] = items
    _write_payload(path, payload)
    return {"message": "Retry attempted", "communication": target}


@router.get("/{domain}/{module}/provenance")
async def provenance(domain: str, module: str):
    path = _data_file(domain, module)
    payload = _read_payload(path)
    records = payload.get("records", [])
    actions = payload.get("actions", [])
    comms = payload.get("communications", [])

    source_mix: dict[str, int] = {}
    for row in records:
        source = str(row.get("source") or "unknown")
        source_mix[source] = source_mix.get(source, 0) + 1

    latest = None
    timestamps = [r.get("updated_at") for r in records if r.get("updated_at")]
    timestamps += [a.get("created_at") for a in actions if a.get("created_at")]
    timestamps += [c.get("created_at") for c in comms if c.get("created_at")]
    if timestamps:
        latest = sorted(timestamps)[-1]

    return {
        "dataset": f"ops.{_slug(domain)}.{_slug(module)}",
        "storage": "JSON file store (backend/app/data/ops)",
        "total_records": len(records),
        "total_actions": len(actions),
        "total_communications": len(comms),
        "source_mix": source_mix,
        "latest_activity_at": latest,
        "note": "Use this for live demo and operational persistence before dedicated domain DB models are introduced.",
    }