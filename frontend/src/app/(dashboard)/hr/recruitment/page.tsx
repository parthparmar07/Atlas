import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Recruitment Pipeline",
  agentId: "hr-recruitment",
  badge: "api",
  domain: "HR & Faculty",
  domainHref: "/hr",
  domainColor: "#8b5cf6",
  tagline: "Faculty hiring runs itself — from posting to shortlist to interview.",
  description:
    "Posts faculty and staff openings to job boards, screens incoming CVs against role requirements, scores candidates, and auto-schedules interviews with shortlisted applicants — reducing time-to-hire from weeks to days.",
  stats: [
    { label: "Active Positions",  value: "12",  change: "Open roles" },
    { label: "CVs Screened",      value: "347", change: "Last 60 days", up: true },
    { label: "Shortlisted",       value: "28",  change: "Pending interviews" },
    { label: "Avg Time-to-Hire",  value: "11d", change: "vs 34d manual", up: true },
  ],
  pipeline: [
    { title: "Job Posted", desc: "Roles published to LinkedIn, Naukri, and internal portals simultaneously." },
    { title: "CVs Collected", desc: "Applications funnelled into a central pipeline regardless of source." },
    { title: "AI Screening", desc: "Gemini scores CVs against JD: qualifications, experience, and publications." },
    { title: "Interview Scheduled", desc: "Shortlisted candidates receive automated invites and panel details." },
    { title: "Offer & Onboarding", desc: "Candidate data passed to HR Bot for appointment letters and onboarding." },
  ],
  actions: [
    { label: "Post Job",          desc: "Draft and publish new faculty or staff openings" },
    { label: "Screen CVs",        desc: "Simulate candidate screening and ranking" },
    { label: "Schedule Interviews", desc: "Generate interview panel schedules automatically" },
    { label: "Generate Offer",    desc: "Create official employment offer letters" },
  ],
  activity: [
    { time: "1 hr ago",   event: "8 new applications: Asst. Professor (CS) — 3 shortlisted", status: "success" },
    { time: "3 hrs ago",  event: "Interview scheduled: Dr. Anjali Rao — March 20, 10 AM", status: "info" },
    { time: "Yesterday",  event: "Offer letter sent: Mr. Vivek Kumar — Onboarding initiated", status: "success" },
    { time: "2 days ago", event: "Role posted: Lab Technician (Chemistry) — 5 boards linked", status: "info" },
    { time: "3 days ago", event: "Reminder sent: 4 candidates — confirmation pending", status: "pending" },
  ],
  capabilities: [
    "Multi-board posting from a single form",
    "AI CV scoring against structured JD criteria",
    "Faculty-specific scoring: publications, qualifications",
    "Calendar-aware automatic interview scheduling",
    "Panel availability conflict detection",
    "Automated candidate communications",
    "HR Bot handoff for offer and onboarding",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
