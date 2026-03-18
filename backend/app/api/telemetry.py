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
async def get_dashboard_stats():
    """Get summarized dashboard statistics."""
    # In a real app, these would come from the DB
    return {
        "active_agents": 24,
        "automations_today": 142,
        "active_projects": 8,
        "system_health": 99.9,
        "throughput": 12.4,
        "events": [
            { "id": 1, "agent": "Admissions Intel", "task": "Scoring 42 apps", "status": "Running", "color": "emerald", "time": "Just now" },
            { "id": 2, "agent": "Faculty Balancer", "task": "Generating Report", "status": "Completed", "color": "blue", "time": "2m ago" },
            { "id": 3, "agent": "Lead Nurture", "task": "Drip Campaign #12", "status": "Active", "color": "amber", "time": "5m ago" },
            { "id": 4, "agent": "Placement Intel", "task": "Syncing Job Boards", "status": "Syncing", "color": "indigo", "time": "12m ago" },
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
