"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart, Users, LayoutDashboard, FileText, Settings, 
  ShieldCheck, BrainCircuit, Activity, ChevronRight, 
  Briefcase, GraduationCap, Coins, Users2
} from "lucide-react";

const DOMAINS_FOR_SIDEBAR = [
  {
    key: "admissions",
    label: "Admissions & Leads",
    color: "#f97316",
    icon: <Users className="w-4 h-4" />,
    agents: [
      { href: "/admissions/intelligence", label: "Admissions Intelligence", badge: "hot" },
      { href: "/admissions/leads",         label: "Lead Nurture",            badge: "unique" },
      { href: "/admissions/scholarship",   label: "Scholarship Matcher",     badge: "api" },
      { href: "/admissions/documents",     label: "Document Verifier",       badge: "core" },
    ],
  },
  {
    key: "hr",
    label: "HR & Faculty",
    color: "#8b5cf6",
    icon: <Users2 className="w-4 h-4" />,
    agents: [
      { href: "/hr/bot",           label: "HR Operations Bot",      badge: "core" },
      { href: "/hr/load-balancer", label: "Faculty Load Balancer",  badge: "unique" },
      { href: "/hr/appraisal",     label: "Appraisal Agent",        badge: "unique" },
      { href: "/hr/recruitment",   label: "Recruitment Pipeline",   badge: "api" },
    ],
  },
  {
    key: "academics",
    label: "Academics",
    color: "#06b6d4",
    icon: <BarChart className="w-4 h-4" />,
    agents: [
      { href: "/academics/timetable",    label: "Timetable AI",        badge: "hot" },
      { href: "/academics/substitution", label: "Substitution Agent",  badge: "core" },
      { href: "/academics/curriculum",   label: "Curriculum Auditor",  badge: "unique" },
      { href: "/academics/calendar",     label: "Calendar Generator",  badge: "core" },
    ],
  },
  {
    key: "placement",
    label: "Placement",
    color: "#10b981",
    icon: <Briefcase className="w-4 h-4" />,
    agents: [
      { href: "/placement/intelligence",   label: "Placement Intel",     badge: "hot" },
      { href: "/placement/interview-prep", label: "Interview Prep",      badge: "unique" },
      { href: "/placement/alumni",         label: "Alumni Network",      badge: "api" },
      { href: "/placement/resume",         label: "Resume Tracking",     badge: "core" },
    ],
  },
  {
    key: "students",
    label: "Students",
    color: "#f59e0b",
    icon: <GraduationCap className="w-4 h-4" />,
    agents: [
      { href: "/students/projects",    label: "Project Tracker",    badge: "hot" },
      { href: "/students/dropout",     label: "Dropout Predictor",  badge: "unique" },
      { href: "/students/internships", label: "Internship Agent",   badge: "core" },
      { href: "/students/grievance",   label: "Grievance Agent",    badge: "core" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    color: "#ef4444",
    icon: <Coins className="w-4 h-4" />,
    agents: [
      { href: "/finance/fees",          label: "Fee Collection",        badge: "core" },
      { href: "/finance/accreditation", label: "Accreditation Agent",   badge: "unique" },
      { href: "/finance/budget",        label: "Budget Monitor",        badge: "api" },
      { href: "/finance/procurement",   label: "Procurement Agent",     badge: "unique" },
    ],
  },
];

const PLATFORM_ITEMS = [
  { href: "/", label: "Dashboard",   icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/admin/users", label: "User Management", icon: <Users2 className="w-4 h-4" /> },
  { href: "/admin/audit", label: "Audit Logs",      icon: <FileText className="w-4 h-4" /> },
  { href: "/ai/policies", label: "AI Policies",     icon: <ShieldCheck className="w-4 h-4" /> },
  { href: "/ai/insights", label: "AI Insights",     icon: <BrainCircuit className="w-4 h-4" /> },
  { href: "/settings",    label: "Settings",        icon: <Settings className="w-4 h-4" /> },
];

const BADGE_DOT: Record<string, string> = {
  hot:    "#ef4444",
  unique: "#a78bfa",
  core:   "#94a3b8",
  api:    "#22d3ee",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Open all by default initially
    const initial: Record<string, boolean> = {};
    DOMAINS_FOR_SIDEBAR.forEach((d) => { initial[d.key] = true; });
    setOpenDomains(initial);
  }, []);

  const toggleDomain = (key: string) => {
    setOpenDomains(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className="flex flex-col transition-all duration-300 ease-in-out shrink-0 text-white"
      style={{
        width: collapsed ? 64 : 260,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
        height: "100vh",
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center px-4" style={{ height: 64, borderBottom: "1px solid var(--sidebar-border)" }}>
         <Link href="/" className="flex items-center gap-3 overflow-hidden w-full">
            <div className="flex items-center justify-center shrink-0">
               {/* Atlas custom logo visual from screenshot */}
              <div className="relative w-6 h-6 flex items-center justify-center mr-1">
                <div className="absolute w-4 h-4 border-2 border-indigo-400 rounded-sm left-0 top-0 opacity-80 mix-blend-screen" />
                <div className="absolute w-4 h-4 border-2 border-purple-400 rounded-sm right-0 bottom-0 opacity-80 mix-blend-screen" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between">
                <p className="font-bold text-sm tracking-wide text-white font-sans uppercase">ATLAS SKILLTECH</p>
                <button 
                  onClick={(e) => { e.preventDefault(); setCollapsed(true); }}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 text-white/50" />
                </button>
              </div>
            )}
         </Link>
      </div>

      {collapsed && (
        <button 
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 sidebar-scrollbar">
        
        {/* Core Platform Links matching screenshot */}
        <div className="space-y-1 mb-6">
          {PLATFORM_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group"
                style={{ 
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? "text-white" : "text-purple-300"} group-hover:text-white transition-colors`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={`text-[13px] font-medium tracking-wide ${isActive ? "text-white" : "text-purple-200"} group-hover:text-white transition-colors`}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="h-px w-full bg-white/10 my-4" />

        {/* Dynamic Agents List */}
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold tracking-widest text-purple-400 uppercase">
            Platform Agents
          </p>
        )}

        {DOMAINS_FOR_SIDEBAR.map((domain) => (
          <div key={domain.key} className="mb-4">
            {!collapsed && (
              <button 
                onClick={() => toggleDomain(domain.key)}
                className="w-full flex items-center justify-between px-3 py-2 mb-1 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-purple-300 group-hover:text-white transition-colors">{domain.icon}</span>
                  <span className="text-[12px] font-semibold text-purple-200 group-hover:text-white transition-colors">
                    {domain.label}
                  </span>
                </div>
                <ChevronRight 
                  className={`w-3.5 h-3.5 text-purple-400 transition-transform ${openDomains[domain.key] ? "rotate-90" : ""}`} 
                />
              </button>
            )}

            {(openDomains[domain.key] || collapsed) && (
              <div className="space-y-0.5 mt-1 relative">
                {/* Visual guideline */}
                {!collapsed && (
                  <div className="absolute left-[22px] top-1 bottom-1 w-px bg-white/10" />
                )}
                
                {domain.agents.map((agent) => {
                  const isActive = pathname === agent.href || pathname.startsWith(agent.href + "/");
                  return (
                    <Link
                      key={agent.href}
                      href={agent.href}
                      className="flex items-center gap-3 py-2 rounded-lg transition-all relative group"
                      style={{
                        paddingLeft: collapsed ? "12px" : "38px",
                        paddingRight: "12px",
                      }}
                      title={collapsed ? agent.label : ""}
                    >
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm" style={{ background: BADGE_DOT[agent.badge] }} />
                      {!collapsed && (
                        <span className={`text-[12px] truncate transition-colors ${isActive ? "text-white font-medium" : "text-purple-200/80 group-hover:text-white"}`}>
                          {agent.label}
                        </span>
                      )}
                      
                      {collapsed && (
                        <div className="absolute left-14 px-3 py-1.5 rounded-md bg-white text-slate-900 text-[11px] font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                          {agent.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer System Credits */}
      {!collapsed && (
        <div 
          className="p-5" 
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <div className="mb-2 flex justify-between items-end">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">System Credits</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mt-2">
             <div className="h-full bg-emerald-400" style={{ width: "75%" }} />
          </div>
          <p className="text-[10px] font-medium text-purple-300 mt-2">75% Usage Reached</p>
        </div>
      )}
    </aside>
  );
}
