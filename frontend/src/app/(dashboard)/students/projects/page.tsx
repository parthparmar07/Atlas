"use client";

import { useState } from "react";
import { 
  PlusCircle, Search, Filter, Folder,
  Target, Zap, Activity, ShieldCheck, 
  BookOpen, Layers, Cpu, Gavel, 
  ArrowRight, Download, Printer, PlayCircle,
  Globe, MoreHorizontal, Layout, Box,
  Terminal, Share2, Star, TrendingUp,
  FileCode, FileSearch, Presentation,
  Users, MapPin, ChevronRight, Sparkles
} from "lucide-react";

const SCHOOLS = [
  { id: "isme", name: "ISME Business", color: "text-indigo-500", artifact: "Business Dossier" },
  { id: "isdi", name: "ISDI Design", color: "text-pink-500", artifact: "Design Spec Sheet" },
  { id: "ugdx", name: "uGDX Tech", icon: Cpu, color: "text-cyan-500", artifact: "Repo & Simulation" },
  { id: "law", name: "Law & Policy", icon: Gavel, color: "text-amber-500", artifact: "Legal Briefing" },
];

const PROJECTS = [
  { id: "PR-801", title: "Mars Rover Simulation v2", school: "ugdx", team: 4, progress: 92, status: "Proof of Concept", lead: "Dr. Satya Narayan" },
  { id: "PR-802", title: "Mumbai Eco-Design Fest", school: "isdi", team: 12, progress: 45, status: "Design Sprint", lead: "Prof. Khanna" },
  { id: "PR-803", title: "Digital Branding for FinTech", school: "isme", team: 2, progress: 78, status: "Industrial Pitch", lead: "Dr. Anjali Rao" },
  { id: "PR-804", title: "Policy for AI Governance", school: "law", team: 3, progress: 20, status: "Research Phase", lead: "Adv. Rahul D." },
];

