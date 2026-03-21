"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, RefreshCw, 
  Clock, MapPin, CheckCircle2, AlertTriangle, 
  ArrowRight, UserPlus, FileText, Layout,
  BookOpen, Layers, Cpu, Gavel, 
  Sparkles, Zap, ClipboardList, Shield
} from "lucide-react";
import AcademicsActionRunner from "@/components/academics/AcademicsActionRunner";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", icon: BookOpen, color: "text-indigo-500", programs: ["BBA Hons.", "MBA", "B.Sc Finance"] },
  { id: "isdi", name: "ISDI Design", icon: Layers, color: "text-pink-500", programs: ["B.Des Fashion", "B.Des Product", "B.Des UI/UX"] },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", programs: ["B.Tech AI/ML", "B.Tech Robotics", "B.Tech Data Science"] },
  { id: "law", name: "Atlas Law & Policy", icon: Gavel, color: "text-amber-500", programs: ["BBA LL.B. (Hons.)"] },
];

const LEAVE_REQUESTS = [
  { id: "SUB-801", school: "isme", professor: "Dr. Anjali Rao", subject: "Macro-Economics", session: "10:45 AM - 12:15 PM", room: "F-102 (Bloomberg Lab)", reason: "Sick Leave", status: "Pending" },
  { id: "SUB-802", school: "isdi", professor: "Prof. Khanna", subject: "Strategic Management", session: "01:30 PM - 03:00 PM", room: "Studio A", reason: "Faculty Workshop", status: "Assigned" },
  { id: "SUB-803", school: "ugdx", professor: "Dr. Satya Narayan", subject: "NASA Project Prep", session: "03:15 PM - 04:45 PM", room: "Robotics Bay 2", reason: "External Webinar", status: "Pending" },
];

const AVAILABLE_FACULTY = [
  { name: "Dr. Vikram K.", school: "isme", expertise: "Finance/Econ", load: "62%", active: true },
  { name: "Prof. Meera S.", school: "isdi", expertise: "UX/Strategic", load: "44%", active: true },
  { name: "Dr. Arjun P.", school: "ugdx", expertise: "AI/Robotics", load: "81%", active: true },
  { name: "Adv. Rahul D.", school: "law", expertise: "Constitutional", load: "30%", active: true },
];

export default function AcademicsSubstitutionPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  const filteredRequests = selectedSchool === "all" 
    ? LEAVE_REQUESTS 
    : LEAVE_REQUESTS.filter(r => r.school === selectedSchool);

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Intelligence Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit">
            <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Substitution Core AI</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Relief Command</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed faculty substitution across ISME, ISDI, uGDX, and Law schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <ClipboardList className="w-5 h-5 text-indigo-500" /> Relief Rules
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> Auto-Assign All
           </button>
        </div>
      </div>

         <AcademicsActionRunner
            title="Substitution Agent Control"
            agentId="academics-substitution"
            actions={[
               { label: "Find Substitute", description: "Rank best substitutes by availability, fit, and load." },
               { label: "Notify Students", description: "Generate complete communication drafts for stakeholders." },
               { label: "Update Timetable", description: "Apply selected substitutions directly into active timetable slots." },
            ]}
            buildContext={(action) => ({
               action,
               school_id: selectedSchool === "all" ? "atlas" : selectedSchool,
               absent_faculty: filteredRequests[0]?.professor ?? "Dr. Anjali Rao",
               subject: filteredRequests[0]?.subject ?? "Macro-Economics",
               section: "FY-CSE-A",
               class_slot: filteredRequests[0]?.session ?? "10:45 AM - 12:15 PM",
               reason: filteredRequests[0]?.reason ?? "Sick Leave",
               affected_classes: filteredRequests.slice(0, 3).map((req) => ({
                  professor: req.professor,
                  subject: req.subject,
                  room: req.room,
                  session: req.session,
               })),
            })}
         />

      <div className="grid grid-cols-12 gap-8">
         {/* Left: Leave / Substitute Requests List */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg"><UserPlus className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900">Pending Relief Queue</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Search className="w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search professor..." className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-44" />
                  </div>
               </div>

               <div className="space-y-4">
                  {filteredRequests.map((r) => {
                     const sObj = SCHOOLS.find(s => s.id === r.school);
                     return (
                        <div key={r.id} className="group relative flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className={`w-14 h-14 rounded-3xl ${sObj?.color.replace('text-', 'bg-')} flex items-center justify-center shadow-xl`}>
                              {sObj && <sObj.icon className="w-6 h-6 text-white" />}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-black text-slate-900">{r.professor}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.id}</span>
                              </div>
                              <div className="flex items-center gap-5">
                                 <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                    <BookOpen className="w-3.5 h-3.5" /> {r.subject}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                    <Clock className="w-3.5 h-3.5" /> {r.session}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-bold">
                                    <MapPin className="w-3.5 h-3.5" /> {r.room}
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${r.status === 'Assigned' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                                 <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Assigned' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{r.status}</span>
                              </div>
                              <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${r.status === 'Assigned' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'}`}>
                                 {r.status === 'Assigned' ? "View Substitute" : "Assign Relief"}
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: AI Recommender & Availability */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* AI Recommendation Hub */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                     <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black leading-tight mb-2">Relief Intelligence</h3>
                  <p className="text-sm text-indigo-100 leading-relaxed mb-10 opacity-80">
                     Our AI matches substitutes based on domain expertise and proximity to the school (ISME, ISDI, etc).
                  </p>
                  
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Best Matches for Macro-Econ</h4>
                     {AVAILABLE_FACULTY.filter(f => f.school === 'isme').map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center text-[10px] font-black border border-white/10">VK</div>
                              <div className="flex flex-col">
                                 <span className="text-sm font-black">{f.name}</span>
                                 <span className="text-[9px] text-indigo-200 font-bold uppercase">{f.expertise} Specialist</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-[10px] font-black text-indigo-300">LOAD: {f.load}</div>
                              <div className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-auto mt-1" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Cpu className="w-48 h-48" /></div>
            </div>

            {/* School Domain Stats */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-500" /> Availability Orbits
               </h3>
               
               <div className="space-y-5">
                  {[
                     { label: "ISME (Main Building)", free: 8, total: 42, color: "bg-indigo-500" },
                     { label: "ISDI Studios", free: 3, total: 28, color: "bg-pink-500" },
                     { label: "uGDX Tech Labs", free: 12, total: 20, color: "bg-cyan-500" },
                     { label: "Law Moot Room", free: 2, total: 5, color: "bg-amber-500" },
                  ].map((s, i) => (
                     <div key={i} className="group relative">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400 mb-2">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.free} Free Proffs</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${(s.free/s.total)*100}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Shield className="w-4 h-4 text-emerald-400" /> Verify School Sync
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
