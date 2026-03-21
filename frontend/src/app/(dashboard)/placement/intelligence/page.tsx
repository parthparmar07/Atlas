"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function PlacementIntelligencePage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Placement Intel",
        agentId: "placement-intelligence",
        badge: "hot",
        domain: "Placement",
        domainHref: "/placement",
        domainColor: "#059669",
        tagline: "Convert student capability into interview-ready opportunity pipelines.",
        description:
          "Runs JD parsing, student-job matching, skill-gap analysis, resume checks, interview preparation, and company pipeline tracking with contract-driven execution.",
        stats: [
          { label: "Students in Pipeline", value: "824", change: "Current placement season" },
          { label: "Match Precision", value: "78%", change: "+9 pts vs baseline", up: true },
          { label: "High-Gap Students", value: "143", change: "Needs training sprint", up: false },
          { label: "Active Recruiters", value: "96", change: "Across 5 schools", up: true },
        ],
        pipeline: [
          { title: "Intake", desc: "Collect JD, student profile, and hiring constraints" },
          { title: "Normalization", desc: "Parse skills, role expectations, and rubric weights" },
          { title: "Scoring", desc: "Compute fit and highlight confidence factors" },
          { title: "Action Plan", desc: "Create prep, resume, and outreach actions" },
          { title: "Ops Sync", desc: "Persist outputs and execution artifacts" },
        ],
        actions: [
          { label: "Analyse Job Descriptions", desc: "Parse role skills and screening criteria" },
          { label: "Match Students to Jobs", desc: "Generate ranked fit matrix and reasons" },
          { label: "Analyse Batch Skill Gaps", desc: "Find skill deficits with intervention plan" },
          { label: "Review Resumes", desc: "Run ATS and role-fit review" },
          { label: "Prepare for Interviews", desc: "Create role-specific interview prep outputs" },
          { label: "Manage Company Pipeline", desc: "Track recruiter stage risks and actions" },
        ],
        activity: [
          { time: "Now", event: "JD parsing completed for 14 new openings", status: "success" },
          { time: "6m ago", event: "Student-job matching refreshed for CSE cohort", status: "success" },
          { time: "19m ago", event: "Skill-gap alert generated for analytics roles", status: "pending" },
          { time: "33m ago", event: "Company outreach queue reprioritized", status: "info" },
          { time: "1h ago", event: "Placement artifact pack synced", status: "success" },
        ],
        capabilities: [
          "JD intelligence extraction",
          "Role fit scoring",
          "Skill-gap diagnostics",
          "Resume and interview linkage",
          "Recruiter pipeline tracking",
          "Execution trace visibility",
          "Ops persistence",
          "Action contract enforcement",
        ],
      }}
    />
  );
}
