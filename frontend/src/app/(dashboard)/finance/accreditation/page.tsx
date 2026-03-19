"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function FinanceAccreditationPage() {
  return (
    <OpsCrudPage
      title="Accreditation Agent"
      subtitle="Track NAAC/NBA/NIRF readiness with evidence and gap status."
      endpoint="/api/ops/finance/accreditation"
      listTitle="Accreditation Criteria"
      createTitle="Add Criterion"
      fields={[
        { key: "criterion", label: "Criterion" },
        { key: "score", label: "Score", type: "number", min: 0, max: 5, step: 0.01 },
        { key: "evidenceCount", label: "Evidence Count", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["Met", "At Risk", "Missing"] },
      ]}
      summary={[
        { label: "Criteria", kind: "count" },
        { label: "Avg Score", kind: "avg", field: "score" },
        { label: "Missing", kind: "countWhere", field: "status", equals: "Missing" },
      ]}
      statusKey="status"
      statusOptions={["Met", "At Risk", "Missing"]}
      seedData={[
        { criterion: "NAAC 3.4.3", score: 2.9, evidenceCount: 6, status: "At Risk" },
        { criterion: "NBA Outcome Metrics", score: 3.6, evidenceCount: 14, status: "Met" },
        { criterion: "NIRF Outreach", score: 0.0, evidenceCount: 1, status: "Missing" },
      ]}
      accentClass="bg-rose-600 hover:bg-rose-700"
    />
  );
}
