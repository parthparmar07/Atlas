import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Wellbeing Support",
  agentId: "students-wellbeing",
  badge: "core",
  domain: "Students",
  domainHref: "/students",
  domainColor: "#ec4899",
  tagline: "Safety-first triage and support routing for student wellbeing.",
  description:
    "Triage wellbeing concerns, suggest support pathways, and generate follow-up actions while preserving confidentiality and escalation discipline.",
  stats: [
    { label: "Active Cases", value: "28", change: "Current week" },
    { label: "Counselor Connects", value: "19", change: "Priority-routed", up: true },
    { label: "Group Matches", value: "12", change: "Support circles" },
    { label: "Escalations", value: "3", change: "Safety protocol" },
  ],
  pipeline: [
    { title: "Intake Triage", desc: "Classify concern severity and urgency indicators." },
    { title: "Support Routing", desc: "Match to counselor, group, or immediate resource path." },
    { title: "Follow-up Plan", desc: "Generate milestones and check-in schedule." },
    { title: "Safety Escalation", desc: "Escalate risk-language cases through designated protocol." },
  ],
  actions: [
    { label: "Connect with a Counselor", desc: "Route to counselor with urgency tier" },
    { label: "Find a Support Group", desc: "Recommend suitable support circles" },
    { label: "Access Self-Help Resources", desc: "Generate guided self-help pack" },
  ],
  activity: [
    { time: "11 min ago", event: "Priority counselor slot allocated for high-urgency case", status: "pending" },
    { time: "31 min ago", event: "Resource pack generated for exam-stress support", status: "success" },
    { time: "2 hr ago", event: "Follow-up reminder schedule updated", status: "info" },
  ],
  capabilities: [
    "Wellbeing triage",
    "Counselor routing",
    "Support group matching",
    "Safety-first escalation guidance",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
