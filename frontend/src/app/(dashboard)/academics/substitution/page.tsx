import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Substitution Agent",
  agentId: "academics-substitution",
  badge: "core",
  domain: "Academics",
  domainHref: "/academics",
  domainColor: "#06b6d4",
  tagline: "No class left uncovered — substitute found in under 2 minutes.",
  description:
    "When faculty mark themselves absent, the agent immediately scans for available substitutes with the relevant subject expertise, notifies the HOD, and sends the substitute and students a consolidated alert — all resolved before the class hour begins.",
  stats: [
    { label: "Substitutions Arranged", value: "312",  change: "This semester", up: true },
    { label: "Avg Find Time",          value: "1m 48s",change: "Sub found in" },
    { label: "No-Sub Instances",       value: "4",    change: "Only 1.3% failure rate" },
    { label: "Classes Covered",        value: "99%",  change: "Coverage rate", up: true },
  ],
  pipeline: [
    { title: "Absence Marked",     desc: "Faculty reporting via portal. Class details extracted from live timetable." },
    { title: "Substitute Search",  desc: "Agent scans free slots, subject expertise, and department compatibility." },
    { title: "HOD Notification",   desc: "HOD alerted with ranked substitute list for one-tap approval." },
    { title: "Sub Confirmed",       desc: "Substitute receives instant notification with venue and topic details." },
    { title: "Students Notified",  desc: "Class batch alerted of the new faculty name and room changes." },
  ],
  actions: [
    { label: "Find Substitute",     desc: "Find best available cover for an absent faculty member" },
    { label: "Auto Notify",        desc: "Draft and send substitution alerts to all stakeholders" },
    { label: "Weekly Summary",     desc: "Audit report of substitution activity and response times" },
    { label: "Build Coverage Pool", desc: "Define priority substitution groups by department" },
  ],
  activity: [
    { time: "20 min ago", event: "Dr. Reddy absent (Physics) — Mr. Rao confirmed as substitute", status: "success" },
    { time: "1 hr ago",   event: "Students notified: Physics class at Lab 2 with Mr. Rao", status: "info" },
    { time: "3 hrs ago",  event: "HOD approved: 2 substitutions for tomorrow morning", status: "success" },
    { time: "Yesterday",  event: "No sub found: Advanced VLSI (8 AM) — class cancelled", status: "error" },
    { time: "2 days ago", event: "28 substitutions arranged this week — 100% coverage", status: "success" },
  ],
  capabilities: [
    "Timetable-aware faculty free slot detection",
    "Subject expertise matrix matching",
    "One-tap HOD approval flow",
    "WhatsApp + app notification to substitute",
    "Student batch alert with venue and faculty name",
    "Substitution load tracking (prevents sub overuse)",
    "Full substitution log for payroll computation",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
