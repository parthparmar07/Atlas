import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Appraisal Agent",
  agentId: "hr-appraisal",
  badge: "unique",
  domain: "HR & Faculty",
  domainHref: "/hr",
  domainColor: "#8b5cf6",
  tagline: "Annual KPI reports generated from data, not paperwork.",
  description:
    "Auto-aggregates research publications, student feedback scores, attendance punctuality, and committee contribution into a structured annual KPI report for every faculty member — saving weeks of manual compilation and eliminating bias from self-declaration.",
  stats: [
    { label: "Faculty Appraised",   value: "184",   change: "Current cycle" },
    { label: "Data Sources",        value: "6",     change: "Auto-aggregated" },
    { label: "Avg KPI Score",       value: "74.3",  change: "+2.1 YoY", up: true },
    { label: "Reports Generated",   value: "184",   change: "0 manual hours", up: true },
  ],
  pipeline: [
    { title: "Research Pull",     desc: "Scrapes Scopus and Google Scholar for faculty publications and h-index." },
    { title: "Feedback Scores",   desc: "Anonymized averages pulled from student semester surveys." },
    { title: "Attendance Data",   desc: "Biometric and timetable compliance metrics recorded." },
    { title: "Committee Work",    desc: "Administrative contributions fetched from Load Balancer agent." },
    { title: "KPI Report Draft",  desc: "Gemini drafts a narrative summary for HR and faculty review." },
  ],
  actions: [
    { label: "Run Appraisal",      desc: "Run annual KPI appraisal for a faculty batch" },
    { label: "Generate Letters",   desc: "Create professional appraisal result letters" },
    { label: "Benchmark Salaries", desc: "Compare faculty salaries against market standards" },
    { label: "Predict Attrition",  desc: "Identify staff at risk of leaving based on data" },
  ],
  activity: [
    { time: "2 hrs ago",  event: "Appraisal report generated: Dr. Sharma — Score 82/100, 3 publications found", status: "success" },
    { time: "5 hrs ago",  event: "Research pull complete: 47 new publications found across faculty", status: "info" },
    { time: "Yesterday",  event: "Feedback sync: S5 semester scores aggregated for all faculty", status: "success" },
    { time: "2 days ago", event: "HR note: KPI weights updated — research weight now 30%", status: "info" },
    { time: "3 days ago", event: "Batch appraisal initiated: 2025-26 annual cycle started", status: "info" },
  ],
  capabilities: [
    "Automated research publication scraping (Scopus, Scholar)",
    "Anonymous student feedback aggregation",
    "Biometric attendance punctuality analysis",
    "Committee and admin contribution tracking",
    "Gemini narrative summary generation",
    "Department and individual trend year-over-year",
    "One-click report distribution to faculty and HR",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
