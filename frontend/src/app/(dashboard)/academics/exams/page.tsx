"use client";

import { useState } from "react";
import { 
  FileText, Calendar, Clock, MapPin, 
  Users, AlertTriangle, CheckCircle2, 
  Search, Filter, BookOpen, Layers, 
  Cpu, Gavel, ArrowRight, Download, Printer,
  Sparkles, Activity
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME (Business & Management)", icon: BookOpen, color: "bg-indigo-500", programs: ["BBA Hons.", "MBA", "B.Sc Finance", "Global Management"] },
  { id: "isdi", name: "ISDI (School of Design)", icon: Layers, color: "bg-pink-500", programs: ["B.Des Fashion", "B.Des Product", "B.Des UI/UX", "M.Des Strategies"] },
  { id: "ugdx", name: "uGDX (School of Technology)", icon: Cpu, color: "bg-cyan-500", programs: ["B.Tech AI/ML", "B.Tech Robotics", "B.Tech Data Science", "Generative AI"] },
  { id: "law", name: "Atlas Law & Policy", icon: Gavel, color: "bg-amber-500", programs: ["BBA LL.B. (Hons.)", "IP Law Specialization"] },
];

const EXAM_SCHEDULE = [
  { id: "EX-101", school: "isme", subject: "Business Psychology (MBA)", date: "2024-05-12", time: "10:00 AM", room: "Bloomberg Lab", status: "Confirmed", proctors: 3 },
  { id: "EX-102", school: "isdi", subject: "Strategic Design (M.Des)", date: "2024-05-14", time: "02:00 PM", room: "Studio A", status: "Audit Needed", proctors: 2 },
  { id: "EX-103", school: "ugdx", subject: "NASA Rover Challenge (Tech)", date: "2024-05-15", time: "09:00 AM", room: "Deep Tech Lab", status: "Confirmed", proctors: 5 },
  { id: "EX-104", school: "law", subject: "Constitutional Law I (Law)", date: "2024-05-16", time: "11:00 AM", room: "Moot Court Room", status: "Pending Law-Tech Sync", proctors: 2 },
  { id: "EX-105", school: "ugdx", subject: "Generative AI Systems (Tech)", date: "2024-05-18", time: "10:00 AM", room: "AI Bay 01", status: "Confirmed", proctors: 4 },
  { id: "EX-106", school: "isdi", subject: "Sustainable Fashion (Fash)", date: "2024-05-19", time: "01:00 PM", room: "Studio D", status: "Confirmed", proctors: 2 },
];

import { useSchool } from "@/context/SchoolContext";

