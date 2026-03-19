"use client";

import { useState } from "react";
import { 
  BarChart3, Search, Filter, BookOpen, 
  Target, Zap, Activity, ShieldCheck, 
  ArrowRight, Download, Printer, PlayCircle,
  Globe, MoreHorizontal, Layout, Box,
  Terminal, Share2, Star, TrendingUp,
  FileCode, FileSearch, Presentation,
  Layers, Cpu, Gavel, Award, Sparkles,
  PieChart, FlaskConical, Microscope, FileText,
  BadgeCent, ChevronRight, Medal, CheckCircle2
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME (Business)", color: "text-indigo-500", research: "Market Psycho" },
  { id: "isdi", name: "ISDI (Design)", color: "text-pink-500", research: "Strategic UX" },
  { id: "ugdx", name: "uGDX (Tech)", icon: Cpu, color: "text-cyan-500", research: "Autonomous AI" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", research: "Algorithmic Bias" },
];

const RESEARCH_PROJECTS = [
  { id: "RES-901", title: "NASA Mars Habitat Simulation", school: "ugdx", status: "Active", funding: "₹1.2M", citations: 44, deadline: "May 2024" },
  { id: "RES-902", title: "Consumer Neural Dynamics", school: "isme", status: "Published", funding: "₹800k", citations: 122, deadline: "Closed" },
  { id: "RES-903", title: "Post-Human Design Ethics", school: "isdi", status: "Drafting", funding: "₹450k", citations: 0, deadline: "July 2024" },
];

export default function ResearchAssistantPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full w-fit">
            <Microscope className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">Global IP Orbit v6.2</span>
          </div>
          <h1>Research Control</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for ISME, ISDI, uGDX, and Law research initiatives.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <BadgeCent className="w-5 h-5 text-indigo-500" /> Grant Catalog
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-cyan-400" /> AI Literature Synth
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main Research Hub */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><FlaskConical className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active IP Pipeline</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                           {s.icon ? <s.icon className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {RESEARCH_PROJECTS.filter(p => selectedSchool === 'all' || p.school === selectedSchool).map((p) => {
                     const sObj = SCHOOLS.find(s => s.id === p.school);
                     return (
                        <div key={p.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-cyan-500 transition-all hover:shadow-2xl overflow-hidden">
                           <div className="flex items-center gap-8">
                              <div className={`w-20 h-20 rounded-[2rem] ${sObj?.color.replace('text-', 'bg-')} flex items-center justify-center shadow-2xl mb-auto`}>
                                 {sObj && (sObj.icon ? <sObj.icon className="w-8 h-8 text-white" /> : <Microscope className="w-8 h-8 text-white" />)}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xl font-black text-slate-900 leading-tight">{p.title}</h4>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black text-indigo-500 uppercase">{p.status}</span>
                                       <div className="w-[1px] h-3 bg-slate-200" />
                                       <span className="text-[10px] font-black text-slate-400 uppercase">{p.citations} Citations</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold italic mb-4">
                                    <span className="flex items-center gap-1.5 font-black text-slate-900">Grant Value: {p.funding}</span>
                                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Deadline: {p.deadline}</span>
                                 </div>
                                 
                                 {/* Handoff Insight */}
                                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Sync Status</span>
                                    <div className="flex items-center gap-1">
                                       <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                       <span className="text-[10px] font-black text-emerald-600 uppercase">Released</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <button className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all">Review Dataset</button>
                                 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                    Publish Results <ArrowRight className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Impact & AI Hub */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Research Impact Index */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Medal className="w-6 h-6 text-indigo-400" /> Institutional Impact
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: "NASA Grant Success", val: 92, color: "bg-cyan-500" },
                     { label: "Parsons Peer Rev.", val: 74, color: "bg-pink-500" },
                     { label: "Mumbai Design Collab", val: 88, color: "bg-indigo-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 group/bar">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 group-hover/bar:text-white transition-colors">
                           <span>{s.label}</span>
                           <span className="text-cyan-400">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-8 bg-cyan-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-cyan-100 mb-4 animate-pulse" />
                     <h4 className="text-xl font-black leading-tight mb-2 italic tracking-tighter">AI Literature Scout</h4>
                     <p className="text-xs text-cyan-50 italic mb-6 leading-relaxed">
                       "Found 12 new papers on Algorithmic Bias (Law). Suggesting a join seminar with uGDX Deep Tech bay for v2 research."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-cyan-100 transition-colors">
                       Coordinate Seminar <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-32 h-32" /></div>
               </div>
            </div>

            {/* Grant Resource Monitor */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative group">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <BadgeCent className="w-5 h-5 text-indigo-500" /> Funding Resource Orbit
               </h3>
               
               <div className="space-y-6 px-1">
                  {[
                     { label: "Institutional Fund", used: 4.2, total: 10, color: "bg-indigo-500" },
                     { label: "External Grants", used: 1.8, total: 5, color: "bg-cyan-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">₹{s.used}M / ₹{s.total}M</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${(s.used/s.total)*100}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/card flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grant Agent Audit</span>
                     <span className="text-xs font-black text-slate-900">All Funds Verified</span>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Globe className="w-4 h-4 text-emerald-400" /> Global Researcher Connect
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
