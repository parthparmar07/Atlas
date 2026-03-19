"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function PlacementResumePage() {
  return (
    <OpsCrudPage
      title="Resume Intelligence"
      subtitle="Track resume quality and ATS readiness across students."
      endpoint="/api/ops/placement/resume"
      listTitle="Resume Reviews"
      createTitle="Add Resume Review"
      fields={[
        { key: "student", label: "Student" },
        { key: "targetRole", label: "Target Role" },
        { key: "score", label: "Score", type: "number", min: 0, max: 100 },
        { key: "version", label: "Version" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Reviewed", "ATS Ready"] },
      ]}
      summary={[
        { label: "Resumes", kind: "count" },
        { label: "Average Score", kind: "avg", field: "score" },
        { label: "ATS Ready", kind: "countWhere", field: "status", equals: "ATS Ready" },
      ]}
      statusKey="status"
      statusOptions={["Draft", "Reviewed", "ATS Ready"]}
      seedData={[
        { student: "Karan Mehta", targetRole: "SDE", score: 78, version: "V3", status: "Reviewed" },
        { student: "Priya Nair", targetRole: "Product Analyst", score: 44, version: "V1", status: "Draft" },
        { student: "Divya Nair", targetRole: "Data Scientist", score: 86, version: "V2", status: "ATS Ready" },
      ]}
      accentClass="bg-emerald-600 hover:bg-emerald-700"
    />
  );
}
