import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Procurement Agent",
  agentId: "finance-procurement",
  badge: "unique",
  domain: "Finance",
  domainHref: "/finance",
  domainColor: "#ef4444",
  tagline: "Smart purchasing, decentralized requests, centralized control.",
  description:
    "Manages the entire institutional procurement cycle from requisition to release. Scans for duplicate requests, benchmarks vendor pricing against historical data, and routes high-value items for senior leadership approval automatically.",
  stats: [
    { label: "Active Requisitions", value: "24",  change: "Pending review" },
    { label: "Avg Approval Time",  value: "1.2d", change: "vs 14d manual", up: true },
    { label: "Vendor Savings",     value: "₹8.4L",change: "Last 6 months", up: true },
    { label: "Duplicate Rejections",value: "12",  change: "Saved unnecessary spend" },
  ],
  pipeline: [
    { title: "Raise Requisition", desc: "Department staff logs requests with specifications, quantities, and reasoning." },
    { title: "Inventory Check",   desc: "Agent verifies if items exist in central store or other department surplus stocks." },
    { title: "Vendor Benchmark",  desc: "Compares current quotes against historical PO data to find optimal pricing." },
    { title: "Approval Chain",     desc: "Requests routed dynamically based on value: HOD to Board level." },
    { title: "PO Generation",      desc: "Instant digital POs generated for approved items and dispatched to vendors." },
  ],
  actions: [
    { label: "Audit Vendor",      desc: "Benchmarking vendor pricing and reliability scores" },
    { label: "Check Stock",       desc: "Inventory levels across all institutional departments" },
    { label: "Requisition Log",   desc: "Generate full audit trail for all recent purchase requests" },
    { label: "Bulk Consolidate",  desc: "Identify bulk purchasing opportunities across departments" },
  ],
  activity: [
    { time: "Just now",   event: "PO Issued: 50 Dell Monitors for CSE Lab — ₹4,20,000", status: "success" },
    { time: "2 hrs ago",  event: "Flag: Requisition #4211 rejected — items in Mechanical surplus", status: "error" },
    { time: "Yesterday",  event: "Benchmark: Lab supplies found 12% lower via vendor 'LabLink'", status: "info" },
    { time: "2 days ago", event: "Approval overdue: Dr. Mehta has 3 pending requisitions", status: "pending" },
    { time: "1 week ago", event: "Audit: Q1 spend 12% below projections due to consolidation", status: "success" },
  ],
  capabilities: [
    "Decentralized requisition interface for all staff",
    "Automated cross-departmental inventory search",
    "Dynamic vendor price benchmarking engine",
    "Configurable monetary approval thresholds",
    "Auto-generation and dispatch of digital POs",
    "Procurement lifecycle tracking from request to delivery",
    "Spending pattern analytics per department/category",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