export default function AcademicsExamsPage() {
  const { currentSchool } = useSchool();
  const [selectedSchool, setSelectedSchool] = useState("all");

  const actualSchoolId = currentSchool.id === 'atlas' ? selectedSchool : currentSchool.id;

  const filteredExams = actualSchoolId === "all" 
    ? EXAM_SCHEDULE 
    : EXAM_SCHEDULE.filter(e => e.school === actualSchoolId);

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className={`flex items-center gap-2 px-3 py-1 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <Calendar className={`w-3.5 h-3.5 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-widest`}>{currentSchool.name} Exam Orbit</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Assessment Matrix</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for {currentSchool.name} academic assessments and proctoring.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:shadow-lg transition-all">
              <Printer className="w-4 h-4" /> Print Seating
           </button>
           <button className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${currentSchool.bg.replace('5%', '100%')} text-white font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1`}>
              <Download className="w-4 h-4" /> Master Schedule
           </button>
        </div>
      </div>

      {/* School Selective Filter */}
      {currentSchool.id === 'atlas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button 
            onClick={() => setSelectedSchool("all")}
            className={`p-6 rounded-[2rem] border transition-all text-left group overflow-hidden relative ${selectedSchool === "all" ? "bg-slate-900 border-slate-800 text-white shadow-2xl" : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"}`}
          >
             <Search className={`w-8 h-8 mb-4 ${selectedSchool === "all" ? "text-indigo-400" : "text-slate-300 group-hover:text-slate-900"}`} />
             <div className="font-black text-xl leading-tight">All Schools</div>
             <div className="text-xs opacity-60 font-medium mt-1">Unified View</div>
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><CheckCircle2 className="w-24 h-24" /></div>
          </button>
          
          {SCHOOLS.map((s) => (
            <button 
              key={s.id}
              onClick={() => setSelectedSchool(s.id)}
              className={`p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${selectedSchool === s.id ? "bg-slate-900 border-slate-800 text-white shadow-2xl scale-105" : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"}`}
            >
               <s.icon className={`w-8 h-8 mb-4 ${selectedSchool === s.id ? "text-white" : "text-slate-300 group-hover:text-slate-900"}`} />
               <div className="font-black text-xl leading-tight">{s.name.split(' ')[0]}</div>
               <div className="text-[10px] opacity-60 font-black uppercase tracking-widest mt-1">{s.name.split(' (')[1]?.replace(')', '') || 'Specialist'}</div>
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform"><s.icon className="w-24 h-24" /></div>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
         {/* Main Schedule Table */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Schedule Matrix</h3>
                  <div className="text-sm font-bold text-slate-400">{filteredExams.length} Exams Listed</div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                           <th className="pb-4 pl-2 text-center">School</th>
                           <th className="pb-4">Program & Subject</th>
                           <th className="pb-4">Location</th>
                           <th className="pb-4">Timing</th>
                           <th className="pb-4">Status</th>
                           <th className="pb-4 text-right pr-2">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {filteredExams.map((e) => {
                           const schoolObj = SCHOOLS.find(s => s.id === e.school);
                           return (
                              <tr key={e.id} className="group hover:bg-slate-50 transition-colors">
                                 <td className="py-6 pl-2">
                                    <div className={`w-12 h-12 rounded-2xl ${schoolObj?.color || 'bg-slate-100'} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                       {schoolObj && <schoolObj.icon className="w-5 h-5 text-white" />}
                                    </div>
                                 </td>
                                 <td className="py-6">
                                    <div className="text-sm font-black text-slate-900">{e.subject}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{schoolObj?.name} Specialized Track</div>
                                 </td>
                                 <td className="py-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                       <MapPin className="w-3.5 h-3.5 text-slate-400" /> {e.room}
                                    </div>
                                 </td>
                                 <td className="py-6">
                                    <div className="text-sm font-black text-slate-700">{e.date}</div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold italic"><Clock className="w-3 h-3" /> {e.time} Slots</div>
                                 </td>
                                 <td className="py-6">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit border ${e.status === 'Confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                       <span className={`w-1.5 h-1.5 rounded-full ${e.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                       <span className="text-[10px] font-black uppercase tracking-widest">{e.status}</span>
                                    </div>
                                 </td>
                                 <td className="py-6 pr-2 text-right">
                                    <button className="p-2 rounded-xl text-slate-300 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                       <ArrowRight className="w-5 h-5" />
                                    </button>
                                 </td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Sidebar: Logistics & AI Hub */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Seating Capacity Heatmap */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                     <Users className="w-5 h-5 text-sky-400" /> Logistics Intelligence
                  </h3>
                  <div className="space-y-5">
                     {[
                        { label: "Proctor Availability", val: 88, status: "Stable" },
                        { label: "Institutional Capacity", val: 42, status: "Optimal" },
                     ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span>{item.label}</span>
                              <span className={item.val > 90 ? "text-rose-400" : "text-emerald-400"}>{item.status}</span>
                           </div>
                           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-1000 ${currentSchool.color.replace('text', 'bg')}`} style={{ width: `${item.val}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-4 rounded-2xl bg-white/10 text-white font-black text-xs hover:bg-white/20 transition-all border border-white/5 uppercase tracking-widest">
                     Multi-School Sync Protocol
                  </button>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-5"><Layers className="w-48 h-48" /></div>
            </div>

            {/* AI Auditor */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative group overflow-hidden">
               <div className="relative z-10">
                  <Sparkles className="w-8 h-8 text-amber-300 mb-4 animate-bounce" />
                  <h3 className="text-2xl font-black leading-tight mb-2">Examination Auditor</h3>
                  <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-6">
                     Checking for conflicting dates in {currentSchool.name} assessment cycles.
                  </p>
                  <div className="p-4 bg-black/20 rounded-2xl border border-white/10 font-mono text-[10px] text-indigo-200">
                     [ORCHESTRATOR] Institutional Audit Active. <br/> No clashes detected in active modules.
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-all"><Cpu className="w-32 h-32" /></div>
            </div>
         </div>
      </div>
    </div>
  );
}
