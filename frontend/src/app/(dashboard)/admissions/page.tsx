"use client";

import { useSchool } from "@/context/SchoolContext";
import { Users, FileText, Zap, Target, Search, ArrowRight, Activity, Timer as Clock } from "lucide-react";
import Link from "next/link";

const AGENTS = [
  {
    id: "intelligence",
    title: "Admissions Intelligence",
    desc: "From raw lead data to ranked institutional applicants in seconds, not days. L4 scoring engine.",
    href: "/admissions/intelligence",
    icon: Zap,
    badge: "Hot",
    color: "indigo"
  },
  {
    id: "leads",
    title: "Lead Nurture",
    desc: "Autonomous drip campaigns and institutional follow-ups targeting high-probability prospects.",
    href: "/admissions/leads",
    icon: Target,
    badge: "Unique",
    color: "violet"
  },
  {
    id: "scholarship",
    title: "Scholarship Matcher",
    desc: "Cross-referencing 200+ government and private schemes for student feasibility.",
    href: "/admissions/scholarship",
    icon: FileText,
    badge: "API",
    color: "sky"
  },
  {
    id: "documents",
    title: "Document Verifier",
    desc: "AI-driven verification of institutional documents to eliminate registry workload.",
    href: "/admissions/documents",
    icon: Search,
    badge: "Core",
    color: "emerald"
  }
];

export default function AdmissionsHub() {
  const { currentSchool } = useSchool();

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-16 shadow-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700`}>
           <Users className={`w-96 h-96 ${currentSchool.color}`} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <Users className={`w-4 h-4 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-[0.2em]`}>{currentSchool.name} Domain</span>
          </div>
          
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Admissions <br/>
            <span className="text-slate-400">Orbit Hub</span>
          </h1>
          
          <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            Coordinating high-frequency applicant outreach and institutional lead management for {currentSchool.name}.
          </p>
          
          <div className="flex items-center gap-8 pt-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">4 Active Agents</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Health: 99.8%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Agents Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {AGENTS.map((agent) => (
          <Link 
            key={agent.id} 
            href={agent.href}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-10 hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden"
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
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[10px] font-black text-slate-300 uppercase italic">L4 Autonomous</span>
               </div>
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
