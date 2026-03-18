"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, Brain, Zap, Activity, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Settings, TerminalSquare,
  PlayCircle, Loader2, CheckCircle, AlertCircle, X, Copy, ChevronDown
} from "lucide-react";

// Workflow Components
import AdmissionsScoringWorkflow from "@/components/workflows/AdmissionsScoringWorkflow";
import HRBotWorkflow from "@/components/workflows/HRBotWorkflow";
import FacultyLoadBalancerWorkflow from "@/components/workflows/FacultyLoadBalancerWorkflow";
import AppraisalWorkflow from "@/components/workflows/AppraisalWorkflow";
import RecruitmentWorkflow from "@/components/workflows/RecruitmentWorkflow";
import SubstitutionWorkflow from "@/components/workflows/SubstitutionWorkflow";
import CurriculumWorkflow from "@/components/workflows/CurriculumWorkflow";
import CalendarWorkflow from "@/components/workflows/CalendarWorkflow";
import PlacementIntelligenceWorkflow from "@/components/workflows/PlacementIntelligenceWorkflow";
import InterviewPrepWorkflow from "@/components/workflows/InterviewPrepWorkflow";
import AlumniWorkflow from "@/components/workflows/AlumniWorkflow";
import ResumeWorkflow from "@/components/workflows/ResumeWorkflow";
import ProjectTrackerWorkflow from "@/components/workflows/ProjectTrackerWorkflow";
import DropoutWorkflow from "@/components/workflows/DropoutWorkflow";
import InternshipWorkflow from "@/components/workflows/InternshipWorkflow";
import GrievanceWorkflow from "@/components/workflows/GrievanceWorkflow";
import FeeCollectionWorkflow from "@/components/workflows/FeeCollectionWorkflow";
import ProcurementWorkflow from "@/components/workflows/ProcurementWorkflow";
import AccreditationWorkflow from "@/components/workflows/AccreditationWorkflow";
import TimetableWorkflow from "@/components/workflows/TimetableWorkflow";
import BudgetWorkflow from "@/components/workflows/BudgetWorkflow";
import DefaultWorkflow from "@/components/workflows/DefaultWorkflow";

export interface AgentConfig {
  name: string;
  agentId: string;
  badge: "hot" | "unique" | "core" | "api";
  domain: string;
  domainHref: string;
  domainColor: string;
  tagline: string;
  description: string;
  stats: Array<{ label: string; value: string; change: string; up?: boolean }>;
  pipeline: Array<{ title: string; desc: string }>;
  actions: Array<{ label: string; desc: string }>;
  activity: Array<{ time: string; event: string; status: "success" | "pending" | "error" | "info" }>;
  capabilities: string[];
}

const BADGE_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  hot:    { label: "Hot",    bg: "var(--hot-bg)",    color: "var(--hot-text)",    border: "var(--hot-border)" },
  unique: { label: "Unique", bg: "var(--unique-bg)", color: "var(--unique-text)", border: "var(--unique-border)" },
  core:   { label: "Core",   bg: "var(--core-bg)",   color: "var(--core-text)",   border: "var(--core-border)" },
  api:    { label: "API",    bg: "var(--api-bg)",    color: "var(--api-text)",    border: "var(--api-border)" },
};

// ── Result Drawer ─────────────────────────────────────────────────────────────
interface DrawerProps {
  result: { action: string; status: string; result: string; timestamp: string; telemetry?: any } | null;
  onClose: () => void;
}

