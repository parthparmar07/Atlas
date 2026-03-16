import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Internship Agent",
  agentId: "students-internships",
  badge: "core",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#f59e0b",
  tagline: "Matching the right skill to the right project, automatically.",
  description:
    "Sources internships from industry partners, matches students based on their technical skill profile and interest, tracks MOUs, and manages the end-to-end report submission pipeline between student, guide, and company mentor.",
  stats: [
    { label: "Partner MOUs",      value: "142",   change: "+12 this year", up: true },
    { label: "Active Interns",    value: "847",   change: "Last 12 months" },
    { label: "Completion Rate",   value: "91%",   change: "Report submitted", up: true },
    { label: "Full-time Offers",  value: "64",    change: "From internships", up: true },
  ],
  pipeline: [
    { title: "Partner Sourcing",  desc: "Agent monitors partner portals and scrapers for new internship openings." },
    { title: "Skill Match",         desc: "Matches student skill profile to opening requirements using AI." },
    { title: "MOU & Onboarding",   desc: "Auto-generates MOUs and tracks student joining with company partners." },
    { title: "Progress Tracker",   desc: "Monitors weekly log submissions and flags lagging students to guides." },
    { title: "Report & Viva",      desc: "Final report plagiarism check and completion viva scheduling." },
  ],
  actions: [
    { label: "Match Now",          desc: "Run matching algorithm for current eligible students" },
    { label: "Add Partner",       desc: "Onboard and register a new industry partner MOU" },
    { label: "Monthly Reports",   desc: "Generate internship progress and activity summaries" },
    { label: "Template Library",  desc: "Manage standard documents for intern management" },
  ],
  activity: [
    { time: "10 min ago",  event: "MOU signed: Microsoft Research — 5 internships added", status: "success" },
    { time: "1 hr ago",    event: "Match list: 22 students matched to Intel VLSI openings", status: "success" },
    { time: "Yesterday",   event: "Log alert: 14 students missed Week-4 log submission", status: "pending" },
    { time: "2 days ago",  event: "Report verified: Anuj Gupta (Google) — 0% plagiarism", status: "success" },
    { time: "3 days ago",  event: "New opening: Amazon Applied AI — SC/ST slots available", status: "info" },
  ],
  capabilities: [
    "Partner MOU lifecycle management",
    "Skill-based student matching algorithm",
    "Weekly progress log auto-collect and summarize",
    "Company mentor liaison automation",
    "Internship-to-PPO conversion tracking",
    "Plagiarism-checked report submission pipeline",
    "Batch-wise internship status analytics",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
