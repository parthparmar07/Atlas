import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Fee Collection Agent",
  agentId: "finance-fees",
  badge: "core",
  domain: "Finance",
  domainHref: "/finance",
  domainColor: "#ef4444",
  tagline: "Maximise recovery, minimise awkward calls.",
  description:
    "Monitors payment schedules, sends tiered gentle reminders via WhatsApp/Email, generates instant payment links, and maintains a real-time defaulter list for the finance office. Integrates directly with Razorpay/Stripe for instant settlement.",
  stats: [
    { label: "Collection Target",  value: "₹8.4Cr", change: "For current sem" },
    { label: "Recovery Rate",      value: "92.4%",  change: "vs 81% last sem", up: true },
    { label: "Reminders Dispatched",value:"1.8K",   change: "Last 7 days" },
    { label: "Defaulter Count",    value: "112",    change: "-47 from last week", up: true },
  ],
  pipeline: [
    { title: "Schedule Monitor",   desc: "Fees due dates cross-referenced against student payment ledger in ERP." },
    { title: "Tiered Reminders",   desc: "Automated sequence: T-7 (Gentle), T-1 (Urgent), T+2 (Escalated follow-up)." },
    { title: "Payment Link",        desc: "Agent generates unique Razorpay checkout links sent via WhatsApp and SMS." },
    { title: "Instant Settlement",  desc: "Payments confirmed via webhook with automated ledger and receipt updates." },
    { title: "Defaulter Escalation",desc: "Repeated non-payment flags sent to Dean for administrative intervention." },
  ],
  actions: [
    { label: "Collect Dues",      desc: "Process current fee payments and identify overdue accounts" },
    { label: "Send Reminders",     desc: "Dispatch tiered nudges to late-paying student segments" },
    { label: "Defaulter Report",   desc: "Generate prioritized list of chronic non-payers for Finance" },
    { label: "Recovery Plan",     desc: "Propose debt restructuring or recovery tracks for high-value dues" },
  ],
  activity: [
    { time: "2 min ago",  event: "Payment received: Arjun Rao (₹42,500) — Receipt #9022 dispatched", status: "success" },
    { time: "45 min ago", event: "Tier-2 WhatsApp batch: 142 reminders sent for March installment", status: "info" },
    { time: "Yesterday",  event: "Defaulter shift: 12 students moved to high-risk (overdue > 30 days)", status: "error" },
    { time: "2 days ago", event: "Collection milestone: CSE department hit 95% semester goal", status: "success" },
    { time: "3 days ago", event: "Gateway sync: 4 pending settlements cleared to college account", status: "success" },
  ],
  capabilities: [
    "ERP-integrated payment schedule monitoring",
    "Tiered WhatsApp & Email outreach automation",
    "Instant payment link generation (Razorpay/Stripe)",
    "Real-time ledger and receipt automation",
    "Branch-wise and batch-wise recovery analytics",
    "Penalty and late fee auto-computation",
    "One-click defaulter list for HOD review",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
