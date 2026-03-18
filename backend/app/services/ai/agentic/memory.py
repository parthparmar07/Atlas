from typing import List, Dict, Any

class ShortTermMemory:
    """Scratchpad for current execution context."""
    def __init__(self):
        self.context: Dict[str, Any] = {}
        self.trajectory: List[str] = []
        
    def update(self, key: str, value: Any):
        self.context[key] = value
        
    def add_step(self, step: str):
        self.trajectory.append(step)

    def get_context(self) -> Dict[str, Any]:
        return self.context

    def clear(self):
        self.context.clear()
        self.trajectory.clear()

class EpisodicMemory:
    """Logs of past executions and outcomes."""
    def __init__(self):
        self.episodes: List[Dict[str, Any]] = []
        
    def add_episode(self, goal: str, outcome: str, success: bool, kpis: Dict[str, Any] = None):
        self.episodes.append({
            "goal": goal,
            "outcome": outcome,
            "success": success,
            "kpis": kpis or {}
        })
        
    def retrieve_relevant(self, goal: str) -> List[Dict[str, Any]]:
        # Naive keyword matching for demonstration
        keywords = set(goal.lower().split())
        results = []
        for ep in self.episodes:
            ep_words = set(ep["goal"].lower().split())
            if keywords.intersection(ep_words):
                results.append(ep)
        return results

class SemanticMemory:
    """Long-term learned policies and facts."""
    def __init__(self):
        self.facts: Dict[str, str] = {}
        
    def store_fact(self, key: str, fact: str):
        self.facts[key] = fact
        
    def get_fact(self, key: str) -> str:
        return self.facts.get(key, "")

# We can have a global or per-agent memory store
class AgentMemory:
    def __init__(self):
        self.short_term = ShortTermMemory()
        self.episodic = EpisodicMemory()
        self.semantic = SemanticMemory()
