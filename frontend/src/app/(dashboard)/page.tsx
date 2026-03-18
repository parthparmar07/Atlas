import type { Metadata } from "next";
import { 
  ArrowUpRight, Cpu, RefreshCw, Target, Shield, Zap, 
  Activity, RefreshCcw, Search, GraduationCap, Server, MessageSquare, Briefcase, FileText
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

const METRICS = [
  { label: "ACTIVE AGENTS", value: "24", subValue: "+4 new", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50", badgeColor: "text-indigo-600 bg-indigo-50" },
  { label: "AUTOMATIONS", value: "142", subValue: "Live", icon: RefreshCw, color: "text-purple-500", bg: "bg-purple-50", badgeColor: "text-purple-600 bg-purple-50", iconUp: true },
  { label: "PROJECTS", value: "8", subValue: "2 Due Soon", icon: Target, color: "text-orange-500", bg: "bg-orange-50", badgeColor: "text-orange-600 bg-orange-50" },
  { label: "UPTIME", value: "99.9%", subValue: "Excellent", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50", badgeColor: "text-emerald-600 bg-emerald-50" },
  { label: "THROUGHPUT", value: "12.4 T/s", subValue: "Groq LPU", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50", badgeColor: "text-indigo-600 bg-indigo-50", iconUp: true }
];

const DOMAINS = [
  {
    key: "admissions", label: "Admissions & Leads", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", href: "/admissions",
    agents: [
      { href: "/admissions/intelligence", name: "Admissions Intelligence", badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "From raw lead to ranked applicant � in seconds, not days." },
      { href: "/admissions/leads",        name: "Lead Nurture",            badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Every lead gets the right message automatically." },
      { href: "/admissions/scholarship",  name: "Scholarship Matcher",     badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Match students to 200+ government & private schemes." },
      { href: "/admissions/documents",    name: "Document Verifier",       badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Zero document errors reach the counsellor's desk." },
    ],
  },
  {
    key: "hr", label: "HR & Faculty", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", href: "/hr",
    agents: [
      { href: "/hr/bot",           name: "HR Operations Bot",     badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "HR queries resolved in seconds, not email threads." },
      { href: "/hr/load-balancer", name: "Faculty Load Balancer", badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Equitable workloads � detected automatically." },
      { href: "/hr/appraisal",     name: "Appraisal Agent",       badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Annual KPI reports generated from data instantly." },
      { href: "/hr/recruitment",   name: "Recruitment Pipeline",  badge: "API",    badgeColor: "bg-sky-100 text-sky-600", desc: "Faculty hiring runs itself � from posting to interview." },
    ],
  },
  {
    key: "academics", label: "Academics", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200", href: "/academics",
    agents: [
      { href: "/academics/timetable",    name: "Timetable AI",       badge: "Hot",    badgeColor: "bg-rose-100 text-rose-600", desc: "Clash-free timetables generated in minutes." },
      { href: "/academics/substitution", name: "Substitution Agent", badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "No class left uncovered � sub found in under 2 mins." },
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
      { href: "/students/dropout",     name: "Dropout Predictor", badge: "Unique", badgeColor: "bg-violet-100 text-violet-600", desc: "Predict risk 6 weeks early � intervene proactively." },
      { href: "/students/internships", name: "Internship Agent",  badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Matching the right skill to the right project." },
      { href: "/students/grievance",   name: "Grievance Agent",   badge: "Core",   badgeColor: "bg-emerald-100 text-emerald-600", desc: "Anonymous reporting, transparent fast resolution." },
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

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8 overflow-y-auto w-full bg-[#f8fafc]">
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider rounded-full bg-indigo-600 text-white uppercase shadow-sm shadow-indigo-500/30">
                Production Node
              </span>
              <span className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider rounded-full bg-slate-200/80 text-slate-600 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Stable
              </span>
              <span className="px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold tracking-wider rounded-full bg-orange-100/80 text-orange-600 uppercase border border-orange-200">
                <Cpu className="w-3 h-3" /> Groq LLaMA-3.3 Powered
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              Command <span className="text-indigo-600">Center</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              Managing Atlas University's high-frequency agentic ecosystem. Real-time telemetry, autonomous decision-making, and multi-domain orchestration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-[1rem] transition-colors font-bold shadow-sm text-sm">
              <RefreshCcw className="w-4 h-4" />
              Hot Refresh
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1rem] transition-colors font-bold shadow-lg shadow-indigo-600/30 text-sm">
              <Zap className="w-4 h-4" />
              Deploy Agent
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {METRICS.map((metric, i) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              <div className="flex justify-between items-start">
                <div className={cn("p-3 rounded-2xl", metric.bg, metric.color)}>
                  <metric.icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                {metric.iconUp && <ArrowUpRight className="w-5 h-5 text-emerald-500" />}
              </div>
              
              <div className="mt-8">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">{metric.label}</p>
                <h3 className="text-4xl font-black tracking-tight text-slate-900">{metric.value}</h3>
              </div>

              <div className="absolute bottom-6 right-6">
                <span className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full", metric.badgeColor)}>
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
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Agent Activity Matrix</h2>
                    <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mt-1">Real-time command stream</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-2 rounded-full bg-indigo-600" />
                  <div className="w-12 h-2 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-xl">??</div>
                    <div>
                      <h4 className="font-bold text-slate-900">Admissions Intel</h4>
                      <p className="text-sm text-slate-500 font-medium">Scoring 42 apps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Just Now</p>
                      <p className="text-xs font-bold text-emerald-500">Encrypted</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-wider">RUNNING</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-xl">??</div>
                    <div>
                      <h4 className="font-bold text-slate-900">Faculty Balancer</h4>
                      <p className="text-sm text-slate-500 font-medium">Generating Report</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">2m Ago</p>
                      <p className="text-xs font-bold text-emerald-500">Encrypted</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold tracking-wider">COMPLETED</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-xl">??</div>
                    <div>
                      <h4 className="font-bold text-slate-900">Lead Nurture</h4>
                      <p className="text-sm text-slate-500 font-medium">Drip Campaign #12</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">5m Ago</p>
                      <p className="text-xs font-bold text-emerald-500">Encrypted</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wider">ACTIVE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-xl">??</div>
                    <div>
                      <h4 className="font-bold text-slate-900">Placement Intel</h4>
                      <p className="text-sm text-slate-500 font-medium">Syncing Job Boards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">12m Ago</p>
                      <p className="text-xs font-bold text-emerald-500">Encrypted</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wider">SYNCING</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Terminal Live */}
            <div className="bg-[#0f172a] rounded-[1.5rem] p-6 shadow-xl border border-slate-800 font-mono text-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">Terminal Live</div>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex">
                  <span className="text-emerald-400 mr-2">root@atlas:~$</span>
                  <span className="text-white">exec --agent admissions-intel --target pool-B</span>
                </div>
                <div className="pl-4 py-2 text-slate-400">Processing vector embeddings for candidate_ID_882...</div>
                <div className="pl-4 text-emerald-400 pb-2">[OK] Score 94.2 generated in 12ms (via Groq Llama-3.3)</div>
                <div className="flex">
                  <span className="text-emerald-400 mr-2">root@atlas:~$</span>
                  <span className="w-2 h-4 bg-slate-400 animate-pulse"></span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Quick Domain Links */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
              <div className="space-y-4">
                {/* admissions quick link */}
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <h3 className="font-bold text-orange-800 mb-2">Admissions & Leads</h3>
                  <div className="space-y-1.5 mb-3">
                    <p className="text-xs font-semibold text-orange-600/80">Admissions Intelligence</p>
                    <p className="text-xs font-semibold text-orange-600/80">Lead Nurture</p>
                    <p className="text-xs font-semibold text-orange-600/80">Scholarship Matcher</p>
                  </div>
                  <Link href="/admissions" className="text-xs font-bold text-orange-700 flex items-center gap-1 hover:gap-2 transition-all">
                    Explore All 4 Agents &rarr;
                  </Link>
                </div>
                
                {/* hr quick link */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-2">HR & Faculty</h3>
                  <div className="space-y-1.5 mb-3">
                    <p className="text-xs font-semibold text-emerald-600/80">HR Operations Bot</p>
                    <p className="text-xs font-semibold text-emerald-600/80">Faculty Load Balancer</p>
                    <p className="text-xs font-semibold text-emerald-600/80">Appraisal Agent</p>
                  </div>
                  <Link href="/hr" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:gap-2 transition-all">
                    Explore All 4 Agents &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Core */}
            <div className="bg-[#111827] rounded-[1.5rem] p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Shield className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold tracking-wide">Security Core</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Encryption</span>
                      <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Active</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Neural Traffic</span>
                      <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Normal</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Audit Logs</h2>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Scheduled</p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-xs font-bold text-slate-400 pt-0.5">14:00</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Fee Recovery Batch</p>
                    <p className="text-xs text-slate-500 font-medium">Financial</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-xs font-bold text-slate-400 pt-0.5">16:30</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Backup Sync</p>
                    <p className="text-xs text-slate-500 font-medium">Core</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-xs font-bold text-slate-400 pt-0.5">18:00</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Alumni Drip</p>
                    <p className="text-xs text-slate-500 font-medium">Leads</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start sm:items-center gap-4 text-amber-800 mb-10 shadow-sm shadow-amber-100/50">
          <Activity className="w-6 h-6 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-bold text-amber-900">Notice</h4>
            <p className="text-sm font-medium opacity-90">Llama-3.3-70B throughput is currently peaking. Secondary agents might experience 200ms extra latency.</p>
          </div>
        </div>

        {/* --- Agent Ecosystem (The huge domain list) --- */}
        <div className="pt-6 border-t-[3px] border-slate-200 border-dashed">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Ecosystem</h2>
              <p className="text-slate-500 font-medium mt-1 text-lg">Distributed intelligence across 6 core domains</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm">Filter</button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm">Sort</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOMAINS.map((domain) => (
              <div key={domain.key} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                {/* Domain Header */}
                <div className={cn("p-5 border-b flex items-center justify-between", domain.bg, domain.border)}>
                  <h3 className={cn("text-lg font-black tracking-tight", domain.color)}>{domain.label}</h3>
                  <Server className={cn("w-5 h-5 opacity-50", domain.color)} />
                </div>
                
                {/* Agents List */}
                <div className="p-5 space-y-5 flex-1">
                  {domain.agents.map((agent, i) => (
                    <div key={i} className="group">
                      <div className="flex items-start justify-between mb-1">
                        <Link href={agent.href} className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {agent.name}
                        </Link>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", agent.badgeColor)}>
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{agent.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                  <Link href={domain.href} className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex items-center justify-center gap-2 transition-all shadow-sm">
                    Domain Hub &rarr;
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
