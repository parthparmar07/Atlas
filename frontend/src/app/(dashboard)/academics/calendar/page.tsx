"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function AcademicsCalendarPage() {
  return (
    <OpsCrudPage
      title="Calendar Generator"
      subtitle="Maintain a conflict-free institutional academic calendar."
      endpoint="/api/ops/academics/calendar"
      listTitle="Academic Calendar Events"
      createTitle="Add Calendar Event"
      fields={[
        { key: "event", label: "Event" },
        { key: "date", label: "Date", type: "date" },
        { key: "owner", label: "Owner" },
        { key: "status", label: "Status", type: "select", options: ["Draft", "Approved", "Published"] },
      ]}
      summary={[
        { label: "Events", kind: "count" },
        { label: "Published", kind: "countWhere", field: "status", equals: "Published" },
        { label: "Approved", kind: "countWhere", field: "status", equals: "Approved" },
      ]}
      statusKey="status"
      statusOptions={["Draft", "Approved", "Published"]}
      seedData={[
        { event: "Internal II Exams", date: "2026-04-08", owner: "Controller Office", status: "Approved" },
        { event: "Sports Day", date: "2026-03-28", owner: "Student Affairs", status: "Published" },
        { event: "Semester Orientation", date: "2026-06-15", owner: "Academic Cell", status: "Draft" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
