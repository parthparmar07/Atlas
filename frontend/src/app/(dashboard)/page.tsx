"use client";

import Link from "next/link";
import { 
  Monitor, RefreshCw, FileText, CheckCircle2, 
  ChevronRight, Activity, BellRing, Target, AlertTriangle
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const DOMAINS = [
  {
    key: "admissions", label: "Admissions & Leads", color: "#f97316",
    href: "/admissions",
    agents: [
      { href: "/admissions/intelligence", name: "Admissions Intelligence", badge: "hot",    desc: "From raw lead to ranked applicant — in seconds, not days." },
      { href: "/admissions/leads",        name: "Lead Nurture",            badge: "unique", desc: "Every lead gets the right message automatically." },
      { href: "/admissions/scholarship",  name: "Scholarship Matcher",     badge: "api",    desc: "Match students to 200+ government & private schemes." },
      { href: "/admissions/documents",    name: "Document Verifier",       badge: "core",   desc: "Zero document errors reach the counsellor's desk." },
    ],
  },
  {
    key: "hr", label: "HR & Faculty", color: "#8b5cf6",
    href: "/hr",
    agents: [
      { href: "/hr/bot",           name: "HR Operations Bot",     badge: "core",   desc: "HR queries resolved in seconds, not email threads." },
      { href: "/hr/load-balancer", name: "Faculty Load Balancer", badge: "unique", desc: "Equitable workloads — detected automatically." },
      { href: "/hr/appraisal",     name: "Appraisal Agent",       badge: "unique", desc: "Annual KPI reports generated from data instantly." },
      { href: "/hr/recruitment",   name: "Recruitment Pipeline",  badge: "api",    desc: "Faculty hiring runs itself — from posting to interview." },
    ],
  },
  {
    key: "academics", label: "Academics", color: "#0ea5e9",
    href: "/academics",
    agents: [
      { href: "/academics/timetable",    name: "Timetable AI",       badge: "hot",    desc: "Clash-free timetables generated in minutes." },
      { href: "/academics/substitution", name: "Substitution Agent", badge: "core",   desc: "No class left uncovered — sub found in under 2 mins." },
      { href: "/academics/curriculum",   name: "Curriculum Auditor", badge: "unique", desc: "Know what exams actually test vs what is taught." },
      { href: "/academics/calendar",     name: "Calendar Generator", badge: "core",   desc: "One source of truth for every date in the year." },
    ],
  },
  {
    key: "placement", label: "Placement", color: "#10b981",
    href: "/placement",
    agents: [
      { href: "/placement/intelligence",   name: "Placement Intel",     badge: "hot",    desc: "Your entire placement pipeline on autopilot." },
      { href: "/placement/interview-prep", name: "Interview Prep",      badge: "unique", desc: "Practice against the exact role you're targeting." },
      { href: "/placement/alumni",         name: "Alumni Network",      badge: "api",    desc: "Turn your past students into your strongest pipeline." },
      { href: "/placement/resume",         name: "Resume Tracking",     badge: "core",   desc: "Every student's resume, optimized for ATS passes." },
    ],
  },
  {
    key: "students", label: "Students", color: "#f59e0b",
    href: "/students",
    agents: [
      { href: "/students/projects",    name: "Project Tracker",   badge: "hot",    desc: "Guide students from synopsis to complete submission." },
      { href: "/students/dropout",     name: "Dropout Predictor", badge: "unique", desc: "Predict risk 6 weeks early — intervene proactively." },
      { href: "/students/internships", name: "Internship Agent",  badge: "core",   desc: "Matching the right skill to the right project." },
      { href: "/students/grievance",   name: "Grievance Agent",   badge: "core",   desc: "Anonymous reporting, transparent fast resolution." },
    ],
  },
  {
    key: "finance", label: "Finance", color: "#ef4444",
    href: "/finance",
    agents: [
      { href: "/finance/fees",          name: "Fee Collection",        badge: "core",   desc: "Maximise recovery, minimise awkward calls." },
      { href: "/finance/accreditation", name: "Accreditation Agent",   badge: "unique", desc: "365-day tracking for NAAC, NBA, and NIRF scores." },
      { href: "/finance/budget",        name: "Budget Monitor",        badge: "api",    desc: "Total visibility into every department's spend limit." },
      { href: "/finance/procurement",   name: "Procurement Agent",     badge: "unique", desc: "Smart purchasing, decentralized tracking flow." },
    ],
  },
];

const BADGE_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  hot:    { label: "Hot",    bg: "var(--hot-bg)",    color: "var(--hot-text)",    border: "var(--hot-border)" },
  unique: { label: "Unique", bg: "var(--unique-bg)", color: "var(--unique-text)", border: "var(--unique-border)" },
  core:   { label: "Core",   bg: "var(--core-bg)",   color: "var(--core-text)",   border: "var(--core-border)" },
  api:    { label: "API",    bg: "var(--api-bg)",    color: "var(--api-text)",    border: "var(--api-border)" },
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CommandCenterPage() {
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto", color: "var(--text-primary)" }}>

      {/* ── Header Area ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#111827" }}>
            Command Center Overview
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Real-time status of Atlas University's agentic ecosystem.
          </p>
        </div>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <span>+</span>
          New Agent
        </button>
      </div>

      {/* ── Top Stat Cards (Premium Light Theme) ── */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        
        {/* Active AI Agents */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between">
            <div>
               <p className="text-slate-500 text-[13px] font-medium mb-1">Active AI Agents</p>
               <h3 className="text-3xl font-bold text-slate-800 tracking-tight">24</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Monitor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded">
              +4 new
            </span>
          </div>
        </div>

        {/* Running Automations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between">
            <div>
               <p className="text-slate-500 text-[13px] font-medium mb-1">Running Automations</p>
               <h3 className="text-3xl font-bold text-slate-800 tracking-tight">142</h3>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-[11px] font-bold rounded">
              Stable
            </span>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between">
            <div>
               <p className="text-slate-500 text-[13px] font-medium mb-1">Total Projects</p>
               <h3 className="text-3xl font-bold text-slate-800 tracking-tight">8</h3>
            </div>
            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded">
              2 Due
            </span>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between">
            <div>
               <p className="text-slate-500 text-[13px] font-medium mb-1">System Health</p>
               <h3 className="text-3xl font-bold text-slate-800 tracking-tight">99.9%</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded">
              Excellent
            </span>
          </div>
        </div>

      </div>

      {/* ── Live Activity Area ── */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        
        {/* Live Agent Activity View */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800">Live Agent Activity</h3>
            <span className="text-indigo-600 text-sm font-semibold cursor-pointer hover:underline text-[13px]">View All</span>
          </div>
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Admissions Intelligence</p>
                  <p className="text-[13px] text-slate-500">Scoring 42 new applications for B.Tech batch</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold tracking-wider rounded border border-emerald-100">Running</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Faculty Load Balancer</p>
                  <p className="text-[13px] text-slate-500">Equity report generated for CSE department</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-wider rounded border border-blue-100">Completed</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Lead Nurture Agent</p>
                  <p className="text-[13px] text-slate-500">Dispatching WhatsApp drip sequence: 128 leads</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] uppercase font-bold tracking-wider rounded border border-amber-100">Active</span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Placement Intel</p>
                  <p className="text-[13px] text-slate-500">Scraping career portals: TCS, Infosys, Wipro</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] uppercase font-bold tracking-wider rounded border border-indigo-100">Syncing</span>
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800">System Activity</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Automation Triggered</p>
                  <p className="text-[13px] text-slate-500">2 min ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Knowledge Base Updated</p>
                  <p className="text-[13px] text-slate-500">15 min ago</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-orange-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Warning Alert</p>
                  <p className="text-[13px] text-slate-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Agent Grids ── */}
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 24 }}>Agent Ecosystem</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {DOMAINS.map((domain) => (
          <section key={domain.key}>
            {/* Domain header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <span 
                  className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: domain.color }} />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{domain.label}</span>
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  {domain.agents.length} Agents Assigned
                </span>
              </div>
              <Link
                href={domain.href}
                className="text-[13px] text-slate-500 font-semibold flex items-center gap-1 hover:text-indigo-600 transition-colors"
                style={{ textDecoration: "none" }}
              >
                Explore Domain
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Agent cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {domain.agents.map((agent) => {
                const badge = BADGE_CONFIG[agent.badge];
                return (
                  <Link
                    key={agent.href}
                    href={agent.href}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      className="bg-white border rounded-xl transition-all h-full flex flex-col justify-between shadow-sm hover:shadow-md"
                      style={{
                        padding: "20px 24px",
                        cursor: "pointer",
                        borderLeft: `3px solid ${domain.color}`,
                        borderColor: "var(--border)",
                        borderLeftColor: domain.color
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${domain.color}80`;
                        (e.currentTarget as HTMLElement).style.borderLeftColor = domain.color;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLElement).style.borderLeftColor = domain.color;
                        (e.currentTarget as HTMLElement).style.transform = "none";
                      }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 style={{ color: "#1e293b", fontSize: 16, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                            {agent.name}
                          </h3>
                          <span
                            className="badge shrink-0"
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              borderColor: badge.border,
                            }}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
                          {agent.desc}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-5 font-semibold text-[13px] transition-colors hover:text-indigo-600" style={{ color: domain.color }}>
                        Open Agent
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-16 pt-8 border-t border-slate-200 text-slate-400 text-sm font-medium text-center">
        Atlas AI Command Center • Production Mode • 24 Live Agents
      </div>
    </div>
  );
}
