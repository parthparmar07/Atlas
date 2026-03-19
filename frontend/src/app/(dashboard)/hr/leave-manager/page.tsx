"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, Clock, FileCheck, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

type OpsRecord = {
  id: number;
  title: string;
  status: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_REQUESTS = [
  { user: "Dr. Alan Turing", type: "Conference", days: 3, status: "PENDING" },
  { user: "Prof. Marie Curie", type: "Sick Leave", days: 1, status: "APPROVED" },
];

export default function LeaveManagerPage() {
  const [records, setRecords] = useState<OpsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/hr/leave-manager");
      if ((data.records ?? []).length === 0) {
        await Promise.all(
          DEFAULT_REQUESTS.map((req) =>
            api("/api/ops/hr/leave-manager", {
              method: "POST",
              body: JSON.stringify({
                title: req.user,
                status: req.status,
                source: "seed",
                metadata: { type: req.type, days: req.days },
              }),
            })
          )
        );
        const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/hr/leave-manager");
        setRecords(seeded.records ?? []);
      } else {
        setRecords(data.records ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const requests = useMemo(
    () =>
      records.map((r) => ({
        id: r.id,
        user: r.title,
        type: String(r.metadata?.type ?? "Leave"),
        days: Number(r.metadata?.days ?? 1),
        status: String(r.status).toUpperCase(),
      })),
    [records]
  );

  const handleAction = async (id: number, action: "APPROVED" | "REJECTED") => {
    setBusyId(id);
    setError("");
    try {
      await api(`/api/ops/hr/leave-manager/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: action }),
      });
      await loadRequests();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update request.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
      <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-emerald-600" />
            AI Leave & Faculty Scheduler
          </h1>
          <p className="text-slate-500 mt-2">Approve absences and auto-assign substitute teachers</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => void loadRequests()} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4"><Clock className="w-5 h-5"/> Pending Approvals</h3>
        <div className="space-y-4">
            {loading ? <div className="text-sm text-slate-500">Loading leave requests...</div> : null}
            {requests.map(req => (
                <div key={req.id} className="p-4 border rounded-2xl flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{req.user}</div>
                        <div className="text-sm font-medium text-slate-500">{req.type} &bull; {req.days} Day(s)</div>
                        <div className="text-xs font-black uppercase text-slate-400 mt-2">Status: {req.status}</div>
                    </div>
                    {req.status === "PENDING" && (
                        <div className="flex gap-2">
                             <button disabled={busyId === req.id} onClick={() => void handleAction(req.id, "APPROVED")} className="p-3 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-xl transition disabled:opacity-60">
                                 <Check className="w-5 h-5" />
                             </button>
                             <button disabled={busyId === req.id} onClick={() => void handleAction(req.id, "REJECTED")} className="p-3 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-xl transition disabled:opacity-60">
                                 <X className="w-5 h-5" />
                             </button>
                        </div>
                    )}
                </div>
            ))}
            {!loading && requests.length === 0 ? <div className="text-sm text-slate-500">No leave requests yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
