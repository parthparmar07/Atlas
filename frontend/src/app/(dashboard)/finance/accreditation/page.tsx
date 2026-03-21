"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function FinanceAccreditationPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Accreditation",
        agentId: "finance-accreditation",
        badge: "unique",
        domain: "Finance & Governance",
        domainHref: "/finance",
        domainColor: "#b91c1c",
        tagline: "Track readiness evidence before accreditation gaps become audit risks.",
        description:
          "Assesses NAAC/NBA/NIRF criterion readiness, builds documentation packs, and generates audit-grade compliance reports with measurable gap visibility.",
        stats: [
          { label: "Criteria Tracked", value: "86", change: "Across frameworks" },
          { label: "Met Criteria", value: "58", change: "67.4% readiness", up: true },
          { label: "At-Risk Criteria", value: "19", change: "Needs evidence closure", up: false },
          { label: "Missing Evidence", value: "9", change: "Immediate action items", up: false },
        ],
        pipeline: [
          { title: "Criterion Intake", desc: "Collect criterion score and evidence count" },
          { title: "Compliance Audit", desc: "Evaluate status by framework requirement" },
          { title: "Document Build", desc: "Generate criterion-wise evidence checklist" },
          { title: "Readiness Scoring", desc: "Compute compliance and risk coverage" },
          { title: "Audit Report", desc: "Prepare review-ready accreditation packet" },
        ],
        actions: [
          { label: "Audit Compliance", desc: "Assess criteria status and priority gaps" },
          { label: "Prepare Documentation", desc: "Generate documentation readiness pack" },
          { label: "Generate Report", desc: "Produce consolidated readiness report" },
        ],
        activity: [
          { time: "Now", event: "Compliance audit completed for NAAC cycle", status: "success" },
          { time: "10m ago", event: "Evidence checklist created for 12 at-risk criteria", status: "pending" },
          { time: "25m ago", event: "Accreditation report draft generated", status: "success" },
          { time: "44m ago", event: "Criterion score variance flagged", status: "info" },
          { time: "1h ago", event: "Framework sync completed", status: "success" },
        ],
        capabilities: [
          "Criterion compliance audit",
          "Evidence gap mapping",
          "Documentation planning",
          "Readiness scoring",
          "Framework reporting",
          "Audit trace capture",
          "Ops logging",
          "Priority action routing",
        ],
      }}
    />
  );
}
