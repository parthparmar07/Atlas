import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Leave Manager",
  agentId: "hr-leave-manager",
  badge: "core",
  domain: "HR",
  domainHref: "/hr",
  domainColor: "#10b981",
  tagline: "Policy-aware leave and HR operations with workload sensitivity.",
  description:
    "Processes leave requests with policy checks, workload impact, appraisal context, and onboarding outputs in a single operations workflow.",
  stats: [
    { label: "Pending Requests", value: "36", change: "Current queue" },
    { label: "Auto-Resolved", value: "68%", change: "Within policy", up: true },
    { label: "Escalations", value: "7", change: "Requires HR officer" },
    { label: "Turnaround", value: "4.1h", change: "Median" },
  ],
  pipeline: [
    { title: "Policy Validation", desc: "Check balances, clauses, and leave type rules." },
    { title: "Impact Scan", desc: "Assess clashes with classes, invigilation, and duties." },
    { title: "Decision Draft", desc: "Generate approve/conditional/reject recommendation." },
    { title: "Notifications", desc: "Prepare HOD and employee communication text." },
  ],
  actions: [
    { label: "Process Leave Requests", desc: "Run leave decision workflow" },
    { label: "Analyse Faculty Load", desc: "Assess load before leave approval" },
    { label: "Run Appraisals", desc: "Generate KPI-aligned appraisal view" },
    { label: "Screen Recruitment", desc: "Apply qualification and fit scoring" },
    { label: "Generate Onboarding", desc: "Create onboarding checklists and drafts" },
    { label: "HR Policy Lookup", desc: "Answer policy query with rule context" },
  ],
  activity: [
    { time: "9 min ago", event: "Conditional approval drafted for exam-duty overlap", status: "pending" },
    { time: "34 min ago", event: "Department load balancing snapshot exported", status: "success" },
    { time: "2 hr ago", event: "Policy clause reference attached to appeal request", status: "info" },
  ],
  capabilities: [
    "Leave policy rule evaluation",
    "Duty clash analysis",
    "Decision recommendation drafting",
    "HR policy and onboarding support",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
