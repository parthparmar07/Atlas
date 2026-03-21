"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function StudentEventsPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Events Coordinator",
        agentId: "students-events",
        badge: "unique",
        domain: "Students",
        domainHref: "/students",
        domainColor: "#9333ea",
        tagline: "Plan, promote, and de-risk events with execution-grade precision.",
        description:
          "Coordinates event planning, promotion, logistics risk checks, and post-event reporting using structured action contracts and auditable outputs.",
        stats: [
          { label: "Upcoming Events", value: "26", change: "Next 45 days" },
          { label: "Promotion Reach", value: "18.2k", change: "+14% campaign uplift", up: true },
          { label: "Risk Flags", value: "7", change: "Needs logistics review", up: false },
          { label: "On-time Reports", value: "91%", change: "Post-event closure", up: true },
        ],
        pipeline: [
          { title: "Event Intake", desc: "Capture event profile, venue, budget, and timeline" },
          { title: "Promotion Planning", desc: "Generate audience and channel plan" },
          { title: "Risk Check", desc: "Validate logistics, contacts, and checklist readiness" },
          { title: "Execution Support", desc: "Track operations and communication events" },
          { title: "Outcome Report", desc: "Compile attendance, feedback, and budget summary" },
        ],
        actions: [
          { label: "Plan Event", desc: "Create event plan with budget and milestone suggestions" },
          { label: "Promote Event", desc: "Generate segment and channel-oriented promotion strategy" },
          { label: "Risk & Logistics Check", desc: "Assess checklist and contact readiness" },
          { label: "Generate Report", desc: "Produce post-event impact and budget report" },
        ],
        activity: [
          { time: "Now", event: "Venue logistics risk flagged for one upcoming event", status: "pending" },
          { time: "7m ago", event: "Promotion strategy generated for annual innovation fest", status: "success" },
          { time: "16m ago", event: "Post-event report published for design sprint", status: "success" },
          { time: "33m ago", event: "Budget variance alert issued to event owner", status: "info" },
          { time: "1h ago", event: "Contact escalation list synced", status: "success" },
        ],
        capabilities: [
          "Event planning",
          "Campaign strategy generation",
          "Logistics readiness analysis",
          "Budget-aware reporting",
          "Feedback trend extraction",
          "Owner escalation support",
          "Ops timeline logging",
          "Communication orchestration",
        ],
      }}
    />
  );
}
