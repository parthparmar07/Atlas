"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, ShieldCheck, 
  Clock, MapPin, CheckCircle2, AlertTriangle, 
  ArrowRight, UserPlus, FileText, Layout,
  BookOpen, Layers, Cpu, Gavel, 
  Sparkles, Zap, ClipboardList, Shield,
  TrendingUp, Star, MoreHorizontal, Mail, Phone,
  BarChart3, Medal, TrendingDown, Target, PieChart,
  Activity, Server, Globe, ChevronRight
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "bg-indigo-500", utilization: 84 },
  { id: "isdi", name: "ISDI Design", color: "bg-pink-500", utilization: 92 },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "bg-cyan-500", utilization: 68 },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "bg-amber-500", utilization: 75 },
];

const FACULTY_LOAD = [
  { id: "F-101", name: "Dr. Elena Gilbert", school: "ugdx", courses: 4, load: 88, status: "Critical", lab: "NASA Center" },
  { id: "F-102", name: "Prof. Damon S.", school: "isdi", courses: 2, load: 45, status: "Optimal", lab: "Studio B" },
  { id: "F-103", name: "Siddharth Roy.", school: "isme", courses: 3, load: 72, status: "Optimal", lab: "Bloomberg Lab" },
  { id: "F-104", name: "Adv. Caroline F.", school: "law", courses: 1, load: 30, status: "Available", lab: "Moot Court" },
];

export default function HRFacultyLoadBalancerPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full w-fit">
            <Activity className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Workload Intelligence Core</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Load Optimization</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed faculty distribution and lab utilization for ISME, ISDI, uGDX, and Law schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Server className="w-5 h-5 text-indigo-500" /> Infrastructure Sync
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-teal-400" /> Propose AI Rebalance
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Faculty Registry & Load */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg"><Users className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Faculty Registry</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Search className="w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search professor..." className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-44" />
                  </div>
               </div>

               <div className="space-y-4">
                  {FACULTY_LOAD.filter(f => selectedSchool === 'all' || f.school === selectedSchool).map((f) => {
                     const sObj = SCHOOLS.find(s => s.id === f.school);
                     return (
                        <div key={f.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-teal-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-sm shadow-inner group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-100 transition-colors">
                                 {f.id}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-black text-slate-900">{f.name}</h4>
                                    <div className={`text-[10px] font-black uppercase text-slate-400 tracking-widest`}>{sObj?.name}</div>
                                 </div>
                                 <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-black">
                                       <BookOpen className="w-3.5 h-3.5" /> {f.courses} Active Courses
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                       <MapPin className="w-3.5 h-3.5" /> Assigned: {f.lab}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 text-right">
                                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${f.status === 'Optimal' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : f.status === 'Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Optimal' ? 'bg-emerald-500' : f.status === 'Critical' ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                                    {f.status}
                                 </div>
                                 <div className="text-sm font-black text-slate-800">{f.load}% Utilization</div>
                              </div>
                           </div>
                           
                           <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Hours</span>
                                    <span className="text-xs font-black text-slate-900">32 / 40 hrs</span>
                                 </div>
                                 <div className="w-[1px] h-6 bg-slate-100" />
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Research Cap</span>
                                    <span className="text-xs font-black text-slate-900">0.4 FTE</span>
                                 </div>
                              </div>
                              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                 Adjust Workload <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Efficiency & Lab Pulse */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-teal-400" /> Efficiency Matrix
               </h3>
               
               <div className="space-y-6">
                  {SCHOOLS.map((s, i) => (
                     <div key={i} className="space-y-1.5 group/bar">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 group-hover/bar:text-white transition-colors">
                           <span>{s.name} Optimization</span>
                           <span className={s.utilization > 80 ? "text-rose-400" : "text-teal-400"}>{s.utilization}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(20,184,166,0.3)]`} style={{ width: `${s.utilization}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-6 bg-teal-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-6 h-6 text-teal-200 mb-4" />
                     <h4 className="text-lg font-black leading-tight mb-2">AI Balancing Suggestion</h4>
                     <p className="text-xs text-teal-50 italic mb-6 leading-relaxed">
                       "Dr Elena Gilbert (uGDX) has reached 'Critical' load due to NASA project overruns. Proposing transfer of 1 core session to Dr Vikram (ISME)."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-teal-100 transition-colors">
                       Review Substitution Proposal <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-24 h-24" /></div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" /> Lab Domain Sync
               </h3>
               
               <div className="space-y-5">
                  {[
                     { label: "Bloomberg Lab (ISME)", status: "Active", count: 12 },
                     { label: "Deep Tech Bay (uGDX)", status: "Critical", count: 42 },
                     { label: "Studio Gamma (ISDI)", status: "Maintenance", count: 2 },
                     { label: "Moot Court (Law)", status: "Active", count: 8 },
                  ].map((l, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-500 transition-colors">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-900">{l.label}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.status}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-[10px] font-black ${l.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                           {l.count} Staff Assigned
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-teal-600 text-white font-black text-xs rounded-3xl hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-100">
                  <Globe className="w-4 h-4 text-white" /> Global Faculty Map
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
