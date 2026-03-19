"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Plus, RefreshCw, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

type OpsRecord = {
  id: number;
  title: string;
  status: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_OPENINGS = [
  { title: "Microsoft Research Internship", company: "Microsoft", slots: 5, track: "AI", status: "open" },
  { title: "Intel VLSI Internship", company: "Intel", slots: 8, track: "VLSI", status: "matching" },
  { title: "Amazon Applied AI", company: "Amazon", slots: 6, track: "ML", status: "open" },
];

export default function InternshipsPage() {
  const [records, setRecords] = useState<OpsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [track, setTrack] = useState("");
  const [slots, setSlots] = useState("5");

  const loadOpenings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/internships");
      if ((data.records ?? []).length === 0) {
        await Promise.all(
          DEFAULT_OPENINGS.map((o) =>
            api("/api/ops/students/internships", {
              method: "POST",
              body: JSON.stringify({
                title: o.title,
                status: o.status,
                source: "seed",
                metadata: { company: o.company, slots: o.slots, track: o.track },
              }),
            })
          )
        );
        const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/internships");
        setRecords(seeded.records ?? []);
      } else {
        setRecords(data.records ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load internships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOpenings();
  }, []);

  const openings = useMemo(
    () =>
      records.map((r) => ({
        id: r.id,
        title: r.title,
        status: String(r.status ?? "open"),
        company: String(r.metadata?.company ?? "-"),
        slots: Number(r.metadata?.slots ?? 0),
        track: String(r.metadata?.track ?? "General"),
      })),
    [records]
  );

  const addOpening = async () => {
    if (!title.trim() || !company.trim()) return;
    setError("");
    try {
      await api("/api/ops/students/internships", {
        method: "POST",
        body: JSON.stringify({
          title,
          status: "open",
          source: "manual",
          metadata: { company, slots: Number(slots || 0), track: track || "General" },
        }),
      });
      await api("/api/ops/students/internships/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Add Partner", context: `${company}:${title}` }),
      });
      setTitle("");
      setCompany("");
      setTrack("");
      setSlots("5");
      await loadOpenings();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create opening.");
    }
  };

  const updateStatus = async (id: number, status: "open" | "matching" | "closed") => {
    setBusyId(id);
    setError("");
    try {
      await api(`/api/ops/students/internships/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await api("/api/ops/students/internships/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Match Now", context: `opening_id=${id} status=${status}` }),
      });
      await loadOpenings();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update opening status.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Internship Agent</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Persisted partner openings and matching workflow.</p>
        </div>
        <button onClick={() => void loadOpenings()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Opening title" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="Track (AI, VLSI...)" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <input value={slots} onChange={(e) => setSlots(e.target.value)} placeholder="Slots" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <button onClick={() => void addOpening()} className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 inline-flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? <div className="text-sm text-slate-500">Loading internship openings...</div> : null}
        {!loading && openings.length === 0 ? <div className="text-sm text-slate-500">No openings found.</div> : null}

        {openings.map((o) => (
          <div key={o.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg inline-flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" /> {o.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{o.company} • {o.track} • Slots: {o.slots}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${o.status === "open" ? "bg-emerald-50 text-emerald-700" : o.status === "matching" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                {o.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={busyId === o.id} onClick={() => void updateStatus(o.id, "open")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Open</button>
              <button disabled={busyId === o.id} onClick={() => void updateStatus(o.id, "matching")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Matching
              </button>
              <button disabled={busyId === o.id} onClick={() => void updateStatus(o.id, "closed")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Closed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
