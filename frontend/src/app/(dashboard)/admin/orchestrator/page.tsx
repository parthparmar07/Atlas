"use client";

import { useState, useEffect } from "react";
import { 
  Zap, Shield, Activity, Target, Brain, 
  ChevronRight, RefreshCw, AlertCircle, CheckCircle2,
  Clock, Server, Globe, Search, Layers, Cpu
} from "lucide-react";
import LiveTerminal from "@/components/workflows/LiveTerminal";

const DOMAINS = [
  { name: "ISME (Business)", color: "bg-indigo-500", icon: Target, active: true },
  { name: "ISDI (Design)", color: "bg-pink-500", icon: Layers, active: true },
  { name: "uGDX (Tech)", color: "bg-cyan-500", icon: Cpu, active: true },
  { name: "Law & Policy", color: "bg-amber-500", icon: Shield, active: false },
];

const HEALTH_METRICS = [
  { label: "Gemini 1.5 Pro", status: "Online", latency: "320ms", load: "12%" },
  { label: "Groq LPU", status: "Online", latency: "11ms", load: "44%" },
  { label: "Agent Bus", status: "Active", latency: "1ms", load: "0.2%" },
];

export default function OrchestratorPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTasks, setActiveTasks] = useState([
    { id: "T-89", agent: "DropoutPredictor", target: "S-Recap", status: "Reflecting", time: "2s ago", goal: "Predictive Intervention" },
    { id: "T-90", agent: "HR-Bot", target: "PayrollSync", status: "Executing", time: "Now", goal: "Salary Reconciliation" },
    { id: "T-91", agent: "PlacementIntel", target: "ISME-BBA-Sem6", status: "Reasoning", time: "Now", goal: "Salary Trend Mapping" },
  ]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Dashboard HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full w-fit">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">God Mode Override Active</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Global Orchestrator</h1>
          <p className="text-lg text-slate-500 font-medium">Monitoring the 35 agents across ISME, ISDI, uGDX, and Law.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {HEALTH_METRICS.map((h, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.label}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">{h.latency}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Live Insights & Flow */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Managed Pipeline Handoff Stream */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <RefreshCw className="w-5 h-5 text-white animate-spin-slow" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Handoffs</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                 <Clock className="w-3.5 h-3.5" /> Live Stream
              </div>
            </div>

            <div className="space-y-4">
              {[
                { from: "Admissions (Lead Nurture)", to: "Scholarship Matcher", action: "Grant Selection", detail: "Qualified high-merit lead (92%) passed for financial mapping.", type: "CAS-891" },
                { from: "Dropout Predictor", to: "Wellbeing Support", action: "Intervention", detail: "Significant attendance drop detected in UGDX. Handing off for counselling.", type: "STU-442" },
                { from: "HR Recruitment", to: "IT Support", action: "Provisioning", detail: "New Faculty (ISME) confirmed. Handing off for ERP credentials.", type: "FAC-110" },
              ].map((h, i) => (
                <div key={i} className="group relative">
                  <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-500 transition-all hover:shadow-lg">
                    <div className="flex flex-col items-center">
                       <span className="text-[10px] font-black text-slate-300 uppercase">{h.from.split('(')[0]}</span>
                       <ChevronRight className="w-4 h-4 text-indigo-400 my-1 rotate-90" />
                       <span className="text-[10px] font-black text-indigo-600 uppercase font-mono">{h.to}</span>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-slate-900">{h.action}</span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-500">{h.type}</span>
                       </div>
                       <p className="text-xs text-slate-500 leading-relaxed italic">"{h.detail}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Backlog */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
             <div className="flex items-center gap-3 mb-8">
                <Target className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-black tracking-tight">Global Task Backlog</h2>
             </div>
             
             <div className="grid gap-3">
                {activeTasks.map((t) => (
                   <div key={t.id} className="grid grid-cols-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-500 border border-white/5">{t.id}</div>
                         <div className="text-sm font-black">{t.agent}</div>
                      </div>
                      <div className="text-xs text-slate-400 font-bold uppercase">{t.goal}</div>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                         <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">{t.status}</span>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">{t.time}</div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Monitors & Terminal */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <LiveTerminal />

          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
             <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-500" /> Domain Pulse
             </h3>
             <div className="space-y-4">
                {DOMAINS.map((d, i) => (
                   <div key={i} className={`p-4 rounded-2xl border transition-all ${d.active ? "bg-slate-50 border-slate-100" : "opacity-40 grayscale border-dashed border-slate-200"}`}>
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                            <d.icon className={`w-4 h-4 ${d.active ? "text-slate-900" : "text-slate-400"}`} />
                            <span className="text-sm font-black">{d.name}</span>
                         </div>
                         {d.active ? <Activity className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-slate-400" />}
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                         <div className={`h-full ${d.color} rounded-full`} style={{ width: d.active ? '65%' : '0%' }} />
                      </div>
                   </div>
                ))}
             </div>
             <button className="w-full mt-6 py-4 rounded-xl bg-slate-900 text-white font-black text-sm hover:bg-slate-800 transition-colors shadow-lg">Manual Override Sync</button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
                <Brain className="w-8 h-8 text-indigo-200 mb-4 opacity-50" />
                <h3 className="text-xl font-black mb-2">AI Reflection Auditor</h3>
                <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                  Deeply reviewing agentic cycles to ensure 100% policy compliance in Law and UGDX.
                </p>
                <div className="p-4 bg-black/20 rounded-2xl border border-white/10 text-[10px] font-mono text-indigo-200 italic">
                  "Reflecting on Admissions Lead T-12. Probability of enrollment is 88%. Action confirmed."
                </div>
             </div>
             <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Target className="w-32 h-32" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
