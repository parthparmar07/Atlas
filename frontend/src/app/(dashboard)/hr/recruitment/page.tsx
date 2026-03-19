"use client";

import { useState } from "react";
import {
  Users, Search, Filter, Briefcase,
  MapPin, Clock, CheckCircle2, AlertCircle,
  ArrowRight, UserPlus, FileText, Layout,
  BookOpen, Layers, Cpu, Gavel, Award, Sparkles,
  PieChart, FlaskConical, Microscope, BadgeCent, Medal,
  Zap, ClipboardList, Shield, TrendingUp, Star, MoreHorizontal, Mail, Phone,
  Globe, ChevronRight, PlusSquare
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "text-indigo-500", vacancies: 4 },
  { id: "isdi", name: "ISDI Design", color: "text-pink-500", vacancies: 7 },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", vacancies: 3 },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", vacancies: 2 },
];

const CANDIDATES = [
  { id: "CAN-101", name: "Dr. Elena Gilbert", school: "ugdx", role: "Sr. Research Scientist (AI)", score: 94, status: "Interviewing", source: "LinkedIn" },
  { id: "CAN-102", name: "Prof. Damon S.", school: "isdi", role: "Strategic Design Faculty", score: 88, status: "Shortlisted", source: "Headhunted" },
  { id: "CAN-103", name: "Siddharth Roy.", school: "isme", role: "MBA Finance Professor", score: 72, status: "Technical Round", source: "Referral" },
  { id: "CAN-104", name: "Adv. Caroline F.", school: "law", role: "Constitutional Policy Lead", score: 91, status: "Initial Screening", source: "Direct" },
];

export default function HRRecruitmentPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Pipeline Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Talent Orbit</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Hiring Control</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed recruitment lifecycle across ISME, ISDI, uGDX, and Law schools.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <PlusSquare className="w-5 h-5 text-indigo-500" /> New Vacancy
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Lead Scraping
           </button>
        </div>
      </div>

      {/* School Vacancy HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SCHOOLS.map((s, i) => (
          <div key={i} className={`p-6 bg-white rounded-[2rem] border border-slate-100 shadow-xl group hover:border-indigo-500/50 transition-all cursor-pointer ${selectedSchool === s.id ? 'ring-2 ring-indigo-500' : ''}`} onClick={() => setSelectedSchool(s.id)}>
            <div className={`text-[10px] font-black ${s.color} uppercase tracking-widest mb-2`}>{s.name}</div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-slate-900">{s.vacancies}</span>
              <span className="text-[10px] font-black p-1 px-2 bg-slate-50 text-slate-400 rounded-lg">Active Roles</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Talent Pipeline */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><UserPlus className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Candidate Pipeline</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                     <Search className="w-4 h-4 text-slate-400" />
                     <input type="text" placeholder="Search talent..." className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 w-44" />
                  </div>
               </div>

               <div className="space-y-4">
                  {CANDIDATES.filter(c => selectedSchool === 'all' || c.school === selectedSchool).map((c) => {
                     const sObj = SCHOOLS.find(s => s.id === c.school);
                     return (
                        <div key={c.id} className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-lg shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                 {c.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-1">
                                    <span className="text-sm font-black text-slate-900">{c.name}</span>
                                    <div className={`text-[9px] font-black ${sObj?.color} uppercase tracking-widest`}>{sObj?.name}</div>
                                 </div>
                                 <div className="flex items-center gap-5 text-[11px] text-slate-500 font-bold">
                                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {c.role}</span>
                                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {c.source}</span>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${c.status === 'Interviewing' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : c.status === 'Shortlisted' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Shortlisted' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                                    {c.status}
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-black text-slate-900">{c.score}% Match</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all text-slate-500"><Mail className="w-4 h-4" /></button>
                                 <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all text-slate-500"><Phone className="w-4 h-4" /></button>
                                 <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all text-slate-500"><FileText className="w-4 h-4" /></button>
                              </div>
                              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                                 Move to Next Round <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Hiring Analytics & AI Audit */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <TrendingUp className="w-6 h-6 text-indigo-400" /> Pipeline Velocity
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: "Avg Time to Fill", val: "12 days", trend: "-2", color: "text-emerald-400" },
                     { label: "Offer Acceptance", val: "94%", trend: "+5", color: "text-indigo-400" },
                  ].map((s, i) => (
                     <div key={i} className="flex flex-col gap-1 p-5 rounded-[2rem] bg-white/5 border border-white/10">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</span>
                        <div className="flex items-end justify-between">
                           <span className={`text-3xl font-black ${s.color}`}>{s.val}</span>
                           <span className="text-[10px] text-slate-500 font-bold">{s.trend} from last month</span>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-8 p-6 bg-indigo-600 rounded-[2rem] relative overflow-hidden group/card shadow-2xl">
                  <div className="relative z-10">
                     <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">AI Agent Audit</div>
                     <p className="text-xs text-white italic mb-4 leading-relaxed font-medium">
                       "Candidate CAN-101 matches the NASA uGDX Robotics criteria perfectly (94%). Suggesting expedited interview with Dean uGDX."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-indigo-100 hover:text-white transition-colors">
                       Confirm Recruitment Sprint <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-24 h-24" /></div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl overflow-hidden relative">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-500" /> Budget Utilization
               </h3>
               
               <div className="space-y-5">
                  {[
                     { label: "ISME Hiring Budget", used: 2.1, total: 5, color: "bg-indigo-500" },
                     { label: "ISDI Faculty Expansion", used: 3.8, total: 4, color: "bg-pink-500" },
                     { label: "uGDX Lab Staffing", used: 1.2, total: 3, color: "bg-cyan-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                           <span>{s.label}</span>
                           <span className="text-slate-900">{s.used}M / {s.total}M</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${(s.used/s.total)*100}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Shield className="w-4 h-4 text-emerald-400" /> Verify Background Checks
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
