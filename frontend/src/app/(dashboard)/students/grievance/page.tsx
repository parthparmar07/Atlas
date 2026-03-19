"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Plus, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

type OpsRecord = {
  id: number;
  title: string;
  status: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_CASES = [
  { title: "AC not working in hostel B", category: "Infrastructure", anonymous: true, status: "open" },
  { title: "Library fine dispute", category: "Finance", anonymous: false, status: "resolved" },
  { title: "Warden response delay", category: "Hostel", anonymous: false, status: "escalated" },
];

export default function GrievancePage() {
  const [records, setRecords] = useState<OpsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [anonymous, setAnonymous] = useState(true);

  const loadCases = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/grievance");
      if ((data.records ?? []).length === 0) {
        await Promise.all(
          DEFAULT_CASES.map((c) =>
            api("/api/ops/students/grievance", {
              method: "POST",
              body: JSON.stringify({
                title: c.title,
                status: c.status,
                source: "seed",
                metadata: { category: c.category, anonymous: c.anonymous },
              }),
            })
          )
        );
        const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/grievance");
        setRecords(seeded.records ?? []);
      } else {
        setRecords(data.records ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load grievances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCases();
  }, []);

  const cases = useMemo(
    () =>
      records.map((r) => ({
        id: r.id,
        title: r.title,
        status: String(r.status ?? "open"),
        category: String(r.metadata?.category ?? "General"),
        anonymous: Boolean(r.metadata?.anonymous),
      })),
    [records]
  );

  const createCase = async () => {
    if (!title.trim()) return;
    setError("");
    try {
      await api("/api/ops/students/grievance", {
        method: "POST",
        body: JSON.stringify({
          title,
          status: "open",
          source: "manual",
          metadata: { category, anonymous },
        }),
      });
      await api("/api/ops/students/grievance/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Grievance Logged", context: `${category}:${title}` }),
      });
      setTitle("");
      setCategory("Academic");
      setAnonymous(true);
      await loadCases();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to log grievance.");
    }
  };

  const updateStatus = async (id: number, status: "open" | "in-progress" | "resolved" | "escalated") => {
    setBusyId(id);
    setError("");
    try {
      await api(`/api/ops/students/grievance/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await api("/api/ops/students/grievance/actions", {
        method: "POST",
        body: JSON.stringify({ action: "SLA Monitoring", context: `case_id=${id} status=${status}` }),
      });
      await loadCases();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update grievance status.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Grievance Agent</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Anonymous-friendly complaint intake with SLA and escalation status.</p>
        </div>
        <button onClick={() => void loadCases()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Describe grievance" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 md:col-span-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
          <option>Academic</option>
          <option>Infrastructure</option>
          <option>Hostel</option>
          <option>Finance</option>
          <option>Harassment</option>
        </select>
        <label className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium inline-flex items-center gap-2">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Anonymous
        </label>
        <button onClick={() => void createCase()} className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 inline-flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Log
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? <div className="text-sm text-slate-500">Loading grievances...</div> : null}
        {!loading && cases.length === 0 ? <div className="text-sm text-slate-500">No grievances found.</div> : null}

        {cases.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{c.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.category} • {c.anonymous ? "Anonymous" : "Named"}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${c.status === "resolved" ? "bg-emerald-50 text-emerald-700" : c.status === "escalated" ? "bg-rose-50 text-rose-700" : c.status === "in-progress" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"}`}>
                {c.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={busyId === c.id} onClick={() => void updateStatus(c.id, "open")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Open</button>
              <button disabled={busyId === c.id} onClick={() => void updateStatus(c.id, "in-progress")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5" /> In Progress
              </button>
              <button disabled={busyId === c.id} onClick={() => void updateStatus(c.id, "resolved")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
              </button>
              <button disabled={busyId === c.id} onClick={() => void updateStatus(c.id, "escalated")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Escalate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
