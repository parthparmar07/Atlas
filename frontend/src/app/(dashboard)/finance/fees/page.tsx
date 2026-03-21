"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function FinanceFeesPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Fee Collection",
        agentId: "finance-fees",
        badge: "hot",
        domain: "Finance & Governance",
        domainHref: "/finance",
        domainColor: "#dc2626",
        tagline: "Recover dues with segmented strategy, speed, and compliance safety.",
        description:
          "Builds dues summaries, reminder sequencing, defaulter intelligence, and recovery plans with channel-aware recommendations and governance-ready outputs.",
        stats: [
          { label: "Outstanding Due", value: "3.24 Cr", change: "Current term" },
          { label: "Recovered This Month", value: "1.08 Cr", change: "+18% vs prior", up: true },
          { label: "Escalated Cases", value: "74", change: "High-risk defaulters", up: false },
          { label: "On-time Collections", value: "81%", change: "Term progress", up: true },
        ],
        pipeline: [
          { title: "Case Intake", desc: "Capture due amount, status, and channel" },
          { title: "Segmentation", desc: "Bucket by delay, amount, and risk" },
          { title: "Reminder Plan", desc: "Generate channel-specific communication queue" },
          { title: "Recovery Path", desc: "Recommend escalation and settlement actions" },
          { title: "Compliance Log", desc: "Persist notices and action evidence" },
        ],
        actions: [
          { label: "Collect Dues", desc: "Generate payable and pending dues summary" },
          { label: "Send Reminders", desc: "Create segmented reminder strategy" },
          { label: "Defaulter Report", desc: "Generate high-risk defaulter intelligence" },
          { label: "Recovery Plan", desc: "Build escalation and recovery action plan" },
        ],
        activity: [
          { time: "Now", event: "Dues summary generated for Semester 6", status: "success" },
          { time: "8m ago", event: "Reminder queue prepared across Email/SMS/WhatsApp", status: "success" },
          { time: "22m ago", event: "Defaulter risk board updated for finance committee", status: "pending" },
          { time: "37m ago", event: "Recovery plan drafted for chronic cases", status: "info" },
          { time: "1h ago", event: "Fee collection run synced", status: "success" },
        ],
        capabilities: [
          "Dues segmentation",
          "Reminder orchestration",
          "Defaulter analytics",
          "Recovery planning",
          "Channel strategy",
          "Compliance-safe trace",
          "Ops persistence",
          "Action-level telemetry",
        ],
      }}
    />
  );
}
