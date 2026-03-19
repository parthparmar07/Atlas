"use client";

import { useState } from "react";
import { 
  Heart, Activity, Users, ShieldCheck, 
  Search, Filter, BookOpen, Layers, 
  Cpu, Gavel, Star, CheckCircle2, 
  Sparkles, Zap, Phone, Mail, 
  ChevronRight, ArrowRight, Download, 
  PlusSquare, MessageSquare, Target,
  Moon, Coffee, Smile, AlertCircle
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME (Business)", color: "text-indigo-500", stressors: ["Finals Pitch", "Internship Deadline"] },
  { id: "isdi", name: "ISDI (Design)", color: "text-pink-500", stressors: ["Parsons Jury", "Portfolio Review"] },
  { id: "ugdx", name: "uGDX (Tech)", icon: Cpu, color: "text-cyan-500", stressors: ["NASA Simulation", "Repo Audit"] },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", stressors: ["Supreme Moot", "Case Briefing"] },
];

const SUPPORT_CIRCLES = [
  { id: "c-1", name: "Atlas Peer Connect", topic: "Social Integration", members: 442, status: "Live" },
  { id: "c-2", name: "Design Minds", topic: "Creative Burnout", members: 122, status: "Active" },
  { id: "c-3", name: "Tech Zen", topic: "System Overload", members: 89, status: "Live" },
];

export default function StudentWellbeingPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Global Balance Orbit</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Mind & Balance</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for student health and wellbeing across Atlas schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Phone className="w-5 h-5 text-indigo-500" /> Emergency Line
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-rose-400" /> Book Counselor
           </button>
        </div>
      </div>

      {/* Wellness Pulse HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
           { icon: Moon, label: "Avg Sleep", val: "6.8 hrs", target: "8.0", color: "text-indigo-500" },
           { icon: Smile, label: "Mood Index", val: "84/100", target: "90", color: "text-emerald-500" },
           { icon: Activity, label: "Phys. Activity", val: "42 min", target: "60", color: "text-rose-500" },
           { icon: Users, label: "Social Connect", val: "92%", target: "100", color: "text-cyan-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-2 mb-2">
               <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-black text-slate-900`}>{s.val}</span>
              <span className="text-[10px] font-bold text-slate-400">Target: {s.target}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Support Spheres */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg"><Activity className="w-5 h-5 text-white animate-pulse" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Support Circles</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-rose-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                           {s.icon ? <s.icon className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {SUPPORT_CIRCLES.map((c) => (
                     <div key={c.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-rose-500 transition-all hover:shadow-2xl">
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 rounded-[2rem] bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-lg shadow-inner group-hover:bg-rose-50 group-hover:text-rose-600 group-hover:border-rose-100 transition-colors">
                              {c.name.split(' ').map(n=>n[0]).join('')}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
                                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{c.topic}</span>
                              </div>
                              <div className="flex items-center gap-5 text-xs text-slate-500 font-bold">
                                 <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {c.members} Active Members</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3 text-right">
                              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${c.status === 'Live' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                 <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'} inline-block mr-1`} />
                                 {c.status}
                              </div>
                              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                 Join Session <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Sidebar: AI Counseling & Institutional Stats */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* AI Wellness Advisor */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Zap className="w-6 h-6 text-rose-400" /> Wellbeing Intel
               </h3>
               
               <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-rose-300 mb-6" />
                     <h4 className="text-2xl font-black leading-tight mb-2 italic tracking-tighter">Peer Pressure Pilot</h4>
                     <p className="text-xs text-slate-300 italic mb-8 leading-relaxed">
                       "Detected high collective stress in ISDI Design collective (Sem 5). Suggesting an offline 'Creative Unwind' session this Friday."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-rose-100 hover:text-white transition-colors">
                       Coordinate Offline Event <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Target className="w-32 h-32" /></div>
               </div>

               <div className="mt-8 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Institutional Resilience</h4>
                  {[
                     { label: "Community Bonding", val: 92, color: "bg-indigo-500" },
                     { label: "Crisis Preparedness", val: 100, color: "bg-emerald-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 flex flex-col gap-1 px-1">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">
                           <span>{s.label}</span>
                           <span className="text-indigo-400">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(255,100,100,0.2)]`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative group">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" /> Crisis Override Hub
               </h3>
               
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/card mb-8">
                  <p className="text-xs text-slate-600 italic mb-4 leading-relaxed font-bold">
                    "24/7 Professional Counseling line is open. 3 Agents standby for Law-Policy ethics counseling."
                  </p>
                  <div className="flex items-center gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl transition-all">
                        Request Private Session <MessageSquare className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
               
               <button className="w-full py-5 bg-rose-600 text-white font-black text-xs rounded-3xl hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-100">
                   Emergency Mental Health Support <AlertCircle className="w-4 h-4" />
               </button>
               
               <p className="mt-6 text-center text-[10px] font-bold text-slate-400 italic">
                  "Institutional integrity begins with individual balance."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
