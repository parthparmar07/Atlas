import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Exam Scheduler",
  agentId: "academics-exams",
  badge: "core",
  domain: "Academics",
  domainHref: "/academics",
  domainColor: "#0ea5e9",
  tagline: "Generate clash-safe examination plans with auditable schedule logic.",
  description:
    "Builds and optimizes exam schedules with hall and conflict constraints, then reports adjustment deltas and utilization signals for exam operations teams.",
  stats: [
    { label: "Exam Slots", value: "184", change: "Current cycle" },
    { label: "Clash Rate", value: "0.8%", change: "After optimization", up: true },
    { label: "Hall Utilization", value: "87%", change: "Average" },
    { label: "Reschedules", value: "11", change: "Controller-approved" },
  ],
  pipeline: [
    { title: "Input Constraints", desc: "Ingest courses, halls, batches, and blackout dates." },
    { title: "Initial Allocation", desc: "Generate first pass timetable with capacity checks." },
    { title: "Conflict Audit", desc: "Detect clashes across student, faculty, and room dimensions." },
    { title: "Optimization", desc: "Balance load while preserving hard constraints." },
    { title: "Publication Pack", desc: "Output schedule, clash report, and audit trail." },
  ],
  actions: [
    { label: "Schedule Exams", desc: "Generate initial exam schedule" },
    { label: "Check for Clashes", desc: "Audit schedule for conflict hotspots" },
    { label: "Optimize Schedule", desc: "Optimize load and hall utilization" },
  ],
  activity: [
    { time: "5 min ago", event: "End-semester draft schedule generated", status: "success" },
    { time: "22 min ago", event: "Conflict detected in CSE-6 and ECE-4 shared slot", status: "pending" },
    { time: "1 hr ago", event: "Hall reallocation recommendation published", status: "info" },
  ],
  capabilities: [
    "Student and room clash detection",
    "Capacity-constrained hall assignment",
    "Schedule optimization with hard constraints",
    "Delta report for published revisions",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
