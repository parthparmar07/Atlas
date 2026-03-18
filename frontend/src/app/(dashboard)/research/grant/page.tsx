import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Grant Tracker",
  agentId: "research-grant",
  badge: "unique",
  domain: "Research",
  domainHref: "/research",
  domainColor: "#0891b2",
  tagline: "Every grant deadline visible, every utilization risk actionable.",
  description:
    "Tracks sponsored project lifecycle from sanction to closure. It monitors utilization, compliance milestones, and near-term deadline risks while generating PI-ready updates and finance-ready portfolio views.",
  stats: [
    { label: "Active Grants", value: "74", change: "Across schools" },
    { label: "Utilization Health", value: "86%", change: "Within target", up: true },
    { label: "Deadlines < 15 Days", value: "11", change: "Need owner action" },
    { label: "UC Overdue", value: "3", change: "Escalated" },
  ],
  pipeline: [
    { title: "Portfolio Ingest", desc: "Consolidate grant, PI, sponsor, and budget context." },
    { title: "Utilization Analytics", desc: "Track burn, variance, and forecast utilization risk." },
    { title: "Compliance Clock", desc: "Monitor UC, progress, and closure obligations." },
    { title: "PI Notifications", desc: "Generate concise owner-specific updates." },
    { title: "Escalation Queue", desc: "Prioritize high-risk cases for finance and dean review." },
  ],
  actions: [
    { label: "Track Grant Portfolio", desc: "Build current grant lifecycle and risk snapshot" },
    { label: "Generate Utilization Report", desc: "Create utilization variance and burn report" },
    { label: "Deadline Alerts", desc: "Generate 30/15/7 day compliance alerts" },
    { label: "Draft PI Updates", desc: "Prepare action-oriented PI communication drafts" },
  ],
  activity: [
    { time: "6 min ago", event: "Deadline alert: DST-2042 UC due in 7 days", status: "pending" },
    { time: "22 min ago", event: "Utilization report generated for Q4 review meeting", status: "success" },
    { time: "1 hr ago", event: "PI update draft generated for low-burn grant BME-88", status: "info" },
    { time: "Yesterday", event: "Escalation raised: 2 grants with overdue progress reports", status: "error" },
    { time: "2 days ago", event: "Portfolio sync complete for 74 active grants", status: "success" },
  ],
  capabilities: [
    "Grant lifecycle portfolio tracking",
    "Utilization and variance analytics",
    "Compliance deadline risk monitoring",
    "Escalation-ready alerting",
    "PI communication drafting",
    "Finance review pack generation",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