export default function StudentProjectsPage() {
  const [selectedSchool, setSelectedSchool] = useState("all");

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
            <Box className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Innovation Orbit v4.2</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Portfolio Vault</h1>
          <p className="text-lg text-slate-500 font-medium italic">Managed orchestration for ISME, ISDI, uGDX, and Law student projects.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-4 rounded-3xl bg-white border border-slate-200 text-slate-700 font-black text-xs hover:shadow-xl transition-all">
              <Folder className="w-5 h-5 text-indigo-500" /> Project Archive
           </button>
           <button className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 hover:-translate-y-1">
              <PlusCircle className="w-5 h-5 text-indigo-400" /> New Proof of Concept
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Main List: Project Pipeline */}
         <div className="col-span-12 xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl overflow-hidden relative">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg"><Activity className="w-5 h-5 text-white" /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Project Pipeline</h2>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-indigo-600">Download Portfolio</button>
                     <div className="w-[1px] h-4 bg-slate-200 mx-2" />
                     {SCHOOLS.map((s) => (
                        <button key={s.id} onClick={() => setSelectedSchool(s.id)} className={`p-2 rounded-xl transition-all ${selectedSchool === s.id ? `bg-indigo-50 ${s.color}` : 'opacity-40 grayscale hover:opacity-100'}`}>
                           {s.icon ? <s.icon className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-4">
                  {PROJECTS.filter(p => selectedSchool === 'all' || p.school === selectedSchool).map((p) => {
                     const sObj = SCHOOLS.find(s => s.id === p.school);
                     return (
                        <div key={p.id} className="group relative p-8 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl overflow-hidden">
                           <div className="flex items-center gap-8">
                              <div className={`w-20 h-20 rounded-[2rem] ${sObj?.color.replace('text-', 'bg-')} flex items-center justify-center shadow-2xl mb-auto`}>
                                 {sObj && (sObj.icon ? <sObj.icon className="w-8 h-8 text-white" /> : <BookOpen className="w-8 h-8 text-white" />)}
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">{p.title}</h3>
                                    <div className={`text-[9px] font-black ${sObj?.color} uppercase tracking-widest font-mono`}>{sObj?.name}</div>
                                 </div>
                                 <div className="flex items-center gap-6 text-[11px] text-slate-500 font-bold mb-4">
                                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Team size: {p.team}</span>
                                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Lead: {p.lead}</span>
                                 </div>
                                 
                                 {/* Progress Bar */}
                                 <div className="space-y-1.5">
                                    <div className="flex justify-between items-end text-[9px] font-black uppercase text-slate-400">
                                       <span>Status: {p.status}</span>
                                       <span className="text-slate-900">{p.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                       <div className={`h-full ${sObj?.color.replace('text-', 'bg-')} rounded-full transition-all duration-1000 shadow-lg`} style={{ width: `${p.progress}%` }} />
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 text-right">
                                 <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${p.progress > 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    {p.progress > 80 ? 'Near Completion' : 'In Progress'}
                                 </div>
                                 <button className="p-2 transition-all opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600">
                                    <MoreHorizontal className="w-6 h-6" />
                                 </button>
                              </div>
                           </div>
                           
                           {/* Artifacts Sync Mock */}
                           <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 {[
                                    { icon: FileCode, label: "Repo Sync" },
                                    { icon: FileSearch, label: "Peer Audit" },
                                    { icon: Presentation, label: "Industrial Pitch" }
                                 ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                                       <a.icon className="w-3.5 h-3.5 text-slate-400" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{a.label}</span>
                                    </div>
                                 ))}
                              </div>
                              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                                 Launch Portfolio Presentation <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>

         {/* Right Sidebar: Project Health & AI Audit */}
         <div className="col-span-12 xl:col-span-4 space-y-6">
            {/* Project Maturity Index */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                 <Target className="w-6 h-6 text-indigo-400" /> Innovation Maturity
               </h3>
               
               <div className="space-y-6">
                  {[
                     { label: "NASA Rover v2 (uGDX)", val: 92, color: "bg-cyan-500" },
                     { label: "Mumbai Design MDW (ISDI)", val: 45, color: "bg-pink-500" },
                     { label: "Branding FinTech (ISME)", val: 78, color: "bg-indigo-500" },
                  ].map((s, i) => (
                     <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-500 group-hover:text-white transition-colors">
                           <span>{s.label}</span>
                           <span className="text-indigo-400">{s.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color} rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(34,211,238,0.2)]`} style={{ width: `${s.val}%` }} />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-10 p-8 bg-indigo-600 rounded-[2.5rem] relative overflow-hidden shadow-2xl group/card">
                  <div className="relative z-10">
                     <Sparkles className="w-7 h-7 text-indigo-100 mb-4" />
                     <h4 className="text-xl font-black leading-tight mb-2">AI Project Pulse</h4>
                     <p className="text-xs text-indigo-50 italic mb-6 leading-relaxed">
                       "Project PR-801 (uGDX) has exceeded Proof of Concept milestones. Probability of NASA top-5 selection is 82%. Suggesting industrial pitch prep."
                     </p>
                     <button className="flex items-center gap-2 text-xs font-black text-white hover:text-indigo-100 transition-colors">
                       Request Dean Review <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:scale-110 transition-transform"><Cpu className="w-32 h-32" /></div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-xl relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-500" /> Collaboration Heatmap
               </h3>
               
               <div className="aspect-square bg-slate-50 rounded-[2rem] border border-slate-100 p-8 relative flex flex-col justify-center items-center group/map">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center justify-center relative">
                     <div className="absolute top-[-10px] left-[-10px] w-4 h-4 bg-rose-500 rounded-full shadow-lg shadow-rose-200 animate-pulse" />
                     <div className="absolute bottom-[-5px] right-[-15px] w-3 h-3 bg-emerald-500 rounded-full" />
                     <Users className="w-10 h-10 text-indigo-500" />
                  </div>
                  <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cross-School Collaboration</p>
                  <div className="flex items-center gap-4 mt-4">
                     <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-900">12</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">ISME-uGDX</span>
                     </div>
                     <div className="w-[1px] h-4 bg-slate-200" />
                     <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-900">8</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">ISDI-Law</span>
                     </div>
                  </div>
               </div>
               
               <button className="w-full mt-10 py-5 bg-slate-900 text-white font-black text-xs rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                  <Globe className="w-4 h-4 text-emerald-400" /> View Live Repositories
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
