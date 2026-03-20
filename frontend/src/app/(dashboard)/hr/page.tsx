"use client";

import { useSchool } from "@/context/SchoolContext";
import { Target, Users, LayoutDashboard, Brain, Activity, Clock, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

const AGENTS = [
  {
    id: "bot",
    title: "HR Operations Bot",
    desc: "Autonomous resolution of institutional HR queries, policies, and grievance handling.",
    href: "/hr/bot",
    icon: LayoutDashboard,
    badge: "Core",
  },
  {
    id: "leave",
    title: "Leave Manager",
    desc: "Smart leave approval and allocation engine based on institutional availability.",
    href: "/hr/leave-manager",
    icon: Clock,
    badge: "Core",
  },
  {
    id: "recruitment",
    title: "Recruitment Pipeline",
    desc: "Automated faculty recruitment from job posting to AI interview scheduling.",
    href: "/hr/recruitment",
    icon: Users,
    badge: "API",
  },
  {
    id: "appraisal",
    title: "Appraisal Agent",
    desc: "Predictive performance tracking and annual KPI generation for institutional staff.",
    href: "/hr/appraisal",
    icon: Brain,
    badge: "Unique",
  },
  {
    id: "load",
    title: "Faculty Load Balancer",
    desc: "Optimizing institutional teaching hours and departmental load distributions.",
    href: "/hr/load-balancer",
    icon: Activity,
    badge: "Unique",
  }
];

export default function HRHub() {
  const { currentSchool } = useSchool();

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-16 shadow-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700`}>
           <Briefcase className={`w-96 h-96 ${currentSchool.color}`} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <Target className={`w-4 h-4 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-[0.2em]`}>{currentSchool.name} Domain</span>
          </div>
          
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Workforce <br/>
            <span className="text-slate-400">Sync Hub</span>
          </h1>
          
          <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            Coordinating institutional faculty loads and HR operations with automated L4 workforce orchestration.
          </p>
          
          <div className="flex items-center gap-8 pt-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">5 Active Systems</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Health: 99.1%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AGENTS.map((agent) => (
          <Link 
            key={agent.id} 
            href={agent.href}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-10 hover:shadow-2xl hover:-translate-y-2 transition-all"
          >
            <div className={`p-4 rounded-2xl bg-slate-50 ${currentSchool.color} w-fit mb-6 group-hover:${currentSchool.bg} transition-colors shadow-sm`}>
              <agent.icon className="w-8 h-8" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{agent.title}</h3>
               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:${currentSchool.bg} group-hover:${currentSchool.color}`}>{agent.badge}</span>
            </div>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 opacity-80 italic">
              {agent.desc}
            </p>
            
            <div className="flex items-center justify-end pt-6 border-t border-slate-50">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
