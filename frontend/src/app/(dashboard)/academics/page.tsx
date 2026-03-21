"use client";

import { useSchool } from "@/context/SchoolContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BookOpen, Calendar, ClipboardCheck, Clock, ArrowRight, Activity, Layers, Sparkles, Users, Eye, Mic, Zap, Loader2 } from "lucide-react";
import Link from "next/link";

const AGENTS = [
  {
    id: "calendar",
    title: "Calendar Intelligence",
    desc: "Single source of truth for all institutional dates, events, and academic milestones.",
    href: "/academics/calendar",
    icon: Calendar,
    badge: "Core",
  },
  {
    id: "exams",
    title: "Examination Control",
    desc: "Autonomous scheduling of proctors, venues, and seated sequences for finals.",
    href: "/academics/exams",
    icon: ClipboardCheck,
    badge: "Hot",
  },
  {
    id: "timetable",
    title: "Timetable AI",
    desc: "Clash-free institutional scheduling for thousands of students and faculty members.",
    href: "/academics/timetable",
    icon: Clock,
    badge: "Hot",
  },
  {
    id: "curriculum",
    title: "Curriculum Auditor",
    desc: "AI audit of course delivery against institutional goals and NAAC/NIRF standards.",
    href: "/academics/curriculum",
    icon: Layers,
    badge: "Unique",
  },
  {
      id: "substitution",
      title: "Substitution Agent",
      desc: "Instant faculty substitution matching based on profile, load, and proximity.",
      href: "/academics/substitution",
      icon: Sparkles,
      badge: "Core",
    },
    {
      id: "faculty",
      title: "Faculty Transparency",
      desc: "Verified professor profiles, subjects maps, and real-time contact intelligence.",
      href: "/academics/faculty",
      icon: Users,
      badge: "New",
    },
    {
      id: "attendance",
      title: "Attendance Watchdog",
      desc: "75% threshold AI monitoring with automated intervention for at-risk students.",
      href: "/academics/attendance",
      icon: Eye,
      badge: "Critical",
    },
    {
      id: "recovery",
      title: "Recovery Advisor",
      desc: "AI study plans and career recovery roadmap for academic restoration.",
      href: "/academics/recovery",
      icon: Activity,
      badge: "AI",
    }
];

export default function AcademicsHub() {
  const { currentSchool } = useSchool();
  const [stats, setStats] = useState<any>(null);
  const [automationRuns, setAutomationRuns] = useState<any[]>([]);
  const [automationBusy, setAutomationBusy] = useState(false);
  const [automationError, setAutomationError] = useState("");

  const loadAutomationRuns = async () => {
    try {
      const data = await api<{ runs: any[] }>(`/api/academics/automation/runs?school=${currentSchool.id}&limit=5`);
      setAutomationRuns(data.runs ?? []);
    } catch (e) {
      setAutomationError(e instanceof Error ? e.message : "Failed to load automation runs.");
    }
  };

  const runAutomation = async () => {
    setAutomationBusy(true);
    setAutomationError("");
    try {
      await api("/api/academics/automation/run", {
        method: "POST",
        body: JSON.stringify({ school: currentSchool.id, trigger_type: "manual", trigger_ref: "hub-runner" }),
      });
      await loadAutomationRuns();
    } catch (e) {
      setAutomationError(e instanceof Error ? e.message : "Automation run failed.");
    } finally {
      setAutomationBusy(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api<any>(`/api/academics/stats?school=${currentSchool.id}`);
        setStats(data);
      } catch (e) {
        console.error("Failed to load school stats", e);
      }
    };
    void loadStats();
    void loadAutomationRuns();
  }, [currentSchool.id]);

  return (
    <div className="p-8 max-w-[1700px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-16 shadow-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700`}>
           <BookOpen className={`w-96 h-96 ${currentSchool.color}`} />
        </div>

        <div className="relative z-10 space-y-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 ${currentSchool.bg} border border-indigo-500/10 rounded-full w-fit`}>
            <BookOpen className={`w-4 h-4 ${currentSchool.color}`} />
            <span className={`text-[10px] font-black ${currentSchool.color} uppercase tracking-[0.2em]`}>{currentSchool.name} Domain</span>
          </div>
          
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none">
            Academic <br/>
            <span className="text-slate-400">Command Hub</span>
          </h1>
          
          <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
            orchestrating a clash-free institutional lifecycle across {currentSchool.name}.
          </p>
          
          <div className="flex items-center gap-8 pt-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Systems</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">L4 Autonomy Peak</span>
             </div>
          </div>
        </div>
      </div>

      {/* Live Domain Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Faculty Verified
                  <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{stats?.faculty_verified ?? "..."}</div>
              <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded inline-block">Institutional Peak</div>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Attendance Risk
                  <Eye className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{stats?.attendance_risk ?? "..."}</div>
              <div className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded inline-block">Below 75% Threshold</div>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Academic GPA
                  <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight">{stats?.average_gpa ?? "..."}</div>
              <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded inline-block">Institutional Avg</div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                  System Health
                  <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-4xl font-black text-white tracking-tight">{stats?.system_health ?? "99.9%"}</div>
              <div className="text-[10px] font-bold text-indigo-400 bg-white/5 px-2 py-1 rounded inline-block">L4 Autonomous</div>
          </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.22em]">Phase 4 Automation</div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Academic Guardrail Cycle</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Runs conflict, exam, calendar, and curriculum guardrails in one autonomous pass.</p>
          </div>
          <button
            onClick={() => void runAutomation()}
            disabled={automationBusy}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-60 inline-flex items-center gap-2"
          >
            {automationBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
            Run Automation Cycle
          </button>
        </div>

        {automationError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{automationError}</div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automationRuns.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-500">No automation runs yet for this school.</div>
          ) : (
            automationRuns.map((run) => (
              <div key={run.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black text-slate-900">Run #{run.id}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-1">{run.status}</div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{run.summary}</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(run.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AGENTS.map((agent) => (
          <Link 
            key={agent.id} 
            href={agent.href}
            className="group bg-white rounded-[2.5rem] border border-slate-100 p-10 hover:shadow-2xl hover:-translate-y-2 transition-all"
          >
            <div className={`p-4 rounded-2xl bg-slate-50 ${currentSchool.color} w-fit mb-6 group-hover:${currentSchool.bg} transition-colors shadow-sm`}>
              <agent.icon className="w-8 h-8" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{agent.title}</h3>
               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:${currentSchool.bg} group-hover:${currentSchool.color}`}>{agent.badge}</span>
            </div>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 opacity-80 italic">
              {agent.desc}
            </p>
            
            <div className="flex items-center justify-end pt-6 border-t border-slate-50">
               <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
