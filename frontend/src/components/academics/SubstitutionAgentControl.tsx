"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Play, Sparkles } from "lucide-react";

type SubstitutionAction = "Find Substitute" | "Notify Students" | "Update Timetable";

type RunnerAction = {
  label: SubstitutionAction;
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

interface SubstitutionAgentControlProps {
  schoolId: string;
}

const ACTIONS: RunnerAction[] = [
  {
    label: "Find Substitute",
    description: "Rank best substitutes by availability, fit, and load.",
  },
  {
    label: "Notify Students",
    description: "Generate complete communication drafts for stakeholders.",
  },
  {
    label: "Update Timetable",
    description: "Apply selected substitutions directly into active timetable slots.",
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

export default function SubstitutionAgentControl({ schoolId }: SubstitutionAgentControlProps) {
  const [absentFaculty, setAbsentFaculty] = useState("Dr. Anjali Rao");
  const [reason, setReason] = useState("Sick Leave");
  const [day, setDay] = useState("Thursday");
  const [limit, setLimit] = useState("8");

  const [runningAction, setRunningAction] = useState<SubstitutionAction | null>(null);
  const [activeAction, setActiveAction] = useState<SubstitutionAction | null>(null);
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");

  const backendBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000", []);

  const runAction = async (action: SubstitutionAction) => {
    setRunningAction(action);
    setActiveAction(action);
    setError("");
    setResponse(null);

    try {
      const payloadContext = {
        action,
        school_id: schoolId || "atlas",
        absent_faculty: absentFaculty,
        reason,
        day,
        limit: Number.parseInt(limit, 10) || 8,
      };

      const res = await fetch(`${backendBase}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: "academics-substitution",
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
      setError(e instanceof Error ? e.message : "Failed to execute substitution operation.");
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

    if (activeAction === "Find Substitute") {
      const recs = (byStatus.get("substitute_ranking_completed")?.recommendations as Record<string, unknown>[]) || [];
      const rows = recs.map((item) => {
        const best = item?.recommended_substitute;
        const bestName = typeof best === "object" && best !== null ? String((best as Record<string, unknown>).faculty_name || "No candidate") : "No candidate";
        const bestScore = typeof best === "object" && best !== null ? String((best as Record<string, unknown>).score || "-") : "-";
        return {
          slot_id: item.slot_id,
          course_name: item.course_name,
          section: item.section,
          day: item.day,
          time: item.time,
          recommended_substitute: bestName,
          score: bestScore,
        };
      });
      return {
        kind: "substitute_ranking",
        kpis: [
          { label: "Impacted Classes", value: Number(byStatus.get("absence_impact_mapped")?.impacted_class_count || rows.length) },
          { label: "Recommendations", value: rows.length },
          { label: "Absent Faculty", value: String(byStatus.get("absence_impact_mapped")?.absent_faculty || "auto-selected") },
        ],
        table: {
          columns: ["slot_id", "course_name", "section", "day", "time", "recommended_substitute", "score"],
          rows,
        },
      } as UIPayload;
    }

    if (activeAction === "Notify Students") {
      const notices = (byStatus.get("notification_pack_generated")?.notifications as Record<string, unknown>[]) || [];
      return {
        kind: "communication_drafts",
        kpis: [
          { label: "Records Loaded", value: Number(byStatus.get("substitution_logs_loaded")?.records || 0) },
          { label: "Draft Packs", value: notices.length },
          { label: "Stakeholder Messages", value: notices.length * 3 },
        ],
        table: {
          columns: ["substitution_id", "hod_notice", "faculty_notice", "class_notice"],
          rows: notices,
        },
      } as UIPayload;
    }

    const patches = (byStatus.get("timetable_patch_applied")?.patches as Record<string, unknown>[]) || [];
    return {
      kind: "timetable_patch",
      kpis: [
        { label: "Candidates Loaded", value: Number(byStatus.get("substitution_candidates_loaded")?.records || 0) },
        { label: "Patched Slots", value: patches.length },
        { label: "Confirmed", value: patches.filter((row) => String(row?.status || "") === "confirmed").length },
      ],
      table: {
        columns: ["slot_id", "course_name", "section", "old_faculty", "new_faculty", "status"],
        rows: patches,
      },
    } as UIPayload;
  }, [activeAction, response]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Autonomous Runner</div>
          <h3 className="text-xl font-black text-slate-900">Substitution Agent Control</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Find, communicate, and apply substitutions in one operational flow.</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Absent Faculty
          <input value={absentFaculty} onChange={(e) => setAbsentFaculty(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Reason
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Day
          <select value={day} onChange={(e) => setDay(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
          </select>
        </label>

        <label className="text-xs font-bold text-slate-500">
          Records Limit
          <input value={limit} onChange={(e) => setLimit(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                <span className="text-sm font-black text-slate-900">{action.label}</span>
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
              <div className="text-sm font-black text-slate-900">{response.result?.title || "Substitution operation completed"}</div>
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
                            <span className="block max-w-[320px] truncate" title={formatCell(row?.[column])}>
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
