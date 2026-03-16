import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Faculty Load Balancer",
  agentId: "hr-load-balancer",
  badge: "unique",
  domain: "HR & Faculty",
  domainHref: "/hr",
  domainColor: "#8b5cf6",
  tagline: "Equitable workloads — detected automatically, corrected proactively.",
  description:
    "Tracks teaching hours, exam invigilation duties, and committee assignments across every faculty member. Flags overload and inequity before it causes burnout. Feeds directly into Timetable AI so over-assigned faculty get lighter scheduling automatically.",
  stats: [
    { label: "Faculty Monitored", value: "184",  change: "Across all depts" },
    { label: "Overload Flags",    value: "7",    change: "Active this week", up: false },
    { label: "Avg Teaching Hrs",  value: "14.2", change: "Per week, target: 16" },
    { label: "Equity Score",      value: "87/100",change: "+4 from last semester", up: true },
  ],
  pipeline: [
    { title: "Load Data Aggregated", desc: "Teaching hours, invigilation duties, and committee roles tracked." },
    { title: "Equity Analysis", desc: "Workload computed and fairness checked across all departments." },
    { title: "Overload Flagging", desc: "Faculty exceeding department threshold flagged for intervention." },
    { title: "Timetable Feed", desc: "Overload list shared with Timetable AI for automatic correction." },
    { title: "Monthly KPI Report", desc: "Workload summary shared with Appraisal Agent for year-end review." },
  ],
  actions: [
    { label: "Analyse Load",      desc: "Run real-time workload analysis by department" },
    { label: "Rebalance Now",     desc: "Propose new workload distribution for overloaded staff" },
    { label: "Overload Report",   desc: "Generate detailed list of staff exceeding thresholds" },
    { label: "Predict Gaps",      desc: "Forecast faculty availability for next semester" },
  ],
  activity: [
    { time: "1 hr ago",    event: "Flag: Dr. Krishnan (CSE) at 23.4 hrs/week — recommended: offload 1 lab batch", status: "error" },
    { time: "3 hrs ago",   event: "Timetable AI updated — Dr. Krishnan excluded from next-round scheduling", status: "success" },
    { time: "Yesterday",   event: "Equity report: ECE dept — 3 faculty carrying 70% of invigilation duties", status: "error" },
    { time: "2 days ago",  event: "Monthly load report sent to all HODs — 14 flagged faculty", status: "info" },
    { time: "3 days ago",  event: "Committee assignments updated: 6 new members added", status: "info" },
  ],
  capabilities: [
    "Real-time aggregation: teaching + invigilation + committee",
    "Per-faculty and per-department equity score",
    "Automatic Timetable AI feed on overload detection",
    "Historical trend tracking by semester",
    "HOD and Principal alert escalation",
    "Appraisal Agent data feed for annual KPI context",
    "Manual rebalance request with justification workflow",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
