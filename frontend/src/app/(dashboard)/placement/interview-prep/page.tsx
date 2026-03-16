import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Interview Prep Agent",
  agentId: "placement-interview-prep",
  badge: "unique",
  domain: "Placement",
  domainHref: "/placement",
  domainColor: "#10b981",
  tagline: "Practice against the exact role you're targeting.",
  description:
    "A student uploads the target job description. The agent generates role-specific mock interview questions across technical, behavioural, and situational categories. The student answers in text or voice. The agent scores each answer with specific feedback.",
  stats: [
    { label: "Sessions Conducted",  value: "2.3K", change: "This semester", up: true },
    { label: "Avg Score Improvement","value":"31%",  change: "After 3 sessions", up: true },
    { label: "JDs Practiced On",    value: "847",  change: "Unique JDs" },
    { label: "Student Satisfaction","value":"4.7/5",change: "From session feedback" },
  ],
  pipeline: [
    { title: "JD Upload", desc: "Student uploads target role JD or pastes relevant job description text." },
    { title: "Question Generation", desc: "Gemini creates 20 role-specific questions: technical, behavioural, and situational." },
    { title: "Student Answers", desc: "Student provides text or voice answers in timed or open-ended sessions." },
    { title: "Scoring", desc: "Answers are scored on relevance and structure with specific improvement notes." },
    { title: "Session Report", desc: "PDF report generated with scores, ideal answers, and revision topics." },
  ],
  actions: [
    { label: "Generate Questions",  desc: "Create a custom question set for a specific student role" },
    { label: "Mock Interview",     desc: "Initiate a full-length simulated interview session" },
    { label: "Prep Roadmap",       desc: "Build a structured 14-day study plan for a company" },
    { label: "Company Profile",    desc: "Generate historical interview trends for a specific firm" },
  ],
  activity: [
    { time: "10 min ago",  event: "Aryan Kumar completed SDE2 AWS session — score 74/100", status: "success" },
    { time: "45 min ago",  event: "New JD onboarded: Google SWE L3 — questions generated", status: "info" },
    { time: "2 hrs ago",   event: "Batch session: 12 students practiced Goldman Sachs roles", status: "success" },
    { time: "Yesterday",   event: "Most-practiced role: Data Analyst — 340 sessions", status: "info" },
    { time: "2 days ago",  event: "Milestone: Divya Nair hit 90/100 on TCS Digital", status: "success" },
  ],
  capabilities: [
    "JD-specific question generation (not generic!)",
    "Technical, behavioural, and situational categories",
    "Text and voice answer modes",
    "Per-answer scoring with specific action items",
    "Session history and progress curve tracking",
    "Downloadable prep report with ideal answers",
    "Group/batch prep session for campus drives",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
