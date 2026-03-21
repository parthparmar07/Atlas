"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function HRAppraisalPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Appraisal Agent",
        agentId: "hr-appraisal",
        badge: "unique",
        domain: "HR & Faculty",
        domainHref: "/hr",
        domainColor: "#7c3aed",
        tagline: "Objective KPI synthesis with human-calibrated final decisions.",
        description:
          "Runs appraisal support with structured KPI summaries, performance band recommendations, and editable HOD-ready remarks while preserving confidentiality and decision governance.",
        stats: [
          { label: "Cycle Completion", value: "72%", change: "+12% in current window", up: true },
          { label: "Faculty Processed", value: "184", change: "Across 5 schools", up: true },
          { label: "Auto Draft Coverage", value: "91%", change: "Remarks generated" },
          { label: "Calibration Pending", value: "23", change: "Requires committee review" },
        ],
        pipeline: [
          { title: "KPI Intake", desc: "Collect teaching, research, attendance, and admin contribution metrics" },
          { title: "Score Normalization", desc: "Normalize cross-department KPI variance for fair comparison" },
          { title: "Band Recommendation", desc: "Suggest performance bands with evidence-based rationale" },
          { title: "Remarks Drafting", desc: "Generate HOD editable appraisal remarks per faculty member" },
          { title: "Review Handoff", desc: "Send final draft pack for confidential managerial approval" },
        ],
        actions: [
          { label: "Run Appraisal", desc: "Generate faculty-wise KPI summary and performance band suggestions" },
          { label: "Generate Report", desc: "Build departmental aggregate appraisal report" },
          { label: "Notify Faculty", desc: "Draft individual appraisal communication templates" },
        ],
        activity: [
          { time: "Now", event: "Appraisal bundle generated for current review cycle", status: "success" },
          { time: "9m ago", event: "Department-level merit matrix report exported", status: "success" },
          { time: "18m ago", event: "Two low-confidence recommendations flagged for manual calibration", status: "pending" },
          { time: "26m ago", event: "HOD remark drafts synced to workflow queue", status: "info" },
          { time: "1h ago", event: "Confidential appraisal packet access logged", status: "success" },
        ],
        capabilities: [
          "Structured KPI aggregation",
          "Performance band recommendation",
          "Evidence-based rationale generation",
          "HOD remarks drafting",
          "Department summary reporting",
          "Confidentiality-aware output boundaries",
          "Ops timeline persistence",
          "Action traceability",
        ],
      }}
    />
  );
}
