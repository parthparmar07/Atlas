import asyncio
from typing import Callable, Dict, List, Any
from pydantic import BaseModel, Field

class AgentEvent(BaseModel):
    event_type: str
    source_agent: str
    target_domain: str = "*"
    payload: Dict[str, Any] = Field(default_factory=dict)
    
class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        
    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(callback)
        
    async def publish(self, event: AgentEvent):
        # Notify specific event type subscribers
        handlers = self.subscribers.get(event.event_type, [])
        # Notify wildcard subscribers
        wildcard_handlers = self.subscribers.get("*", [])
        
        tasks = []
        for handler in handlers + wildcard_handlers:
            tasks.append(handler(event))
            
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

# Global Event Bus
agent_bus = EventBus()
