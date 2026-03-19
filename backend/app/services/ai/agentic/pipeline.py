import abc
import json
import asyncio
from typing import Any, Dict, List, Callable
from pydantic import BaseModel
import datetime

class AgentState(BaseModel):
    goal: str
    context: str
    perception_data: Dict[str, Any] = {}
    reasoning_summary: str = ""
    plan: List[str] = []
    execution_results: List[Any] = []
    reflection: str = ""
    status: str = "INITIALIZED"

class AgenticPipeline(abc.ABC):
    """
    Goal-oriented pipeline: Perception -> Reasoning -> Planning -> Execution -> Reflection.
    """
    
    @abc.abstractmethod
    async def perceive(self, state: AgentState) -> Dict[str, Any]:
        """Gather data from context, memory, and tools."""
        pass
        
    @abc.abstractmethod
    async def reason(self, state: AgentState) -> str:
        """Analyze the perceived data and the goal."""
        pass
        
    @abc.abstractmethod
    async def plan(self, state: AgentState) -> List[str]:
        """Decompose the goal into sub-goals/steps."""
        pass
        
    @abc.abstractmethod
    async def execute(self, state: AgentState) -> List[Any]:
        """Execute the planned steps using tool negotiation."""
        pass
        
    @abc.abstractmethod
    async def reflect(self, state: AgentState) -> str:
        """Evaluate success against KPIs and update policy."""
        pass
        
    async def run(self, goal: str, context: str = "", step_callback: Callable[[str, str], Any] = None) -> AgentState:
        state = AgentState(goal=goal, context=context)
        
        async def emit(status: str, detail: str = ""):
            if step_callback:
                if asyncio.iscoroutinefunction(step_callback):
                    await step_callback(status, detail)
                else:
                    step_callback(status, detail)

        try:
            state.status = "PERCEIVING"
            await emit("PERCEIVING", "Gathering data from context, memory, and tools...")
            state.perception_data = await self.perceive(state)
            
            state.status = "REASONING"
            await emit("REASONING", "Analyzing perceived data and determining strategy...")
            state.reasoning_summary = await self.reason(state)
            
            state.status = "PLANNING"
            await emit("PLANNING", "Decomposing the goal into actionable steps...")
            state.plan = await self.plan(state)
            
            state.status = "EXECUTING"
            for i, step in enumerate(state.plan):
                await emit("EXECUTING", f"Step {i+1}/{len(state.plan)}: {step}")
                # Actual execution is inside self.execute which calls steps.
            
            state.execution_results = await self.execute(state)
            
            state.status = "REFLECTING"
            await emit("REFLECTING", "Evaluating success and updating long-term memory...")
            state.reflection = await self.reflect(state)
            
            state.status = "SUCCESS"
            await emit("SUCCESS", "Goal achieved successfully.")
        except Exception as e:
            state.status = "ERROR"
            state.reflection = f"Failed during {state.status}: {str(e)}"
            await emit("ERROR", state.reflection)
            
        return state
