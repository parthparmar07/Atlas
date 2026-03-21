"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function GrievancePage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Grievance Desk",
        agentId: "students-grievance",
        badge: "api",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#4f46e5",
        tagline: "Route every complaint with SLA clarity and audit-safe escalation.",
        description:
          "Processes student grievances into categorized, SLA-aware workflows with escalation priorities, anonymized reporting, and communication tracking.",
        stats: [
          { label: "Open Cases", value: "37", change: "Current queue" },
          { label: "SLA Breach Risk", value: "6", change: "Requires immediate review", up: false },
          { label: "Resolved This Week", value: "49", change: "+12 vs prior", up: true },
          { label: "Anonymous Submissions", value: "41%", change: "Privacy-protected channel" },
        ],
        pipeline: [
          { title: "Case Intake", desc: "Capture category, severity, and source channel" },
          { title: "Classification", desc: "Tag grievance type and accountability owner" },
          { title: "SLA Assignment", desc: "Set response and resolution windows" },
          { title: "Escalation Logic", desc: "Trigger breach escalation and notifications" },
          { title: "Reporting", desc: "Generate anonymized and operational views" },
        ],
        actions: [
          { label: "Process Grievances", desc: "Classify and route incoming grievances" },
          { label: "Escalation Report", desc: "Generate breach and escalation status report" },
          { label: "Anonymise Report", desc: "Create privacy-safe grievance trend output" },
          { label: "SLA Dashboard", desc: "Build compliance summary by category and owner" },
        ],
        activity: [
          { time: "Now", event: "New high-priority grievance routed to registrar desk", status: "pending" },
          { time: "6m ago", event: "SLA dashboard refreshed with latest owner metrics", status: "success" },
          { time: "17m ago", event: "Anonymous trend report exported for review committee", status: "success" },
          { time: "34m ago", event: "Two cases marked breach-risk and escalated", status: "pending" },
          { time: "1h ago", event: "Case communication retries completed", status: "info" },
        ],
        capabilities: [
          "Grievance classification",
          "Owner and SLA routing",
          "Escalation analytics",
          "Anonymized reporting",
          "Breach-risk detection",
          "Case communication tracking",
          "Ops persistence",
          "Execution trace transparency",
        ],
      }}
    />
  );
}
