"use client";

import { useSchool } from "@/context/SchoolContext";
import { BookOpen, Calendar, ClipboardCheck, Clock, ArrowRight, Activity, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

const AGENTS = [
  {
    id: "calendar",
    title: "Calendar Intelligence",
    desc: "Single source of truth for all institutional dates, events, and academic milestones.",
    href: "/academics/calendar",
    icon: Calendar,
    badge: "Core",
  },
  {
    id: "exams",
    title: "Examination Control",
    desc: "Autonomous scheduling of proctors, venues, and seated sequences for finals.",
    href: "/academics/exams",
    icon: ClipboardCheck,
    badge: "Hot",
  },
  {
    id: "timetable",
    title: "Timetable AI",
    desc: "Clash-free institutional scheduling for thousands of students and faculty members.",
    href: "/academics/timetable",
    icon: Clock,
    badge: "Hot",
  },
  {
    id: "curriculum",
    title: "Curriculum Auditor",
    desc: "AI audit of course delivery against institutional goals and NAAC/NIRF standards.",
    href: "/academics/curriculum",
    icon: Layers,
    badge: "Unique",
  },
  {
      id: "substitution",
      title: "Substitution Agent",
      desc: "Instant faculty substitution matching based on profile, load, and proximity.",
      href: "/academics/substitution",
      icon: Sparkles,
      badge: "Core",
    }
];

export default function AcademicsHub() {
  const { currentSchool } = useSchool();

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-16 shadow-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700`}>
           <BookOpen className={`w-96 h-96 ${currentSchool.color}`} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <BookOpen className={`w-4 h-4 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-[0.2em]`}>{currentSchool.name} Domain</span>
          </div>
          
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Academic <br/>
            <span className="text-slate-400">Command Hub</span>
          </h1>
          
          <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            orchestrating a clash-free institutional lifecycle across {currentSchool.name}.
          </p>
          
          <div className="flex items-center gap-8 pt-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">5 Active Systems</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">L4 Autonomy Peak</span>
             </div>
          </div>
        </div>
      </div>

      {/* Grid */}
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
