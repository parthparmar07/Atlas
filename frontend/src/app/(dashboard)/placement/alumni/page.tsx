"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function PlacementAlumniPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Alumni Network",
        agentId: "placement-alumni",
        badge: "unique",
        domain: "Placement",
        domainHref: "/placement",
        domainColor: "#0f766e",
        tagline: "Activate alumni as mentors, referrers, and hiring multipliers.",
        description:
          "Matches student goals to alumni mentors, supports job-post campaigns, and orchestrates networking events with action-level outputs and communication traceability.",
        stats: [
          { label: "Alumni Tracked", value: "2,407", change: "Verified profiles" },
          { label: "Mentor Matches", value: "486", change: "Active mentoring pairs", up: true },
          { label: "Referral Active", value: "312", change: "Open referral loops", up: true },
          { label: "Dormant Segment", value: "129", change: "Needs reactivation", up: false },
        ],
        pipeline: [
          { title: "Goal Mapping", desc: "Map student intent to alumni capability" },
          { title: "Mentor Match", desc: "Rank likely mentor-fit candidates" },
          { title: "Referral Campaign", desc: "Generate outreach and referral briefs" },
          { title: "Event Planning", desc: "Plan domain-specific networking sessions" },
          { title: "Outcome Tracking", desc: "Log interactions and conversion" },
        ],
        actions: [
          { label: "Find Mentors", desc: "Build ranked mentor recommendations" },
          { label: "Post Job Opening", desc: "Prepare alumni-facing opportunity post" },
          { label: "Organize Networking Event", desc: "Generate event plan and invite cohort" },
        ],
        activity: [
          { time: "Now", event: "Mentor match list generated for AI specialization", status: "success" },
          { time: "7m ago", event: "Referral campaign queued for product roles", status: "pending" },
          { time: "23m ago", event: "Networking event agenda drafted", status: "success" },
          { time: "41m ago", event: "Dormant alumni reactivation segment updated", status: "info" },
          { time: "1h ago", event: "Engagement outputs synced to ops timeline", status: "success" },
        ],
        capabilities: [
          "Mentor recommendation",
          "Referral campaign drafting",
          "Networking event planning",
          "Segment-based alumni activation",
          "Engagement outcome tracking",
          "Execution telemetry",
          "Ops communications trail",
          "Placement integration",
        ],
      }}
    />
  );
}
