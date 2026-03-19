"use client";

import { useState } from "react";
import { 
  Activity, ShieldCheck, Zap, Server, 
  Terminal, Search, Filter, Cpu, 
  ArrowRight, Globe, MoreHorizontal, 
  Layers, Gavel, BookOpen, Sparkles,
  CheckCircle2, AlertCircle, Phone, 
  Database, Wifi, Key, Layout,
  ChevronRight
} from "lucide-react";

const SERVICES = [
  { id: "S-101", name: "Bloomberg Terminal (ISME)", status: "Operational", uptime: 99.9, latency: "12ms" },
  { id: "S-102", name: "uGDX GPU Cluster", status: "High Load", uptime: 98.4, latency: "2ms" },
  { id: "S-103", name: "Parsons Design Cloud", status: "Maintenance", uptime: 84.1, latency: "140ms" },
  { id: "S-104", name: "Atlas Law Lexis Cloud", status: "Operational", uptime: 99.8, latency: "18ms" },
];

const TICKETS = [
  { id: "T-201", type: "Access Request", user: "Dr. Elena G. (uGDX)", detail: "NASA simulation cluster access.", priority: "Critical", status: "Provisioning" },
  { id: "T-202", type: "ERP Creds", user: "Prof. Khanna (ISDI)", detail: "Account locked after 3 attempts.", priority: "High", status: "Awaiting Triage" },
  { id: "T-203", type: "WiFi Config", user: "Student BBA-Sem2", detail: "Connecting to 'Atlas-High-Speed' fails.", priority: "Low", status: "Resolved" },
];

export default function ITSupportAgentPage() {
  const [selectedService, setSelectedService] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Infra HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Server className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Ops v7.0</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Infra Command</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for ISME, ISDI, uGDX, and Law IT services.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Database className="w-5 h-5 text-indigo-500" /> System Logs
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> Proactive AI Provisioning
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Triage & Provisioning */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Terminal className="w-5 h-5 text-white animate-pulse" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Support Triage</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Search className="w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search tickets..." className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-44" />
                  </div>
               </div>

               <div className="space-y-4">
                  {TICKETS.map((t) => (
                     <div key={t.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-8">
                           <div className={`w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-lg shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors`}>
                              {t.id.split('-')[1]}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                 <h4 className="text-xl font-black text-slate-900 leading-tight">{t.user}</h4>
                                 <div className={`text-[9px] font-black uppercase tracking-widest ${t.priority === 'Critical' ? 'text-rose-500' : t.priority === 'High' ? 'text-orange-500' : 'text-slate-400'}`}>{t.priority} Priority</div>
                              </div>
                              <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold mb-4">
                                 <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Type: {t.type}</span>
                                 <span className="flex items-center gap-1.5 opacity-60 italic whitespace-nowrap overflow-hidden text-ellipsis max-w-sm">"{t.detail}"</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3 text-right">
                              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${t.status === 'Resolved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : t.status === 'Provisioning' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                 <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Resolved' ? 'bg-emerald-500' : t.status === 'Provisioning' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-400'} inline-block mr-1`} />
                                 {t.status}
                              </div>
                              <button className="p-2 transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600">
                                 <MoreHorizontal className="w-6 h-6" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Service Health & AI Audit */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Service Health Grid */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                 <Activity className="w-6 h-6 text-indigo-400" /> Service Health Orbit
               </h3>
               
               <div className="space-y-4">
                  {SERVICES.map((s, i) => (
                     <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group/item">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center transition-colors ${s.status === 'Operational' ? 'group-hover/item:bg-emerald-500/20' : 'group-hover/item:bg-rose-500/20'}`}>
                                 <Server className={`w-5 h-5 ${s.status === 'Operational' ? 'text-emerald-400' : 'text-rose-400'}`} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-white">{s.name.split(' (')[0]}</span>
                                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.status}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-[10px] font-black text-indigo-400 mb-1">{s.uptime}% Uptime</div>
                              <div className="text-[10px] text-slate-500 font-bold">{s.latency} Latency</div>
                           </div>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${s.status === 'Operational' ? 'bg-emerald-500' : 'bg-rose-500'} rounded-full shadow-lg`} style={{ width: `${s.uptime}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* AI Infra Pulse */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative group">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" /> AI Infra Audit
               </h3>
               
               <div className="p-8 bg-indigo-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card mb-8">
                  <div className="relative z-10 text-white">
                     <ShieldCheck className="w-7 h-7 text-indigo-100 mb-4" />
                     <h4 className="text-xl font-black leading-tight mb-2 italic tracking-tighter text-white">Security Handoff Sync</h4>
                     <p className="text-xs text-indigo-50 italic mb-8 leading-relaxed opacity-80">
                       "New Faculty (ISME-BBA) confirmed in HR Recruitment. Automatically provisioned Bloomberg Terminal access and Atlas ERP credentials."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-100 transition-colors uppercase tracking-widest">
                       Verify Provisioning <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-32 h-32" /></div>
               </div>

               <div className="space-y-6">
                  {[{ icon: Database, label: "DB Connection Pool", val: 92, color: "bg-indigo-500" },
                    { icon: Wifi, label: "WiFi Saturation", val: 78, color: "bg-cyan-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 flex flex-col gap-1 px-1">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400">
                           <div className="flex items-center gap-1.5"><s.icon className="w-3 h-3 text-slate-400" /> {s.label}</div>
                           <span className="text-slate-900">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Phone className="w-4 h-4 text-emerald-400" /> Emergency IT Override
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
