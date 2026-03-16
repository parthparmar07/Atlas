import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "HR Operations Bot",
  agentId: "hr-bot",
  badge: "core",
  domain: "HR & Faculty",
  domainHref: "/hr",
  domainColor: "#8b5cf6",
  tagline: "HR queries resolved in seconds, not email threads.",
  description:
    "A conversational HR assistant available to all staff via chat. Handles leave applications and approvals through the HOD chain, answers any HR policy question from the service rulebook, and lets staff download payslips or file tax declarations — all without opening a form.",
  stats: [
    { label: "Queries Resolved",  value: "2.1K", change: "Last 30 days", up: true },
    { label: "Leave Requests",    value: "147",  change: "This month" },
    { label: "Avg Resolution",    value: "42s",  change: "vs 2.3 hrs email" },
    { label: "Policy Questions",  value: "890",  change: "Answered automatically", up: true },
  ],
  pipeline: [
    { title: "Staff Query Ingested", desc: "Staff requests leave, policy info, or payroll self-service via chat." },
    { title: "Intent Classification", desc: "Gemini identifies the specific HR workflow required immediately." },
    { title: "Action Execution", desc: "Generates requests, retrieves policy docs, or fetches payroll links." },
    { title: "Approval Routing", desc: "Notifies relevant HODs or administrators for one-click approval." },
    { title: "Record Keeping", desc: "Transactions logged to HR master and balances updated in real-time." },
  ],
  actions: [
    { label: "Process Leaves",     desc: "Approve or reject pending leave requests" },
    { label: "Draft Notice",      desc: "Create official HR circulars or staff notices" },
    { label: "Payroll Summary",   desc: "Generate monthly payroll and deduction reports" },
    { label: "Onboarding Checklist", desc: "Create task lists for new faculty/staff joinees" },
  ],
  activity: [
    { time: "3 min ago",  event: "Faculty Sharma applied EL — HOD Dr. Mehta notified for approval", status: "pending" },
    { time: "15 min ago", event: "Policy query answered: 'Paternity leave entitlement'", status: "success" },
    { time: "1 hr ago",   event: "Bulk payslip generation: March 2026 ready for download", status: "success" },
    { time: "2 hrs ago",  event: "Leave balance updated: Q1 carry-forward applied", status: "info" },
    { time: "Yesterday",  event: "HOD rejected leave (Mr. Patel) — exam duty conflict", status: "error" },
  ],
  capabilities: [
    "Natural language leave application ('Give me CL next Monday')",
    "Multi-level HOD approval chain with escalation",
    "Full access to service rules — no more email to HR",
    "Payslip download, arrear queries, Form 16 access",
    "Leave balance tracker (CL, EL, ML, CCL, maternity)",
    "Tax declaration submission via chat",
    "Integration with payroll system for real-time data",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
