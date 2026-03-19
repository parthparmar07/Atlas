"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function ResearchPublicationPage() {
  return (
    <OpsCrudPage
      title="Publication Ops"
      subtitle="Track manuscript readiness and reviewer cycles."
      endpoint="/api/ops/research/publication"
      listTitle="Publication Pipeline"
      createTitle="Add Manuscript"
      fields={[
        { key: "manuscript", label: "Manuscript" },
        { key: "journal", label: "Journal" },
        { key: "reviewCycleDays", label: "Review Cycle Days", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Submitted", "Revision", "Accepted"] },
      ]}
      summary={[
        { label: "Active Manuscripts", kind: "count" },
        { label: "Under Revision", kind: "countWhere", field: "status", equals: "Revision" },
        { label: "Avg Review Cycle", kind: "avg", field: "reviewCycleDays", suffix: "d" },
      ]}
      statusKey="status"
      statusOptions={["Draft", "Submitted", "Revision", "Accepted"]}
      seedData={[
        { manuscript: "Smart Grid Optimization", journal: "IEEE Access", reviewCycleDays: 29, status: "Revision" },
        { manuscript: "Nano Materials Synthesis", journal: "Elsevier Materials", reviewCycleDays: 41, status: "Submitted" },
        { manuscript: "Rural Health Analytics", journal: "Springer Health", reviewCycleDays: 12, status: "Accepted" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
