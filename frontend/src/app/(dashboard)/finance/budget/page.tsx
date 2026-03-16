import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Budget Monitor",
  agentId: "finance-budget",
  badge: "api",
  domain: "Finance",
  domainHref: "/finance",
  domainColor: "#ef4444",
  tagline: "Total visibility into every department's spend.",
  description:
    "Tracks departmental spending against sanctioned annual budgets in real-time. Flags overspend before it happens, manages the procurement approval pipeline, and provides one-click financial health dashboards for the Board of Trustees.",
  stats: [
    { label: "Total Budget",      value: "₹42.0Cr",change: "Institutional FY25" },
    { label: "Overall Spend",     value: "₹31.2Cr",change: "74% utilisation" },
    { label: "Pending Approvals", value: "8",      change: "Procurement requests" },
    { label: "Savings Found",     value: "₹12.4L", change: "Through vendor audit", up: true },
  ],
  pipeline: [
    { title: "Budget Sanction",   desc: "Annual departmental allocations uploaded and thresholds locked." },
    { title: "Expense Tracking",   desc: "Invoices, payroll, and purchase orders auto-matched to budget heads." },
    { title: "Risk Alerting",      desc: "Agent flags categories approaching 90% utilization and notifies HODs." },
    { title: "Procurement Flow",   desc: "Purchase requests routed for one-click digital sign-off by authorities." },
    { title: "Board Dashboard",    desc: "Real-time P&L, burn rate, and projected end-of-year surplus reporting." },
  ],
  actions: [
    { label: "Check Spend",       desc: "Audit current departmental spending against limits" },
    { label: "Forecast Burn",     desc: "Predict year-end budget utilization based on trends" },
    { label: "Approve POs",       desc: "Review and sign-off on pending purchase orders" },
    { label: "Analyse Savings",    desc: "Identify vendor consolidation or cost-saving opportunities" },
  ],
  activity: [
    { time: "Just now",   event: "Purchase Order #9822 approved: Lab Consumables (₹18,000)", status: "success" },
    { time: "2 hrs ago",  event: "Threshold alert: ECE travel budget at 92% — HOD notified", status: "error" },
    { time: "Yesterday",  event: "Payroll sync: March salaries processed for 247 staff", status: "success" },
    { time: "2 days ago", event: "Vendor audit: Switched electricity provider — est savings ₹12k/mo", status: "info" },
    { time: "1 week ago", event: "Quarterly review: All depts within ±5% of budget", status: "success" },
  ],
  capabilities: [
    "Departmental budget header management",
    "Real-time expense and burn-rate tracking",
    "Automated procurement approval hierarchy",
    "PO-to-Invoice matching and audit trail",
    "Budget utilization threshold alerting (90%/100%)",
    "Vendor benchmarking and savings identification",
    "Board-level strategic financial dashboards",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
