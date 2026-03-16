import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Resume Intelligence",
  agentId: "placement-resume",
  badge: "core",
  domain: "Placement",
  domainHref: "/placement",
  domainColor: "#10b981",
  tagline: "Every student's resume, optimized for ATS.",
  description:
    "Students upload their draft resumes. The agent scores them against industry standards and specific target roles, highlighting weak action verbs, missing keywords, and formatting errors. Provides line-by-line rewrite suggestions and tracks version improvement.",
  stats: [
    { label: "Resumes Scored",   value: "2.1K", change: "This placement cycle", up: true },
    { label: "Avg Score Jump",   value: "+22%", change: "From V1 to V3", up: true },
    { label: "ATS Passing",      value: "84%",  change: "Resumes above threshold" },
    { label: "Target Roles",     value: "41",   change: "Optimization maps" },
  ],
  pipeline: [
    { title: "Resume Upload", desc: "Text, sections, and layout structure extracted from PDF or DOCX uploads." },
    { title: "ATS Simulation", desc: "Checks parsability and flags layouts or fonts that break automated scanners." },
    { title: "Role Targeting", desc: "Identifies missing keywords by comparing content against 50+ real-world JDs." },
    { title: "Rewrite Engine", desc: "Suggests impact-driven alternatives for weak bullet points using context-aware AI." },
    { title: "Version History", desc: "Tracks student progress from initial draft to final placement-ready version." },
  ],
  actions: [
    { label: "Score Resumes",      desc: "Instant ATS scoring for selected student CVs" },
    { label: "Optimise Resume",    desc: "Rewrite weak sections for maximum role relevance" },
    { label: "Bulk Audit",         desc: "Run readiness check for the entire graduating batch" },
    { label: "JD Matcher",         desc: "Map resume content against a specific job description" },
  ],
  activity: [
    { time: "Just now",   event: "Karan Mehta uploaded V3 (SDE) — score improved from 42 to 78", status: "success" },
    { time: "15 min ago", event: "Priya Nair V1 flagged: ATS unreadable (complex format)", status: "error" },
    { time: "45 min ago", event: "Batch analysis: 24 students missing 'Agile' keyword for Product roles", status: "info" },
    { time: "2 hrs ago",  event: "Review queue: 4 final resumes approved by Placement Officer", status: "success" },
    { time: "Yesterday",  event: "Role dictionary updated for 'Data Scientist' — added LLM", status: "info" },
  ],
  capabilities: [
    "ATS parsability simulation (detects layout breaks)",
    "Target-role keyword matching (vs real market JDs)",
    "Impact-driven bullet point generation (STAR method)",
    "Grammar, spell check, and action-verb analysis",
    "Version control and progress tracking per student",
    "Batch readiness dashboard for placement team",
    "Exportable PDF feedback reports",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
