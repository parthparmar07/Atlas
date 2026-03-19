"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function ResearchGrantPage() {
  return (
    <OpsCrudPage
      title="Grant Tracker"
      subtitle="Track utilization, compliance, and deadline risks across grants."
      endpoint="/api/ops/research/grant"
      listTitle="Grant Portfolio"
      createTitle="Add Grant"
      fields={[
        { key: "grantCode", label: "Grant Code" },
        { key: "pi", label: "PI" },
        { key: "utilizationPct", label: "Utilization %", type: "number", min: 0, max: 100 },
        { key: "dueInDays", label: "Due In Days", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["On Track", "At Risk", "Overdue"] },
      ]}
      summary={[
        { label: "Active Grants", kind: "count" },
        { label: "Avg Utilization", kind: "avg", field: "utilizationPct", suffix: "%" },
        { label: "Overdue", kind: "countWhere", field: "status", equals: "Overdue" },
      ]}
      statusKey="status"
      statusOptions={["On Track", "At Risk", "Overdue"]}
      seedData={[
        { grantCode: "DST-2042", pi: "Dr. Raman", utilizationPct: 82, dueInDays: 7, status: "At Risk" },
        { grantCode: "BME-88", pi: "Dr. Fatima", utilizationPct: 54, dueInDays: 20, status: "On Track" },
        { grantCode: "AI-RG-19", pi: "Dr. Karthik", utilizationPct: 96, dueInDays: 0, status: "Overdue" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
