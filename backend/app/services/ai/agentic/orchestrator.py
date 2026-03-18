from typing import Any, Dict
from app.services.ai.agentic.event_bus import agent_bus, AgentEvent

class DomainOrchestrator:
    """Base class for domain orchestrators."""
    domain: str
    
    def __init__(self):
        agent_bus.subscribe(f"{self.domain}_request", self.handle_request)
        agent_bus.subscribe("*", self.monitor_global)
        
    async def handle_request(self, event: AgentEvent):
        pass
        
    async def monitor_global(self, event: AgentEvent):
        pass

class AdmissionsOrchestrator(DomainOrchestrator):
    domain = "admissions"
    
    async def handle_request(self, event: AgentEvent):
        print(f"[AdmissionsOrchestrator] Received request: {event.payload}")
        # Could route to specific sub-agents (intel, leads, scholarship, etc.)
        
    async def monitor_global(self, event: AgentEvent):
        # Listen for events from other domains (e.g. Finance completed fee processing)
        if event.event_type == "goal_completed_Finance" and "fee" in event.payload.get("goal", "").lower():
            # Trigger admission finalization
            await agent_bus.publish(AgentEvent(
                event_type="admissions_request",
                source_agent="orchestrator",
                payload={"goal": "Finalize admission for paid student"}
            ))

# Instantiate to register subscriptions
admissions_orchestrator = AdmissionsOrchestrator()
