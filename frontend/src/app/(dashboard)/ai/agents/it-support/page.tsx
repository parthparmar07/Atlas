import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "IT Support",
  agentId: "it-support",
  badge: "api",
  domain: "IT",
  domainHref: "/ai/agents",
  domainColor: "#14b8a6",
  tagline: "Incident triage, request routing, and SLA-focused service operations.",
  description:
    "Handles IT incidents and service requests with severity tagging, queue assignment, and escalation actions based on risk and SLA drift.",
  stats: [
    { label: "Open Tickets", value: "73", change: "Across queues" },
    { label: "First Response", value: "9m", change: "Median", up: true },
    { label: "SLA Breach Risk", value: "6", change: "Watchlist" },
    { label: "Resolved Today", value: "41", change: "Service desk", up: true },
  ],
  pipeline: [
    { title: "Incident Intake", desc: "Capture issue signals and classify severity tier." },
    { title: "Queue Routing", desc: "Assign to infra, app, or access queue with ownership." },
    { title: "Action Guidance", desc: "Generate immediate remediation/checklist steps." },
    { title: "SLA Monitoring", desc: "Track elapsed time and escalation threshold." },
  ],
  actions: [
    { label: "Troubleshoot Issue", desc: "Run incident triage and queue assignment" },
    { label: "Request Equipment", desc: "Process hardware/service request workflow" },
    { label: "Access IT Services", desc: "Validate and process access request" },
  ],
  activity: [
    { time: "7 min ago", event: "P2 network incident routed to infra queue", status: "pending" },
    { time: "26 min ago", event: "Laptop procurement request approved", status: "success" },
    { time: "1 hr ago", event: "RBAC access checklist generated for new faculty", status: "info" },
  ],
  capabilities: [
    "Incident severity triage",
    "Queue and ownership routing",
    "Equipment request processing",
    "Access workflow validation",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
