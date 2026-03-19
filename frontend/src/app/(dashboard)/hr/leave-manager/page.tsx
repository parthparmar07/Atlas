"use client";

import { useState } from "react";
import { 
  Calendar, Users, Clock, ShieldCheck, 
  AlertCircle, CheckCircle2, Search, Filter,
  ChevronRight, ArrowRightLeft, Target, Layers, 
  Cpu, Gavel, BookOpen, Sparkles, Zap, 
  Settings, Download, Activity, FileText
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/5" },
  { id: "isdi", name: "ISDI Design", icon: Layers, color: "text-pink-500", bg: "bg-pink-500/5" },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-500/5" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", bg: "bg-amber-500/5" },
];

const LEAVE_STATS = [
  { label: "Active Requests", val: 12, trend: "+2", color: "text-indigo-500" },
  { label: "Faculty Absence", val: "8%", trend: "-1%", color: "text-rose-500" },
  { label: "Staff Absence", val: "4%", trend: "0%", color: "text-emerald-500" },
  { label: "Total Approved", val: 442, trend: "+12", color: "text-slate-500" },
];

const REQUESTS = [
  { id: "REQ-771", name: "Dr. Satya Narayan", school: "ugdx", type: "Sick Leave", period: "12 May - 14 May", days: 3, status: "Pending", detail: "Medical emergency - Surgery recovery." },
  { id: "REQ-772", name: "Prof. Khanna", school: "isdi", type: "Workshop Leave", period: "15 May - 15 May", days: 1, status: "Approved", detail: "Parsons Academic Collaboration workshop." },
  { id: "REQ-773", name: "Dr. Anjali Rao", school: "isme", type: "Casual Leave", period: "16 May - 17 May", days: 2, status: "Auto-Rejected", detail: "Overlap with Bloomberg Lab maintenance sessions." },
  { id: "REQ-774", name: "Adv. Rahul D.", school: "law", type: "Moot Court Visit", period: "12 May - 13 May", days: 2, status: "Pending", detail: "National Moot Court judging." },
];

export default function HRLeaveManagerPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Workforce Integrity Core</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Leave Orbit</h1>
          <p className="text-lg text-slate-500 font-medium">Managed leave lifecycle for Atlas SkillTech University staff.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <FileText className="w-5 h-5 text-indigo-500" /> Policy Audit
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-emerald-400" /> Balance Sync
           </button>
        </div>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LEAVE_STATS.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl group hover:border-indigo-500/50 transition-all">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</div>
            <div className="flex items-end justify-between">
              <span className={`text-4xl font-black ${s.color}`}>{s.val}</span>
              <span className={`text-[10px] font-black p-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Leave Queue */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Activity className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Relief Lifecycle Queue</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `${s.bg} ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}><s.icon className="w-5 h-5" /></button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {REQUESTS.filter(r => selectedSchool === 'all' || r.school === selectedSchool).map((r) => {
                     const sObj = SCHOOLS.find(s => s.id === r.school);
                     return (
                        <div key={r.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-3xl ${sObj?.color.replace('text-', 'bg-')} flex items-center justify-center shadow-xl`}>
                                 {sObj && <sObj.icon className="w-6 h-6 text-white" />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-1">
                                    <span className="text-sm font-black text-slate-900">{r.name}</span>
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase">{r.type}</span>
                                 </div>
                                 <div className="flex items-center gap-5 text-[11px] text-slate-500 font-bold italic">
                                    <Clock className="w-3.5 h-3.5" /> {r.period} ({r.days} days)
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${r.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : r.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Approved' ? 'bg-emerald-500' : r.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                                    {r.status}
                                 </div>
                              </div>
                           </div>
                           
                           {/* Handoff Insight */}
                           <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                              <p className="text-xs text-slate-400 max-w-md line-clamp-1 italic">"{r.detail}"</p>
                              <div className="flex items-center gap-2">
                                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-xl transition-all">
                                    View Substitution Flow <ArrowRightLeft className="w-3 h-3" />
                                 </button>
                                 <button className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                    <AlertCircle className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Coverage & AI Audit */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Target className="w-6 h-6 text-indigo-400" /> Coverage Metrics
               </h3>
               
               <div className="space-y-6">
                  {SCHOOLS.map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                           <span>{s.name} Capacity</span>
                           <span className="text-emerald-400">92%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/10 relative">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Integrity Hub</div>
                  <p className="text-xs text-slate-400 italic mb-4 leading-relaxed">
                    "Analyzing ISDI Faculty Leave vs Sem End Jury schedule. Recommendation: Hold approvals for 15 May."
                  </p>
                  <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-300">
                    Apply Constraint <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" /> Institutional Health
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Leave Accrual</div>
                     <div className="text-xl font-black text-slate-800">4.2 <span className="text-xs text-slate-400 font-bold">days/mo</span></div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Substitute Cost</div>
                     <div className="text-xl font-black text-slate-800">₹12k <span className="text-xs text-slate-400 font-bold">avg/wk</span></div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Avg Tenure</div>
                     <div className="text-xl font-black text-slate-800">3.8 <span className="text-xs text-slate-400 font-bold">years</span></div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Staff Rating</div>
                     <div className="text-xl font-black text-slate-800">4.9 <span className="text-xs text-slate-400 font-bold">stars</span></div>
                  </div>
               </div>
               
               <button className="w-full mt-10 py-5 bg-indigo-600 text-white font-black text-xs rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  Generate Workforce Report (PDF)
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
