import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from app.core.database import async_session_maker
from app.models.agent import Agent

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


class TelemetryBroadcast:
    def __init__(self):
        self.connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, message: dict):
        for conn in self.connections:
            try:
                await conn.send_json(message)
            except Exception:
                pass


broadcast = TelemetryBroadcast()


@router.get("/stats")
async def get_dashboard_stats(school: str = "atlas"):
    """Get hyper-detailed institutional telemetry with massive data density."""
    try:
        from app.api import agent_exec as _exec_module
        automations = _exec_module._GLOBAL_STATE.get("automation_counter", 0)
    except Exception:
        automations = 0

    # Hyper-detailed school-specific data payload
    metrics = {
        "atlas": {
            "active_agents": 35, "inference_latency": "12ms (Groq LPU)", "tokens_processed": "1.2M / day",
            "school_specific": [
                { "label": "Global Enrollment", "val": "1,240", "sub": "+12% YoY", "status": "Stable" },
                { "label": "Cross-Domain Handoffs", "val": "4,821", "sub": "98% Success", "status": "Active" },
                { "label": "Financial Liquidity", "val": "$4.2M", "sub": "Operating", "status": "Nominal" },
                { "label": "Institutional Health", "val": "99.9%", "sub": "L4 Shield", "status": "Secure" }
            ]
        },
        "isme": {
            "active_agents": 12, "inference_latency": "8ms (ISME-Edge)", "tokens_processed": "450K / day",
            "school_specific": [
                { "label": "MBA Placement Velocity", "val": "92%", "sub": "Top 1% Rank", "status": "High" },
                { "label": "Fortune 500 Partners", "val": "142", "sub": "Active Hiring", "status": "Growing" },
                { "label": "Startup Incubator", "val": "18", "sub": "$1.2M Raised", "status": "Active" },
                { "label": "Bloomberg Sync", "val": "Live", "sub": "Real-time feed", "status": "Nominal" }
            ]
        },
        "isdi": {
            "active_agents": 8, "inference_latency": "24ms (Diffusion VAE)", "tokens_processed": "120K / day",
            "school_specific": [
                { "label": "Studio Utilization", "val": "78%", "sub": "14 Active Studios", "status": "Active" },
                { "label": "Portfolio Velocity", "val": "842/mo", "sub": "92% AI-Gen", "status": "Fluid" },
                { "label": "Material Lab Stock", "val": "94%", "sub": "Sustainable Core", "status": "Nominal" },
                { "label": "Design Awards '26", "val": "12", "sub": "Global Wins", "status": "Elite" }
            ]
        },
        "ugdx": {
            "active_agents": 15, "inference_latency": "5ms (H100 Cluster)", "tokens_processed": "2.8M / day",
            "school_specific": [
                { "label": "GPU Nodes Active", "val": "82", "sub": "H100 Array", "status": "Peak" },
                { "label": "Fine-tuning Batches", "val": "1.4K", "sub": "Atlas-Core-V2", "status": "Running" },
                { "label": "Reseach Papers '26", "val": "42", "sub": "NeurIPS Track", "status": "High" },
                { "label": "Code Autocomplete Sync", "val": "99.8%", "sub": "Internal LLM", "status": "Nominal" }
            ]
        },
        "law": {
            "active_agents": 6, "inference_latency": "45ms (Fact-Check RAG)", "tokens_processed": "80K / day",
            "school_specific": [
                { "label": "Case Study Index", "val": "1.2M", "sub": "L5 Scanned", "status": "Robust" },
                { "label": "Moot Court Accuracy", "val": "98.4%", "sub": "Internal Bench", "status": "Elite" },
                { "label": "Policy Drafts Sync", "val": "12", "sub": "GOV-AI Track", "status": "Active" },
                { "label": "Precedent RAG Load", "val": "14ms", "sub": "Elastic Search", "status": "Nominal" }
            ]
        }
    }

    selected = metrics.get(school, metrics["atlas"])

    return {
        "active_agents": selected["active_agents"],
        "automations_today": automations,
        "system_health": 99.9,
        "inference_latency": selected["inference_latency"],
        "tokens_processed": selected["tokens_processed"],
        "school_specific_data": selected["school_specific"],
        "events": [
            { "id": 1, "agent": f"{school.upper()} Intel", "task": "Lead Scoring", "status": "Running", "color": "emerald", "time": "Just now" },
            { "id": 2, "agent": "Faculty Balancer", "task": "Schedule Sync", "status": "Completed", "color": "blue", "time": "2m ago" },
        ]
    }



@router.websocket("/live")
async def telemetry_live(websocket: WebSocket):
    await broadcast.connect(websocket)
    try:
        async with async_session_maker() as db:
            result = await db.execute(select(Agent).order_by(Agent.id))
            agents = result.scalars().all()
            await websocket.send_json({
                "type": "snapshot",
                "agents": [
                    {
                        "id": a.id,
                        "name": a.name,
                        "module_type": a.module_type,
                        "status": a.status.value,
                        "last_heartbeat": a.last_heartbeat.isoformat() if a.last_heartbeat else None,
                    }
                    for a in agents
                ],
            })
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        broadcast.disconnect(websocket)
