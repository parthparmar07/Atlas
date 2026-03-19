"use client";

import { useState } from "react";
import { 
  BookOpen, PlusCircle, CheckCircle2, 
  Search, Filter, BookText, HelpCircle, 
  Map, Target, ArrowRight, Download, Printer,
  Layers, Cpu, Gavel, Award, Globe,
  Sparkles, TrendingUp, Layout, Shield
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME (Business)", color: "text-indigo-500", tracks: ["Digital Branding", "Business Analytics", "Business Psychology"] },
  { id: "isdi", name: "ISDI (Design)", color: "text-pink-500", tracks: ["Fashion Design", "Communication Design", "Product Design"] },
  { id: "ugdx", name: "uGDX (Tech)", icon: Cpu, color: "text-cyan-500", tracks: ["AI & ML", "Data Science", "Robotics"] },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", tracks: ["BBA LL.B. (Hons.)"] },
];

const MODULES = [
  { id: "M-101", name: "FinTech Foundations", school: "isme", type: "Core", credits: 4, level: "Sem 3", prerequisite: "Financial Markets" },
  { id: "M-102", name: "LLM Engineering", school: "ugdx", type: "Elective", credits: 6, level: "Sem 5", prerequisite: "Python & PyTorch" },
  { id: "M-103", name: "Advanced UX Research", school: "isdi", type: "Core", credits: 4, level: "Sem 4", prerequisite: "Human Centered Design" },
  { id: "M-104", name: "IP Law in AI Age", school: "law", type: "Elective", credits: 3, level: "Sem 7", prerequisite: "Contracts II" },
  { id: "M-105", name: "Sustainable Biz Models", school: "isme", type: "Elective", credits: 4, level: "Sem 4", prerequisite: "Biz Ethics" },
  { id: "M-106", name: "Quantum Computing 101", school: "ugdx", type: "Core", credits: 6, level: "Sem 6", prerequisite: "Linear Algebra" },
  { id: "M-107", name: "Bio-Materials Design", school: "isdi", type: "Elective", credits: 5, level: "Sem 5", prerequisite: "Materials Lab" },
  { id: "M-108", name: "Global Trade Policy", school: "law", type: "Core", credits: 4, level: "Sem 4", prerequisite: "Intro to Law" },
];

export default function StudentCourseBuilderPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full w-fit">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Skill Architecture v3.1</span>
          </div>
          <h1>Course Architect</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed curriculum building for ISME, ISDI, uGDX, and Law tracks.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Download className="w-5 h-5 text-indigo-500" /> Syllabus Pack
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Adaptive Builder
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left Side: Modular Hub */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><BookText className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Curriculum Matrix</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Search className="w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search modules..." className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-44" />
                  </div>
               </div>

               <div className="space-y-4">
                  {MODULES.filter(m => selectedSchool === 'all' || m.school === selectedSchool).map((m) => {
                     const sObj = SCHOOLS.find(s => s.id === m.school);
                     return (
                        <div key={m.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-3xl ${sObj?.color.replace('text-', 'bg-')} flex items-center justify-center shadow-xl`}>
                                 {sObj && (sObj.icon ? <sObj.icon className="w-6 h-6 text-white" /> : <BookOpen className="w-6 h-6 text-white" />)}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-black text-slate-900">{m.name}</h4>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black text-indigo-500 uppercase">{m.level}</span>
                                       <div className="w-[1px] h-3 bg-slate-200" />
                                       <span className="text-[10px] font-black text-slate-400 uppercase">{m.credits} Credits</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold">
                                    <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Prereq: {m.prerequisite}</span>
                                    <span className="flex items-center gap-1.5"><Shield className={`w-3.5 h-3.5 ${m.type === 'Core' ? 'text-rose-500' : 'text-emerald-500'}`} /> {m.type}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <button className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Preview Syllabus</button>
                                 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                    Add Module <PlusCircle className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Track Analysis & AI Hub */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Specialization Orbit */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Map className="w-6 h-6 text-indigo-400" /> Track Specialization
               </h3>
               
               <div className="space-y-4">
                  {SCHOOLS.map((s, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedSchool(s.id)}
                        className={`w-full p-5 rounded-[2rem] border transition-all text-left ${selectedSchool === s.id ? "bg-white/10 border-white/20" : "bg-transparent border-white/5 opacity-50 hover:opacity-100"}`}
                     >
                        <div className="flex items-center justify-between mb-3">
                           <span className="text-xs font-black uppercase tracking-widest">{s.name}</span>
                           <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                           {s.tracks.map((t, j) => (
                              <span key={j} className="text-[9px] font-black bg-white/5 px-2 py-0.5 rounded border border-white/5">{t}</span>
                           ))}
                        </div>
                     </button>
                  ))}
               </div>
            </div>

            {/* AI Advisor Hub */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <Sparkles className="w-8 h-8 text-amber-300 mb-6" />
                  <h3 className="text-2xl font-black leading-tight mb-2">AI Track Consultant</h3>
                  <p className="text-sm text-indigo-50 leading-relaxed mb-10 italic">
                    "Detected high interest in AI/ML (uGDX). Recommending 'Generative Design 4.0' from ISDI for a tech-design cross-credit."
                  </p>
                  
                  <div className="p-5 bg-white/10 rounded-[2rem] border border-white/10">
                     <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">Pre-requisite Audit</div>
                     <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-white">Python for Law</span>
                        <span className="text-[10px] bg-rose-500 px-2 py-0.5 rounded-full font-black">Missing</span>
                     </div>
                     <button className="w-full py-3 rounded-xl bg-white/10 text-xs font-black hover:bg-white/20 transition-all border border-white/5">Auto-Schedule Prereq</button>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Layers className="w-48 h-48" /></div>
            </div>

            {/* Program Health Chart (Mock) */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" /> Professional Mastery
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: "Technical Proficiency", val: 82 },
                     { label: "Design Thinking", val: 44 },
                     { label: "Business Ethics", val: 92 },
                     { label: "Law/Policy Compliance", val: 12 },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Globe className="w-4 h-4 text-emerald-400" /> Export for LinkedIn
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
