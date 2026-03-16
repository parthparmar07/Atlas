import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Admissions Intelligence",
  agentId: "admissions-intelligence",
  badge: "hot",
  domain: "Admissions & Leads",
  domainHref: "/admissions",
  domainColor: "#f97316",
  tagline: "From raw lead to ranked applicant — in seconds, not days.",
  description:
    "Captures leads from every source, parses uploaded resumes and mark sheets, scores each applicant on academic fit, programme demand, and location profile, then surfaces a ranked counsellor dashboard so your team sees the best candidates first.",
  stats: [
    { label: "Applications Processed", value: "1,247", change: "23% this month", up: true },
    { label: "Avg Score Time",          value: "8s",    change: "vs 4 hrs manual", up: true },
    { label: "Conversion Rate",         value: "34%",   change: "from lead to enrol" },
    { label: "Pending Review",          value: "41",    change: "Awaiting counsellor" },
  ],
  pipeline: [
    { title: "Lead Captured",         desc: "Form submission, API, or CSV upload. Source tagged automatically." },
    { title: "Document Parse",        desc: "Gemini reads mark sheets, certs. Extracts CGPA, board, subject scores in seconds." },
    { title: "Fit Scoring",           desc: "Multi-factor score: academic strength x programme demand x location weight x recency." },
    { title: "Counsellor Dashboard",  desc: "Ranked list with per-applicant context card. Phone, email, best call time." },
    { title: "Trigger Nurture",       desc: "Passes qualified leads to Lead Nurture Agent for drip sequence automatically." },
  ],
  actions: [
    { label: "Run Scoring",       desc: "Score latest batch of applicants using Gemini" },
    { label: "Detect Fraud",      desc: "Analyse pool for document fraud patterns" },
    { label: "Generate Report",   desc: "Weekly admissions intelligence summary" },
    { label: "Rank Applicants",   desc: "Produce ranked shortlist by composite score" },
  ],
  activity: [
    { time: "2 min ago",  event: "Scored 12 new applicants from Indore region — avg score 74/100", status: "success" },
    { time: "18 min ago", event: "Flagged: Rahul Sharma (CGPA 9.1) — top 5% match for B.Tech CSE", status: "info" },
    { time: "1 hr ago",   event: "Bulk import: 87 leads from IndiaMart campaign processed", status: "success" },
    { time: "3 hrs ago",  event: "Score model retrained with last 30-day enrolment outcomes", status: "info" },
    { time: "Yesterday",  event: "Exported 240 pending apps to counsellor review queue", status: "pending" },
  ],
  capabilities: [
    "Multi-source lead ingestion (forms, APIs, CSV)",
    "Gemini-powered document parsing — zero manual data entry",
    "Composite academic fit score (0–100)",
    "Programme-wise demand heatmap by location",
    "One-click handoff to Lead Nurture cascade",
    "Counsellor ranked dashboard with filters",
    "Duplicate detection and lead deduplication",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
