import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Scholarship Matcher",
  agentId: "admissions-scholarship",
  badge: "api",
  domain: "Admissions & Leads",
  domainHref: "/admissions",
  domainColor: "#f97316",
  tagline: "Tell every eligible student about every rupee they qualify for.",
  description:
    "Cross-references each applicant's profile against 200+ central, state, and private scholarship schemes. Generates a personalised eligibility report before the first counsellor call — turning scholarships into a conversion tool, not an afterthought.",
  stats: [
    { label: "Schemes Tracked",    value: "214",   change: "Updated monthly", up: true },
    { label: "Reports Generated",  value: "892",   change: "This admission cycle" },
    { label: "Avg Schemes/Student",value: "4.3",   change: "Students qualify for", up: true },
    { label: "₹ Unlocked",         value: "₹3.2Cr",change: "Est. for current batch", up: true },
  ],
  pipeline: [
    { title: "Profile Ingested", desc: "Caste, income, state, marks, gender, and disability data parsed." },
    { title: "Scheme Matching", desc: "Agent cross-references against 214 scheme eligibility criteria." },
    { title: "Eligibility Report", desc: "Ranked list of schemes with award value and deadlines." },
    { title: "Counsellor Briefing", desc: "Reports integrated directly into counsellor applicant cards." },
    { title: "Deadline Alerts", desc: "Agent alerts stakeholders for upcoming scheme deadlines." },
  ],
  actions: [
    { label: "Match Now",          desc: "Run scholarship matching engine on student pool" },
    { label: "Update Database",    desc: "Check for new government or private schemes" },
    { label: "Generate Letters",   desc: "Create recommendation letters for matched students" },
    { label: "Track Applications", desc: "Monitor status of active scholarship applications" },
  ],
  activity: [
    { time: "5 min ago",  event: "Matched Kavya Reddy — 7 schemes, highest award: ₹75,000", status: "success" },
    { time: "30 min ago", event: "PM Vidyalakshmi deadline alert sent to 43 eligible students", status: "info" },
    { time: "2 hrs ago",  event: "Scheme database updated: 3 new state schemes added", status: "info" },
    { time: "6 hrs ago",  event: "Batch report: 120 applicants matched, avg 3.8 schemes each", status: "success" },
    { time: "Yesterday",  event: "Report export: Admissions Director's overview PDF", status: "pending" },
  ],
  capabilities: [
    "214 central, state & private scheme database",
    "Real-time eligibility matching in < 1 second",
    "Multi-criteria: income, caste, gender, marks, state",
    "Personalised PDF eligibility report per applicant",
    "Counsellor applicant card integration",
    "Automatic deadline monitoring and alerts",
    "Monthly scheme database refresh from govt portals",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
