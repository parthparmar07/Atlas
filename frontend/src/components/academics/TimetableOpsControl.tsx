"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Play, Sparkles } from "lucide-react";

type TimetableAction =
  | "Parse Timetable Constraints"
  | "Detect Conflicts"
  | "Manage Substitutions"
  | "Generate Academic Calendar"
  | "Schedule Examinations";

type RunnerAction = {
  label: TimetableAction;
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

interface TimetableOpsControlProps {
  schoolId: string;
  defaultProgramme?: string;
}

const ACTIONS: RunnerAction[] = [
  {
    label: "Parse Timetable Constraints",
    description: "Convert operating constraints into structured scheduling rules.",
  },
  {
    label: "Detect Conflicts",
    description: "Run a complete clash and overload scan across published slots.",
  },
  {
    label: "Manage Substitutions",
    description: "Prepare substitute recommendations for absence disruptions.",
  },
  {
    label: "Generate Academic Calendar",
    description: "Build a synchronized semester calendar with holiday overlays.",
  },
  {
    label: "Schedule Examinations",
    description: "Generate a capacity-safe exam schedule proposal.",
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

export default function TimetableOpsControl({ schoolId, defaultProgramme = "B.Tech AI/ML" }: TimetableOpsControlProps) {
  const [programme, setProgramme] = useState(defaultProgramme);
  const [semester, setSemester] = useState("Fall 2026");
  const [examCycle, setExamCycle] = useState("End Semester");

  const [constraintsInput, setConstraintsInput] = useState(
    "No faculty double-booking allowed\nLabs only in certified lab rooms\nAvoid 4+ consecutive periods"
  );
  const [absentFaculty, setAbsentFaculty] = useState("Dr. Rao");
  const [absenceReason, setAbsenceReason] = useState("Medical leave");
  const [day, setDay] = useState("Thursday");

  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-11-30");
  const [holidayInput, setHolidayInput] = useState("Independence Day|2026-08-15\nGandhi Jayanti|2026-10-02");

  const [hallInput, setHallInput] = useState("Hall A|120\nHall B|90\nLab 1|60");

  const [runningAction, setRunningAction] = useState<TimetableAction | null>(null);
  const [activeAction, setActiveAction] = useState<TimetableAction | null>(null);
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [error, setError] = useState("");

  const backendBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000", []);

  const parseConstraints = () => {
    return constraintsInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const parseHolidays = () => {
    return holidayInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, date] = line.split("|").map((v) => v.trim());
        return {
          name: name || "Holiday",
          date: date || startDate,
        };
      });
  };

  const parseHalls = () => {
    return hallInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, capacityRaw] = line.split("|").map((v) => v.trim());
        const parsedCapacity = Number.parseInt(capacityRaw || "60", 10);
        return {
          name: name || "Hall",
          capacity: Number.isNaN(parsedCapacity) ? 60 : parsedCapacity,
        };
      });
  };

  const runAction = async (action: TimetableAction) => {
    setRunningAction(action);
    setActiveAction(action);
    setError("");
    setResponse(null);

    try {
      const constraints = parseConstraints();
      const payloadContext = {
        action,
        school_id: schoolId || "atlas",
        programme,
        semester,
        constraints,
        constraint_text: constraints.join("; "),
        absent_faculty: absentFaculty,
        reason: absenceReason,
        day,
        start_date: startDate,
        end_date: endDate,
        holidays: parseHolidays(),
        exam_cycle: examCycle,
        halls: parseHalls(),
      };

      const res = await fetch(`${backendBase}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: "academics-timetable",
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
      setError(e instanceof Error ? e.message : "Failed to execute timetable operation.");
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

    if (activeAction === "Parse Timetable Constraints") {
      const hard = (byStatus.get("constraints_structured")?.hard_constraints as Record<string, unknown>[]) || [];
      const soft = (byStatus.get("constraints_structured")?.soft_constraints as Record<string, unknown>[]) || [];
      const rows = [...hard.map((r) => ({ type: "hard", ...r })), ...soft.map((r) => ({ type: "soft", ...r }))];
      return {
        kind: "constraint_rules",
        kpis: [
          { label: "Hard Rules", value: hard.length },
          { label: "Soft Rules", value: soft.length },
          { label: "Total Rules", value: rows.length },
        ],
        table: {
          columns: ["type", "constraint", "weight"],
          rows,
        },
      } as UIPayload;
    }

    if (activeAction === "Detect Conflicts") {
      const hard = (byStatus.get("conflict_report_generated")?.hard_conflicts as Record<string, unknown>[]) || [];
      const soft = (byStatus.get("conflict_report_generated")?.soft_conflicts as Record<string, unknown>[]) || [];
      const rows = [...hard.map((r) => ({ bucket: "hard", ...r })), ...soft.map((r) => ({ bucket: "soft", ...r }))];
      return {
        kind: "conflict_scan",
        kpis: [
          {
            label: "Hard Conflicts",
            value: Number(byStatus.get("conflict_report_generated")?.hard_conflict_count || hard.length),
          },
          {
            label: "Soft Risks",
            value: Number(byStatus.get("conflict_report_generated")?.soft_conflict_count || soft.length),
          },
          { label: "Total", value: rows.length },
        ],
        table: {
          columns: ["bucket", "conflict_type", "severity", "day", "entity", "suggested_resolution"],
          rows,
        },
      } as UIPayload;
    }

    if (activeAction === "Manage Substitutions") {
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
        kind: "substitution_plan",
        kpis: [
          {
            label: "Impacted Classes",
            value: Number(byStatus.get("absence_impact_mapped")?.impacted_class_count || rows.length),
          },
          { label: "Recommendations", value: rows.length },
          {
            label: "Absent Faculty",
            value: String(byStatus.get("absence_impact_mapped")?.absent_faculty || "auto-selected"),
          },
        ],
        table: {
          columns: ["slot_id", "course_name", "section", "day", "time", "recommended_substitute", "score"],
          rows,
        },
      } as UIPayload;
    }

    if (activeAction === "Generate Academic Calendar") {
      const sample = (byStatus.get("calendar_generated")?.sample_events as Record<string, unknown>[]) || [];
      return {
        kind: "academic_calendar",
        kpis: [
          { label: "Teaching Days", value: Number(byStatus.get("calendar_generated")?.teaching_days || 0) },
          { label: "Preview Events", value: sample.length },
          { label: "Start", value: String(byStatus.get("calendar_inputs_resolved")?.start_date || "N/A") },
        ],
        table: {
          columns: ["date", "title", "event_type"],
          rows: sample,
        },
      } as UIPayload;
    }

    const generated = (byStatus.get("exam_schedule_generated")?.created_schedules as Record<string, unknown>[]) || [];
    return {
      kind: "exam_schedule",
      kpis: [
        { label: "Scheduled Exams", value: generated.length },
        { label: "Capacity Risks", value: generated.filter((row) => !Boolean(row?.capacity_ok)).length },
        { label: "Cycle", value: String(byStatus.get("exam_inputs_resolved")?.cycle || "N/A") },
      ],
      table: {
        columns: ["exam_name", "date", "time", "hall", "capacity_ok"],
        rows: generated,
      },
    } as UIPayload;
  }, [activeAction, response]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Autonomous Runner</div>
          <h3 className="text-xl font-black text-slate-900">Timetable AI Control</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Structured operations for timetable, calendar, substitutions, and exam proposals.</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Programme
          <input
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Semester
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Exam Cycle
          <select
            value={examCycle}
            onChange={(e) => setExamCycle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <option>End Semester</option>
            <option>Mid Semester</option>
            <option>Improvement / Backlog</option>
          </select>
        </label>
      </div>

      <label className="text-xs font-bold text-slate-500 block">
        Constraints (one per line)
        <textarea
          value={constraintsInput}
          onChange={(e) => setConstraintsInput(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Absent Faculty
          <input
            value={absentFaculty}
            onChange={(e) => setAbsentFaculty(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Absence Reason
          <input
            value={absenceReason}
            onChange={(e) => setAbsenceReason(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Day
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Calendar Window Start
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Calendar Window End
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-xs font-bold text-slate-500">
          Holidays (Name|Date per line)
          <textarea
            value={holidayInput}
            onChange={(e) => setHolidayInput(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
          />
        </label>

        <label className="text-xs font-bold text-slate-500">
          Halls (Hall|Capacity per line)
          <textarea
            value={hallInput}
            onChange={(e) => setHallInput(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
              <div className="text-sm font-black text-slate-900">{response.result?.title || "Timetable operation completed"}</div>
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
              <table className="w-full min-w-[860px]">
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
                            <span className="block max-w-[300px] truncate" title={formatCell(row?.[column])}>
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
