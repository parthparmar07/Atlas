"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, Brain, Zap, Activity, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Settings, TerminalSquare,
  PlayCircle, Loader2, CheckCircle, AlertCircle, X, Copy, ChevronDown, Trash2, Mail, Phone
} from "lucide-react";

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

const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

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
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const domainSlug = toSlug(config.domain);
  const moduleSlug = config.agentId.startsWith(`${domainSlug}-`) ? toSlug(config.agentId.slice(domainSlug.length + 1)) : toSlug(config.agentId);

  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [drawerResult, setDrawerResult] = useState<DrawerProps["result"]>(null);
  const [error, setError] = useState<string | null>(null);
  const [opsMode, setOpsMode] = useState(false);

  const [realActions, setRealActions] = useState<Array<{ label: string; desc: string }>>(config.actions);
  const [contracts, setContracts] = useState<Record<string, { handler?: string; required_inputs?: string[] }>>({});

  const [opsLoading, setOpsLoading] = useState(true);
  const [opsRecords, setOpsRecords] = useState<Array<{ id: number; title: string; status: string; source: string; updated_at?: string }>>([]);
  const [opsCount, setOpsCount] = useState(0);
  const [provenance, setProvenance] = useState<{ total_records: number; source_mix: Record<string, number>; latest_activity_at?: string } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSource, setNewSource] = useState("manual");
  const [channel, setChannel] = useState("email");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const loadOpsData = async () => {
    setOpsLoading(true);
    try {
      const [recordsRes, provRes] = await Promise.all([
        fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}`),
        fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/provenance`),
      ]);

      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setOpsRecords(recordsData.records || []);
        setOpsCount(recordsData.count || 0);
      }

      if (provRes.ok) {
        const provData = await provRes.json();
        setProvenance(provData);
      }
    } catch {
      // keep UI usable even if ops endpoint is unavailable
    } finally {
      setOpsLoading(false);
    }
  };

  // Sync with backend on mount
  useEffect(() => {
    const fetchRealMetadata = async () => {
      try {
        const [agentRes, contractRes] = await Promise.all([
          fetch(`${backendBase}/api/agent-exec/agents/${config.agentId}`),
          fetch(`${backendBase}/api/agent-exec/agents/${config.agentId}/contracts`),
        ]);

        if (agentRes.ok) {
          const data = await agentRes.json();
          if (data.actions && data.actions.length > 0) {
            const mapped = data.actions.map((a: string) => ({
              label: a,
              desc: `Execute the ${a} action on this agent.`,
            }));
            setRealActions(mapped);
          }
        } else {
          setOpsMode(true);
        }

        if (contractRes.ok) {
          const c = await contractRes.json();
          setContracts(c.contracts || {});
        } else {
          setOpsMode(true);
        }
      } catch (err) {
        setOpsMode(true);
      }

      await loadOpsData();
    };
    fetchRealMetadata();
  }, [config.agentId, backendBase, domainSlug, moduleSlug]);

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
      if (!opsMode) {
        const res = await fetch(`${backendBase}/api/agent-exec/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent_id: config.agentId,
            action,
            context: context || `Running from Atlas Command Center — ${config.domain}`,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setDrawerResult({ action, status: data.status, result: data.result, timestamp: data.timestamp, telemetry: data.telemetry });
          return;
        }
        setOpsMode(true);
      }

      const fallbackRes = await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, context }),
      });
      if (!fallbackRes.ok) {
        const txt = await fallbackRes.text();
        throw new Error(txt || `HTTP ${fallbackRes.status}`);
      }
      const fallback = await fallbackRes.json();
      setDrawerResult({
        action,
        status: fallback.status || "SUCCESS",
        result: fallback.result || `${action} executed via operations fallback`,
        timestamp: fallback.created_at || new Date().toISOString(),
      });
      await loadOpsData();
    } catch (e: any) {
      setError(`Execution failed: ${e.message}`);
    } finally {
      setRunningAction(null);
    }
  };

  const createRecord = async () => {
    if (!newTitle.trim()) return;
    setError(null);
    try {
      const res = await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, source: newSource, status: "new" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setNewTitle("");
      setNewSource("manual");
      await loadOpsData();
    } catch (e: any) {
      setError(`Create failed: ${e.message}`);
    }
  };

  const removeRecord = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await loadOpsData();
    } catch (e: any) {
      setError(`Delete failed: ${e.message}`);
    }
  };

  const sendCommunication = async () => {
    if (!recipient.trim() || !message.trim()) return;
    setError(null);
    try {
      const res = await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/communications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, recipient, message }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("");
      await loadOpsData();
    } catch (e: any) {
      setError(`Communication failed: ${e.message}`);
    }
  };

  const renderWorkflow = () => {
    return <DefaultWorkflow config={effectiveConfig} contracts={contracts} onExecute={executeAction} isExecuting={!!runningAction} />;
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
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Workbench</h3>
              <span className="text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                {opsMode ? "Ops Mode" : "Agent Mode"}
              </span>
            </div>

            <div className="text-xs text-slate-500 mb-4">
              Records: <span className="font-bold text-slate-700">{opsCount}</span>
              {provenance?.latest_activity_at ? ` • Last: ${new Date(provenance.latest_activity_at).toLocaleString()}` : ""}
            </div>

            <div className="space-y-3 mb-4">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new operational item"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select value={newSource} onChange={(e) => setNewSource(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
                  <option value="manual">Manual</option>
                  <option value="api">API</option>
                  <option value="import">Import</option>
                  <option value="webhook">Webhook</option>
                </select>
                <button onClick={createRecord} className="px-3 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700">Create</button>
              </div>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 mb-5">
              {opsLoading ? (
                <div className="text-sm text-slate-500">Loading records...</div>
              ) : opsRecords.length === 0 ? (
                <div className="text-sm text-slate-500">No records yet.</div>
              ) : (
                opsRecords.slice(0, 6).map((record) => (
                  <div key={record.id} className="flex items-start justify-between gap-2 p-3 rounded-xl border border-slate-100 bg-white">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{record.title}</div>
                      <div className="text-[11px] text-slate-500">{record.status} • {record.source}</div>
                    </div>
                    <button onClick={() => removeRecord(record.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select value={channel} onChange={(e) => setChannel(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="call">Call</option>
                </select>
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient" className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
              </div>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Follow-up message" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm min-h-20" />
              <button onClick={sendCommunication} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 inline-flex items-center justify-center gap-2">
                {channel === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />} Send {channel}
              </button>
            </div>
          </div>

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
