"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Layout, Users, 
  MapPin, Settings, Search, Filter, 
  ChevronRight, ArrowLeftRight, BookOpen, 
  Layers, Cpu, Gavel, Sparkles, CheckCircle2,
  Printer, Download, PlusSquare
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", icon: BookOpen, color: "text-indigo-500", border: "border-indigo-500/20", bg: "bg-indigo-500/5", programs: ["BBA Hons.", "B.Sc Finance", "MBA"] },
  { id: "isdi", name: "ISDI Design", icon: Layers, color: "text-pink-500", border: "border-pink-500/20", bg: "bg-pink-500/5", programs: ["B.Des Fashion", "B.Des Communication", "B.Des Product"] },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", border: "border-cyan-500/20", bg: "bg-cyan-500/5", programs: ["B.Tech AI/ML", "B.Tech Robotics"] },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", border: "border-amber-500/20", bg: "bg-amber-500/5", programs: ["BBA LL.B. (Hons.)"] },
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["09:00 - 10:30", "10:45 - 12:15", "12:30 - 01:30 (Break)", "01:30 - 03:00", "03:15 - 04:45", "05:00 - 06:30"];

const SCHEDULE_DATA = [
  { id: 1, school: "isme", day: "Monday", slot: "09:00 - 10:30", subject: "Macro-Economics", prof: "Dr. Rao", room: "F-102" },
  { id: 2, school: "isdi", day: "Tuesday", slot: "10:45 - 12:15", subject: "Typography Systems", prof: "Prof. Khanna", room: "Studio 4" },
  { id: 3, school: "ugdx", day: "Wednesday", slot: "01:30 - 03:00", subject: "Deep Learning II", prof: "Dr. Satya", room: "Lab 8" },
  { id: 4, school: "law", day: "Thursday", slot: "03:15 - 04:45", subject: "Legal Writing", prof: "Adv. Mehra", room: "Court Room" },
];

export default function AcademicsTimetablePage() {
  const [selectedSchool, setSelectedSchool] = useState("isme");

  const schoolObj = SCHOOLS.find(s => s.id === selectedSchool) || SCHOOLS[0];

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Layout className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Master Orchestration v2.4</span>
          </div>
          <h1>Timetable Matrix</h1>
          <p className="text-lg text-slate-500 font-medium">Dynamic scheduling for {schoolObj.name} across its specialized programs.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <PlusSquare className="w-5 h-5 text-indigo-500" /> New Session
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5" /> Propose Shift
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left Side: School Selectors & Programs */}
         <div className="col-span-12 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl space-y-8">
               <h3 className="text-lg font-black text-slate-900 mb-6 px-1 flex items-center justify-between">
                  Target School
                  <ChevronRight className="w-5 h-5 text-slate-300" />
               </h3>
               
               <div className="space-y-3">
                  {SCHOOLS.map((s) => (
                     <button 
                        key={s.id}
                        onClick={() => setSelectedSchool(s.id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all ${selectedSchool === s.id ? `${s.bg} ${s.border}` : "bg-white border-slate-100 hover:border-slate-300 opacity-60 grayscale"}`}
                     >
                        <div className={`w-12 h-12 rounded-2xl ${selectedSchool === s.id ? 'bg-white' : 'bg-slate-100'} flex items-center justify-center shadow-lg`}>
                           <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div className="text-left overflow-hidden">
                           <div className="text-sm font-black text-slate-900 whitespace-nowrap">{s.name}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase truncate">{s.programs[0]} Specialist</div>
                        </div>
                     </button>
                  ))}
               </div>

               <div className="pt-8 border-t border-slate-50 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Programs</h4>
                  <div className="space-y-2">
                     {schoolObj.programs.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                           <CheckCircle2 className={`w-4 h-4 ${schoolObj.color}`} />
                           <span className="text-xs font-black text-slate-700">{p}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4">Faculty Load AI</h3>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-6">"Suggesting 15-min break after 10:45 sessions to maintain NASA-grade teacher focus."</p>
                  <div className="space-y-1.5 mb-8">
                     <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Burnout Risk</span>
                        <span className="text-emerald-400">Low</span>
                     </div>
                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '22%' }} />
                     </div>
                  </div>
                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black hover:bg-white/10 transition-colors">Audit All Schools</button>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Sparkles className="w-48 h-48" /></div>
            </div>
         </div>

         {/* Right Side: Visual Orbit Grid */}
         <div className="col-span-12 xl:col-span-9 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl relative overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-6">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Planner Orbit</h3>
                     <div className="flex items-center gap-1">
                        {WEEK_DAYS.map((d, i) => (
                           <div key={i} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${i === 0 ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>{d.slice(0,3)}</div>
                        ))}
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"><Printer className="w-5 h-5" /></button>
                     <button className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"><Download className="w-5 h-5" /></button>
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-4">
                  {/* Time column */}
                  <div className="flex flex-col gap-4">
                     <div className="h-12 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">GMT+5:30</div>
                     {TIME_SLOTS.map((ts, i) => (
                        <div key={i} className="h-32 flex flex-col items-center justify-center gap-1 border-r border-slate-50 pr-4">
                           <Clock className="w-3.5 h-3.5 text-slate-300" />
                           <span className="text-[11px] font-black text-slate-400 text-center">{ts.split(' ')[0]}</span>
                        </div>
                     ))}
                  </div>

                  {/* Days columns */}
                  {WEEK_DAYS.map((day, dIdx) => (
                     <div key={dIdx} className="flex flex-col gap-4">
                        <div className="h-12 flex items-center justify-center text-xs font-black text-slate-700 border-b border-slate-50 group">
                           {day}
                           <ArrowLeftRight className="w-3 h-3 ml-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {TIME_SLOTS.map((slot, sIdx) => {
                           const session = SCHEDULE_DATA.find(s => s.day === day && s.slot === slot);
                           const isFilteredSchool = session?.school === selectedSchool;
                           
                           return (
                              <div key={sIdx} className={`h-32 rounded-3xl p-4 transition-all relative group overflow-hidden ${session ? (
                                    isFilteredSchool 
                                    ? `bg-white border-2 border-indigo-500 shadow-xl scale-105 z-10`
                                    : `bg-slate-50 border border-slate-100 opacity-30 grayscale`
                                 ) : "bg-slate-50/50 border border-dashed border-slate-200"}`}>
                                 
                                 {session && (
                                    <>
                                       <div className="flex items-center justify-between mb-2">
                                          <div className={`w-6 h-6 rounded-lg ${isFilteredSchool ? 'bg-indigo-600' : 'bg-slate-200'} flex items-center justify-center`}><Settings className="w-3 h-3 text-white" /></div>
                                          <div className="text-[9px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">View Details</div>
                                       </div>
                                       <div className="text-[13px] font-black text-slate-900 leading-tight mb-1 truncate">{session.subject}</div>
                                       <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                          <Users className="w-3 h-3" />
                                          <span className="text-[10px] font-black">{session.prof}</span>
                                       </div>
                                       <div className="flex items-center gap-1.5 text-indigo-500">
                                          <MapPin className="w-3 h-3" />
                                          <span className="text-[10px] font-black">{session.room}</span>
                                       </div>
                                    </>
                                 )}
                                 
                                 {!session && (
                                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                       <PlusSquare className="w-6 h-6 text-slate-300 hover:text-indigo-500" />
                                    </div>
                                 )}
                              </div>
                           )
                        })}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
