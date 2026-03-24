"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Search, Filter, BookOpen, Layers, 
  Cpu, Gavel, Pin, Clock, MapPin, 
  CheckCircle2, Sparkles, Download, Printer,
  MoreHorizontal, Users, Target, ShieldCheck,
  AlertCircle, Activity, Globe, PlusCircle, Bookmark
} from "lucide-react";
import AcademicsActionRunner from "@/components/academics/AcademicsActionRunner";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "bg-indigo-500", text: "text-indigo-500" },
  { id: "isdi", name: "ISDI Design", color: "bg-pink-500", text: "text-pink-500" },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "bg-cyan-500", text: "text-cyan-500" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "bg-amber-500", text: "text-amber-500" },
];

const CALENDAR_EVENTS = [
  { id: "EV-1", title: "Semester III Exams", school: "isme", date: "12 May", type: "Exam", venue: "Bloomberg Lab", importance: "Critical" },
  { id: "EV-2", title: "NASA Rover Field Test", school: "ugdx", date: "15 May", type: "Project", venue: "uGDX Deep Tech Bay", importance: "High" },
  { id: "EV-3", title: "Parsons Design Workshop", school: "isdi", date: "18 May", type: "Workshop", venue: "Studio A", importance: "High" },
  { id: "EV-4", title: "Supreme Court Moot Trial", school: "law", date: "22 May", type: "Event", venue: "Moot Court Room", importance: "Medium" },
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

import { useSchool } from "@/context/SchoolContext";

export default function AcademicsCalendarPage() {
  const { currentSchool } = useSchool();
  const [selectedSchool, setSelectedSchool] = useState("all");
   const [academicYear, setAcademicYear] = useState("2026-2027");
   const [startDate, setStartDate] = useState("2026-07-01");
   const [endDate, setEndDate] = useState("2027-05-31");
   const [eventName, setEventName] = useState("Industry Conclave");
   const [eventDate, setEventDate] = useState("2026-09-15");
   const [eventType, setEventType] = useState("event");
   const [holidayInput, setHolidayInput] = useState(
      "Independence Day|2026-08-15\nRepublic Day|2027-01-26"
   );
   const [examWindowInput, setExamWindowInput] = useState(
      "Mid Sem|2026-11-12|2026-11-28\nEnd Sem|2027-04-10|2027-04-26"
   );

  const actualSchoolId = currentSchool.id === 'atlas' ? selectedSchool : currentSchool.id;

   const parseHolidayInput = () => {
      return holidayInput
         .split("\n")
         .map((line) => line.trim())
         .filter(Boolean)
         .map((line) => {
            const [name, date] = line.split("|").map((v) => v.trim());
            return { name: name || "Holiday", date: date || startDate };
         });
   };

   const parseExamWindows = () => {
      return examWindowInput
         .split("\n")
         .map((line) => line.trim())
         .filter(Boolean)
         .map((line) => {
            const [name, start, end] = line.split("|").map((v) => v.trim());
            return {
               name: name || "Exam Window",
               start: start || startDate,
               end: end || endDate,
            };
         });
   };

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className={`flex items-center gap-2 px-3 py-1 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <CalendarIcon className={`w-3.5 h-3.5 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-widest`}>{currentSchool.name} Orbit</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Academic Timeline</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managing {currentSchool.name} academic cycles and institutional milestones.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <input type="text" placeholder={`AI: Optimize ${currentSchool.name} Schedule...`} className="bg-transparent border-none focus:ring-0 text-[11px] font-bold text-slate-600 w-64 uppercase tracking-wider" />
              <button className="bg-slate-900 text-white p-2 rounded-xl hover:bg-indigo-600 transition-all"><PlusCircle className="w-4 h-4" /></button>
           </div>
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <PlusCircle className="w-5 h-5 text-indigo-500" /> New Milestone
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Globe className="w-5 h-5 text-sky-400" /> Cloud Sync
           </button>
        </div>
      </div>

         <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Calendar Input Control</h3>
                  <p className="text-xs text-slate-500 font-medium">
                     Set these once and run any calendar action. Format for lines: Name|Date and Name|Start|End.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
               <label className="text-xs font-bold text-slate-500">
                  Academic Year
                  <input
                     value={academicYear}
                     onChange={(e) => setAcademicYear(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
               </label>
               <label className="text-xs font-bold text-slate-500">
                  Start Date
                  <input
                     value={startDate}
                     onChange={(e) => setStartDate(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
               </label>
               <label className="text-xs font-bold text-slate-500">
                  End Date
                  <input
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
               </label>
               <label className="text-xs font-bold text-slate-500">
                  Event Type
                  <select
                     value={eventType}
                     onChange={(e) => setEventType(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                     <option value="event">event</option>
                     <option value="exam">exam</option>
                     <option value="holiday">holiday</option>
                     <option value="teaching_day">teaching_day</option>
                  </select>
               </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
               <label className="text-xs font-bold text-slate-500">
                  Event Name
                  <input
                     value={eventName}
                     onChange={(e) => setEventName(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
               </label>
               <label className="text-xs font-bold text-slate-500">
                  Event Date
                  <input
                     value={eventDate}
                     onChange={(e) => setEventDate(e.target.value)}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  />
               </label>
               <div className="text-[11px] text-slate-500 font-medium rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 flex items-center">
                  Active School: <span className="font-black text-slate-700 ml-1">{actualSchoolId === "all" ? "atlas" : actualSchoolId}</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <label className="text-xs font-bold text-slate-500">
                  Holidays (Name|Date per line)
                  <textarea
                     value={holidayInput}
                     onChange={(e) => setHolidayInput(e.target.value)}
                     rows={4}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  />
               </label>
               <label className="text-xs font-bold text-slate-500">
                  Exam Windows (Name|Start|End per line)
                  <textarea
                     value={examWindowInput}
                     onChange={(e) => setExamWindowInput(e.target.value)}
                     rows={4}
                     className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
                  />
               </label>
            </div>
         </div>

         <AcademicsActionRunner
            title="Calendar Generator Control"
            agentId="academics-calendar"
            actions={[
               { label: "Generate Calendar", description: "Create full semester calendar with teaching and exam windows." },
               { label: "Add Event", description: "Insert approved milestones with overlap checks." },
               { label: "Holiday Mapping", description: "Evaluate teaching-day impact from holiday load." },
               { label: "Export Calendar", description: "Prepare publish-ready calendar payload by month." },
            ]}
            buildContext={(action) => ({
               action,
               school_id: actualSchoolId === "all" ? "atlas" : actualSchoolId,
               academic_year: academicYear,
               start_date: startDate,
               end_date: endDate,
               event: {
                  name: eventName,
                  date: eventDate,
                  type: eventType,
               },
               holidays: parseHolidayInput(),
               exam_windows: parseExamWindows(),
            })}
         />

      <div className="grid grid-cols-12 gap-8">
         {/* Left Side: Modular Calendar Grid */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-8">
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">May 2024</h2>
                     <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600"><ChevronRight className="w-5 h-5" /></button>
                     </div>
                  </div>
                  {currentSchool.id === 'atlas' && (
                    <div className="flex items-center gap-2">
                       {SCHOOLS.map((s) => (
                          <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.text}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                             {s.icon ? <s.icon className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                          </button>
                       ))}
                       <button onClick={() => setSelectedSchool('all')} className={`p-2 rounded-xl transition-all ${selectedSchool === 'all' ? 'bg-indigo-50 text-indigo-600' : 'opacity-40 grayscale hover:opacity-100'}`}>
                          <Layers className="w-5 h-5" />
                       </button>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner">
                  {WEEK_DAYS.map((d, i) => (
                     <div key={i} className={`p-6 bg-slate-50 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest ${i > 4 ? 'bg-indigo-50/30' : ''}`}>{d}</div>
                  ))}
                  {Array.from({ length: 35 }).map((_, i) => {
                     const dayNum = i - 3; // Mocking starting from Wednesday
                     const isDay = dayNum > 0 && dayNum <= 31;
                     const events = isDay ? CALENDAR_EVENTS.filter(e => e.date.includes(dayNum.toString().padStart(2, '0'))) : [];
                     const filteredEvents = events.filter(e => actualSchoolId === 'all' || e.school === actualSchoolId);

                     return (
                        <div key={i} className={`h-40 bg-white p-4 group relative transition-colors ${!isDay ? 'bg-slate-50 opacity-20' : 'hover:bg-slate-50'}`}>
                           {isDay && (
                              <>
                                 <span className="text-xs font-black text-slate-300 group-hover:text-indigo-600 transition-colors">{dayNum}</span>
                                 <div className="mt-2 space-y-1.5 overflow-hidden">
                                    {filteredEvents.map((e, ei) => {
                                       const sObj = SCHOOLS.find(s => s.id === e.school);
                                       return (
                                          <div key={ei} className={`p-2 rounded-xl border ${sObj?.color.replace('bg-', 'bg-').replace('500', '50')} ${sObj?.text.replace('text-', 'border-').replace('500', '100')} flex flex-col gap-0.5 shadow-sm group/ev`}>
                                             <div className="flex items-center justify-between">
                                                <span className={`text-[8px] font-black uppercase tracking-tighter ${sObj?.text}`}>{e.type}</span>
                                                <Bookmark className={`w-2.5 h-2.5 ${sObj?.text} opacity-0 group-hover/ev:opacity-100 transition-opacity`} />
                                             </div>
                                             <div className="text-[10px] font-black text-slate-900 leading-tight line-clamp-2">{e.title}</div>
                                          </div>
                                       )
                                    })}
                                 </div>
                              </>
                           )}
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Key Orbit & AI Insights */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Key Milestones Queue */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Pin className="w-6 h-6 text-indigo-400" /> {currentSchool.name} Milestones
               </h3>
               
               <div className="space-y-4">
                  {CALENDAR_EVENTS.filter(e => currentSchool.id === 'atlas' || e.school === currentSchool.id).map((e, i) => {
                     const sObj = SCHOOLS.find(s => s.id === e.school);
                     return (
                        <div key={i} className="group relative p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl ${sObj?.color || 'bg-indigo-600'} flex items-center justify-center shadow-lg`}>
                                 <CalendarIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-black text-white">{e.title}</h4>
                                    <span className="text-[10px] font-black text-indigo-400">{e.date}</span>
                                 </div>
                                 <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.venue}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
               
               <div className="mt-10 p-8 bg-indigo-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-indigo-100 mb-4" />
                     <h4 className="text-xl font-black leading-tight mb-2">Institutional Logic</h4>
                     <p className="text-xs text-indigo-50 italic mb-6 leading-relaxed">
                       "Auditing {currentSchool.name} calendar for resource conflicts. High availability detected for Exam blocks."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-100 transition-colors">
                       Optimize Resource Map <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-32 h-32" /></div>
               </div>
            </div>

            {/* Reputation & Engagement Heatmap */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" /> Professional Pulse
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: `${currentSchool.name} Visibility`, val: 82, color: currentSchool.color.replace('text', 'bg') },
                     { label: "Faculty Engagement", val: 44, color: "bg-slate-300" },
                     { label: "Cycle Completion", val: 92, color: "bg-emerald-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5 flex flex-col gap-1">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Printer className="w-4 h-4 text-emerald-400" /> Generate Institutional PDF
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
