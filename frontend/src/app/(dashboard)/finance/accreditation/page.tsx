import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Accreditation Agent",
  agentId: "finance-accreditation",
  badge: "unique",
  domain: "Finance",
  domainHref: "/finance",
  domainColor: "#ef4444",
  tagline: "365-day readiness for NAAC, NBA, and NIRF.",
  description:
    "Compares your live institutional data against NAAC/NBA criteria in real-time. Flags missing documentation, poor metrics (like faculty-student ratio), and auto-generates draft Self-Study Reports (SSR) with supporting data points.",
  stats: [
    { label: "NAAC Est. Score",   value: "3.42",  change: "Target: 3.51 (A++)", up: true },
    { label: "Criteria Met",      value: "84/104",change: "Metric compliance" },
    { label: "SSR Readiness",     value: "71%",   change: "Draft auto-complete", up: true },
    { label: "Quality Flags",     value: "14",    change: "Documentation missing" },
  ],
  pipeline: [
    { title: "Metric Ingestion",   desc: "Faculty stats, library data, research output, and student results auto-fetched." },
    { title: "Compliance Check",   desc: "Scores live data against the latest NAAC Quantitative Metrics (QnM)." },
    { title: "Gap Identification", desc: "Flags low-scoring criteria like placement record or budget mismatches." },
    { title: "SSR Generation",     desc: "Gemini drafts qualitative responses based on institutional achievements." },
    { title: "Audit Hub",           desc: "Central evidence repository cross-referenced to accreditation criteria." },
  ],
  actions: [
    { label: "NAAC Score",        desc: "Calculate real-time NAAC compliance score estimate" },
    { label: "Prepare SSR",       desc: "Generate draft content for Self-Study Report criteria" },
    { label: "NIRF Ranking",      desc: "Audit data submission for NIRF national rankings" },
    { label: "Gap Analysis",      desc: "Identify specific documentation or metric deficiencies" },
  ],
  activity: [
    { time: "1 hr ago",    event: "Criterion 5 score improved following Alum Matcher rollout", status: "success" },
    { time: "4 hrs ago",   event: "Flag: Criterion 3.4.3 — Research papers below threshold", status: "error" },
    { time: "Yesterday",   event: "SSR Draft: 'Institutional Values' response refreshed", status: "success" },
    { time: "2 days ago",  event: "NBA readiness check: Mechanical Engineering at 82%", status: "info" },
    { time: "3 days ago",  event: "Evidence alert: 42 faculty missing 'Appointment Letter' scans", status: "error" },
  ],
  capabilities: [
    "Real-time NAAC/NBA/NIRF score estimation",
    "Auto-generation of Self-Study Report (SSR) drafts",
    "Automated Qualitative Metric (QlM) response drafting",
    "Cross-department evidence tracking and document vault",
    "Metric-driven gap analysis and quality improvement nudges",
    "Faculty-student ratio and research-per-capita monitoring",
    "Audit-ready data export formats (Excel/PDF)",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
