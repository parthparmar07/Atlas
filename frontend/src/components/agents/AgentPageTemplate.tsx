"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight, Brain, Zap, Activity, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Settings, TerminalSquare,
  PlayCircle, Loader2, CheckCircle, AlertCircle, X
} from "lucide-react";

export interface AgentConfig {
  name: string;
  agentId: string;           // slug matching backend registry e.g. "admissions-intelligence"
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
  result: { action: string; status: string; result: string; timestamp: string } | null;
  onClose: () => void;
}

function ResultDrawer({ result, onClose }: DrawerProps) {
  if (!result) return null;
  const isSuccess = result.status === "SUCCESS";
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
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
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Status pill */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
          >
            {result.status}
          </span>
          <span className="text-[12px] text-slate-500 font-medium">Agent execution complete</span>
        </div>

        {/* Result output */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {result.result}
          </div>
        </div>
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

  const executeAction = async (action: string) => {
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
          context: `Running from Atlas Command Center — ${config.domain}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setDrawerResult({ action, status: data.status, result: data.result, timestamp: data.timestamp });
    } catch (e: any) {
      setError(`Execution failed: ${e.message}`);
    } finally {
      setRunningAction(null);
    }
  };

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
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
        <div className="relative z-10 flex justify-between items-start">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                {config.name}
              </h1>
              <span
                className="badge"
                style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-lg font-medium mb-4" style={{ color: config.domainColor }}>
              {config.tagline}
            </p>
            <p className="text-slate-500 font-medium leading-relaxed">
              {config.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              Online
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ID: {config.agentId}
            </div>
          </div>
        </div>
        <div
          className="absolute -right-20 -top-40 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: config.domainColor }}
        />
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {config.stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">{stat.value}</h3>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              {stat.up === true ? (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" />{stat.change}
                </div>
              ) : stat.up === false ? (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  <ArrowDownRight className="w-3 h-3" />{stat.change}
                </div>
              ) : (
                <span className="text-slate-500">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* ── Left Column ── */}
        <div className="col-span-2 space-y-8">
          {/* Pipeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: config.domainColor }} />
              Agent Workflow
            </h2>
            <div className="relative border-l-2 ml-4" style={{ borderColor: `${config.domainColor}30` }}>
              {config.pipeline.map((step, i) => (
                <div key={i} className="mb-8 last:mb-0 relative pl-10 pr-4">
                  <div
                    className="absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center font-bold text-xs"
                    style={{ background: config.domainColor, color: "white" }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions — real execution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-indigo-500" />
              Quick Actions
            </h2>
            <p className="text-[12px] text-slate-400 mb-6 font-medium">
              Each action triggers the real AI execution pipeline via Gemini.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {config.actions.map((act) => {
                const isRunning = runningAction === act.label;
                return (
                  <button
                    key={act.label}
                    onClick={() => executeAction(act.label)}
                    disabled={!!runningAction}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-colors ${isRunning ? "bg-indigo-100 border-indigo-200 border" : "bg-white border border-slate-200"}`}
                    >
                      {isRunning ? (
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{act.label}</h4>
                      <p className="text-[12px] font-medium text-slate-500 mt-1">{act.desc}</p>
                      {isRunning && (
                        <p className="text-[11px] text-indigo-600 font-semibold mt-1.5">Executing via Gemini...</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="col-span-1 space-y-8">
          {/* Capabilities */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              Core Capabilities
            </h2>
            <ul className="space-y-4">
              {config.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Recent Logs
            </h2>
            <div className="space-y-6">
              {config.activity.map((log, i) => (
                <div
                  key={i}
                  className="relative pl-4 border-l-2"
                  style={{
                    borderColor:
                      log.status === "success" ? "#10b981" :
                      log.status === "error"   ? "#ef4444" :
                      log.status === "pending" ? "#f59e0b" : "#cbd5e1",
                  }}
                >
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{
                      color:
                        log.status === "success" ? "#059669" :
                        log.status === "error"   ? "#b91c1c" :
                        log.status === "pending" ? "#d97706" : "#64748b",
                    }}
                  >
                    {log.time}
                  </span>
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed mt-0.5">
                    {log.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result Drawer */}
      <ResultDrawer result={drawerResult} onClose={() => setDrawerResult(null)} />
    </div>
  );
}
