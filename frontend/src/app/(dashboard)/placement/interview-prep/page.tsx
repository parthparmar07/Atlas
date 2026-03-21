"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function PlacementInterviewPrepPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Interview Prep",
        agentId: "placement-interview-prep",
        badge: "core",
        domain: "Placement",
        domainHref: "/placement",
        domainColor: "#10b981",
        tagline: "Turn mock performance into measurable interview conversion.",
        description:
          "Generates role-specific questions, evaluates candidate responses, and issues focused guidance for the next interview round with traceable outputs.",
        stats: [
          { label: "Mock Sessions", value: "311", change: "Last 30 days" },
          { label: "Avg Improvement", value: "+12.4", change: "Score delta after 2 rounds", up: true },
          { label: "Critical Weak Areas", value: "67", change: "Needs coaching", up: false },
          { label: "Round-2 Conversion", value: "61%", change: "+8 pts trend", up: true },
        ],
        pipeline: [
          { title: "Profile Intake", desc: "Capture role and candidate strengths" },
          { title: "Question Build", desc: "Generate structured interview sets" },
          { title: "Answer Review", desc: "Assess depth, clarity, and relevance" },
          { title: "Tip Engine", desc: "Create targeted improvement plan" },
          { title: "Progress Log", desc: "Persist scorecard history" },
        ],
        actions: [
          { label: "Generate Questions", desc: "Create role-specific interview question set" },
          { label: "Review Answers", desc: "Score and critique submitted answers" },
          { label: "Provide Tips", desc: "Generate focused coaching suggestions" },
        ],
        activity: [
          { time: "Now", event: "Question set generated for backend engineering", status: "success" },
          { time: "8m ago", event: "Answer review flagged system-design weak spots", status: "pending" },
          { time: "21m ago", event: "Targeted improvement tips delivered", status: "success" },
          { time: "36m ago", event: "Score progression synced to placement timeline", status: "info" },
          { time: "1h ago", event: "Mock round feedback digest prepared", status: "success" },
        ],
        capabilities: [
          "Question generation",
          "Answer scoring",
          "Weak-area diagnostics",
          "Round-wise coaching",
          "Role-context calibration",
          "Execution trace",
          "Ops logging",
          "Interview readiness tracking",
        ],
      }}
    />
  );
}
