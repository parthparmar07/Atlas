"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function HRLeaveManagerPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Leave Manager",
        agentId: "hr-leave-manager",
        badge: "core",
        domain: "HR & Faculty",
        domainHref: "/hr",
        domainColor: "#16a34a",
        tagline: "Policy-aware leave decisions with zero spreadsheet ops.",
        description:
          "Automates leave validation, policy checks, clash detection, and stakeholder communication. Designed for institutional workloads with real auditability and escalation controls.",
        stats: [
          { label: "Pending Requests", value: "12", change: "Live from ops feed", up: true },
          { label: "Auto Decisions", value: "78%", change: "+11% this month", up: true },
          { label: "Avg TAT", value: "4m", change: "vs 1.8 days manual", up: true },
          { label: "Escalations", value: "6", change: "Policy edge cases" },
        ],
        pipeline: [
          { title: "Request Intake", desc: "Faculty/staff leave request enters workflow with dates, type, and reason" },
          { title: "Policy Validation", desc: "Leave balance + clause validation against institutional service rules" },
          { title: "Clash Detection", desc: "Checks teaching duty, exam invigilation, and critical calendar blocks" },
          { title: "Decision Engine", desc: "Approve / Conditional / Reject with reasons and clause references" },
          { title: "Cascade", desc: "Triggers substitution/timetable signals if approved leave affects classes" },
        ],
        actions: [
          { label: "Process Leave Requests", desc: "Evaluate pending leaves with policy + duty clash checks" },
          { label: "Analyse Faculty Load", desc: "Detect over/under allocation and generate balancing suggestions" },
          { label: "Run Appraisals", desc: "Generate structured KPI summaries and performance bands" },
          { label: "HR Policy Lookup", desc: "Answer rule queries with explicit clause references" },
        ],
        activity: [
          { time: "Now", event: "3 leave cases processed with clause-backed decisions", status: "success" },
          { time: "5m ago", event: "Conditional approval raised due to exam duty overlap", status: "pending" },
          { time: "12m ago", event: "Substitution signal emitted for approved faculty absence", status: "info" },
          { time: "28m ago", event: "Policy lookup response delivered to HoD", status: "success" },
          { time: "1h ago", event: "Escalation created for long medical leave exception", status: "pending" },
        ],
        capabilities: [
          "Leave policy clause matching",
          "Balance and eligibility validation",
          "Duty clash and calendar impact checks",
          "Clause-referenced approval rationale",
          "Automatic stakeholder communication",
          "Escalation for exceptions",
          "Ops persistence for audit trail",
          "Cross-agent cascade signaling",
        ],
      }}
    />
  );
}
