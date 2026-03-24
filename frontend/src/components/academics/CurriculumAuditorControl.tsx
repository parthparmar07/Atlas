"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Play, Sparkles } from "lucide-react";

type CurriculumAction =
  | "Audit Syllabus"
  | "NEP Compliance"
  | "Industry Alignment"
  | "Generate Audit Report";

type RunnerAction = {
  label: CurriculumAction;
  description: string;
};

type UIKpi = {
  label: string;
  value: string | number;
};

type UITable = {
  columns: string[];
  rows: Record<string, unknown>[];
};

type UIPayload = {
  kind?: string;
  kpis?: UIKpi[];
  table?: UITable;
};

type RunResponse = {
  status: string;
  timestamp: string;
  result?: {
    title?: string;
    summary?: string;
    hash?: string;
    ui_payload?: UIPayload;
  };
  execution_details?: Record<string, unknown>[];
};

interface CurriculumAuditorControlProps {
  schoolId: string;
}

const ACTIONS: RunnerAction[] = [
  {
    label: "Audit Syllabus",
    description: "Refresh curriculum gap map against exam and skill signals.",
  },
  {
    label: "NEP Compliance",
    description: "Evaluate NEP 2020 compliance metrics across active entries.",
  },
  {
    label: "Industry Alignment",
    description: "Benchmark relevance to current role-family expectations.",
  },
  {
    label: "Generate Audit Report",
    description: "Produce programme-level audit rollup with top gaps.",
  },
];

