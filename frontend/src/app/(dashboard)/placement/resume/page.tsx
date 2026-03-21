"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function PlacementResumePage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Resume Review",
        agentId: "placement-resume",
        badge: "api",
        domain: "Placement",
        domainHref: "/placement",
        domainColor: "#059669",
        tagline: "Upgrade resumes from generic drafts to role-winning profiles.",
        description:
          "Runs ATS scoring, keyword gap checks, bulk resume audits, and JD-level matching to produce recruiter-ready recommendations with measurable deltas.",
        stats: [
          { label: "Resumes Audited", value: "1,264", change: "This cycle" },
          { label: "ATS Ready", value: "72%", change: "+11 pts after optimization", up: true },
          { label: "Critical Gaps", value: "209", change: "Low keyword coverage", up: false },
          { label: "Avg Rewrite Gain", value: "+14", change: "Score increase", up: true },
        ],
        pipeline: [
          { title: "Profile Capture", desc: "Collect role and resume summary" },
          { title: "ATS Scan", desc: "Compute structure and keyword score" },
          { title: "Gap Detection", desc: "Identify missing evidence and weak bullets" },
          { title: "Optimization", desc: "Generate rewrite and impact suggestions" },
          { title: "Export", desc: "Store review artifacts and status" },
        ],
        actions: [
          { label: "Score Resumes", desc: "Generate ATS score and weakness signals" },
          { label: "Optimise Resume", desc: "Build role-specific rewrite guidance" },
          { label: "Bulk Audit", desc: "Evaluate cohort-wide resume readiness" },
          { label: "JD Matcher", desc: "Check resume against target JD keywords" },
        ],
        activity: [
          { time: "Now", event: "ATS scan completed for 32 resumes", status: "success" },
          { time: "10m ago", event: "Bulk audit flagged 9 high-risk profiles", status: "pending" },
          { time: "24m ago", event: "Optimization pack published for analyst roles", status: "success" },
          { time: "39m ago", event: "JD matcher run completed for product roles", status: "info" },
          { time: "1h ago", event: "Resume quality trend synced to placement ops", status: "success" },
        ],
        capabilities: [
          "ATS scoring",
          "Keyword gap analysis",
          "Resume optimization",
          "Bulk quality audits",
          "JD relevance checks",
          "Traceable execution",
          "Ops persistence",
          "Readiness status tracking",
        ],
      }}
    />
  );
}
