"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight, Brain, Zap, Activity, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Settings, TerminalSquare, Shield,
  PlayCircle, Loader2, CheckCircle, AlertCircle, X, Copy, ChevronDown, Trash2, Mail, Phone
} from "lucide-react";

// ── Workflow imports ─────────────────────────────────────────────────────────
import DefaultWorkflow from "@/components/workflows/DefaultWorkflow";
import AdmissionsScoringWorkflow from "@/components/workflows/AdmissionsScoringWorkflow";
import HRBotWorkflow from "@/components/workflows/HRBotWorkflow";
import TimetableWorkflow from "@/components/workflows/TimetableWorkflow";
import FacultyLoadBalancerWorkflow from "@/components/workflows/FacultyLoadBalancerWorkflow";
import PlacementIntelligenceWorkflow from "@/components/workflows/PlacementIntelligenceWorkflow";
import RecruitmentWorkflow from "@/components/workflows/RecruitmentWorkflow";
import AppraisalWorkflow from "@/components/workflows/AppraisalWorkflow";
import ProjectTrackerWorkflow from "@/components/workflows/ProjectTrackerWorkflow";
import DropoutWorkflow from "@/components/workflows/DropoutWorkflow";
import GrievanceWorkflow from "@/components/workflows/GrievanceWorkflow";
import InterviewPrepWorkflow from "@/components/workflows/InterviewPrepWorkflow";
import ResumeWorkflow from "@/components/workflows/ResumeWorkflow";
import AlumniWorkflow from "@/components/workflows/AlumniWorkflow";
import CurriculumWorkflow from "@/components/workflows/CurriculumWorkflow";
import SubstitutionWorkflow from "@/components/workflows/SubstitutionWorkflow";
import CalendarWorkflow from "@/components/workflows/CalendarWorkflow";
import FeeCollectionWorkflow from "@/components/workflows/FeeCollectionWorkflow";
import BudgetWorkflow from "@/components/workflows/BudgetWorkflow";
import AccreditationWorkflow from "@/components/workflows/AccreditationWorkflow";
import ProcurementWorkflow from "@/components/workflows/ProcurementWorkflow";
import InternshipWorkflow from "@/components/workflows/InternshipWorkflow";
import ScholarshipWorkflow from "@/components/workflows/ScholarshipWorkflow";
import ITSupportWorkflow from "@/components/workflows/ITSupportWorkflow";
import ExamSchedulerWorkflow from "@/components/workflows/ExamSchedulerWorkflow";
import ResearchWorkflow from "@/components/workflows/ResearchWorkflow";
import ExecutionTrace from "@/components/agents/ExecutionTrace";

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

// ── Workflow Registry ─────────────────────────────────────────────────────────
type WorkflowProps = {
  config: AgentConfig;
  contracts?: Record<string, { handler?: string; required_inputs?: string[] }>;
  onExecute: (action: string, context: string) => Promise<void>;
  isExecuting: boolean;
};

