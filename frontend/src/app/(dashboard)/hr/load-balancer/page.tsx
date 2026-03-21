"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function HRFacultyLoadBalancerPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Faculty Load Balancer",
        agentId: "hr-load-balancer",
        badge: "unique",
        domain: "HR & Faculty",
        domainHref: "/hr",
        domainColor: "#0f766e",
        tagline: "Balance teaching capacity before burnout and bottlenecks happen.",
        description:
          "Computes workload inequity, detects concentration risk, and recommends assignment shifts that can be fed into timetable constraints for better institutional stability.",
        stats: [
          { label: "Overloaded Faculty", value: "9", change: "Above 20 hrs/week", up: false },
          { label: "Underutilized Faculty", value: "14", change: "Below 8 hrs/week" },
          { label: "Dept Risk Clusters", value: "3", change: "Single-point dependency" },
          { label: "Rebalance Candidates", value: "27", change: "Actionable shifts identified", up: true },
        ],
        pipeline: [
          { title: "Load Data Sync", desc: "Pull teaching hours, duty blocks, committees, and supervision counts" },
          { title: "Risk Scoring", desc: "Compute workload score and identify inequity thresholds" },
          { title: "Constraint Build", desc: "Create faculty assignment constraints for timetable planning" },
          { title: "Shift Recommendations", desc: "Propose specific assignment redistribution with impact" },
          { title: "Ops Handoff", desc: "Publish validated changes for HoD and scheduling approval" },
        ],
        actions: [
          { label: "Analyse Load", desc: "Run inequity scan and identify overload risk" },
          { label: "Generate Report", desc: "Export department-wise utilization matrix" },
          { label: "Recommend Changes", desc: "Propose concrete reassignment plan" },
        ],
        activity: [
          { time: "Now", event: "Load scan flagged 2 departments with concentration risk", status: "pending" },
          { time: "6m ago", event: "Constraint feed emitted for timetable planning", status: "success" },
          { time: "15m ago", event: "Rebalance recommendation pack generated", status: "success" },
          { time: "23m ago", event: "Manual override logged by HoD for one faculty assignment", status: "info" },
          { time: "1h ago", event: "Weekly utilization report pushed to HR ops store", status: "success" },
        ],
        capabilities: [
          "Workload score computation",
          "Overload/underload detection",
          "Department concentration risk analysis",
          "Assignment shift recommendations",
          "Timetable constraint generation",
          "Manager override support",
          "Operational trace logging",
          "Cross-domain handoff readiness",
        ],
      }}
    />
  );
}
