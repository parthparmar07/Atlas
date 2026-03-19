"use client";

import OpsCrudPage from "@/components/ops/OpsCrudPage";

export default function ResearchAssistantPage() {
  return (
    <OpsCrudPage
      title="Research Assistant"
      subtitle="Manage literature discovery and synthesis requests."
      endpoint="/api/ops/research/assistant"
      listTitle="Research Requests"
      createTitle="Add Research Request"
      fields={[
        { key: "topic", label: "Topic" },
        { key: "owner", label: "Owner" },
        { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High"] },
        { key: "turnaroundMins", label: "Turnaround (mins)", type: "number", min: 0 },
        { key: "status", label: "Status", type: "select", options: ["Queued", "In Progress", "Completed"] },
      ]}
      summary={[
        { label: "Requests", kind: "count" },
        { label: "Completed", kind: "countWhere", field: "status", equals: "Completed" },
        { label: "Avg Turnaround", kind: "avg", field: "turnaroundMins", suffix: "m" },
      ]}
      statusKey="status"
      statusOptions={["Queued", "In Progress", "Completed"]}
      seedData={[
        { topic: "Quantum-safe cryptography", owner: "Dr. Iyer", priority: "High", turnaroundMins: 5, status: "Completed" },
        { topic: "AI in precision agriculture", owner: "Civil Lab", priority: "Medium", turnaroundMins: 9, status: "In Progress" },
        { topic: "Battery recycling policy review", owner: "Dr. Kannan", priority: "Low", turnaroundMins: 0, status: "Queued" },
      ]}
      accentClass="bg-cyan-600 hover:bg-cyan-700"
    />
  );
}
