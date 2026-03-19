import type { Metadata } from "next";
import { 
  ArrowUpRight, Cpu, RefreshCw, Target, Shield, Zap,
  Activity, RefreshCcw, Server
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "Dashboard | Atlas Ecosystem",
};

type TelemetryEvent = {
  id: number;
  agent: string;
  task: string;
  status: string;
  color: string;
  time: string;
};

type TelemetryStats = {
  active_agents: number;
  automations_today: number;
  active_projects: number;
  system_health: number;
  throughput: number;
  events: TelemetryEvent[];
};

type CommunicationsSnapshot = {
  total: number;
  delivered: number;
  failed: number;
  queued: number;
};

const TELEMETRY_FALLBACK: TelemetryStats = {
  active_agents: 24,
  automations_today: 142,
  active_projects: 8,
  system_health: 99.9,
  throughput: 12.4,
  events: [
    { id: 1, agent: "Admissions Intel", task: "Scoring 42 apps", status: "Running", color: "emerald", time: "Just now" },
    { id: 2, agent: "Faculty Balancer", task: "Generating Report", status: "Completed", color: "blue", time: "2m ago" },
    { id: 3, agent: "Lead Nurture", task: "Drip Campaign #12", status: "Active", color: "amber", time: "5m ago" },
    { id: 4, agent: "Placement Intel", task: "Syncing Job Boards", status: "Syncing", color: "indigo", time: "12m ago" },
  ],
};

async function getTelemetryStats(): Promise<TelemetryStats> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${base}/api/telemetry/stats`, { cache: "no-store" });
    if (!res.ok) return TELEMETRY_FALLBACK;
    const data = (await res.json()) as TelemetryStats;
    return {
      ...TELEMETRY_FALLBACK,
      ...data,
      events: Array.isArray(data.events) && data.events.length ? data.events : TELEMETRY_FALLBACK.events,
    };
  } catch {
    return TELEMETRY_FALLBACK;
  }
}

async function getCommunicationsSnapshot(): Promise<CommunicationsSnapshot> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${base}/api/ops/communications`, { cache: "no-store" });
    if (!res.ok) return { total: 0, delivered: 0, failed: 0, queued: 0 };
    const data = (await res.json()) as { communications?: Array<{ status?: string }> };
    const communications = data.communications ?? [];
    const total = communications.length;
    const delivered = communications.filter((c) => (c.status ?? "").toLowerCase() === "delivered").length;
    const failed = communications.filter((c) => (c.status ?? "").toLowerCase() === "failed").length;
    const queued = communications.filter((c) => {
      const status = (c.status ?? "").toLowerCase();
      return status === "queued" || status === "pending";
    }).length;
    return { total, delivered, failed, queued };
  } catch {
    return { total: 0, delivered: 0, failed: 0, queued: 0 };
  }
}

