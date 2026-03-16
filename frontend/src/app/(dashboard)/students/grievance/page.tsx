import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Grievance Agent",
  agentId: "students-grievance",
  badge: "core",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#f59e0b",
  tagline: "Anonymous reporting, transparent resolution, zero lost complaints.",
  description:
    "A secure portal for anonymous and named complaints. Categorises grievances, routes them to the right authority, monitors resolution SLAs, and auto-escalates to the principal's office if timelines are breached.",
  stats: [
    { label: "Grievances Logged", value: "87",    change: "Last 60 days" },
    { label: "Avg Resolution",    value: "4.2 days",change: "-2 days from avg", up: true },
    { label: "Resolved Promptly", value: "94%",   change: "Within SLA", up: true },
    { label: "Escalated to Boss", value: "2",     change: "Current month", up: false },
  ],
  pipeline: [
    { title: "Grievance Logged",   desc: "Student submits issue via portal. Anonymity preserved where requested." },
    { title: "Categorization",    desc: "Gemini classifies: Academic, Infrastructure, Hostel, Harassment, or Finance." },
    { title: "Routing",             desc: "Issue routed to correct HOD or Registrar and unique Tracker ID issued." },
    { title: "SLA Monitoring",      desc: "Agent monitors resolution time with 24hr priority for critical categories." },
    { title: "Auto-Escalation",     desc: "Complaints escalated to higher committees automatically if SLA breached." },
  ],
  actions: [
    { label: "Process Grievances",  desc: "Categorize and route the latest batch of student complaints" },
    { label: "Escalation Report",   desc: "Identify complaints that have exceeded their resolution SLA" },
    { label: "Anonymise Report",    desc: "Generate high-level trend reports while protecting privacy" },
    { label: "SLA Dashboard",       desc: "Audit departmental performance on grievance resolution" },
  ],
  activity: [
    { time: "Just now",   event: "Grievance #892 (AC Repair) routed to Facilities — 48hr SLA", status: "success" },
    { time: "2 hrs ago",  event: "Resolved: #871 (Library fine dispute) — adjustment approved", status: "success" },
    { time: "Yesterday",  event: "Escalation: #865 (Warden response) — escalated to Registrar", status: "error" },
    { time: "2 days ago", event: "Category shift: Academic complaints increased 20% during internals", status: "info" },
    { time: "3 days ago", event: "Anonymous feedback: Canteen pricing — routed to committee", status: "pending" },
  ],
  capabilities: [
    "Full anonymity protection for whistleblowers",
    "AI category and priority classification",
    "Department-specific routing logic",
    "Time-bound SLA monitoring per category",
    "Automatic hierarchical escalation on breach",
    "Student tracking portal with status updates",
    "Departmental performance analytics (Resolution Rate)",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
