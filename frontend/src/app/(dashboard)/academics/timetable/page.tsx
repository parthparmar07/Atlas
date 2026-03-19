"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function AcademicsTimetablePage() {
  return (
    <OpsCrudPage
      title="Timetable AI"
      subtitle="Manage section schedules with clash-aware status updates."
      endpoint="/api/ops/academics/timetable"
      listTitle="Timetable Runs"
      createTitle="Add Timetable Run"
      fields={[
        { key: "program", label: "Program" },
        { key: "sections", label: "Sections", type: "number", min: 1 },
        { key: "generationMins", label: "Generation Mins", type: "number", min: 0, step: 0.1 },
        { key: "clashes", label: "Clashes", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Validated", "Published"] },
      ]}
      summary={[
        { label: "Runs", kind: "count" },
        { label: "Avg Generation", kind: "avg", field: "generationMins", suffix: "m" },
        { label: "Published", kind: "countWhere", field: "status", equals: "Published" },
      ]}
      statusKey="status"
      statusOptions={["Draft", "Validated", "Published"]}
      seedData={[
        { program: "S5 ECE", sections: 12, generationMins: 4.2, clashes: 0, status: "Published" },
        { program: "S3 CSE", sections: 18, generationMins: 5.1, clashes: 1, status: "Validated" },
        { program: "S1 Common", sections: 22, generationMins: 0, clashes: 0, status: "Draft" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
