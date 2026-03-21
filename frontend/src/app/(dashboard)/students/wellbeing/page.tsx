"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function StudentWellbeingPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Wellbeing Support",
        agentId: "students-wellbeing",
        badge: "core",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#e11d48",
        tagline: "Route support early, safely, and with measurable follow-through.",
        description:
          "Provides counselor routing, support-group matching, and self-help recommendation workflows with privacy-aware handling and traceable support actions.",
        stats: [
          { label: "Support Requests", value: "58", change: "Current week" },
          { label: "Counselor Connect SLA", value: "93%", change: "Within target window", up: true },
          { label: "Urgent Cases", value: "5", change: "Priority review", up: false },
          { label: "Self-help Adoption", value: "67%", change: "Follow-through metric", up: true },
        ],
        pipeline: [
          { title: "Issue Intake", desc: "Capture support request context and urgency" },
          { title: "Triage", desc: "Classify for counselor, group, or self-help track" },
          { title: "Guided Routing", desc: "Assign nearest valid support channel" },
          { title: "Follow-up", desc: "Track response and revisit risk markers" },
          { title: "Support Summary", desc: "Log support outcomes to ops timeline" },
        ],
        actions: [
          { label: "Connect with a Counselor", desc: "Route request to counseling queue" },
          { label: "Find a Support Group", desc: "Match support circles by issue profile" },
          { label: "Access Self-Help Resources", desc: "Recommend guided self-help pack" },
        ],
        activity: [
          { time: "Now", event: "Counselor routing generated for two priority requests", status: "pending" },
          { time: "10m ago", event: "Support-group recommendations published", status: "success" },
          { time: "24m ago", event: "Self-help resource bundle delivered", status: "success" },
          { time: "41m ago", event: "Follow-up reminder triggered for unresolved case", status: "info" },
          { time: "1h ago", event: "Wellbeing queue metrics synced", status: "success" },
        ],
        capabilities: [
          "Counselor routing",
          "Support-group matching",
          "Self-help recommendation",
          "Urgency triage",
          "Follow-up scheduling",
          "Privacy-aware handling",
          "Ops trace persistence",
          "Communication workflow support",
        ],
      }}
    />
  );
}
