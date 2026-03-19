"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function ItSupportPage() {
  return (
    <OpsCrudPage
      title="IT Support"
      subtitle="Track incident triage, queue routing, and SLA state."
      endpoint="/api/ops/ai/it-support"
      listTitle="IT Tickets"
      createTitle="Create Ticket"
      fields={[
        { key: "ticket", label: "Ticket" },
        { key: "queue", label: "Queue" },
        { key: "severity", label: "Severity", type: "select", options: ["P1", "P2", "P3"] },
        { key: "responseMins", label: "Response (mins)", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved", "Escalated"] },
      ]}
      summary={[
        { label: "Tickets", kind: "count" },
        { label: "Open", kind: "countWhere", field: "status", equals: "Open" },
        { label: "Avg Response", kind: "avg", field: "responseMins", suffix: "m" },
      ]}
      statusKey="status"
      statusOptions={["Open", "In Progress", "Resolved", "Escalated"]}
      seedData={[
        { ticket: "Network outage in Block A", queue: "Infra", severity: "P2", responseMins: 8, status: "In Progress" },
        { ticket: "Laptop replacement request", queue: "Assets", severity: "P3", responseMins: 24, status: "Resolved" },
        { ticket: "Faculty VPN access issue", queue: "Access", severity: "P2", responseMins: 11, status: "Open" },
      ]}
      accentClass="bg-teal-600 hover:bg-teal-700"
    />
  );
}
