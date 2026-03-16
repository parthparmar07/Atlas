import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

const config: AgentConfig = {
  name: "Alumni Network Agent",
  agentId: "placement-alumni",
  badge: "api",
  domain: "Placement",
  domainHref: "/placement",
  domainColor: "#10b981",
  tagline: "Turn your past students into your strongest placement pipeline.",
  description:
    "Auto-syncs with LinkedIn to track where your alumni are working now. Surfaces mentorship matches for current students, flags internal referral opportunities at top companies, and runs targeted re-engagement campaigns to bring alumni back as recruiters.",
  stats: [
    { label: "Tracked Alumni",    value: "14.2K", change: "Across 41 countries", up: true },
    { label: "Mentorship Matches",value: "312",   change: "Active pairings" },
    { label: "Hiring Referrals",  value: "84",    change: "Channels generated", up: true },
    { label: "Profile Syncs",     value: "2.8K",  change: "Last 30 days" },
  ],
  pipeline: [
    { title: "LinkedIn Sync", desc: "Monitors alumni profiles and auto-updates database on job changes." },
    { title: "Network Mapping", desc: "Visualizes alumni density across global companies and tech sectors." },
    { title: "Mentor Matching", desc: "Matches students to alumni based on career goals and shared backgrounds." },
    { title: "Referral Mining", desc: "Flags alumni at hiring companies to request student referrals." },
    { title: "Smart Outreach", desc: "Auto-drafts personalized reconnection messages based on current roles." },
  ],
  actions: [
    { label: "Find Mentors",      desc: "Identify suitable alumni mentors for graduating students" },
    { label: "Send Campaign",     desc: "Launch re-engagement outreach to inactive alumni" },
    { label: "Map Network",       desc: "Visualize institutional influence across industry sectors" },
    { label: "Referral Pipeline", desc: "Activate referral requests for active job openings" },
  ],
  activity: [
    { time: "2 hrs ago",  event: "Profile sync: 47 alumni promoted to Senior/Lead roles", status: "success" },
    { time: "5 hrs ago",  event: "Referral request sent to 8 alumni at Amazon for SDE-1 opening", status: "info" },
    { time: "Yesterday",  event: "Mentorship pairing: 14 students matched with 2020 batch alumni", status: "success" },
    { time: "2 days ago", event: "Congrats sent to Rohan Das (Batch '19) for new CTO role", status: "success" },
    { time: "1 week ago", event: "Alumni newsletter: 62% open rate. 3 new campus drive leads.", status: "info" },
  ],
  capabilities: [
    "LinkedIn data synchronization",
    "Company and geography density mapping",
    "Automated milestone tracking (promotions, job changes)",
    "Student-alumni mentorship algorithm",
    "Context-aware email/message drafting for outreach",
    "Targeted referral request pipelines",
    "Donation and endowment campaign tracking",
  ],
};

export default function Page() {
  return <AgentPageTemplate config={config} />;
}
