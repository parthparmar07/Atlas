import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Events Coordinator",
  agentId: "students-events",
  badge: "api",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#f59e0b",
  tagline: "Campus events run with operational rigor, not last-minute chaos.",
  description:
    "Coordinates full event operations from runbook planning to logistics risk checks and post-event KPI reporting. It helps student affairs teams maintain predictable execution quality across workshops, fests, and outreach programs.",
  stats: [
    { label: "Events This Term", value: "38", change: "Across all schools" },
    { label: "On-Time Starts", value: "92%", change: "Runbook compliance", up: true },
    { label: "Budget Variance", value: "4.8%", change: "Within approved limits", up: true },
    { label: "Escalations", value: "6", change: "Risk-managed" },
  ],
  pipeline: [
    { title: "Event Blueprint", desc: "Capture objectives, audience, dependencies, and owner matrix." },
    { title: "Budget & Vendors", desc: "Validate spend buckets, approvals, and procurement checkpoints." },
    { title: "Risk & Logistics", desc: "Run venue, AV, safety, and staffing readiness checks before go-live." },
    { title: "Promotion Cadence", desc: "Publish multi-channel communication with CTA tracking." },
    { title: "Post-Event Audit", desc: "Measure attendance, outcomes, and improvement actions." },
  ],
  actions: [
    { label: "Plan Event", desc: "Create the full event runbook with owners and dependencies" },
    { label: "Promote Event", desc: "Generate segmented campaign messaging and send cadence" },
    { label: "Risk & Logistics Check", desc: "Run go/no-go readiness checks" },
    { label: "Generate Report", desc: "Create post-event KPI and improvement report" },
  ],
  activity: [
    { time: "8 min ago", event: "Hackathon logistics check completed — status: go", status: "success" },
    { time: "35 min ago", event: "Vendor escalation raised for AV backup in Main Hall", status: "pending" },
    { time: "2 hr ago", event: "Placement workshop campaign launched to 2,300 students", status: "info" },
    { time: "Yesterday", event: "Career fair post-event report generated and circulated", status: "success" },
    { time: "2 days ago", event: "Budget variance alert: +7% on annual cultural fest", status: "error" },
  ],
  capabilities: [
    "End-to-end event runbook generation",
    "Go/no-go logistics and risk gating",
    "Segmented communications planning",
    "Budget variance monitoring",
    "Volunteer and owner responsibility mapping",
    "Post-event KPI and learning loop",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
