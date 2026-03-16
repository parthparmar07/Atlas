import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Lead Nurture Agent",
  agentId: "admissions-leads",
  badge: "unique",
  domain: "Admissions & Leads",
  domainHref: "/admissions",
  domainColor: "#f97316",
  tagline: "Every lead gets the right message at the right time — automatically.",
  description:
    "Runs intelligent drip sequences over WhatsApp and email based on lead source, programme of interest, and engagement signals. Sequences stop the moment a student enrolls. Counsellors are only interrupted when a lead replies or hits a hot trigger.",
  stats: [
    { label: "Active Sequences",  value: "328",  change: "12 added today", up: true },
    { label: "Open Rate",         value: "61%",  change: "+8% from last month", up: true },
    { label: "Reply Rate",        value: "22%",  change: "Industry avg: 6%", up: true },
    { label: "Enrolled via Drip", value: "94",   change: "Last 90 days" },
  ],
  pipeline: [
    { title: "Lead Enters", desc: "Passed from Admissions Intelligence with score, programme, source tag." },
    { title: "Sequence Assignment", desc: "Agent picks the right sequence based on tone and cadence." },
    { title: "WhatsApp + Email Drip", desc: "Automated day-by-day communication cadence." },
    { title: "Trigger Detection", desc: "Agent flags hot leads to counsellor based on engagement." },
    { title: "Auto-Stop on Enrolment", desc: "CRM event triggers sequence halt automatically." },
  ],
  actions: [
    { label: "Send Campaigns",     desc: "Broadcast personalized outreach to lead segments" },
    { label: "Check Drop-offs",    desc: "Identify leads with zero recent engagement" },
    { label: "Segment Leads",      desc: "Assign leads to behavioral cohorts using Gemini" },
    { label: "Match Scholarships",  desc: "Personalize messages based on eligible scholarships" },
  ],
  activity: [
    { time: "Just now",   event: "Priya Nair (B.Pharm) opened Day-5 email — flagged as hot lead", status: "success" },
    { time: "14 min ago", event: "Day-2 WhatsApp batch sent: 47 leads (JEE drop sequence)", status: "info" },
    { time: "1 hr ago",   event: "Sequence stopped: Arjun Mehta enrolled", status: "success" },
    { time: "3 hrs ago",  event: "Reply from unknown number — auto-routed to counsellor Sneha", status: "pending" },
    { time: "Yesterday",  event: "A/B test concluded: Scholarship angle leads by 31%", status: "info" },
  ],
  capabilities: [
    "WhatsApp Business API + email drip in one timeline",
    "Per-source sequence templates (JEE, referral, walk-in, digital)",
    "Engagement signal detection (opens, clicks, replies)",
    "Hot-lead instant counsellor alert",
    "Auto-stop on enrolment via CRM webhook",
    "A/B testing on message variants",
    "Opt-out handling and DND compliance",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
