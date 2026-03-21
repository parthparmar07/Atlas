"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function FinanceProcurementPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Procurement",
        agentId: "finance-procurement",
        badge: "api",
        domain: "Finance & Governance",
        domainHref: "/finance",
        domainColor: "#7c3aed",
        tagline: "Move requests to PO with speed, compliance, and cost control.",
        description:
          "Processes requisitions, tracks order lifecycle, and manages vendor payment queues with structured procurement intelligence and approval traceability.",
        stats: [
          { label: "Open Requisitions", value: "137", change: "Across departments" },
          { label: "PO Issued", value: "92", change: "This month", up: true },
          { label: "Cycle Time", value: "5.8d", change: "Avg request to PO", up: true },
          { label: "Rejection Rate", value: "6.2%", change: "Policy non-compliance", up: false },
        ],
        pipeline: [
          { title: "Request Intake", desc: "Capture requisition and budget context" },
          { title: "Validation", desc: "Check policy, vendor, and threshold rules" },
          { title: "PO Workflow", desc: "Advance approved requests to purchase orders" },
          { title: "Order Tracking", desc: "Monitor delivery milestones and blockers" },
          { title: "Vendor Settlement", desc: "Queue and process payable runs" },
        ],
        actions: [
          { label: "Process Requests", desc: "Validate and triage incoming requisitions" },
          { label: "Track Orders", desc: "Track PO and delivery lifecycle" },
          { label: "Pay Vendors", desc: "Prepare payment-ready vendor queue" },
        ],
        activity: [
          { time: "Now", event: "New requisition triage completed for lab equipment", status: "success" },
          { time: "9m ago", event: "PO delay risk flagged for one high-value request", status: "pending" },
          { time: "23m ago", event: "Vendor payment queue generated for finance review", status: "success" },
          { time: "38m ago", event: "Order tracking board refreshed", status: "info" },
          { time: "1h ago", event: "Procurement actions synced to ops timeline", status: "success" },
        ],
        capabilities: [
          "Request validation",
          "Policy-aware triage",
          "PO lifecycle tracking",
          "Vendor risk checks",
          "Payment queue creation",
          "Cycle-time monitoring",
          "Execution trace",
          "Audit persistence",
        ],
      }}
    />
  );
}
