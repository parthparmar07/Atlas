"use client";

import { useState, useEffect } from "react";
import { 
  Zap, Shield, Activity, Target, Brain, 
  ChevronRight, RefreshCw, AlertCircle, CheckCircle2,
  Clock, Server, Globe, Search, Layers, Cpu, Sparkles
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

import { useSchool } from "@/context/SchoolContext";

export default function OrchestratorPage() {
  const [mounted, setMounted] = useState(false);
  const { currentSchool: school } = useSchool();
  const [stats, setStats] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState([
    { id: "T-89", agent: "DropoutPredictor", target: "S-Recap", status: "Reflecting", time: "2s ago", goal: "Predictive Intervention" },
    { id: "T-90", agent: "HR-Bot", target: "PayrollSync", status: "Executing", time: "Now", goal: "Salary Reconciliation" },
    { id: "T-91", agent: "PlacementIntel", target: "ISME-BBA-Sem6", status: "Reasoning", time: "Now", goal: "Salary Trend Mapping" },
  ]);
  
  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchSignalHistory();

    const interval = setInterval(() => {
        fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, [school]); // Re-fetch when school changes

  const fetchStats = async () => {
    try {
        const res = await fetch(`http://localhost:8000/api/telemetry/stats?school=${school.id}`);
        const data = await res.json();
        setStats(data);
    } catch (e) { console.error(e); }
  };

  const fetchSignalHistory = async () => {
    try {
        const res = await fetch('http://localhost:8000/api/signals/history');
        const data = await res.json();
        setSignals(data.reverse());
    } catch (e) { console.error(e); }
  };

  if (!mounted) return null;

  const HEALTH_CARDS = [
    { label: "LPU Inference", val: stats?.inference_latency || "Checking...", icon: Zap, color: "text-amber-500" },
    { label: "Token Throughput", val: stats?.tokens_processed || "0.0M", icon: Brain, color: "text-indigo-500" },
    { label: "Unit Context", val: stats?.context || "Institutional Pulse", icon: Activity, color: "text-sky-500" },
    { label: "Specialized Metric", val: stats?.special_metric || "N/A", icon: Sparkles, color: "text-emerald-500" },
  ];

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Dashboard HUD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className={`flex items-center gap-2 px-3 py-1 ${school.bg} border border-indigo-500/20 rounded-full w-fit`}>
            <school.icon className={`w-3.5 h-3.5 ${school.color}`} />
            <span className={`text-[10px] font-black ${school.color} uppercase tracking-widest`}>{school.name} Orchestrator Override</span>
          </div>
          <h1>{school.name} Control Plane</h1>
          <p className="text-lg text-slate-500 font-medium">Monitoring {stats?.active_agents || 35} agents across the {school.name} Synaptic Pipeline.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {HEALTH_CARDS.map((h, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2 min-w-[160px]">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.label}</div>
                <h.icon className={`w-3.5 h-3.5 ${h.color}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">{h.val}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Live Insights & Flow */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Managed Pipeline Signal Stream */}
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl relative overflow-hidden">
            {/* Dynamic Institutional Overlay */}
            <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none`}>
               <school.icon className={`w-80 h-80 ${school.color}`} />
            </div>

            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${school.bg} flex items-center justify-center shadow-2xl transition-all duration-500`}>
                  <Activity className={`w-7 h-7 ${school.color} animate-pulse`} />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{school.name} Synaptic Pulse</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`w-2 h-2 rounded-full ${school.color.replace('text', 'bg')} animate-ping`} />
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time {school.id?.toUpperCase()} Flow Bus</div>
                    </div>
                </div>
              </div>
              <button onClick={fetchSignalHistory} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:bg-white hover:shadow-xl group">
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>

            {/* Hyper-Detailed Institutional Intelligence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
               {stats?.school_specific_data?.map((metric: any, i: number) => (
                 <div key={i} className={`p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 group`}>
                    <div className="flex items-center justify-between mb-4">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</div>
                       <div className={`w-2 h-2 rounded-full ${metric.status === 'Peak' || metric.status === 'High' || metric.status === 'Elite' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                       <div className="text-3xl font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">{metric.val}</div>
                       <div className={`text-[10px] font-black uppercase ${metric.status === 'NOMINAL' ? 'text-slate-400' : school.color}`}>{metric.status}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{metric.sub}</div>
                    
                    {/* Visual Progress/Health indicator */}
                    <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${school.color.replace('text', 'bg')} opacity-40`} style={{ width: i % 2 === 0 ? '75%' : '45%' }} />
                    </div>
                 </div>
               ))}
               
               {/* Fallback/System Metadata if stats not loaded yet */}
               {!stats?.school_specific_data && [1,2,3,4].map(i => (
                 <div key={i} className="p-6 bg-slate-50 animate-pulse border border-slate-100 rounded-[2rem] h-[140px]" />
               ))}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {signals.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <Activity className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Awaiting Domain Signals...</p>
                </div>
              ) : signals.map((s, i) => (
                <div key={s.id || i} className="group relative">
                  <div className="flex items-center gap-6 p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:border-indigo-500 transition-all hover:shadow-2xl">
                    <div className="flex flex-col items-center min-w-[100px] border-r border-slate-100 pr-6">
                       <span className="text-[10px] font-black text-slate-400 uppercase">{s.source_agent}</span>
                       <div className="h-4 w-px bg-slate-100 my-1" />
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Signal Sent</span>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-black text-slate-900">{s.action}</span>
                          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase ${s.priority > 3 ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                            {s.priority > 3 ? 'Critical' : 'Routine'}
                          </span>
                       </div>
                       <p className="text-xs text-slate-500 font-medium italic opacity-80">
                         Executed handoff with result: {s.payload?.result || 'N/A'}. 
                         Latency: {s.payload?.duration_ms || 0}ms.
                       </p>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-300 uppercase mb-2">{new Date(s.timestamp).toLocaleTimeString()}</div>
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                        </div>
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
