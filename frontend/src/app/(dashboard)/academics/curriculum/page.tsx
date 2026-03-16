import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Curriculum Auditor",
  agentId: "academics-curriculum",
  badge: "unique",
  domain: "Academics",
  domainHref: "/academics",
  domainColor: "#06b6d4",
  tagline: "Know what exams actually test — before your students sit them.",
  description:
    "Analyses your syllabus against the last 5 years of university question papers. Identifies topics that are over-tested (high exam frequency, low syllabus weight) and under-taught (high syllabus weight, rare in exams). Outputs a curriculum heatmap for each subject.",
  stats: [
    { label: "Subjects Audited",  value: "87",   change: "Current semester" },
    { label: "Over-tested Topics","value": "23",   change: "Flagged" },
    { label: "Under-taught Topics","value": "31",  change: "Flagged" },
    { label: "Syllabus Coverage", value: "78%",   change: "vs exam coverage 91%" },
  ],
  pipeline: [
    { title: "Syllabus Ingested",    desc: "PDF syllabus uploaded and units/topics/credits extracted by Gemini." },
    { title: "QP Analysis",          desc: "Multi-year question paper archive parsed and topic frequency computed." },
    { title: "Gap Matrix Built",     desc: "2D matrix mapping syllabus weight against exam frequency trends." },
    { title: "Heatmap Generated",    desc: "Visual subject heatmap identifying danger zones and alignment." },
    { title: "HOD Report",           desc: "Department summary with revision recommendations for BOS consideration." },
  ],
  actions: [
    { label: "Audit Syllabus",    desc: "Run gap analysis against AICTE and industry norms" },
    { label: "NEP Compliance",    desc: "Check syllabus for NEP 2020 regulatory compliance" },
    { label: "Industry Alignment", desc: "Compare curriculum with current LinkedIn skill trends" },
    { label: "Generate Report",   desc: "Complete annual curriculum audit summary for depts" },
  ],
  activity: [
    { time: "3 hrs ago",  event: "Audit complete: Digital Electronics — 8 over-tested topics flagged", status: "error" },
    { time: "6 hrs ago",  event: "Heatmap shared with HOD ECE — BOS meeting scheduled", status: "success" },
    { time: "Yesterday",  event: "QP archive updated: 120 new papers added (Nov 2025)", status: "info" },
    { time: "2 days ago", event: "Under-taught alert: 'Power Electronics' flagged in exam trends", status: "error" },
    { time: "3 days ago", event: "Dept summary: CSE — 87% alignment (up from 71%)", status: "success" },
  ],
  capabilities: [
    "Gemini-powered syllabus and QP topic extraction",
    "5-year question paper frequency analysis",
    "Exam-frequency vs syllabus-weight gap matrix",
    "Visual heatmap per subject for faculty",
    "Department-level summary for HOD and BOS",
    "Recommended syllabus revision list",
    "Historical trend: alignment improvement year-over-year",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
