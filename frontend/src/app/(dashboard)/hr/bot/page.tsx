"use client";

import AgentPageTemplate from "@/components/agents/AgentPageTemplate";

export default function HrBotPage() {
  return (
    <AgentPageTemplate
      config={{
        name: "HR Operations Bot",
        agentId: "hr-bot",
        badge: "core",
        domain: "HR & Faculty",
        domainHref: "/hr",
        domainColor: "#10b981",
        tagline: "HR queries resolved in seconds, not email threads.",
        description:
          "Your intelligent HR layer — understands natural language queries about leave, payroll, policies, and onboarding. Integrates with ERP and responds instantly so HR teams can focus on people, not paperwork.",
        stats: [
          { label: "Queries Resolved", value: "1,284", change: "+38 today", up: true },
          { label: "Avg Response Time", value: "1.2s", change: "vs 4h email", up: true },
          { label: "Policy Lookups", value: "342", change: "This month" },
          { label: "Escalations", value: "12", change: "↓ 40% vs last month", up: true },
        ],
        pipeline: [
          { title: "Query Intake", desc: "Employee submits natural language query via chat or portal" },
          { title: "Intent Classification", desc: "AI classifies as leave, payroll, policy, onboarding, or general" },
          { title: "Context Retrieval", desc: "Fetches relevant employee record & policy from ERP/HRMS" },
          { title: "Response Generation", desc: "Groq LLaMA generates structured, accurate response with citations" },
          { title: "Escalation Gate", desc: "Flags edge-cases to HR manager with full context summary" },
        ],
        actions: [
          { label: "Process Leaves", desc: "Validate eligibility, check quota, auto-approve or escalate" },
          { label: "Draft Notice", desc: "Generate formatted internal notices for announcements, holidays, alerts" },
          { label: "Payroll Summary", desc: "Generate monthly payroll report with breakdowns" },
          { label: "Onboarding Checklist", desc: "Role-specific onboarding tasks for new hires" },
        ],
        activity: [
          { time: "Just now", event: "Leave request from Prof. Sharma auto-approved", status: "success" },
          { time: "3m ago",   event: "Payroll correction query resolved for R. Patel", status: "success" },
          { time: "8m ago",   event: "Maternity policy lookup — 2 documents retrieved", status: "success" },
          { time: "15m ago",  event: "Faculty load analysis flagged Dr. Nair at 122% capacity", status: "pending" },
          { time: "1h ago",   event: "Onboarding checklist emailed to 3 new joiners", status: "success" },
        ],
        capabilities: [
          "Natural language HR query understanding",
          "Leave management & eligibility validation",
          "Payroll calculation & arrear computation",
          "Policy search across HRMS documents",
          "Automated onboarding workflow",
          "Faculty workload analysis & detection",
          "Multi-language support (EN/HI/MR)",
          "ERP/HRMS integration via REST API",
        ],
      }}
    />
  );
}
