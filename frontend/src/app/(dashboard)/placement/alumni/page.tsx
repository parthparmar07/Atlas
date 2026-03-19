"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function PlacementAlumniPage() {
  return (
    <OpsCrudPage
      title="Alumni Network Agent"
      subtitle="Turn alumni into mentorship and referral pipelines."
      endpoint="/api/ops/placement/alumni"
      listTitle="Alumni Network"
      createTitle="Add Alumni Profile"
      fields={[
        { key: "alumniName", label: "Alumni Name" },
        { key: "batch", label: "Batch" },
        { key: "company", label: "Company" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status", type: "select", options: ["Tracked", "Mentor", "Referral Active"] },
      ]}
      summary={[
        { label: "Tracked Alumni", kind: "count" },
        { label: "Mentors", kind: "countWhere", field: "status", equals: "Mentor" },
        { label: "Referral Active", kind: "countWhere", field: "status", equals: "Referral Active" },
      ]}
      statusKey="status"
      statusOptions={["Tracked", "Mentor", "Referral Active"]}
      seedData={[
        { alumniName: "Rohan Das", batch: "2019", company: "Amazon", role: "SDE-2", status: "Referral Active" },
        { alumniName: "Anjali Rao", batch: "2020", company: "Microsoft", role: "Data Engineer", status: "Mentor" },
        { alumniName: "Karan Mehta", batch: "2018", company: "Infosys", role: "Lead Consultant", status: "Tracked" },
      ]}
      accentClass="bg-emerald-600 hover:bg-emerald-700"
    />
  );
}
