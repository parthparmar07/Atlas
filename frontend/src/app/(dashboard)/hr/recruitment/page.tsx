"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function HRRecruitmentPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Recruitment Pipeline",
        agentId: "hr-recruitment",
        badge: "api",
        domain: "HR & Faculty",
        domainHref: "/hr",
        domainColor: "#2563eb",
        tagline: "From vacancy to offer letter in one autonomous pipeline.",
        description:
          "Automates faculty/staff hiring workflow: role posting, CV screening, interview scheduling, and offer generation with transparent scoring and institutional compliance checks.",
        stats: [
          { label: "Open Requisitions", value: "16", change: "Across all schools" },
          { label: "Screening Throughput", value: "94/day", change: "+22% week-on-week", up: true },
          { label: "Interview SLA", value: "2.1 days", change: "Down from 6.4 days", up: true },
          { label: "Offer Conversion", value: "31%", change: "Live pipeline metric", up: true },
        ],
        pipeline: [
          { title: "Requisition Intake", desc: "Collect role profile, eligibility norms, and hiring constraints" },
          { title: "Candidate Scoring", desc: "Evaluate CVs by qualification, experience, research, and fit" },
          { title: "Shortlist & Panels", desc: "Generate ranked shortlist and panel-ready candidate packs" },
          { title: "Interview Scheduling", desc: "Create slots, panel mapping, and candidate communication drafts" },
          { title: "Offer Pack", desc: "Generate compliant offer letter and onboarding handoff" },
        ],
        actions: [
          { label: "Post Job", desc: "Generate role posting with norms and hiring metadata" },
          { label: "Screen CVs", desc: "Rank candidates with weighted scoring framework" },
          { label: "Schedule Interviews", desc: "Produce panel schedule and interview rubric" },
          { label: "Generate Offer", desc: "Draft official offer pack with compensation structure" },
        ],
        activity: [
          { time: "Now", event: "CV screening run completed for AI/ML faculty role", status: "success" },
          { time: "7m ago", event: "Interview panel schedule generated for 6 shortlisted candidates", status: "success" },
          { time: "13m ago", event: "Recruitment shortlist flagged one profile for compliance review", status: "pending" },
          { time: "21m ago", event: "Offer letter draft created for Assistant Professor role", status: "info" },
          { time: "1h ago", event: "Requisition intake synced from HR control panel", status: "success" },
        ],
        capabilities: [
          "Role posting generation",
          "Weighted CV scoring",
          "Top-N shortlist reasoning",
          "Panel interview schedule creation",
          "Interview kit and rubric drafting",
          "Offer letter generation",
          "Audit-ready pipeline logs",
          "Ops feed persistence",
        ],
      }}
    />
  );
}
