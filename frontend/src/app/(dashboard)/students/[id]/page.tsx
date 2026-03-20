"use client";

import { useState, useEffect } from "react";
import { 
  Zap, Brain, Activity, UserCircle2, 
  MapPin, Clock, Calendar, ShieldCheck, 
  ArrowUpRight, Sparkles, RefreshCw, 
  FileText, Briefcase, GraduationCap,
  MessageSquare, Layers, ChevronRight
} from "lucide-react";
import Link from "next/link";

import { useSchool } from "@/context/SchoolContext";

export default function StudentDetailMatrix({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);
  const { currentSchool: school } = useSchool();
  const studentId = params.id;

  // Mock student state - in reality, would fetch by ID
  const student = {
    id: studentId,
    name: "Rohan Mehra",
    school: school.name,
    program: "BBA Finance & GenAI",
    stage: "Experience (Year 3)",
    status: "At Risk",
    risk_score: 72,
    risk_level: "High",
    stats: { attendance: 65, gpa: 2.4, feedback: 4, tasks: 12 },
    synaptic_feed: [
      { id: 1, agent: "AdmissionsIntel", action: "Matched Merit", detail: "Initial alignment 92% (High Tech-Intent).", time: "2y ago" },
      { id: 2, agent: "DropoutPredictor", action: "Attendance Drop", detail: "Significant dip (30%) in block weeks.", time: "2d ago", alert: true },
      { id: 3, agent: "FinanceBot", action: "Grant Re-appraisal", detail: "Proposed scholarship revision due to GPA.", time: "1d ago" },
      { id: 4, agent: "PlacementIntel", action: "Opportunity Sync", detail: "Mapped to FinTech internship track.", time: "Now" },
    ]
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Header Orbit */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
           <div className={`w-24 h-24 rounded-3xl ${school.color.replace('text', 'bg')} flex items-center justify-center font-black text-white text-4xl shadow-2xl border-4 border-white`}>
             {student.name.split(' ').map(n=>n[0]).join('')}
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                   {student.status} ∙ {student.risk_level} Risk
                 </span>
                 <span className={`px-3 py-1 ${school.bg} border border-indigo-100 ${school.color} rounded-full text-[10px] font-black uppercase tracking-widest`}>
                   {school.name}
                 </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{student.name}</h1>
              <p className="text-lg text-slate-500 font-medium">{student.program} ∙ {school.name} Matrix #{student.id}</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-black text-xs hover:shadow-xl transition-all h-fit">
             <MessageSquare className="w-4 h-4" /> Message Parent
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 h-fit">
             <Sparkles className="w-4 h-4" /> Agentic Intervention
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Lifecycle Orbit */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
           
           {/* Timeline Matrix */}
           <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Lifecycle State Orbit</h3>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">360 Snapshot ∙ 2021-2024</div>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-4 relative">
                {/* Connector line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-50 -translate-y-1/2 z-0" />
                
                {[
                  { label: "Admissions (Orbit)", val: "Lead ➔ Enrolled", status: "Resolved", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Envision (Foundations)", val: "Sem 1 ➔ Sem 2", status: "Completed", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Experience (Growth)", val: "Sem 3 ➔ Sem 6", status: "Ongoing", icon: Layers, color: "text-rose-500", bg: "bg-rose-50" },
                  { label: "Evolution (Impact)", val: "Intern ➔ Placement", status: "Predicted", icon: Briefcase, color: "text-slate-200", bg: "bg-slate-50" },
                ].map((s, i) => (
                  <div key={i} className="relative z-10 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</div>
                    <div className="text-sm font-black text-slate-900 whitespace-nowrap mb-2">{s.val}</div>
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">{s.status}</span>
                  </div>
                ))}
             </div>
           </div>

           {/* Technical Stats HUD */}
           <div className="grid grid-cols-3 gap-8">
              {[
                { label: "Engagement Velocity", val: `${student.stats.attendance}%`, score: -12, color: "text-rose-500", icon: Activity },
                { label: "GPA Projection", val: student.stats.gpa, score: -0.4, color: "text-rose-500", icon: Brain },
                { label: "Course Competency", val: "78/100", score: 2, color: "text-emerald-500", icon: ShieldCheck },
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-between aspect-square">
                   <div className="flex items-center justify-between">
                     <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                     <s.icon className={`w-5 h-5 ${s.color}`} />
                   </div>
                   <div className="space-y-1">
                      <div className="text-4xl font-black text-slate-900">{s.val}</div>
                      <div className={`text-xs font-bold leading-none ${s.score > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.score > 0 ? '▲' : '▼'} {Math.abs(s.score)}% compared to cohort
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Synaptic Signal Bus */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-[#1a163a] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden h-full">
             {/* Gradient glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
             
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Synaptic Activity</h3>
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">Real-time Agent Handoffs</div>
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                {student.synaptic_feed.map((f, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-indigo-500/20 group pb-6">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#1a163a] ${f.alert ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{f.agent}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{f.time}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl group-hover:bg-white/10 transition-all">
                       <div className="text-sm font-black text-white mb-2">{f.action}</div>
                       <p className="text-xs text-slate-400 leading-relaxed italic">"{f.detail}"</p>
                    </div>
                  </div>
                ))}
             </div>

             <button className="w-full mt-8 py-5 bg-white text-indigo-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">
               View Full Neural Chain
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
