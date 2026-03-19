"use client";

import { useState } from "react";
import { 
  Calendar, Users, MapPin, Clock, 
  Sparkles, Zap, Activity, ShieldCheck, 
  Search, Filter, BookOpen, Layers, 
  Cpu, Gavel, ArrowRight, Download, 
  Printer, PlayCircle, Instagram, Globe,
  MoreHorizontal, PlusSquare, Image as ImageIcon,
  Share2, Target, BarChart3, Radio, ChevronRight
} from "lucide-react";

const CLUBS = [
  { id: "c-101", name: "NASA Rover Challenge", school: "ugdx", color: "bg-cyan-500" },
  { id: "c-102", name: "Finance Thinkers", school: "isme", color: "bg-indigo-500" },
  { id: "c-103", name: "Design Collective", school: "isdi", color: "bg-pink-500" },
  { id: "c-104", name: "Moot Court Society", school: "law", color: "bg-amber-500" },
  { id: "c-105", name: "Atlas Sports", school: "admin", color: "bg-emerald-500" },
];

const UPCOMING_EVENTS = [
  { id: "EV-99", title: "Mumbai Design Week Collab", club: "Design Collective", date: "22 May", venue: "Main Atrium", reach: "2.4k", status: "Designing Poster" },
  { id: "EV-100", title: "Bloomberg Trading Champ", club: "Finance Thinkers", date: "24 May", venue: "ISME Finance Lab", reach: "1.2k", status: "Pending POA" },
  { id: "EV-101", title: "Mars Rover Simulation", club: "NASA Rover Challenge", date: "28 May", venue: "uGDX Deep Tech Lab", reach: "4.8k", status: "Live Sync" },
];

export default function StudentEventsPage() {
  const [selectedClub, setSelectedClub] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full w-fit">
            <Radio className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Global Vibe Coordinator</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Event Command</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for 10+ clubs across ISME, ISDI, uGDX, and Law schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Download className="w-5 h-5 text-indigo-500" /> Download POA
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-indigo-400" /> AI Poster Design
           </button>
        </div>
      </div>

      {/* Club Carousel HUD */}
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        <button 
          onClick={() => setSelectedClub("all")}
          className={`flex-none px-8 py-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${selectedClub === "all" ? "bg-slate-900 border-slate-800 text-white shadow-2xl" : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"}`}
        >
           <div className="font-black text-xl mb-1">All Activity</div>
           <div className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-none">Global Pulse</div>
        </button>
        
        {CLUBS.map((c) => (
          <button 
            key={c.id}
            onClick={() => setSelectedClub(c.id)}
            className={`flex-none px-8 py-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${selectedClub === c.id ? `${c.color} border-transparent text-white shadow-2xl scale-105` : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"}`}
          >
             <div className="font-black text-xl mb-1">{c.name.split(' ')[0]}</div>
             <div className="text-[10px] opacity-60 font-black uppercase tracking-widest leading-none">{c.name}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main Event Timeline */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Activity className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upcoming Global Fests</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600"><Search className="w-5 h-5" /></button>
                     <button className="p-3 bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600"><Filter className="w-5 h-5" /></button>
                  </div>
               </div>

               <div className="space-y-4">
                  {UPCOMING_EVENTS.map((e) => {
                     const cObj = CLUBS.find(c => c.name === e.club);
                     return (
                        <div key={e.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-8">
                              <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
                                 <span className="text-[10px] font-black uppercase opacity-60">{e.date.split(' ')[1]}</span>
                                 <span className="text-3xl font-black">{e.date.split(' ')[0]}</span>
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">{e.title}</h3>
                                    <div className={`text-[9px] font-black ${cObj?.color.replace('bg-', 'text-')} uppercase tracking-widest font-mono`}>{e.club}</div>
                                 </div>
                                 <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold"><MapPin className="w-3.5 h-3.5" /> {e.venue}</div>
                                    <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-bold"><Users className="w-3.5 h-3.5" /> {e.reach} Registrations</div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${e.status === 'Live Sync' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${e.status === 'Live Sync' ? 'bg-emerald-500' : 'bg-slate-400'} inline-block mr-1`} />
                                    {e.status}
                                 </div>
                                 <button className="p-2 transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600">
                                    <MoreHorizontal className="w-6 h-6" />
                                 </button>
                              </div>
                           </div>
                           
                           {/* Social Media Sync Mock */}
                           <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg"><Instagram className="w-5 h-5 text-white" /></div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Auto-Coverage</span>
                                    <span className="text-xs font-black text-slate-900 leading-none">Instagram Live Scheduled</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                                    Launch Stage Command <ArrowRight className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Poster Lab & AI Hub */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Digital Poster Lab */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <ImageIcon className="w-6 h-6 text-pink-400" /> Digital Poster Lab
               </h3>
               
               <div className="aspect-[4/3] bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] shadow-2xl relative overflow-hidden p-8 flex flex-col justify-end">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-48 h-48" /></div>
                  <div className="relative z-10">
                     <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase mb-4 inline-block">Draft v0.4</span>
                     <h4 className="text-3xl font-black italic tracking-tighter leading-none mb-2">MUMBAI <br/> DESIGN WEEK</h4>
                     <p className="text-xs font-bold text-indigo-100 opacity-60">Featuring Atlas ISDI Collective</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 mt-6">
                  <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Download Assets</button>
                  <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Share to IG</button>
               </div>
            </div>

            {/* AI Coordinator Insights */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative group">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Agent Intelligence
               </h3>
               
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/card mb-8">
                  <p className="text-xs text-slate-600 italic mb-4 leading-relaxed line-clamp-3">
                    "Analyzing venue occupancy for Mars Rover simulation. Suggesting extending 'Lab 8' booking by 2 hours as NASA VIPs confirmed attendance."
                  </p>
                  <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                    Apply Booking Shift <ChevronRight className="w-4 h-4" />
                  </button>
               </div>

               <div className="space-y-6">
                  {[
                     { label: "Auditorium Occupancy", val: 92, color: "bg-indigo-500" },
                     { label: "Social Reach Index", val: 78, color: "bg-pink-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 flex flex-col gap-1">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.val}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Finalize POA Audit
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
