"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function AdmissionsIntelligencePage() {
  return (
    <AgentPageTemplate
      config={{
        name: "Admissions Intelligence",
        agentId: "admissions-intelligence",
        badge: "hot",
        domain: "Admissions Orbit",
        domainHref: "/admissions",
        domainColor: "#f97316",
        tagline: "From raw lead to ranked applicant - in seconds, not days.",
        description:
          "The Admissions Intelligence agent is the front-line orchestrator for your recruitment funnel. It automatically ingests leads from web forms, WhatsApp, and social media, parses transcripts, scores candidates against program criteria, and generates personalized engagement strategies for ISME, ISDI, uGDX, and Law schools.",
        stats: [
          { label: "Active Leads", value: "1,248", change: "+14% this week", up: true },
          { label: "uGDX Tech Scored", value: "942", change: "75% of pipeline", up: true },
          { label: "High Intent (ISME)", value: "128", change: "Score > 85", up: true },
          { label: "Avg Process Time", value: "1.4s", change: "Vs 45m manual", up: true },
        ],
        pipeline: [
          { title: "Lead Ingestion", desc: "Multi-channel intake from Web, WhatsApp, and Partner APIs" },
          { title: "Profile Analysis", desc: "LLM-driven parsing of academics, experience, and intent" },
          { title: "Smart Scoring", desc: "Dynamic weighting based on school-specific suitability rubrics (ISDI/uGDX/Law)" },
          { title: "Drip Assignment", desc: "Automated transition to high-conversion nurture sequences" },
          { title: "Counsellor Sync", desc: "Handoff of qualified leads to human staff with full context summaries" },
        ],
        actions: [
          { label: "Qualify Leads", desc: "Score suitability (0-100) based on academics, fit, and intent" },
          { label: "Parse Documents", desc: "Extract structured data from transcripts, marksheet, and certificates" },
          { label: "Track Funnel", desc: "Show stage-wise counts and conversion rates with stalled lead alerts" },
          { label: "Generate Follow-Up Messages", desc: "Create personalised WhatsApp/Email nurture text for inactive leads" },
          { label: "Match Scholarships", desc: "Check eligibility against Central, State, and Institutional schemes" },
          { label: "Brief Counsellors", desc: "Generate pre-call briefing packs with objections and talking points" },
        ],
        activity: [
          { time: "Just now", event: "Aarav Sharma profiled — 92% match for B.Tech CSE (uGDX)", status: "success" },
          { time: "8m ago",   event: "Bulk scoring completed for 124 web-form leads (ISDI)", status: "success" },
          { time: "22m ago",  event: "Lead from WhatsApp flagged as 'High Urgency' (Law)", status: "pending" },
          { time: "1h ago",   event: "Yield prediction updated for MBA Q3 intake (ISME)", status: "success" },
          { time: "3h ago",   event: "Transcript analysis failed for Lead #4029 (Low res PDF)", status: "error" },
        ],
        capabilities: [
          "Dynamic lead scoring & ranking",
          "Automated transcription parsing",
          "Intent and sentiment analysis",
          "Multi-channel data aggregation",
          "Program suitability matching",
          "Yield and conversion prediction",
          "Personalized nurture-map generation",
          "CRM and ERP data synchronization",
        ],
      }}
    />
  );
}
