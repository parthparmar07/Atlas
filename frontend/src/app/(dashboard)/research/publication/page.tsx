import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Publication Ops",
  agentId: "research-publication",
  badge: "api",
  domain: "Research",
  domainHref: "/research",
  domainColor: "#0891b2",
  tagline: "Move manuscripts from draft to submission with disciplined editorial workflows.",
  description:
    "Supports journal-fit screening, submission readiness audits, and reviewer-cycle management. It keeps publication pipelines transparent while preserving academic integrity and author intent.",
  stats: [
    { label: "Active Manuscripts", value: "119", change: "Across departments" },
    { label: "Ready-to-Submit", value: "46", change: "After readiness audit", up: true },
    { label: "Under Revision", value: "31", change: "Reviewer cycle in progress" },
    { label: "Avg Review Cycle", value: "34d", change: "Rolling quarter" },
  ],
  pipeline: [
    { title: "Journal Fit", desc: "Evaluate scope alignment, audience, and acceptance risk." },
    { title: "Readiness Audit", desc: "Validate structure, references, ethics, and formatting readiness." },
    { title: "Submission Tracking", desc: "Track stage progression and stalled manuscripts." },
    { title: "Reviewer Response", desc: "Map comments to action plan and manuscript deltas." },
    { title: "Decision Readout", desc: "Summarize outcomes and next submission strategy." },
  ],
  actions: [
    { label: "Screen Journal Fit", desc: "Rank journals by scope and submission risk" },
    { label: "Submission Readiness", desc: "Run pre-submission pass/fail checklist" },
    { label: "Track Submission", desc: "Monitor live submission pipeline status" },
    { label: "Draft Reviewer Response", desc: "Create structured comment-to-action response plan" },
  ],
  activity: [
    { time: "3 min ago", event: "Journal fit matrix generated for materials science paper", status: "success" },
    { time: "16 min ago", event: "Readiness audit flagged missing ethics disclosure section", status: "pending" },
    { time: "58 min ago", event: "Reviewer response draft prepared for major revision", status: "success" },
    { time: "Yesterday", event: "Submission pipeline updated: 4 moved to under review", status: "info" },
    { time: "2 days ago", event: "Duplicate-submission risk warning raised for manuscript 7A", status: "error" },
  ],
  capabilities: [
    "Journal-fit ranking",
    "Submission readiness auditing",
    "Reviewer cycle tracking",
    "Revision action mapping",
    "Ethics and disclosure flagging",
    "Department publication health reporting",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