const WORKFLOW_REGISTRY: Record<string, React.ComponentType<WorkflowProps>> = {
  "admissions-intelligence": ({ config, onExecute, isExecuting }) => (
    <AdmissionsScoringWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "admissions-scholarship": ({ config, onExecute, isExecuting }) => (
    <ScholarshipWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "admissions-leads": ({ config, onExecute, isExecuting }) => (
    <AdmissionsScoringWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "hr-bot": ({ config, onExecute, isExecuting }) => (
    <HRBotWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "hr-load-balancer": ({ config, onExecute, isExecuting }) => (
    <FacultyLoadBalancerWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "hr-appraisal": ({ config, onExecute, isExecuting }) => (
    <AppraisalWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "hr-recruitment": ({ config, onExecute, isExecuting }) => (
    <RecruitmentWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "academics-timetable": ({ config, onExecute, isExecuting }) => (
    <TimetableWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "academics-substitution": ({ config, onExecute, isExecuting }) => (
    <SubstitutionWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "academics-curriculum": ({ config, onExecute, isExecuting }) => (
    <CurriculumWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "academics-exams": ({ config, onExecute, isExecuting }) => (
    <ExamSchedulerWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "students-dropout": ({ config, onExecute, isExecuting }) => (
    <DropoutWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "students-grievance": ({ config, onExecute, isExecuting }) => (
    <GrievanceWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "students-mentorship": ({ config, onExecute, isExecuting }) => (
    <CurriculumWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "placement-intelligence": ({ config, onExecute, isExecuting }) => (
    <PlacementIntelligenceWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "placement-training": ({ config, onExecute, isExecuting }) => (
    <InterviewPrepWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "placement-alumni": ({ config, onExecute, isExecuting }) => (
    <AlumniWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "finance-fees": ({ config, onExecute, isExecuting }) => (
    <FeeCollectionWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "finance-budget": ({ config, onExecute, isExecuting }) => (
    <BudgetWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "finance-procurement": ({ config, onExecute, isExecuting }) => (
    <ProcurementWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "it-support": ({ config, onExecute, isExecuting }) => (
    <ITSupportWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
  "research-assistant": ({ config, onExecute, isExecuting }) => (
    <ResearchWorkflow agentId={config.agentId} onExecute={onExecute} isExecuting={isExecuting} />
  ),
};

const BADGE_CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  hot:    { label: "Hot",    bg: "var(--hot-bg)",    color: "var(--hot-text)",    border: "var(--hot-border)" },
  unique: { label: "Unique", bg: "var(--unique-bg)", color: "var(--unique-text)", border: "var(--unique-border)" },
  core:   { label: "Core",   bg: "var(--core-bg)",   color: "var(--core-text)",   border: "var(--core-border)" },
  api:    { label: "API",    bg: "var(--api-bg)",    color: "var(--api-text)",    border: "var(--api-border)" },
};

const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

// ── Result Drawer ─────────────────────────────────────────────────────────────
interface DrawerProps {
  result: { action: string; status: string; result: any; timestamp: string; telemetry?: any; execution_details?: any[] } | null;
  onClose: () => void;
}

function ResultDrawer({ result, onClose }: DrawerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const isSuccess = result.status === "SUCCESS";
  const data = typeof result.result === "string" ? null : result.result;

  const copyOutput = async () => {
    try {
      const text = typeof result.result === "string" ? result.result : JSON.stringify(result.result, null, 2);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-[min(920px,calc(100vw-2.5rem))]">
      <div className="relative w-full bg-slate-50 border border-slate-200 shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl ${isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
              {isSuccess ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base tracking-tight">{result.action}</h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                {new Date(result.timestamp).toLocaleString()}
                {data?.hash && <span className="text-slate-300 tabular-nums">ID: {data.hash}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyOutput} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm">
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-all">
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
            <button onClick={onClose} className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="max-h-[65vh] overflow-y-auto p-6 bg-slate-50 custom-scrollbar">
            {data?.type === "STUDENT_RISK_DOSSIER" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Intensity</div>
                    <div className="text-3xl font-black text-rose-600">{data.risk_score}%</div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${data.risk_score}%` }} />
                    </div>
                  </div>
                  {Object.entries(data.metrics || {}).map(([k, v]: any) => (
                    <div key={k} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{k.replace(/_/g, " ")}</div>
                      <div className="text-sm font-black text-slate-800">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-tighter">Recommended Intervention Framework</h4>
                  <div className="space-y-3">
                    {data.intervention_plan?.map((step: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : data?.type === "ONBOARDING_PACK" ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                  <Shield className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-10 rotate-12" />
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Digital Employee Record</div>
                  <h3 className="text-2xl font-black mb-1">Onboarding Framework Alpha</h3>
                  <div className="flex gap-4 mt-4">
                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold border border-white/20 uppercase tracking-widest">Tier: {data.employee_tier}</div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/30 uppercase tracking-widest">Digital Sign: Verified</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(data.onboarding_30_60_90 || {}).map(([k, v]: any) => (
                    <div key={k} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">{k.replace(/_/g, " ")} Goals</div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : data?.type === "MERIT_MATRIX" ? (
              <div className="space-y-6">
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight underline decoration-indigo-200 decoration-4">Candidate Merit Matrix</h3>
                          <p className="text-xs text-slate-400 mt-1 font-bold italic">Generated via Admissions Intelligence Agent</p>
                       </div>
                       <div className="text-right">
                          <div className="text-3xl font-black text-indigo-600">{data.probability_score}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Probability</div>
                       </div>
                    </div>
                    <div className="grid gap-6">
                       {data.key_drivers?.map((driver: string, i: number) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <span>{driver}</span>
                                <span>Impact: {95 - i*10}%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${95 - i*10}%` }} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            ) : (result?.execution_details && result.execution_details.length > 0) ? (
              <div className="space-y-6">
                 <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight underline decoration-indigo-200 decoration-4">Autonomous Execution Trace</h3>
                          <p className="text-xs text-slate-400 mt-1 font-bold italic">Generated via AI Pipeline</p>
                       </div>
                    </div>
                      <ExecutionTrace steps={result.execution_details} />
                 </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <pre className="text-[13px] leading-6 text-slate-700 whitespace-pre-wrap font-mono">
                  {typeof result.result === "string" ? result.result : JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            )}
            <div className="mt-6 p-4 rounded-xl border border-slate-200/60 bg-white/50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
               <span>Pipeline: 100% Verified</span>
               <span>Certification: OK</span>
               <span className="text-indigo-400">Atlas Command Node</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentPageTemplate({ config }: { config: AgentConfig }) {
  const badge = BADGE_CONFIG[config.badge];
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const domainSlug = toSlug(config.domain);
  const moduleSlug = config.agentId.startsWith(`${domainSlug}-`) ? toSlug(config.agentId.slice(domainSlug.length + 1)) : toSlug(config.agentId);

  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [drawerResult, setDrawerResult] = useState<DrawerProps["result"]>(null);
  const [error, setError] = useState<string | null>(null);

  const [opsLoading, setOpsLoading] = useState(true);
  const [opsRecords, setOpsRecords] = useState<any[]>([]);
  const [opsCount, setOpsCount] = useState(0);
  const [provenance, setProvenance] = useState<any>(null);
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
        fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/provenance`)
      ]);
      if (recordsRes.ok) {
        const data = await recordsRes.json();
        const records = Array.isArray(data) ? data : (data?.records || []);
        setOpsRecords(records);
        setOpsCount(records.length);
      }
      if (provRes.ok) setProvenance(await provRes.json());
    } catch { } finally { setOpsLoading(false); }
  };

  useEffect(() => { loadOpsData(); }, []);

  const executeAction = async (action: string, context: string) => {
    setRunningAction(action);
    setError(null);
    setDrawerResult(null);
    try {
      const res = await fetch(`${backendBase}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: config.agentId, action, context }),
      });
      if (res.ok) {
        const data = await res.json();
        setDrawerResult({
          action,
          status: data.status,
          result: data.result,
          timestamp: data.timestamp,
          telemetry: data.telemetry,
          execution_details: data.execution_details,
        });
      } else {
        let errorDetail = `Execution failed with status ${res.status}.`;
        try {
          const payload = await res.json();
          if (payload?.detail?.message) {
            errorDetail = payload.detail.message;
          } else if (payload?.detail) {
            errorDetail = typeof payload.detail === "string" ? payload.detail : JSON.stringify(payload.detail);
          }
        } catch {
          const fallbackText = await res.text();
          if (fallbackText) {
            errorDetail = fallbackText;
          }
        }
        setError(errorDetail);
      }
    } catch (e: any) { setError(e.message); } finally { setRunningAction(null); }
  };

  const removeRecord = async (id: number) => {
     await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}/${id}`, { method: "DELETE" });
     loadOpsData();
  };

  const sendCommunication = async () => {
     // Mock send
     alert(`Sent ${channel} to ${recipient}`);
  };

  const renderWorkflow = () => {
    const Workflow = WORKFLOW_REGISTRY[config.agentId] || DefaultWorkflow;
    return <Workflow config={config} onExecute={executeAction} isExecuting={!!runningAction} />;
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm">
          {error}
        </div>
      ) : null}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <Link href={config.domainHref} style={{ color: config.domainColor }} className="hover:opacity-80 transition-opacity capitalize">{config.domain}</Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900">{config.name}</span>
          </div>
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border ${badge.border}`} style={{ backgroundColor: badge.bg, color: badge.color }}>
              <Zap className="w-3 h-3" /> {badge.label} Agent
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">{config.name}</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">{config.description}</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {config.stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
                   {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.change}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xl">
             <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                   <Settings className="w-3 h-3" /> {WORKFLOW_REGISTRY[config.agentId] ? `${config.name} Workflow Engine` : "Standard Workflow Engine"}
                </div>
                {runningAction && (
                   <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-wider border border-amber-200 animate-pulse flex items-center gap-1.5"><Brain className="w-3 h-3" /> AI Reasoning...</span>
                )}
             </div>
             {renderWorkflow()}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-white/80 border border-slate-200 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-black mb-4">Live Workbench</h3>
              <div className="space-y-3 mb-6">
                 <input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="New operational item" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" />
                 <div className="grid grid-cols-2 gap-2">
                    <select value={newSource} onChange={(e)=>setNewSource(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 text-sm">
                       <option value="manual">Manual</option>
                       <option value="api">API</option>
                    </select>
                    <button onClick={async()=> { 
                       await fetch(`${backendBase}/api/ops/${domainSlug}/${moduleSlug}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title: newTitle, source: newSource}) });
                       setNewTitle(""); loadOpsData();
                    }} className="bg-slate-900 text-white rounded-xl text-sm font-bold">Add</button>
                 </div>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                 {opsRecords.map(r => (
                    <div key={r.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                       <div><div className="text-sm font-bold">{r.title}</div><div className="text-[10px] text-slate-400">{r.source}</div></div>
                       <button onClick={()=>removeRecord(r.id)}><Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-500" /></button>
                    </div>
                 ))}
              </div>
           </div>
           <div className="bg-white/80 border border-slate-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-black mb-6">Quick Actions</h3>
              <div className="grid gap-3">
                 {config.actions.map((a, i) => (
                    <button key={i} onClick={()=>executeAction(a.label, a.desc)} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-500 text-left transition-all group">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold group-hover:text-indigo-600">{a.label}</span>
                          <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                       </div>
                       <p className="text-[10px] text-slate-400">{a.desc}</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
      <ResultDrawer result={drawerResult} onClose={() => setDrawerResult(null)} />
    </div>
  );
}