function toTitle(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (v) => v.toUpperCase());
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function CurriculumAuditorControl({ schoolId }: CurriculumAuditorControlProps) {
  const [programme, setProgramme] = useState("B.Tech CSE");
  const [semester, setSemester] = useState("Semester 5");
  const [track, setTrack] = useState("Data Science");
  const [benchmarksInput, setBenchmarksInput] = useState("NEP 2020\nNASSCOM FutureSkills\nOBE");
  const [industryRolesInput, setIndustryRolesInput] = useState("Data Analyst\nML Engineer\nData Engineer");
  const [programmesInput, setProgrammesInput] = useState("B.Tech CSE\nB.Tech AI/ML");

  const [runningAction, setRunningAction] = useState<CurriculumAction | null>(null);
  const [activeAction, setActiveAction] = useState<CurriculumAction | null>(null);
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");

  const backendBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000", []);

  const lines = (raw: string) =>
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const runAction = async (action: CurriculumAction) => {
    setRunningAction(action);
    setActiveAction(action);
    setError("");
    setResponse(null);

    try {
      const payloadContext = {
        action,
        school_id: schoolId || "atlas",
        programme,
        semester,
        track,
        benchmarks: lines(benchmarksInput),
        industry_roles: lines(industryRolesInput),
        programmes: lines(programmesInput),
      };

      const res = await fetch(`${backendBase}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: "academics-curriculum",
          action,
          context: JSON.stringify(payloadContext),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail?.message || body?.detail || `Execution failed with status ${res.status}`;
        throw new Error(typeof detail === "string" ? detail : "Execution failed");
      }

      const data = (await res.json()) as RunResponse;
      setResponse(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to execute curriculum operation.");
    } finally {
      setRunningAction(null);
    }
  };

  const normalizedOutput = useMemo(() => {
    const ui = response?.result?.ui_payload;
    if (ui?.kpis && ui?.table) {
      return ui;
    }

    const steps = response?.execution_details ?? [];
    const byStatus = new Map<string, Record<string, unknown>>();
    for (const step of steps) {
      const status = String(step?.status || "");
      if (status) byStatus.set(status, step);
    }

    if (activeAction === "Audit Syllabus") {
      const updated = (byStatus.get("syllabus_audit_completed")?.updated_entries as Record<string, unknown>[]) || [];
      return {
        kind: "syllabus_audit",
        kpis: [
          { label: "Entries Audited", value: Number(byStatus.get("curriculum_scope_resolved")?.entry_count || updated.length) },
          {
            label: "Needs Update",
            value: updated.filter((row) => String(row?.status || "") === "needs_update").length,
          },
          { label: "Programme Scope", value: String(byStatus.get("curriculum_scope_resolved")?.programme_filter || "all") },
        ],
        table: {
          columns: ["course_code", "course_name", "alignment_score", "status", "gaps"],
          rows: updated,
        },
      } as UIPayload;
    }

    if (activeAction === "NEP Compliance") {
      const assessed = (byStatus.get("nep_compliance_assessed") || {}) as Record<string, unknown>;
      const metrics = (assessed.metrics || {}) as Record<string, unknown>;
      return {
        kind: "nep_compliance",
        kpis: [
          { label: "Overall Score", value: Number(assessed.overall_score || 0) },
          { label: "Status", value: String(assessed.status_label || "unknown") },
          { label: "Metrics", value: 3 },
        ],
        table: {
          columns: ["metric", "score"],
          rows: [
            { metric: "multidisciplinary_readiness", score: metrics.multidisciplinary_readiness },
            { metric: "academic_bank_readiness", score: metrics.academic_bank_readiness },
            { metric: "obe_documentation", score: metrics.obe_documentation },
          ],
        },
      } as UIPayload;
    }

    if (activeAction === "Industry Alignment") {
      const recs = (byStatus.get("industry_alignment_report")?.recommendations as Record<string, unknown>[]) || [];
      return {
        kind: "industry_alignment",
        kpis: [
          { label: "Avg Relevance", value: Number(byStatus.get("industry_benchmark_loaded")?.avg_industry_relevance || 0) },
          { label: "Entries", value: Number(byStatus.get("industry_benchmark_loaded")?.entry_count || 0) },
          { label: "Recommendations", value: recs.length },
        ],
        table: {
          columns: ["course_code", "course_name", "industry_relevance", "recommendation"],
          rows: recs,
        },
      } as UIPayload;
    }

    const summaries = (byStatus.get("programme_rollup_created")?.programme_summaries as Record<string, unknown>[]) || [];
    const gaps = (byStatus.get("annual_audit_report_ready")?.top_gap_courses as Record<string, unknown>[]) || [];
    const rows = [...summaries.map((row) => ({ row_type: "programme", ...row })), ...gaps.map((row) => ({ row_type: "gap_course", ...row }))];
    return {
      kind: "curriculum_audit_report",
      kpis: [
        { label: "Programmes", value: summaries.length },
        { label: "Top Gap Courses", value: gaps.length },
        { label: "Report Rows", value: rows.length },
      ],
      table: {
        columns: ["row_type", "programme", "entry_count", "avg_alignment", "needs_update", "course_code", "course_name", "alignment_score", "gaps"],
        rows,
      },
    } as UIPayload;
  }, [activeAction, response]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Autonomous Runner</div>
          <h3 className="text-xl font-black text-slate-900">Curriculum Auditor Control</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Programme-aware audit, compliance, and industry relevance analysis.</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Programme
          <input value={programme} onChange={(e) => setProgramme(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Semester
          <input value={semester} onChange={(e) => setSemester(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Industry Track
          <input value={track} onChange={(e) => setTrack(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Benchmarks (one per line)
          <textarea value={benchmarksInput} onChange={(e) => setBenchmarksInput(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Industry Roles (one per line)
          <textarea value={industryRolesInput} onChange={(e) => setIndustryRolesInput(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Programmes for Rollup (one per line)
          <textarea value={programmesInput} onChange={(e) => setProgrammesInput(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {ACTIONS.map((action) => {
          const active = runningAction === action.label;
          return (
            <button
              key={action.label}
              onClick={() => runAction(action.label)}
              disabled={!!runningAction}
              className="text-left border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all disabled:opacity-60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-900 leading-tight">{action.label}</span>
                {active ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" /> : <Play className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{action.description}</p>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
        </div>
      ) : null}

      {response ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <div className="text-sm font-black text-slate-900">{response.result?.title || "Curriculum operation completed"}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{response.result?.summary || "Completed successfully."}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.18em] mt-2">
                {new Date(response.timestamp).toLocaleString()} {response.result?.hash ? `• ${response.result.hash}` : ""}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(normalizedOutput?.kpis || []).map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{kpi.label}</div>
                <div className="text-xl font-black text-slate-900 mt-1">{kpi.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {toTitle(normalizedOutput?.kind || "output")}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {(normalizedOutput?.table?.columns || []).map((column) => (
                      <th key={column} className="text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                        {toTitle(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(normalizedOutput?.table?.rows || []).length > 0 ? (
                    (normalizedOutput?.table?.rows || []).map((row, index) => (
                      <tr key={index} className="border-b last:border-b-0 border-slate-100">
                        {(normalizedOutput?.table?.columns || []).map((column) => (
                          <td key={`${index}-${column}`} className="px-4 py-2.5 text-xs text-slate-700 align-top">
                            <span className="block max-w-[330px] truncate" title={formatCell(row?.[column])}>
                              {formatCell(row?.[column])}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-sm text-slate-500" colSpan={(normalizedOutput?.table?.columns || []).length || 1}>
                        No records returned for this action.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
