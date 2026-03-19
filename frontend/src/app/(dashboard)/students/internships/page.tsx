"use client";

import { useState } from "react";
import { 
  Briefcase, Search, Filter, Globe,
  Target, Zap, Activity, ShieldCheck, 
  BookOpen, Layers, Cpu, Gavel, 
  ArrowRight, Download, Printer, PlayCircle,
  MoreHorizontal, Layout, Box,
  Terminal, Share2, Star, TrendingUp,
  FileCode, FileSearch, Presentation,
  Building2, Users, MapPin, CheckCircle2,
  ExternalLink, TrendingDown, Medal, Sparkles,
  Clock, ChevronRight
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", icon: Building2, color: "text-indigo-500", partners: ["Bloomberg", "Goldman Sachs", "HUL"] },
  { id: "isdi", name: "ISDI Design", icon: Layers, color: "text-pink-500", partners: ["Parsons", "IDEO", "Vogue"] },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", partners: ["NASA", "Tesla", "Microsoft"] },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", partners: ["AZB", "Shardul Amarchand", "UN"] },
];

const OPPORTUNITIES = [
  { id: "INT-501", company: "NASA", school: "ugdx", role: "Rover Simulation Intern", location: "Remote/Houston", stipend: "₹45k", deadline: "22 May", status: "Scouting", match: 94 },
  { id: "INT-502", company: "Bloomberg", school: "isme", role: "Market Analyst", location: "Mumbai", stipend: "₹38k", deadline: "24 May", status: "Interviewing", match: 88 },
  { id: "INT-503", company: "Parsons School", school: "isdi", role: "Design Researcher", location: "New York", stipend: "₹65k", deadline: "28 May", status: "Shortlisted", match: 72 },
  { id: "INT-504", company: "AZB & Partners", school: "law", role: "Legal Associate (AI Law)", location: "Delhi", stipend: "₹42k", deadline: "12 June", status: "Open", match: 91 },
];

export default function StudentInternshipsPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
            <Medal className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Global Industry Orbit v5.0</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Industry Portal</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for ISME, ISDI, uGDX, and Law summer internships.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Building2 className="w-5 h-5 text-indigo-500" /> Partner Catalog
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Opportunity Match
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main Opportunity Hub */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Briefcase className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Summer '24 Internship Pipeline</h2>
                  </div>
                  <div className="flex items-center gap-2">
                      {SCHOOLS.map((s) => {
                         const Icon = s.icon;
                         return (
                           <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                             <Icon className="w-5 h-5" />
                           </button>
                         );
                      })}
                  </div>
               </div>

               <div className="space-y-4">
                  {OPPORTUNITIES.filter(o => selectedSchool === 'all' || o.school === selectedSchool).map((o) => {
                     const sObj = SCHOOLS.find(s => s.id === o.school);
                     return (
                        <div key={o.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl overflow-hidden">
                           <div className="flex items-center gap-8">
                              <div className={`w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-lg group-hover:bg-indigo-50 transition-colors`}>
                                 <Building2 className={`w-8 h-8 ${sObj?.color || 'text-slate-300'}`} />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">{o.company}</h3>
                                    <div className={`text-[9px] font-black ${sObj?.color} uppercase tracking-widest font-mono`}>{o.role}</div>
                                 </div>
                                 <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold">
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {o.location}</span>
                                    <span className="flex items-center gap-1.5 font-black text-slate-900 italic">Expected Stipend: {o.stipend}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${o.status === 'Interviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : o.status === 'Shortlisted' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'Shortlisted' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'} inline-block mr-1`} />
                                    {o.status}
                                 </div>
                                 <div className="text-2xl font-black text-slate-900 tracking-tighter">{o.match}% Match</div>
                              </div>
                           </div>
                           
                           {/* Action Bar */}
                           <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase">Deadline: {o.deadline}</span>
                                 </div>
                                 <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase">IRI Verified</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                                    Quick Apply <ArrowRight className="w-3.5 h-3.5" />
                                 </button>
                                 <button className="p-3 border border-slate-100 rounded-2xl text-slate-300 hover:text-indigo-600 transition-all">
                                    <ExternalLink className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Analytics & AI Hub */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* IRI Readiness Dashboard */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-indigo-400" /> Internship Readiness (IRI)
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: "Technical Mastery", val: 82, color: "bg-indigo-500" },
                     { label: "Portfolio Assessment", val: 94, color: "bg-pink-500" },
                     { label: "Interview Confidence", val: 78, color: "bg-cyan-500" },
                     { label: "Soft Skill Benchmarking", val: 65, color: "bg-amber-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">
                           <span>{s.label}</span>
                           <span className="text-indigo-400">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.2)]`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-8 bg-indigo-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-indigo-100 mb-4" />
                     <h4 className="text-xl font-black leading-tight mb-2">AI Placement Scout</h4>
                     <p className="text-xs text-indigo-50 italic mb-6 leading-relaxed">
                       "Top Match Detected: NASA Rover Simulation (uGDX). Your PR-801 project score (92%) aligns perfectly with their Deep Tech requirements."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-100 transition-colors">
                       Priority Profile Sync <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Building2 className="w-32 h-32" /></div>
               </div>
            </div>

            {/* Industrial Placement Historicals */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" /> Professional Outcomes
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Avg Stipend</div>
                     <div className="text-xl font-black text-slate-800">₹42k <span className="text-[10px] text-emerald-500 font-bold">+12%</span></div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">PPO Conversion</div>
                     <div className="text-xl font-black text-slate-800">44% <span className="text-[10px] text-emerald-500 font-bold">+5%</span></div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Top Hiring</div>
                     <div className="text-sm font-black text-slate-800">ISME x Bloomberg</div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Global Placed</div>
                     <div className="text-xl font-black text-slate-800">122 <span className="text-[10px] text-slate-400 font-bold">Students</span></div>
                  </div>
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Globe className="w-4 h-4 text-emerald-400" /> View Global Alumni Connect
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
