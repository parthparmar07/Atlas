"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, Briefcase, 
  MapPin, Clock, CheckCircle2, AlertCircle, 
  ArrowRight, UserPlus, FileText, Layout,
  BookOpen, Layers, Cpu, Gavel, 
  Sparkles, Zap, ClipboardList, Shield,
  TrendingUp, Star, MoreHorizontal, Mail, Phone,
  BarChart3, Medal, TrendingDown, Target, PieChart,
  ChevronRight, Activity, PlusSquare
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "text-indigo-500" },
  { id: "isdi", name: "ISDI Design", color: "text-pink-500" },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500" },
];

const APPRAISALS = [
  { id: "APR-201", name: "Dr. Elena Gilbert", school: "ugdx", period: "Annual 2023-24", score: 9.4, status: "Reviewing", kpi: "Research/NASA", trend: "up" },
  { id: "APR-202", name: "Prof. Damon S.", school: "isdi", period: "30-Day Checkpoint", score: 8.8, status: "Self-Appraisal", kpi: "Parsons Collab", trend: "stable" },
  { id: "APR-203", name: "Siddharth Roy.", school: "isme", period: "Annual 2023-24", score: 7.2, status: "Manager Review", kpi: "Bloomberg Lab", trend: "down" },
  { id: "APR-204", name: "Adv. Caroline F.", school: "law", period: "60-Day Review", score: 9.1, status: "Completed", kpi: "Moot Court Coord", trend: "up" },
];

const PERFORMANCE_METRICS = [
  { label: "Cycle Completion", val: "72%", trend: "+12%", color: "text-indigo-500" },
  { label: "Top Performer Avg", val: "9.2", trend: "+0.4", color: "text-emerald-500" },
  { label: "Feedback Loop Rate", val: "98%", trend: "Stable", color: "text-indigo-400" },
  { label: "Promotion Budget", val: "₹1.4M", trend: "+₹200k", color: "text-slate-500" },
];

export default function HRAppraisalPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Medal className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Merit Lifecycle Core</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Performance Orbit</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed merit and appraisal system across ISME, ISDI, uGDX, and Law schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <PlusSquare className="w-5 h-5 text-indigo-500" /> Launch Review Cycle
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Merit Score Sync
           </button>
        </div>
      </div>

      {/* Institutional Merit Summary HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PERFORMANCE_METRICS.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl group hover:border-indigo-500/50 transition-all">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</div>
            <div className="flex items-end justify-between">
              <span className={`text-4xl font-black ${s.color}`}>{s.val}</span>
              <span className={`text-[10px] font-black p-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Active Appraisals */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Activity className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merit Lifecycle Queue</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-indigo-600">Download Matrix (CSV)</button>
                     <div className="w-[1px] h-4 bg-slate-200 mx-2" />
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                           {s.icon ? <s.icon className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {APPRAISALS.filter(a => selectedSchool === 'all' || a.school === selectedSchool).map((a) => {
                     const sObj = SCHOOLS.find(s => s.id === a.school);
                     return (
                        <div key={a.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors relative overflow-hidden">
                                 {a.name.split(' ').map(n=>n[0]).join('')}
                                 {a.trend === 'up' && <div className="absolute top-0 right-0 p-1 bg-emerald-500"><TrendingUp className="w-2 h-2 text-white" /></div>}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-1">
                                    <span className="text-sm font-black text-slate-900">{a.name}</span>
                                    <div className={`text-[9px] font-black ${sObj?.color} uppercase tracking-widest`}>{sObj?.name}</div>
                                 </div>
                                 <div className="flex items-center gap-5 text-[11px] text-slate-500 font-bold">
                                    <span className="flex items-center gap-1 font-black text-slate-700">{a.period}</span>
                                    <span className="flex items-center gap-1 opacity-60 italic">Key Result: {a.kpi}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${a.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : a.status === 'Reviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                                    {a.status}
                                 </div>
                                 <div className="text-2xl font-black text-slate-900 italic tracking-tighter">{a.score}/10</div>
                              </div>
                           </div>
                           
                           <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black">R{i}</div>
                                    ))}
                                 </div>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">3 Peer Reviews Ready</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    View Detailed Matrix
                                 </button>
                                 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                    Sign & Finalize <ArrowRight className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Quadrant & AI Insights */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <BarChart3 className="w-6 h-6 text-indigo-400" /> Merit Quadrant
               </h3>
               
               <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl relative p-8">
                  {/* Quadrant Lines */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
                  <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/10" />
                  
                  {/* Data Points */}
                  <div className="absolute top-[20%] right-[20%] w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
                  <div className="absolute bottom-[30%] right-[40%] w-3 h-3 bg-indigo-500 rounded-full" />
                  <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-amber-500 rounded-full" />
                  
                  {/* Labels */}
                  <div className="absolute top-2 right-2 text-[9px] font-black text-emerald-400 uppercase">Top Talent</div>
                  <div className="absolute bottom-2 left-2 text-[9px] font-black text-rose-400 uppercase">Under Review</div>
               </div>
               
               <div className="mt-8 p-6 bg-white/5 rounded-[2rem] border border-white/10 relative">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Appraisal Feedback</div>
                  <p className="text-xs text-slate-400 italic mb-4 leading-relaxed line-clamp-2">
                    "Dr. Elena (uGDX) exceeds NASA participation KPIs by 40%. Suggesting 'Level 2 Senior Research Tenure' promotion."
                  </p>
                  <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-300 transition-colors">
                    Draft Promotion Plan <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-indigo-500" /> Institutional Goals
               </h3>
               
               <div className="space-y-5">
                  {[
                     { label: "Research Citations", avg: 8.2, target: 10, color: "bg-indigo-500" },
                     { label: "Parsons Peer Rev.", avg: 7.4, target: 8, color: "bg-pink-500" },
                     { label: "Moot Court Wins", avg: 3.1, target: 4, color: "bg-amber-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.avg} / {s.target}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${(s.avg/s.target)*100}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <PieChart className="w-4 h-4 text-emerald-400" /> View Skill Heatmap
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
