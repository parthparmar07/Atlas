import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Timetable AI",
  agentId: "academics-timetable",
  badge: "hot",
  domain: "Academics",
  domainHref: "/academics",
  domainColor: "#06b6d4",
  tagline: "Clash-free timetables generated in minutes, not weeks.",
  description:
    "Uses OR-Tools constraint satisfaction solver augmented with Gemini natural language constraint input. Handles clash detection, faculty availability, room capacity, and lab requirements — then broadcasts the live schedule instantly via WebSocket.",
  stats: [
    { label: "Timetables Generated", value: "6",     change: "Current semester" },
    { label: "Clashes Detected",     value: "0",     change: "In current schedule", up: true },
    { label: "Generation Time",      value: "4.2 min",change: "For 180 sections" },
    { label: "Manual Swaps",         value: "3",     change: "This week" },
  ],
  pipeline: [
    { title: "Inputs Collected", desc: "Faculty load, room inventory, subject matrix, and lab requirements aggregated." },
    { title: "Constraint Building", desc: "Gemini translates natural language constraints into logical solver inputs." },
    { title: "CSP Solving", desc: "OR-Tools solves constraint satisfaction problem for an optimal schedule." },
    { title: "Clash Validation", desc: "Cross-validates room conflicts, faculty booking, and section overlaps." },
    { title: "Live Broadcast", desc: "Timetable pushed via WebSocket to student portals and display boards." },
  ],
  actions: [
    { label: "Generate Timetable", desc: "Run a fresh automated schedule generation" },
    { label: "Detect Clashes",     desc: "Scan current timetable for hidden scheduling conflicts" },
    { label: "Reschedule",        desc: "Modify a segment of the timetable for emergency needs" },
    { label: "Generate Report",   desc: "Room and faculty utilization efficiency audit" },
  ],
  activity: [
    { time: "2 hrs ago",  event: "S5 ECE timetable generated — 0 clashes, 4 constraints satisfied", status: "success" },
    { time: "4 hrs ago",  event: "NL constraint added: 'No back-to-back lectures for II year CSE'", status: "info" },
    { time: "Yesterday",  event: "Manual swap: Dr. Menon Thursday 9 AM ↔ Wednesday 2 PM", status: "success" },
    { time: "2 days ago", event: "Substitution Agent triggered — rescheduled Dr. Kumar's class", status: "info" },
    { time: "3 days ago", event: "Room capacity: Lab 3 expanded to 60 seats — rescheduled 2 batches", status: "info" },
  ],
  capabilities: [
    "OR-Tools CSP solver for provably optimal schedules",
    "Gemini natural language constraint input",
    "Room, faculty, and section clash detection",
    "Faculty load balancer integration (avoids overloads)",
    "Lab and specialised room requirement handling",
    "Live WebSocket timetable broadcast",
    "Manual swap interface with instant re-validation",
    "Holiday and exam board date awareness",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
