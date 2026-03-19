"use client";

import { useState } from "react";
import { 
  Briefcase, Search, Filter, Globe,
  Target, Zap, Activity, ShieldCheck, 
  ArrowRight, Download, Printer, PlayCircle,
  MoreHorizontal, Layout, Box,
  Terminal, Share2, Star, TrendingUp,
  FileCode, FileSearch, Presentation,
  Building2, Users, MapPin, CheckCircle2,
  ExternalLink, TrendingDown, Medal, Sparkles,
  Award, PieChart, BarChart3, Radio,
  UserCheck, FileUser, Video, MessageSquare,
  Cpu, Gavel, BookOpen, Library
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "text-indigo-500", domain: "Finance/Ops" },
  { id: "isdi", name: "ISDI Design", color: "text-pink-500", domain: "Strategy/UX" },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", domain: "AI/Robotics" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", domain: "Digital Law" },
];

const PLACEMENT_LOGS = [
  { id: "P-301", student: "Akshay S.", company: "NASA", school: "ugdx", role: "AI Ethicist", status: "Offer Made", package: "₹18 LPA" },
  { id: "P-302", student: "Riya M.", company: "Bloomberg", school: "isme", role: "Traders Analyst", status: "Reviewing", package: "₹14 LPA" },
  { id: "P-303", student: "Kiara D.", company: "Parsons Collab", school: "isdi", role: "Strategic UX", status: "Interviewing", package: "₹22 LPA" },
];

export default function PlacementIntelligencePage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Pipeline HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
            <Medal className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Global Career Orbit v4.2</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Career Intelligence</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for ISME, ISDI, uGDX, and Law student placements.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <FileUser className="w-5 h-5 text-indigo-500" /> Resume Vault
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-emerald-400" /> AI Mock Interviewer
           </button>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
           { label: "Overall Placed", val: "84%", color: "text-emerald-500" },
           { label: "Avg CTC", val: "₹14.2L", color: "text-indigo-500" },
           { label: "Top Domain", val: "uGDX (AI)", color: "text-cyan-500" },
           { label: "PPO Rate", val: "42%", color: "text-pink-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
            <div className={`absolute bottom-[-10px] right-[-10px] opacity-5 group-hover:scale-110 transition-transform ${s.color.replace('text-', 'text-')}`}><Medal className="w-24 h-24" /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Outcome Registry */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg text-white font-black">AI</div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Industrial Outcome Registry</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                           {s.id === 'ugdx' ? <Cpu className="w-5 h-5" /> : s.id === 'law' ? <Gavel className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {PLACEMENT_LOGS.filter(p => selectedSchool === 'all' || p.school === selectedSchool).map((p) => {
                     const sObj = SCHOOLS.find(s => s.id === p.school);
                     return (
                        <div key={p.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-emerald-500 transition-all hover:shadow-2xl overflow-hidden">
                           <div className="flex items-center gap-8">
                              <div className={`w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-lg group-hover:bg-emerald-50 transition-colors`}>
                                 <UserCheck className={`w-8 h-8 ${sObj?.color || 'text-slate-300'}`} />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-black text-slate-900 leading-tight">{p.student}</h4>
                                    <div className={`text-[9px] font-black ${sObj?.color} uppercase tracking-widest font-mono`}>{p.company}</div>
                                 </div>
                                 <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold mb-4">
                                    <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Role: {p.role}</span>
                                    <span className="flex items-center gap-1.5 font-black text-slate-900 italic">Package: {p.package}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${p.status === 'Offer Made' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : p.status === 'Reviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Offer Made' ? 'bg-emerald-500' : p.status === 'Reviewing' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'} inline-block mr-1`} />
                                    {p.status}
                                 </div>
                                 <button className="p-2 transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-emerald-600">
                                    <MoreHorizontal className="w-6 h-6" />
                                 </button>
                              </div>
                           </div>
                           
                           {/* Handoff Insight */}
                           <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Alumni Verified</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">
                                    View Industrial Portfolio <ArrowRight className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Career AI & Readiness */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* AI Mock Feedback Orbit */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Video className="w-6 h-6 text-emerald-400" /> AI Interview Insight
               </h3>
               
               <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card mb-8">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-emerald-300 mb-6" />
                     <h4 className="text-2xl font-black leading-tight mb-2 tracking-tighter">Mock v4.0 Feedback</h4>
                     <p className="text-xs text-slate-300 italic mb-10 leading-relaxed">
                       "Akshay S. (uGDX) showed 94% technical mastery in NASA simul-ops. Cultural fit score (78%) could be improved by focusing on 'Interdisciplinary Design' ethics."
                     </p>
                     
                     <div className="space-y-4">
                        {[
                           { label: "Technical Precision", val: 94 },
                           { label: "Soft Skills Synergy", val: 62 },
                        ].map((m, i) => (
                           <div key={i} className="space-y-1">
                              <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                 <span>{m.label}</span>
                                 <span className="text-white">{m.val}%</span>
                              </div>
                              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.val}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><MessageSquare className="w-32 h-32" /></div>
               </div>
               
               <button className="w-full py-5 border border-white/20 text-white font-black text-xs rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5 text-emerald-400" /> Re-trigger Mock Interview
               </button>
            </div>

            {/* Industrial Partner Saturation */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative group">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" /> Partner Domain Sync
               </h3>
               
               <div className="space-y-5 px-1">
                  {[
                     { label: "Bloomberg (ISME)", status: "Active Vacancy", count: 12 },
                     { label: "NASA (uGDX)", status: "Selection Lab", count: 4 },
                     { label: "Parsons (ISDI)", status: "Scouting", count: 8 },
                     { label: "AZB & Part. (Law)", status: "Active Vacancy", count: 2 },
                  ].map((p, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:border-indigo-500 transition-colors">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-900">{p.label}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.status}</span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xs font-black text-slate-800">
                           {p.count}
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Library className="w-4 h-4 text-emerald-400" /> Full Partner Catalog
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
