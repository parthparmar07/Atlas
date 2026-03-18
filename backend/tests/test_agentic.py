import pytest
import asyncio
from app.services.ai.agentic.pipeline import AgentState
from app.services.ai.agentic.event_bus import agent_bus, AgentEvent
from app.modules.admissions_intel.agent import AdmissionsIntelligenceAgent

@pytest.mark.asyncio
async def test_agentic_pipeline_success():
    agent = AdmissionsIntelligenceAgent()
    
    # Simulate a goal
    state = await agent.run(action="Score recent applications", context="Test context")
    
    assert state["status"] == "SUCCESS"
    assert "telemetry" in state
    assert state["telemetry"]["steps_executed"] > 0
    assert "artifact" in state["result"].lower() or "verified" in state["result"].lower()

@pytest.mark.asyncio
async def test_event_bus_pub_sub():
    received_events = []
    
    async def handler(event: AgentEvent):
        received_events.append(event)
        
    agent_bus.subscribe("test_event", handler)
    
    await agent_bus.publish(AgentEvent(
        event_type="test_event",
        source_agent="test",
        payload={"msg": "hello"}
    ))
    
    assert len(received_events) == 1
    assert received_events[0].payload["msg"] == "hello"

@pytest.mark.asyncio
async def test_agent_memory_retention():
    agent = AdmissionsIntelligenceAgent()
    agent.memory.short_term.update("test_key", "test_value")
    
    assert agent.memory.short_term.get_context()["test_key"] == "test_value"
    
    agent.memory.episodic.add_episode("Test Goal", "Success", True)
    episodes = agent.memory.episodic.retrieve_relevant("Test Goal")
    assert len(episodes) > 0
    assert episodes[0]["outcome"] == "Success"

@pytest.mark.asyncio
async def test_agentic_pipeline_partial_failure():
    # Simulate an agent with a tool that fails to see if it catches it
    class FailingAgent(AdmissionsIntelligenceAgent):
        async def execute(self, state: AgentState) -> list:
            raise ValueError("Simulated partial failure during execution")
            
    agent = FailingAgent()
    state = await agent.run(action="Trigger failure", context="")
    
    assert state["status"] == "ERROR"
    assert "Failed during" in state["result"]
