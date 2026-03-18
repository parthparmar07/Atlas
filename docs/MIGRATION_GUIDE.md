# Atlas Agentic Framework Migration Guide

This document outlines the architectural shift from the legacy "Form Selection -> Execute Code" pseudo-agents to the new **Goal-Oriented Agentic Pipeline**.

## The Problem with Legacy Agents
The original architecture relied on a monolithic `AgentBase` class. Agents were simply a collection of static string prompts (e.g., `ACTION_PROMPTS`). When a user selected an action in the UI, the backend merely injected context into the static prompt and forwarded it to an LLM. 
- **No real logic**: Agents lacked Python tools, APIs, or database connections.
- **No memory**: Agents forgot context immediately after execution.
- **No autonomy**: Agents could not break down goals or negotiate tool usage.

## The New Architecture: `AgenticPipeline`
We have completely refactored the framework located in `backend/app/services/ai/agentic/`.

1. **Pipeline Layer (`pipeline.py`)**
   Every agent now executes a multi-stage cognitive loop:
   `Perception -> Reasoning -> Planning -> Execution -> Reflection`
   This ensures agents assess their environment, formulate a dynamic plan, execute steps using tools, and evaluate their own success.

2. **Memory Abstractions (`memory.py`)**
   - **Short-Term Memory (Scratchpad)**: Tracks the current execution context and plan steps.
   - **Episodic Memory**: Logs past executions, outcomes, and KPIs so agents can learn from prior runs.
   - **Semantic Memory**: Stores long-term policies and domain facts.

3. **Event Bus (`event_bus.py`)**
   Agents no longer operate in silos. They communicate via an asynchronous publish-subscribe `agent_bus`. When an agent completes a goal, it emits a `goal_completed_<domain>` event. Domain orchestrators (`orchestrator.py`) listen to these events to trigger subsequent workflows automatically.

## How to Verify No Pseudo-Agents Remain

We have entirely overwritten the foundational `AgentBase` class in `app/services/ai/agents/base.py`. 

By changing `AgentBase` to inherit from `AgenticPipeline` and enforcing the `perceive`, `reason`, `plan`, `execute`, and `reflect` methods:
**It is now architecturally impossible for a legacy pseudo-agent to exist in this codebase.**

Every single one of the 24 agents in `app/modules/` automatically inherits this cognitive loop. Even if an agent has not yet been given custom Python tools (like the newly updated `AdmissionsIntelligenceAgent` and `AccreditationAgent`), it will fallback to the LLM within the strict bounds of the `AgenticPipeline` (planning steps, reasoning, and reflecting).

### Steps to migrate remaining custom tools:
1. Open the agent file (e.g., `app/modules/hr_bot/agent.py`).
2. Add unique async python tools:
   ```python
   async def tool_query_leave_balance(self, employee_id: str):
       # DB query here
       pass
   ```
3. Override the `execute` method to negotiate these tools:
   ```python
   async def execute(self, state: AgentState):
       # Iterate over state.plan and trigger tools based on intent
       pass
   ```

## Frontend Integration
The Next.js UI now dynamically reads the agent's workflow state. The favicon will automatically transition between default, a pulsing yellow indicator (in-progress), a green checkmark (success), or a red cross (error) based on the realtime execution status of the pipeline.