const DOMAINS = [
  {
    key: "admissions", label: "Admissions & Leads", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", href: "/admissions",
    agents: [
      { href: "/admissions/intelligence", name: "Admissions Intelligence", badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "From raw lead to ranked applicant - in seconds, not days." },
      { href: "/admissions/leads",        name: "Lead Nurture",            badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Every lead gets the right message automatically." },
      { href: "/admissions/scholarship",  name: "Scholarship Matcher",     badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Match students to 200+ government & private schemes." },
      { href: "/admissions/documents",    name: "Document Verifier",       badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Zero document errors reach the counsellor's desk." },
    ],
  },
  {
    key: "hr", label: "HR & Faculty", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", href: "/hr",
    agents: [
      { href: "/hr/bot",           name: "HR Operations Bot",     badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "HR queries resolved in seconds, not email threads." },
      { href: "/hr/load-balancer", name: "Faculty Load Balancer", badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Equitable workloads - detected automatically." },
      { href: "/hr/appraisal",     name: "Appraisal Agent",       badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Annual KPI reports generated from data instantly." },
      { href: "/hr/recruitment",   name: "Recruitment Pipeline",  badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Faculty hiring runs itself - from posting to interview." },
    ],
  },
  {
    key: "academics", label: "Academics", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200", href: "/academics",
    agents: [
      { href: "/academics/timetable",    name: "Timetable AI",       badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "Clash-free timetables generated in minutes." },
      { href: "/academics/substitution", name: "Substitution Agent", badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "No class left uncovered - sub found in under 2 mins." },
      { href: "/academics/curriculum",   name: "Curriculum Auditor", badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Know what exams actually test vs what is taught." },
      { href: "/academics/calendar",     name: "Calendar Generator", badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "One source of truth for every date in the year." },
    ],
  },
  {
    key: "placement", label: "Placement", color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200", href: "/placement",
    agents: [
      { href: "/placement/intelligence",   name: "Placement Intel",     badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "Your entire placement pipeline on autopilot." },
      { href: "/placement/interview-prep", name: "Interview Prep",      badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Practice against the exact role you're targeting." },
      { href: "/placement/alumni",         name: "Alumni Network",      badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Turn your past students into your strongest pipeline." },
      { href: "/placement/resume",         name: "Resume Tracking",     badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Every student's resume, optimized for ATS passes." },
    ],
  },
  {
    key: "students", label: "Students", color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200", href: "/students",
    agents: [
      { href: "/students/projects",    name: "Project Tracker",   badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "Guide students from synopsis to complete submission." },
      { href: "/students/dropout",     name: "Dropout Predictor", badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Predict risk 6 weeks early - intervene proactively." },
      { href: "/students/internships", name: "Internship Agent",  badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Matching the right skill to the right project." },
      { href: "/students/events",      name: "Events Coordinator", badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Run campus events with runbooks, risk checks, and KPI reporting." },
      { href: "/students/grievance",   name: "Grievance Agent",   badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Anonymous reporting, transparent fast resolution." },
    ],
  },
  {
    key: "research", label: "Research", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", href: "/research",
    agents: [
      { href: "/research/assistant",   name: "Research Assistant",  badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Find sources, analyze evidence, and build publishable outlines." },
      { href: "/research/grant",       name: "Grant Tracker",       badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Track utilization, deadlines, and PI escalations across grants." },
      { href: "/research/publication", name: "Publication Ops",     badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Move manuscripts from draft to submission with revision discipline." },
    ],
  },
  {
    key: "finance", label: "Finance", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", href: "/finance",
    agents: [
      { href: "/finance/fees",          name: "Fee Collection",        badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Maximise recovery, minimise awkward calls." },
      { href: "/finance/accreditation", name: "Accreditation Agent",   badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "365-day tracking for NAAC, NBA, and NIRF scores." },
      { href: "/finance/budget",        name: "Budget Monitor",        badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Total visibility into every department's spend limit." },
      { href: "/finance/procurement",   name: "Procurement Agent",     badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Smart purchasing, decentralized tracking flow." },
    ],
  },
];

export default async function DashboardPage() {
  const [telemetry, communications] = await Promise.all([
    getTelemetryStats(),
    getCommunicationsSnapshot(),
  ]);
  const encryptionLevel = Math.max(70, Math.min(100, Math.round(telemetry.system_health)));
  const trafficLevel = Math.max(20, Math.min(100, Math.round(telemetry.throughput * 5)));
  const deliveryRate = communications.total > 0 ? Math.round((communications.delivered / communications.total) * 100) : 0;
  const metrics = [
    { label: "ACTIVE AGENTS", value: String(telemetry.active_agents), subValue: "Live", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50", badgeColor: "text-indigo-600 bg-indigo-50" },
    { label: "AUTOMATIONS", value: String(telemetry.automations_today), subValue: "Today", icon: RefreshCw, color: "text-purple-500", bg: "bg-purple-50", badgeColor: "text-purple-600 bg-purple-50", iconUp: true },
    { label: "PROJECTS", value: String(telemetry.active_projects), subValue: "In Progress", icon: Target, color: "text-orange-500", bg: "bg-orange-50", badgeColor: "text-orange-600 bg-orange-50" },
    { label: "UPTIME", value: `${telemetry.system_health}%`, subValue: "Excellent", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50", badgeColor: "text-emerald-600 bg-emerald-50" },
    { label: "THROUGHPUT", value: `${telemetry.throughput} T/s`, subValue: "Groq LPU", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50", badgeColor: "text-indigo-600 bg-indigo-50", iconUp: true },
  ];

  const activityEvents = telemetry.events.slice(0, 4);

  const getEventIconClasses = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("running") || s.includes("active")) return "group-hover:text-indigo-600 group-hover:bg-indigo-50";
    if (s.includes("sync")) return "group-hover:text-orange-600 group-hover:bg-orange-50";
    return "group-hover:text-emerald-600 group-hover:bg-emerald-50";
  };

  const getStatusBadgeClasses = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("running")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (s.includes("active")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
    if (s.includes("sync")) return "bg-orange-50 text-orange-700 border-orange-100";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getIndicatorClasses = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("running")) return "bg-emerald-500 animate-pulse";
    if (s.includes("active")) return "bg-indigo-500 animate-pulse";
    if (s.includes("sync")) return "bg-orange-500 animate-pulse";
    return "bg-slate-400";
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto w-full bg-slate-50 relative min-h-screen">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/80 via-white to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-400/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 relative z-10">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full bg-indigo-600 text-white uppercase shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                Production Node
              </span>
              <span className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider rounded-full bg-slate-200/80 backdrop-blur-md text-slate-700 uppercase border border-slate-300/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Stable
              </span>
              <span className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider rounded-full bg-orange-100/80 backdrop-blur-md text-orange-700 uppercase border border-orange-200/50">
                <Cpu className="w-3 h-3 text-orange-500" /> Groq LLaMA-3.3 Powered
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 drop-shadow-sm">
              Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Center</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              Managing Atlas University's high-frequency agentic ecosystem. Real-time telemetry, autonomous decision-making, and multi-domain orchestration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="group flex items-center gap-2 px-6 py-3.5 bg-white/80 backdrop-blur-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-[1rem] transition-all font-bold shadow-sm hover:shadow text-sm">
              <RefreshCcw className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors group-hover:rotate-180 duration-500" />
              Hot Refresh
            </button>
            <button className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-[1rem] transition-all font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm hover:-translate-y-0.5">
              <Zap className="w-4 h-4 text-indigo-100 group-hover:text-white" />
              Deploy Agent
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[180px] group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div className={cn("p-3 rounded-2xl transition-colors", metric.bg, metric.color)}>
                  <metric.icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                {metric.iconUp && <ArrowUpRight className="w-5 h-5 text-emerald-500 drop-shadow-sm" />}
              </div>
              
              <div className="mt-8 relative z-10">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">{metric.label}</p>
                <h3 className="text-4xl font-black tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">{metric.value}</h3>
              </div>

              <div className="absolute bottom-6 right-6 z-10">
                <span className={cn("px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm", metric.badgeColor)}>
                  {metric.subValue}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Activity Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Agent Activity Matrix */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.5rem] p-8 shadow-sm border border-slate-200/60 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Agent Activity Matrix</h2>
                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mt-1">Real-time command stream</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <div className="w-12 h-2 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {activityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 bg-slate-50 text-slate-400 rounded-xl transition-colors", getEventIconClasses(event.status))}>
                        {event.status.toLowerCase().includes("sync") ? <RefreshCcw className="w-5 h-5" /> : event.status.toLowerCase().includes("running") ? <Cpu className="w-5 h-5" /> : event.status.toLowerCase().includes("active") ? <RefreshCw className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{event.agent}</h4>
                        <p className="text-sm text-slate-500 font-medium">{event.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{event.time}</p>
                        <p className="text-xs font-bold text-emerald-500">Encrypted</p>
                      </div>
                      <span className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider shadow-sm uppercase", getStatusBadgeClasses(event.status))}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", getIndicatorClasses(event.status))} />
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Terminal Live */}
            <div className="bg-[#0b1120] rounded-[1.5rem] p-6 shadow-2xl border border-slate-700/50 font-mono text-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Live Stream</div>
                </div>
              </div>
              <div className="space-y-3 text-slate-300 relative z-10">
                <div className="flex">
                  <span className="text-emerald-400 mr-2 font-bold">root@atlas:~$</span>
                  <span className="text-white">exec --agent admissions-intel --target pool-B</span>
                </div>
                <div className="pl-4 py-1 text-slate-400 border-l-2 border-slate-800 ml-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
                    Processing vector embeddings for candidate_ID_882...
                  </div>
                </div>
                <div className="pl-4 pb-2 border-l-2 border-slate-800 ml-2">
                  <div className="text-emerald-400 inline-flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded">
                    <Shield className="w-3 h-3" />
                    [OK] Score 94.2 generated in 12ms (via Groq Llama-3.3)
                  </div>
                </div>
                <div className="flex pt-2">
                  <span className="text-emerald-400 mr-2 font-bold">root@atlas:~$</span>
                  <span className="w-2 h-4 bg-slate-400 animate-pulse mt-0.5" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">

            {/* Delivery SLA */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Delivery SLA</h2>
                <Link href="/admin/communications" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Open</Link>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Delivered</p>
                  <p className="text-xl font-black text-emerald-600">{communications.delivered}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Failed</p>
                  <p className="text-xl font-black text-rose-600">{communications.failed}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Queued</p>
                  <p className="text-xl font-black text-amber-600">{communications.queued}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Success Rate</p>
                  <p className="text-xl font-black text-indigo-600">{deliveryRate}%</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Delivery Health</span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{communications.total} total</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                    style={{ width: `${Math.max(5, deliveryRate)}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Domain Links */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Priority Hubs</h2>
              </div>
              <div className="space-y-4">
                {/* admissions quick link */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:border-orange-200 transition-colors group/link cursor-pointer">
                  <h3 className="font-bold text-orange-800 mb-2 flex items-center justify-between">
                    Admissions & Leads
                    <ArrowUpRight className="w-4 h-4 text-orange-400 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                  </h3>
                  <div className="space-y-1.5 mb-3 px-1 border-l-2 border-orange-200 ml-1">
                    <p className="text-xs font-semibold text-orange-700/80">Admissions Intelligence</p>
                    <p className="text-xs font-semibold text-orange-700/80">Lead Nurture</p>
                    <p className="text-xs font-semibold text-orange-700/80">Scholarship Matcher</p>
                  </div>
                  <Link href="/admissions" className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
                    Explore All 4 Agents &rarr;
                  </Link>
                </div>
                
                {/* hr quick link */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:border-emerald-200 transition-colors group/link cursor-pointer">
                  <h3 className="font-bold text-emerald-800 mb-2 flex items-center justify-between">
                    HR & Faculty
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                  </h3>
                  <div className="space-y-1.5 mb-3 px-1 border-l-2 border-emerald-200 ml-1">
                    <p className="text-xs font-semibold text-emerald-700/80">HR Operations Bot</p>
                    <p className="text-xs font-semibold text-emerald-700/80">Faculty Load Balancer</p>
                    <p className="text-xs font-semibold text-emerald-700/80">Appraisal Agent</p>
                  </div>
                  <Link href="/hr" className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                    Explore All 4 Agents &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Core */}
            <div className="bg-gradient-to-b from-[#111827] to-[#0b1120] rounded-[1.5rem] p-6 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Shield className="w-32 h-32" />
              </div>
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-bold tracking-wide">Security Core</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Encryption</span>
                      <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${encryptionLevel}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Neural Traffic</span>
                      <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">{trafficLevel > 80 ? "High" : trafficLevel > 55 ? "Normal" : "Low"}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${trafficLevel}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Audit Logs</h2>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4 px-2">Scheduled Jobs</p>
              
              <div className="space-y-4 px-2">
                {activityEvents.slice(0, 3).map((event, idx) => (
                  <div key={event.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">{event.time}</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
                      {idx < Math.min(2, activityEvents.length - 1) ? <div className="w-px h-8 bg-slate-100 mt-1" /> : null}
                    </div>
                    <div className="-mt-1.5">
                      <p className="text-sm font-bold text-slate-800">{event.task}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{event.agent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Global Alert */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-200/60 rounded-2xl p-5 flex items-start sm:items-center gap-4 text-amber-800 mb-10 shadow-sm shadow-amber-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
          <div className="p-2 bg-amber-100/50 rounded-xl shrink-0">
            <Activity className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 tracking-tight">Notice</h4>
            <p className="text-sm font-medium opacity-90 text-amber-800/80">Llama-3.3-70B throughput is currently peaking. Secondary agents might experience 200ms extra latency.</p>
          </div>
        </div>

        {/* --- Agent Ecosystem (The huge domain list) --- */}
        <div className="pt-10 border-t border-slate-200/60 relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Agent Ecosystem
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs tracking-widest uppercase">Live</span>
              </h2>
              <p className="text-slate-500 font-medium mt-2 text-lg">Distributed intelligence across 6 core domains</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white/80 backdrop-blur border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow">Filter</button>
              <button className="px-5 py-2.5 bg-white/80 backdrop-blur border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow">Sort</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOMAINS.map((domain) => (
              <div key={domain.key} className="bg-white/80 backdrop-blur-sm rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group/card">
                {/* Domain Header */}
                <div className={cn("p-6 border-b flex items-center justify-between relative overflow-hidden", domain.bg, domain.border)}>
                  <div className="absolute inset-0 bg-white/20 group-hover/card:bg-transparent transition-colors" />
                  <h3 className={cn("text-lg font-black tracking-tight relative z-10", domain.color)}>{domain.label}</h3>
                  <Server className={cn("w-5 h-5 opacity-40 relative z-10", domain.color)} />
                </div>
                
                {/* Agents List */}
                <div className="p-6 space-y-5 flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
                  {domain.agents.map((agent, i) => (
                    <div key={i} className="group relative z-10 transition-transform hover:-translate-y-0.5">
                      <div className="flex items-start justify-between mb-1.5 gap-2">
                        <Link href={agent.href} className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1">
                          {agent.name}
                        </Link>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-sm", agent.badgeColor)}>
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-90">{agent.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50 mt-auto">
                  <Link href={domain.href} className="w-full py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm group-hover/card:shadow">
                    View Domain Hub
                    <ArrowUpRight className="w-4 h-4 opacity-50 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
