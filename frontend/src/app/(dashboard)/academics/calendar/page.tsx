import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Calendar Generator",
  agentId: "academics-calendar",
  badge: "core",
  domain: "Academics",
  domainHref: "/academics",
  domainColor: "#06b6d4",
  tagline: "One source of truth for every date in the academic year.",
  description:
    "Takes exam board dates, university holiday notifications, credit requirements, and internal event schedules — then outputs a complete, constraint-validated academic calendar distributed to all stakeholders automatically.",
  stats: [
    { label: "Events Scheduled", value: "247",  change: "This academic year" },
    { label: "Conflicts Resolved","value": "12",  change: "Auto-resolved" },
    { label: "Stakeholders Notified","value": "3.4K",change: "On last publish" },
    { label: "Calendar Updates", value: "8",    change: "This semester" },
  ],
  pipeline: [
    { title: "Inputs Gathered",     desc: "Exam dates, state holidays, and internal deadlines aggregated." },
    { title: "Constraint Validation",desc: "Checks minimum instructional days and holiday/exam gap requirements." },
    { title: "Calendar Built",       desc: "Generates full year view: classes, exams, events, and holidays." },
    { title: "Authority Approval",   desc: "Draft sent for official sign-off with one-click revision tracking." },
    { title: "Mass Distribution",    desc: "Published simultaneously to all portals and display boards." },
  ],
  actions: [
    { label: "Generate Calendar", desc: "Build full academic calendar for the new session" },
    { label: "Add Event",         desc: "Insert new institutional event with conflict check" },
    { label: "Holiday Mapping",   desc: "Cross-reference state holidays with academic schedule" },
    { label: "Export Calendar",   desc: "Generate formatted PDF/Excel document for distribution" },
  ],
  activity: [
    { time: "1 day ago",  event: "S6 even semester calendar published — 247 events", status: "success" },
    { time: "3 days ago", event: "University circular: 2 new public holidays added — schedule updated", status: "info" },
    { time: "1 week ago", event: "Internal exam schedule integrated — 14 new events added", status: "info" },
    { time: "2 weeks ago","event": "Conflict resolved: Sports day vs Internal II — rescheduled", status: "success" },
    { time: "1 month ago","event": "Annual academic calendar approved by Principal", status: "success" },
  ],
  capabilities: [
    "Multi-source input: board dates, holidays, internals",
    "Minimum instructional day compliance validation",
    "Holiday conflict auto-detection and resolution",
    "Principal / authority approval workflow",
    "Simultaneous publish to all stakeholder portals",
    "Notification broadcast to 3000+ stakeholders",
    "Mid-year revision tracking with changelog",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
