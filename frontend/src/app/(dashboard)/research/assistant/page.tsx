import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Research Assistant",
  agentId: "research-assistant",
  badge: "core",
  domain: "Research",
  domainHref: "/research",
  domainColor: "#0891b2",
  tagline: "From question framing to manuscript-ready structure in one research loop.",
  description:
    "Supports faculty and scholars with literature discovery, evidence synthesis, and draft structuring. It translates broad research goals into tractable knowledge workflows with transparent assumptions and next actions.",
  stats: [
    { label: "Literature Queries", value: "1.8K", change: "This semester" },
    { label: "Draft Outlines", value: "326", change: "Generated for teams", up: true },
    { label: "Topic Gaps Found", value: "142", change: "Actionable signals", up: true },
    { label: "Avg Turnaround", value: "3.2m", change: "Per request", up: true },
  ],
  pipeline: [
    { title: "Question Framing", desc: "Convert broad topic into searchable hypotheses and themes." },
    { title: "Source Discovery", desc: "Surface high-signal sources and rank by relevance." },
    { title: "Evidence Synthesis", desc: "Extract patterns, contradictions, and open gaps." },
    { title: "Analysis Support", desc: "Summarize dataset signals and interpretation options." },
    { title: "Manuscript Structuring", desc: "Assemble argument flow into publication-ready outline." },
  ],
  actions: [
    { label: "Find Literature", desc: "Discover ranked sources and thematic clusters" },
    { label: "Analyze Data", desc: "Summarize dataset-level insights and caveats" },
    { label: "Prepare Manuscript", desc: "Generate structured draft outline from findings" },
  ],
  activity: [
    { time: "4 min ago", event: "Literature map generated for quantum-safe cryptography", status: "success" },
    { time: "18 min ago", event: "Evidence conflict flagged across 3 key citations", status: "pending" },
    { time: "1 hr ago", event: "Draft outline generated for AI in precision agriculture", status: "success" },
    { time: "Yesterday", event: "Dataset trend summary delivered to Civil Engineering lab", status: "info" },
    { time: "2 days ago", event: "Methodology gap alert raised for survey sample bias", status: "error" },
  ],
  capabilities: [
    "Focused literature discovery",
    "Theme and gap extraction",
    "Dataset interpretation support",
    "Hypothesis refinement prompts",
    "Structured manuscript outline generation",
    "Transparent caveat reporting",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
