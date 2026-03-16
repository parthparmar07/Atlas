import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Dropout Predictor",
  agentId: "students-dropout",
  badge: "unique",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#f59e0b",
  tagline: "Predict risk 6 weeks early — intervene while it still matters.",
  description:
    "Uses a 12-signal risk model (attendance, mid-term scores, library usage, fee delays, extracurricular engagement) to identify students at risk of drop-out. Sends alerts to counsellors weeks before the crisis, tracking intervention outcomes and retention probability.",
  stats: [
    { label: "Students Monitored", value: "3,240",  change: "Campus-wide" },
    { label: "High Risk Flags",    value: "42",     change: "+4 this week", up: false },
    { label: "Interventions Meta", value: "88%",    change: "Outcome tracked", up: true },
    { label: "Retention Rate",     value: "96.4%",  change: "vs 91.2% last year", up: true },
  ],
  pipeline: [
    { title: "Signal Ingestion",    desc: "Attendance, LMS activity, library usage, and fee payment signals collected." },
    { title: "Risk Scoring",        desc: "ML model identifies anomalies or sudden drops in academic and social engagement." },
    { title: "Counsellor Trigger",  desc: "Agent fires 'Intervention Required' alerts to assigned student counsellors." },
    { title: "Outcome Tracking",    desc: "Counsellor notes logged and agent tracks post-intervention score/attendance shifts." },
    { title: "Model Calibration",  desc: "Monthly retraining on real dropout outcomes to increase prediction accuracy." },
  ],
  actions: [
    { label: "Run Prediction",     desc: "Simulate dropout risk analysis for the current student base" },
    { label: "Intervention Plan",  desc: "Generate targeted action plans for high-risk students" },
    { label: "Early Warning",      desc: "Produce this week's prioritized alert list for counsellors" },
    { label: "Trend Analysis",     desc: "Audit long-term dropout factors and institutional trends" },
  ],
  activity: [
    { time: "1 hr ago",    event: "New Risk: Aman Bansal (S4 ME) — 40% attendance drop detected", status: "error" },
    { time: "4 hrs ago",   event: "Intervention success: Sneha Rao (S2 IT) — attendance up by 30%", status: "success" },
    { time: "Yesterday",   event: "Periodic scan: 3,240 students — 42 high risk, 112 moderate", status: "info" },
    { time: "2 days ago",  event: "Alert: Fee delay + Poor Internal score (Sameer Sheikh)", status: "pending" },
    { time: "3 days ago",  event: "Monthly report: Retention climbing in CSE post-pilot", status: "success" },
  ],
  capabilities: [
    "12-signal predictive risk model",
    "Early warning (6-8 weeks before potential dropout)",
    "Integration with Biometric, LMS, and Library systems",
    "Counsellor workload management/assignment",
    "Closed-loop intervention outcome tracking",
    "Sudden behavior shift detection (Anomaly Detection)",
    "Department-wise risk distribution heatmaps",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
