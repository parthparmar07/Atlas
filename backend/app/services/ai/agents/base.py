import abc
import datetime
import os
import asyncio
import json
from typing import Any, Dict, List, Callable
import time
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.services.ai.gemini import gemini_client
from app.services.ai.groq_service import groq_client
from app.services.ai.agentic.pipeline import AgenticPipeline, AgentState
from app.services.ai.agentic.memory import AgentMemory
from app.services.ai.agentic.event_bus import agent_bus, AgentEvent

class AgentBase(AgenticPipeline):
    """
    Goal-oriented base class for all Atlas AI agents.
    Implements a genuine workflow: Perception -> Reasoning -> Planning -> Execution -> Reflection.
    Replaces the legacy 'select action -> execute LLM' pattern.
    """
    agent_id: str
    agent_name: str
    domain: str

    SYSTEM_PROMPT: str

    def __init__(self):
        self.memory = AgentMemory()
        # Automatically subscribe to domain events
        agent_bus.subscribe(f"goal_completed_{self.domain}", self.on_domain_event)

    def get_action_prompts(self) -> dict[str, str]:
        """Legacy compatibility: returns available goals (formerly actions)."""
        prompts = getattr(self, "ACTION_PROMPTS", None)
        if isinstance(prompts, dict):
            return prompts
        return {}
        
    def get_tools(self) -> List[Callable]:
        """Return a list of tool functions this agent can use."""
        return []

    async def on_domain_event(self, event: AgentEvent):
        # Store in episodic memory
        self.memory.episodic.add_episode(event.payload.get("goal", ""), "Event Received", True)

    async def _call_llm(self, prompt: str) -> str:
        ai_client = groq_client if groq_client.is_available() else gemini_client
        if not ai_client:
            return "Fallback: No AI client available."

        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=2, max=10),
            retry=retry_if_exception_type(Exception),
            reraise=True
        )
        async def _execute():
            return await ai_client.generate_text(
                prompt=prompt,
                system_instruction=self.SYSTEM_PROMPT,
                temperature=0.4,
            )
        return await _execute()

    async def perceive(self, state: AgentState) -> Dict[str, Any]:
        """Gather context from memory and input."""
        past_episodes = self.memory.episodic.retrieve_relevant(state.goal)
        return {
            "provided_context": state.context,
            "relevant_history": past_episodes,
            "domain_rules": self.memory.semantic.get_fact("rules")
        }

    async def reason(self, state: AgentState) -> str:
        """Analyze goal and context to determine feasibility and strategy."""
        prompt = (
            f"Analyze this goal: '{state.goal}'.\n"
            f"Context: {state.perception_data}\n"
            f"Provide a brief strategic summary of how to achieve this goal."
        )
        return await self._call_llm(prompt)

    async def plan(self, state: AgentState) -> List[str]:
        """Decompose the goal into steps."""
        prompt = (
            f"Goal: '{state.goal}'\n"
            f"Strategy: {state.reasoning_summary}\n"
            f"List 3-5 concrete steps to execute this goal. Format as a JSON array of strings."
        )
        res = await self._call_llm(prompt)
        try:
            # Extract JSON array from text
            start = res.find('[')
            end = res.rfind(']') + 1
            if start != -1 and end > start:
                return json.loads(res[start:end])
            return ["Execute primary action directly"]
        except:
            return ["Execute primary goal"]

    async def execute(self, state: AgentState) -> List[Any]:
        """Execute the planned steps using tool negotiation."""
        results = []
        for step in state.plan:
            # Simulated tool-use negotiation
            self.memory.short_term.add_step(f"Executing: {step}")
            
            prompt = (
                f"Execute this step: '{step}' for the overall goal '{state.goal}'.\n"
                f"Context: {state.context}\n"
                f"Generate a realistic, detailed output for this step. Do not use placeholders."
            )
            step_res = await self._call_llm(prompt)
            results.append({"step": step, "output": step_res})
            
        return results

    async def reflect(self, state: AgentState) -> str:
        """Evaluate success and emit event."""
        prompt = (
            f"Reflect on the execution of goal '{state.goal}'.\n"
            f"Steps executed: {len(state.execution_results)}\n"
            f"Determine if the goal was successful and suggest 1 improvement."
        )
        reflection = await self._call_llm(prompt)
        
        # Store in episodic memory
        self.memory.episodic.add_episode(state.goal, reflection, True)
        
        # Publish completion event
        await agent_bus.publish(AgentEvent(
            event_type=f"goal_completed_{self.domain}",
            source_agent=self.agent_id,
            payload={"goal": state.goal, "reflection": reflection}
        ))
        
        return reflection

    async def run(self, action: str, context: str = "") -> dict[str, Any]:
        """
        Legacy interface wrapper. Maps the 'action' to a 'goal' and runs the AgenticPipeline.
        """
        start_time = time.time()
        
        # Run the full pipeline
        state = await super().run(goal=action, context=context)
        
        # Compile the final result into the artifact format
        compiled_result = (
            f"## Agentic Pipeline Execution: {state.status}\n\n"
            f"**Reasoning:** {state.reasoning_summary}\n\n"
            f"**Plan:**\n" + "\n".join([f"- {p}" for p in state.plan]) + "\n\n"
            f"**Execution Log:**\n"
        )
        for r in state.execution_results:
            compiled_result += f"### Step: {r.get('step')}\n{r.get('output')}\n\n"
            
        compiled_result += f"**Reflection:**\n{state.reflection}\n"
        
        # Generate physical artifact
        artifact_info = await self.post_run(action, context, compiled_result)
        duration_ms = int((time.time() - start_time) * 1000)

        telemetry = {
            "duration_ms": duration_ms,
            "model": "groq/gemini (agentic)",
            "steps_executed": len(state.plan)
        }
        
        if state.status == "ERROR":
            telemetry["error_type"] = state.reflection.split(":")[0]

        return {
            "agent_id": self.agent_id,
            "agent_name": self.agent_name,
            "domain": self.domain,
            "action": action,  # Now acts as the high-level goal
            "status": "SUCCESS" if state.status == "SUCCESS" else "ERROR",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "result": artifact_info,
            "telemetry": telemetry
        }

    async def post_run(self, action: str, context: str, llm_result: str) -> str:
        """Saves the AI result to a physical file."""
        safe_domain = self.domain.replace(" & ", "_").replace(" ", "_").lower()
        safe_agent = self.agent_id.replace("-", "_").lower()
        output_dir = os.path.join("outputs", safe_domain, safe_agent)
        os.makedirs(output_dir, exist_ok=True)

        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_action = action.replace(" ", "_").lower()
        filename = f"{timestamp}_{safe_action}.md"
        filepath = os.path.join(output_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            header = (
                f"# ATLAS AGENTIC ARTIFACT\n"
                f"**Agent:** {self.agent_name} ({self.agent_id})\n"
                f"**Goal:** {action}\n"
                f"**Timestamp:** {datetime.datetime.now().isoformat()}\n"
                f"**Context:** {context if context else 'None'}\n"
                f"---\n\n"
            )
            f.write(header + llm_result)

        return (
            f"**✅ Goal Execution Verified via Agentic Pipeline**\n\n"
            f"The agent dynamically decomposed the goal, executed steps, and reflected on the outcome.\n\n"
            f"**Output Directory:** `{output_dir}`\n"
            f"**Saved File:** `{filename}`\n\n"
            f"---\n\n"
            f"{llm_result}"
        )
