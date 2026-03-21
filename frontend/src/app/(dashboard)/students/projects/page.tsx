"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function StudentProjectsPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Projects Command",
        agentId: "students-projects",
        badge: "api",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#f59e0b",
        tagline: "Keep project execution on-track with early delay and risk control.",
        description:
          "Monitors project lifecycle status, attendance-linked delays, grievance linkage, and internship overlap impact to generate coordinator-ready interventions.",
        stats: [
          { label: "Active Project Teams", value: "218", change: "Current semester" },
          { label: "Delay Flags", value: "29", change: "Missed milestone risk", up: false },
          { label: "On-track Progress", value: "73%", change: "+6% from last month", up: true },
          { label: "Escalation Candidates", value: "12", change: "Needs faculty intervention", up: false },
        ],
        pipeline: [
          { title: "Snapshot Capture", desc: "Collect team milestone and update latency data" },
          { title: "Delay Detection", desc: "Identify teams missing expected progress windows" },
          { title: "Risk Correlation", desc: "Cross-check attendance and grievance pressure" },
          { title: "Intervention Planning", desc: "Recommend project and mentor actions" },
          { title: "Closure Tracking", desc: "Log outcomes and review next cycle" },
        ],
        actions: [
          { label: "Track Projects", desc: "Generate branch-wise project progress summary" },
          { label: "Monitor Dropout Risk", desc: "Link project risk with student persistence signals" },
          { label: "Manage Grievances", desc: "Review grievance impact on project continuity" },
          { label: "Manage Internships", desc: "Check internship load effects on project pace" },
          { label: "Generate Attendance Alerts", desc: "Create attendance-linked intervention list" },
          { label: "Flag Delays", desc: "Produce prioritized delayed-team escalation board" },
        ],
        activity: [
          { time: "Now", event: "Delay board generated for this week milestone review", status: "pending" },
          { time: "9m ago", event: "Project tracking output published for CSE and Design", status: "success" },
          { time: "21m ago", event: "Attendance-linked risk correlations refreshed", status: "success" },
          { time: "38m ago", event: "Coordinator escalation packet drafted", status: "info" },
          { time: "1h ago", event: "Lifecycle timeline persisted to ops store", status: "success" },
        ],
        capabilities: [
          "Project lifecycle analytics",
          "Milestone delay detection",
          "Attendance-impact correlation",
          "Intervention recommendation",
          "Escalation board generation",
          "Coordinator handoff outputs",
          "Ops history tracking",
          "Action-level execution trace",
        ],
      }}
    />
  );
}
