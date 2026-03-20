from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import datetime
import asyncio
import json

from app.api.telemetry import broadcast

router = APIRouter(prefix="/signals", tags=["signals"])

class Signal(BaseModel):
    id: str
    source_agent: str
    target_agent: Optional[str] = "*"  # * means broadcast
    action: str
    payload: Dict[str, Any]
    priority: int = 1 # 1: Low, 5: Critical
    timestamp: Optional[str] = None

class SignalBus:
    def __init__(self):
        self.history: List[Signal] = []
        self.max_history = 100

    async def emit(self, signal: Signal):
        signal.timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        self.history.append(signal)
        if len(self.history) > self.max_history:
            self.history.pop(0)
        
        # Broadcast via telemetry websocket
        if broadcast:
            await broadcast.broadcast({
                "type": "intelligence_signal",
                "signal": signal.dict()
            })

signal_bus = SignalBus()

@router.post("/emit")
async def emit_signal(signal: Signal):
    """Manual trigger for an inter-agent signal."""
    await signal_bus.emit(signal)
    return {"status": "emitted", "id": signal.id}

@router.get("/history")
async def get_signal_history():
    """Get the recent list of intelligence handoffs."""
    return signal_bus.history
