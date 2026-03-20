"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, Mail, Phone, 
  MapPin, Brain, Activity, Target, 
  ChevronRight, ArrowUpRight, ShieldAlert,
  Sparkles, RefreshCw, Layers
} from "lucide-react";
import Link from "next/link";

const STUDENTS = [
  { id: "S-1001", name: "Aarav Sharma", school: "uGDX", program: "B.Tech GenAI", year: "Sem 2", status: "Enrolled", risk: "Low", gpa: 3.8, engagement: 92 },
  { id: "S-1002", name: "Ishani Kapoor", school: "ISDI", program: "B.Des Fashion", year: "Sem 4", status: "Enrolled", risk: "Low", gpa: 3.9, engagement: 95 },
  { id: "S-1003", name: "Rohan Mehra", school: "ISME", program: "BBA Finance", year: "Sem 6", status: "At Risk", risk: "High", gpa: 2.4, engagement: 45 },
  { id: "S-1004", name: "Ananya Iyer", school: "Law", program: "LL.B AI Law", year: "Sem 1", status: "Prospect", risk: "N/A", gpa: 0, engagement: 0 },
  { id: "S-1005", name: "Kabir Singh", school: "uGDX", program: "M.Tech Robotics", year: "Sem 3", status: "Enrolled", risk: "Medium", gpa: 3.1, engagement: 78 },
  { id: "S-1006", name: "Sanya Malhotra", school: "ISME", program: "MBA Marketing", year: "Sem 2", status: "Recent Alumni", risk: "N/A", gpa: 3.7, engagement: 88 },
  { id: "S-1101", name: "Vikram Batra", school: "uGDX", program: "B.Tech AI Cloud", year: "Sem 4", status: "Enrolled", risk: "Low", gpa: 3.9, engagement: 98 },
  { id: "S-1102", name: "Zoya Akhtar", school: "ISDI", program: "B.Des Strategies", year: "Sem 2", status: "Enrolled", risk: "Low", gpa: 3.4, engagement: 82 },
  { id: "S-1103", name: "Priya Das", school: "ISME", program: "B.Sc Finance", year: "Sem 4", status: "At Risk", risk: "Medium", gpa: 2.8, engagement: 62 },
  { id: "S-1104", name: "Dev Karan", school: "Law", program: "LL.B Corporate", year: "Sem 3", status: "Enrolled", risk: "Low", gpa: 3.2, engagement: 89 },
  { id: "S-1105", name: "Meera Nair", school: "ISDI", program: "B.Des Fashion", year: "Sem 6", status: "Recent Alumni", risk: "N/A", gpa: 3.9, engagement: 94 },
  { id: "S-1106", name: "Samir Jain", school: "uGDX", program: "B.Tech Data Sci", year: "Sem 4", status: "Enrolled", risk: "High", gpa: 2.1, engagement: 38 },
];

import { useSchool } from "@/context/SchoolContext";

export default function StudentMasterList() {
  const { currentSchool } = useSchool();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = currentSchool.id === "atlas" || s.school.toLowerCase() === currentSchool.id.toLowerCase();
    return matchesSearch && matchesSchool;
  });

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-2xl relative overflow-hidden mb-8">
        {/* Institutional Watermark */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <currentSchool.icon className={`w-64 h-64 ${currentSchool.color}`} />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className={`flex items-center gap-2 px-4 py-1.5 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
              <currentSchool.icon className={`w-4 h-4 ${currentSchool.color}`} />
              <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-[0.2em]`}>{currentSchool.name} Official Registry</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
              {currentSchool.name === 'Atlas Global' ? 'Institutional' : currentSchool.name} <br/>
              <span className="text-slate-400">Lifecycle Matrix</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              Real-time directory of {filteredStudents.length} learners currently active within the {currentSchool.name} ecosystem.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search across identity/SID..."
                      className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-[350px] shadow-sm transition-all focus:bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all shadow-sm">
                  <Filter className="w-5 h-5 text-slate-500" />
                </button>
             </div>
             <div className="flex items-center gap-3 justify-end">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Sync Status</div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black uppercase">Active (0.4ms)</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Learners", val: "1,240", icon: Users, color: "text-indigo-500" },
          { label: "Engagement Velocity", val: "84%", icon: Activity, color: "text-emerald-500" },
          { label: "Predictive Risk (High)", val: "12 Students", icon: ShieldAlert, color: "text-rose-500" },
          { label: "Admission Pipeline", val: "342 Leads", icon: Target, color: "text-sky-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
              <div className="text-2xl font-black text-slate-900">{s.val}</div>
            </div>
            <div className={`p-4 rounded-2xl bg-slate-50 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Matrix Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black text-slate-900">Lifecycle Registry</h3>
           <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
               <Sparkles className="w-4 h-4" /> Export Intelligence
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Identity</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic school</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program & Stage</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle State</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Predictive Risk</th>
                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-4">Matrix Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {s.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{s.name}</div>
                        <div className="text-[10px] font-bold text-slate-400">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        s.school === 'uGDX' ? 'bg-cyan-50 text-cyan-600' : 
                        s.school === 'ISDI' ? 'bg-pink-50 text-pink-600' : 
                        s.school === 'ISME' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {s.school}
                      </span>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="text-xs font-bold text-slate-800">{s.program}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.year}</div>
                  </td>
                  <td className="py-6">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border ${
                      s.status === 'Enrolled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      s.status === 'At Risk' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      s.status === 'Prospect' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${s.risk === 'High' ? 'bg-rose-500' : s.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${s.engagement}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{s.risk}</span>
                    </div>
                  </td>
                  <td className="py-6 pr-4 text-right">
                    <Link href={`/students/${s.id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
