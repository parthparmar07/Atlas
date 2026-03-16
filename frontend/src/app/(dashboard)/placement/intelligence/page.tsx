import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Placement Intelligence",
  agentId: "placement-intelligence",
  badge: "hot",
  domain: "Placement",
  domainHref: "/placement",
  domainColor: "#10b981",
  tagline: "Your entire placement pipeline, running on autopilot.",
  description:
    "Scrapes job descriptions from 50+ companies weekly, maps required skills against your curriculum batch profiles, surfaces the exact skill gaps, and matches students to live openings with a compatibility score — so your placement officer sees ranked leads, not a pile of JDs.",
  stats: [
    { label: "JDs Scraped Weekly",  value: "340+", change: "Across 50 companies", up: true },
    { label: "Student Matches",     value: "1,847",change: "Active mappings" },
    { label: "Offers Facilitated",  value: "214",  change: "This placement season", up: true },
    { label: "Avg Match Score",     value: "72%",  change: "JD fit for placed students" },
  ],
  pipeline: [
    { title: "JD Scraping", desc: "Weekly scrape of company career pages and portals. New JDs auto-ingested." },
    { title: "Skill Extraction", desc: "Gemini identifies required skills, experience, and tech stack from each JD." },
    { title: "Gap Analysis", desc: "Batch profile vs JD requirements analysis showing strength and weakness areas." },
    { title: "Student Matching", desc: "Individual compatibility scoring surfaces top matches for every role." },
    { title: "Company Pipeline", desc: "Ranked student lists sent to HR for drive and interview scheduling." },
  ],
  actions: [
    { label: "Run Predictor",     desc: "Predict placement probability for the current student batch" },
    { label: "Match Companies",   desc: "Cross-reference students against visiting company profiles" },
    { label: "Outreach Calendar", desc: "Generate a strategic outreach schedule for target companies" },
    { label: "Generate Report",   desc: "Monthly placement analytics and hiring performance report" },
  ],
  activity: [
    { time: "2 hrs ago",   event: "347 JDs collected: TCS, Infosys, and 46 others this week", status: "success" },
    { time: "4 hrs ago",   event: "Skill gap alert: Python data wrangling missing in 60% of IT batch", status: "error" },
    { time: "Yesterday",   event: "Infosys match list sent: 42 students above 80% fit", status: "success" },
    { time: "2 days ago",  event: "Campus drive confirmed: Wipro — March 22", status: "info" },
    { time: "1 week ago",  event: "S7 batch profile updated — React and ML scores improved", status: "success" },
  ],
  capabilities: [
    "50+ company JD scraping on weekly schedule",
    "Gemini skill and requirement extraction from JDs",
    "Batch skill gap heatmap vs market demand",
    "Individual student-JD compatibility scoring",
    "Placement officer ranked student view per role",
    "Company visit and campus drive pipeline",
    "Semester-wise skill improvement tracking",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
