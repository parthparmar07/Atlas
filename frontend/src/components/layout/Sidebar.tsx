"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BarChart3, Users, Settings, BookOpen, GraduationCap,
  Briefcase, Target, Shield, LayoutDashboard, ChevronLeft, Menu, Activity, ChevronDown
} from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, any> = {
  "layout-dashboard": LayoutDashboard,
  "users": Users,
  "settings": Settings,
  "activity": Activity,
  "shield": Shield,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  "briefcase": Briefcase,
  "target": Target,
};

const DEFAULT_PLATFORM_CORE = [
  { title: "Command Center", href: "/", icon: "layout-dashboard", color: "text-indigo-400" },
  { title: "Active Directory", href: "/admin/users", icon: "users", color: "text-slate-300" },
  { title: "Administrator", href: "/settings", icon: "settings", color: "text-slate-300" },
  { title: "Audit Logs", href: "/admin/audit", icon: "activity", color: "text-slate-300" },
  { title: "Security Core", href: "/ai/policies", icon: "shield", color: "text-slate-300" },
];

const DOMAIN_GROUP = { group: "Platform Domains", items: [
    { 
      title: "Admissions & Leads", icon: Users, href: "/admissions", color: "text-indigo-400",
      subItems: [
        { title: "Lead Nurture", href: "/admissions/leads" },
        { title: "Admissions Intel", href: "/admissions/intelligence" },
        { title: "Scholarship", href: "/admissions/scholarship" },
        { title: "Documents", href: "/admissions/documents" }
      ]
    },
    { 
      title: "Academics", icon: BookOpen, href: "/academics", color: "text-sky-400",
      subItems: [
        { title: "Calendar", href: "/academics/calendar" },
        { title: "Timetable", href: "/academics/timetable" },
        { title: "Curriculum", href: "/academics/curriculum" },
        { title: "Substitution", href: "/academics/substitution" }
      ]
    },
    { 
      title: "HR & Faculty", icon: Target, href: "/hr", color: "text-emerald-400",
      subItems: [
        { title: "HR Bot", href: "/hr/bot" },
        { title: "Recruitment", href: "/hr/recruitment" },
        { title: "Appraisal", href: "/hr/appraisal" },
        { title: "Faculty Load Balancer", href: "/hr/load-balancer" }
      ]
    },
    { 
      title: "Student Lifecycle", icon: GraduationCap, href: "/students", color: "text-pink-400",
      subItems: [
        { title: "Dropout Predictor", href: "/students/dropout" },
        { title: "Grievance", href: "/students/grievance" },
        { title: "Internships", href: "/students/internships" },
        { title: "Projects", href: "/students/projects" }
      ]
    },
    { 
      title: "Placement & Industry", icon: Briefcase, href: "/placement", color: "text-orange-400",
      subItems: [
        { title: "Placement Intel", href: "/placement/intelligence" },
        { title: "Interview Prep", href: "/placement/interview-prep" },
        { title: "Resume Review", href: "/placement/resume" },
        { title: "Alumni Network", href: "/placement/alumni" }
      ]
    },
    { 
      title: "Finance & Compliance", icon: LayoutDashboard, href: "/finance", color: "text-amber-400",
      subItems: [
        { title: "Budget Monitor", href: "/finance/budget" },
        { title: "Procurement", href: "/finance/procurement" },
        { title: "Fee Collection", href: "/finance/fees" },
        { title: "Accreditation", href: "/finance/accreditation" }
      ]
    }
  ]};

function NavItem({ item, collapsed, pathname }: { item: any, collapsed: boolean, pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isParentActive = pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/");
  
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative cursor-pointer",
          isParentActive ? "bg-indigo-600/10 border border-indigo-500/20 text-white" : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
        )}
        onClick={() => {
          if (hasSubItems && !collapsed) {
            setIsOpen(!isOpen);
          } else if (hasSubItems && collapsed) {
            // Just act as a link or expand sidebar, for simplicity we won't auto-expand here, Next Link doesn't wrap entirely
          }
        }}
      >
        <Link href={hasSubItems ? "#" : item.href} className="flex items-center gap-3 flex-1 overflow-hidden pointer-events-auto">
          <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isParentActive ? "text-indigo-400" : item.color)} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium text-sm whitespace-nowrap overflow-hidden flex-1"
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {!collapsed && hasSubItems && (
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200 text-slate-500",
              isOpen ? "rotate-180 text-indigo-400" : ""
            )}
          />
        )}
        
        {!collapsed && isParentActive && !hasSubItems && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && !collapsed && hasSubItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2 pl-10 pr-3 flex flex-col gap-1 flex-1 relative">
              {/* Connection Line */}
              <div className="absolute left-[22px] top-0 bottom-3 w-[1px] bg-[#2d2859] rounded-full" />
              
              {item.subItems.map((sub: any, i: number) => {
                const isChildActive = pathname === sub.href;
                return (
                  <Link
                    key={i}
                    href={sub.href}
                    className={cn(
                      "text-[13px] py-2 px-3 rounded-lg transition-colors relative",
                      isChildActive 
                        ? "text-indigo-400 bg-indigo-500/10 font-medium" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "absolute -left-[14px] top-1/2 -translate-y-1/2 w-3 h-[1px]",
                      isChildActive ? "bg-indigo-500" : "bg-[#2d2859]"
                    )} />
                    <span className="relative z-10">{sub.title}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [platformCoreItems, setPlatformCoreItems] = useState<any[]>(
    DEFAULT_PLATFORM_CORE.map((item) => ({ ...item, icon: ICON_MAP[item.icon] || LayoutDashboard }))
  );

  useEffect(() => {
    setMounted(true);
    const loadPlatformCore = async () => {
      try {
        const res = await fetchWithAuth("/api/admin/navigation/platform-core");
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data?.items)) return;
        const mapped = data.items.map((item: any) => ({
          title: item.title,
          href: item.href,
          color: item.color || "text-slate-300",
          icon: ICON_MAP[item.icon] || LayoutDashboard,
        }));
        if (mapped.length > 0) setPlatformCoreItems(mapped);
      } catch {
        // Keep defaults when API is unavailable.
      }
    };
    loadPlatformCore();
  }, []);

  if (!mounted) return <div className="w-[280px] bg-[#1a163a] shrink-0" />;

  const menuItems = [
    { group: "Platform Core", items: platformCoreItems },
    DOMAIN_GROUP,
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-[#1a163a] text-slate-300 flex flex-col shrink-0 relative z-30 transition-shadow sidebar-scrollbar overflow-y-auto overflow-x-hidden border-r border-[#2d2859]"
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center px-5 shrink-0 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 font-bold text-lg leading-none">A</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-bold text-white text-base tracking-wide leading-tight">ATLAS</span>
                <span className="text-[10px] text-indigo-300 tracking-wider font-semibold">SKILLTECH</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors absolute right-4 text-slate-400 hover:text-white"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-6 w-full">
        {menuItems.map((group, idx) => (
          <div key={idx} className="flex flex-col w-full">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-6 mb-2 text-[10px] font-bold text-indigo-400/50 uppercase tracking-widest whitespace-nowrap"
                >
                  {group.group}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-1 px-3">
              {group.items.map((item, itemIdx) => (
                <NavItem key={itemIdx} item={item} collapsed={collapsed} pathname={pathname} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile / Actions */}
      <div className="p-4 border-t border-[#2d2859] shrink-0">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 block shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <span className="text-sm font-semibold text-white truncate">Administrator</span>
                <span className="text-xs text-slate-400 truncate">System Access</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}