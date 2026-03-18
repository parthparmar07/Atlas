import abc
import json
from typing import Any, Dict, List
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
        
    async def run(self, goal: str, context: str = "") -> AgentState:
        state = AgentState(goal=goal, context=context)
        
        try:
            state.status = "PERCEIVING"
            state.perception_data = await self.perceive(state)
            
            state.status = "REASONING"
            state.reasoning_summary = await self.reason(state)
            
            state.status = "PLANNING"
            state.plan = await self.plan(state)
            
            state.status = "EXECUTING"
            state.execution_results = await self.execute(state)
            
            state.status = "REFLECTING"
            state.reflection = await self.reflect(state)
            
            state.status = "SUCCESS"
        except Exception as e:
            state.status = "ERROR"
            state.reflection = f"Failed during {state.status}: {str(e)}"
            
        return state
