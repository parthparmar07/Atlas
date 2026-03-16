import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Project Tracker",
  agentId: "students-projects",
  badge: "hot",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#f59e0b",
  tagline: "Guide students from synopsis to submission — with zero manual follow-ups.",
  description:
    "Automates the entire final year project lifecycle. Sets milestone checkpoints, runs similarity checks on synopses, and generates submission packages automatically. Nudges guides when students stall and provides a Kanban bird's-eye view for coordinators.",
  stats: [
    { label: "Active Projects",   value: "412",   change: "2024-25 Batch" },
    { label: "Milestones Hit",    value: "84%",   change: "On-time completions", up: true },
    { label: "Nudges Sent",       value: "1.2K",  change: "Auto-generated", up: true },
    { label: "Risk Flags",        value: "24",    change: "Requiring attention" },
  ],
  pipeline: [
    { title: "Project Registration", desc: "Student records title, guide, and team for lifecycle tracking." },
    { title: "Similarity Check", desc: "Synopsis verified against historical projects and online repositories." },
    { title: "Milestone Tracking", desc: "Automated progress tracking from synopsis through final review." },
    { title: "Guide Nudge", desc: "Agent identifies stalled interactions and pings faculty for updates." },
    { title: "Auto-Package", desc: "Generates plagiarism reports and certificates for the final submission." },
  ],
  actions: [
    { label: "Track Projects",    desc: "Generate current semester project status summary" },
    { label: "Flag Delays",       desc: "Identify projects missing critical milestone deadlines" },
    { label: "Synopsis Review",   desc: "Perform automated review of new project proposals" },
    { label: "Generate Report",   desc: "Export project progress audit for examination cell" },
  ],
  activity: [
    { time: "5 min ago",  event: "Milestone hit: Team 42 submitted — Plagiarism check: 8% (Pass)", status: "success" },
    { time: "20 min ago", event: "Auto-nudge sent: Dr. Gupta — no update for 14 days", status: "pending" },
    { time: "1 hr ago",   event: "Project registered: 'Blockchain for Credentialing'", status: "success" },
    { time: "Yesterday",  event: "Risk alert: 12 teams in CSE have missed Review 1", status: "error" },
    { time: "2 days ago", event: "Submission package generated for Team 01 (Mechanical)", status: "success" },
  ],
  capabilities: [
    "End-to-end milestone lifecycle management",
    "Automated similarity check (synopsis & report)",
    "Non-spammy automated guide & student nudges",
    "Kanban dashboard for branch coordinators",
    "Automated submission document generation",
    "Faculty-student interaction log tracking",
    "Similarity-aware project title rejection",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
