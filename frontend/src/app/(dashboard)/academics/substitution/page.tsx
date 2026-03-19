"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function AcademicsSubstitutionPage() {
  return (
    <OpsCrudPage
      title="Substitution Agent"
      subtitle="Resolve faculty substitutions before class hour starts."
      endpoint="/api/ops/academics/substitution"
      listTitle="Substitution Queue"
      createTitle="Create Substitution"
      fields={[
        { key: "subject", label: "Subject" },
        { key: "absentFaculty", label: "Absent Faculty" },
        { key: "substituteFaculty", label: "Substitute Faculty" },
        { key: "slot", label: "Slot" },
        { key: "status", label: "Status", type: "select", options: ["Requested", "Approved", "Completed", "Failed"] },
      ]}
      summary={[
        { label: "Requests", kind: "count" },
        { label: "Completed", kind: "countWhere", field: "status", equals: "Completed" },
        { label: "Failed", kind: "countWhere", field: "status", equals: "Failed" },
      ]}
      statusKey="status"
      statusOptions={["Requested", "Approved", "Completed", "Failed"]}
      seedData={[
        { subject: "Physics", absentFaculty: "Dr. Reddy", substituteFaculty: "Mr. Rao", slot: "Mon 10:00", status: "Completed" },
        { subject: "Advanced VLSI", absentFaculty: "Dr. Menon", substituteFaculty: "", slot: "Tue 08:00", status: "Failed" },
        { subject: "Machine Learning", absentFaculty: "Dr. Krishnan", substituteFaculty: "Ms. Nair", slot: "Wed 14:00", status: "Approved" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