function ResultDrawer({ result, onClose }: DrawerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const isSuccess = result.status === "SUCCESS";

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(result.result || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard access can fail in restricted browser contexts.
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(860px,calc(100vw-2.5rem))]">
      <div
        className="relative w-full bg-white border border-slate-200 shadow-2xl shadow-slate-900/15 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <h2 className="font-bold text-slate-800 text-sm">{result.action}</h2>
              <p className="text-[11px] text-slate-400">{new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyOutput}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <span className="inline-flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={collapsed ? "Expand output" : "Collapse output"}
            >
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Close output">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isSuccess ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200"}`}
            >
              {result.status}
            </span>
            <span className="text-[12px] text-slate-500 font-medium">Execution complete</span>
          </div>
          
          {result.telemetry && (
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {result.telemetry.duration_ms}ms</span>
              {result.telemetry.model && <span>• Model: {result.telemetry.model}</span>}
              {result.telemetry.retries_used !== undefined && <span>• Retries: {result.telemetry.retries_used}</span>}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="max-h-[58vh] overflow-y-auto p-5 custom-scrollbar bg-white">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <pre className="text-[13px] leading-6 text-slate-700 whitespace-pre-wrap font-mono">
                {result.result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Template ─────────────────────────────────────────────────────────────
export default function AgentPageTemplate({ config }: { config: AgentConfig }) {
  const badge = BADGE_CONFIG[config.badge];
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [drawerResult, setDrawerResult] = useState<DrawerProps["result"]>(null);
  const [error, setError] = useState<string | null>(null);
  const [realActions, setRealActions] = useState<Array<{ label: string; desc: string }>>(config.actions);

  // Sync with backend on mount
  useEffect(() => {
    const fetchRealActions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent-exec/agents/${config.agentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.actions && data.actions.length > 0) {
            // Map the string actions from backend to the { label, desc } format the UI expects
            const mapped = data.actions.map((a: string) => ({
              label: a,
              desc: `Execute the ${a} action on this agent.`
            }));
            setRealActions(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to sync agent actions:", err);
      }
    };
    fetchRealActions();
  }, [config.agentId]);

  // Use the realActions in the effective config
  const effectiveConfig = { ...config, actions: realActions };

  // Update favicon based on workflow state
  useEffect(() => {
    let state = "default";
    if (runningAction) {
      state = "in-progress";
    } else if (drawerResult) {
      state = drawerResult.status === "SUCCESS" ? "success" : "error";
    }

    const setFavicon = (type: string) => {
      let iconUrl = "/favicon.svg"; // default
      
      if (type === "in-progress") {
        iconUrl = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23eab308%22 /><circle cx=%2250%22 cy=%2250%22 r=%2220%22 fill=%22white%22><animate attributeName=%22r%22 values=%2210;20;10%22 dur=%221s%22 repeatCount=%22indefinite%22/></circle></svg>";
      } else if (type === "success") {
        iconUrl = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%2322c55e%22 /><path d=%22M30 50 L45 65 L70 35%22 stroke=%22white%22 stroke-width=%2210%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>";
      } else if (type === "error") {
        iconUrl = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23ef4444%22 /><path d=%22M30 30 L70 70 M70 30 L30 70%22 stroke=%22white%22 stroke-width=%2210%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>";
      }
      
      let link: HTMLLinkElement | null = document.getElementById("app-favicon") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = 'app-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = iconUrl;
    };

    setFavicon(state);

    // Cleanup on unmount
    return () => {
      setFavicon("default");
    };
  }, [runningAction, drawerResult]);

  // Use the realActions in the effective config for the UI
  const effectiveActions = realActions;

  const executeAction = async (action: string, context: string) => {
    setRunningAction(action);
    setError(null);
    setDrawerResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: config.agentId,
          action,
          context: context || `Running from Atlas Command Center — ${config.domain}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setDrawerResult({ action, status: data.status, result: data.result, timestamp: data.timestamp, telemetry: data.telemetry });
    } catch (e: any) {
      setError(`Execution failed: ${e.message}`);
    } finally {
      setRunningAction(null);
    }
  };

  const renderWorkflow = () => {
    switch (config.agentId) {
      case "admissions-intelligence":
        return <AdmissionsScoringWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "hr-bot":
        return <HRBotWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "hr-load-balancer":
        return <FacultyLoadBalancerWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "hr-appraisal":
        return <AppraisalWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "hr-recruitment":
        return <RecruitmentWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "finance-accreditation":
        return <AccreditationWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "academics-timetable":
        return <TimetableWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "academics-substitution":
        return <SubstitutionWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "academics-curriculum":
        return <CurriculumWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "academics-calendar":
        return <CalendarWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "placement-intelligence":
        return <PlacementIntelligenceWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "placement-interview":
        return <InterviewPrepWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "placement-alumni":
        return <AlumniWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "placement-resume":
        return <ResumeWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "students-projects":
        return <ProjectTrackerWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "students-dropout":
        return <DropoutWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "students-internships":
        return <InternshipWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "students-grievance":
        return <GrievanceWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "finance-fees":
        return <FeeCollectionWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "finance-procurement":
        return <ProcurementWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      case "finance-budget":
        return <BudgetWorkflow agentId={config.agentId} onExecute={executeAction} isExecuting={!!runningAction} />;
      default:
        return <DefaultWorkflow config={effectiveConfig} onExecute={executeAction} isExecuting={!!runningAction} />;
    }
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1400, margin: "0 auto", color: "var(--text-primary)" }}>
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 mb-8 text-sm font-semibold text-slate-400">
        <Link href="/" className="hover:text-slate-700 transition-colors">Command Center</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={config.domainHref} className="hover:text-slate-700 transition-colors">{config.domain}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-800">{config.name}</span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Header Banner ── */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-10 mb-10 shadow-xl shadow-slate-200/40 card-hover">
        <div className="relative z-10 flex justify-between items-start">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                {config.name}
              </h1>
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm"
                style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500" style={{ color: config.domainColor }}>
              {config.tagline}
            </p>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
              {config.description}
            </p>
          </div>
          <div className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              Agent Active
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
              #{config.agentId}
            </div>
          </div>
        </div>
        <div
          className="absolute -right-20 -top-40 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none animate-pulse"
          style={{ background: config.domainColor }}
        />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        {config.stats.map((stat, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-7 shadow-lg shadow-slate-100/50 card-hover flex flex-col justify-between group">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 group-hover:text-slate-500 transition-colors">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-5">{stat.value}</h3>
            <div className="flex items-center gap-2 text-[12px] font-bold">
              {stat.up === true ? (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <ArrowUpRight className="w-3.5 h-3.5" />{stat.change}
                </div>
              ) : stat.up === false ? (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  <ArrowDownRight className="w-3.5 h-3.5" />{stat.change}
                </div>
              ) : (
                <span className="text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Col: Workflow Engine */}
        <div className="col-span-8 space-y-8">
          {renderWorkflow()}
        </div>

        {/* Right Col: Activity & Capabilities */}
        <div className="col-span-4 space-y-8">
          {/* Quick Actions List */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                <TerminalSquare className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Quick Actions</h2>
            </div>
            <div className="grid gap-4">
              {effectiveConfig.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => executeAction(action.label, `Running ${action.label} from quick actions`)}
                  disabled={!!runningAction}
                  className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/60 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{action.label}</span>
                    {runningAction === action.label ? (
                      <Loader2 className="w-3 h-3 text-indigo-600 animate-spin" />
                    ) : (
                      <PlayCircle className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-all" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-sky-50 rounded-xl text-sky-600 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Activity</h3>
            </div>
            <div className="space-y-5">
              {config.activity.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.event}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Core Capabilities</h3>
            </div>
            <div className="space-y-3">
              {config.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-600 font-medium text-sm">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ResultDrawer result={drawerResult} onClose={() => setDrawerResult(null)} />
    </div>
  );
}
