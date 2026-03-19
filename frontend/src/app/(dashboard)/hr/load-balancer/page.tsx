"use client";

import { useEffect, useMemo, useState } from "react";

type LoadStatus = "Balanced" | "Monitor" | "Overloaded";

type FacultyLoad = {
  id: string;
  faculty: string;
  department: string;
  hoursPerWeek: number;
  duties: number;
  status: LoadStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: LoadStatus[] = ["Balanced", "Monitor", "Overloaded"];

export default function HrLoadBalancerPage() {
  const [loads, setLoads] = useState<FacultyLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<FacultyLoad, "id">>({
    faculty: "",
    department: "",
    hoursPerWeek: 0,
    duties: 0,
    status: "Balanced",
  });

  const overloadCount = useMemo(() => loads.filter((item) => item.status === "Overloaded").length, [loads]);
  const avgHours = useMemo(() => {
    if (!loads.length) return 0;
    return Math.round((loads.reduce((acc, item) => acc + item.hoursPerWeek, 0) / loads.length) * 10) / 10;
  }, [loads]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/hr/load-balancer/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load faculty balance data");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<FacultyLoad>[];
      setLoads(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (loads.length > 0) return;
    const seed: Omit<FacultyLoad, "id">[] = [
      { faculty: "Dr. Krishnan", department: "CSE", hoursPerWeek: 23.4, duties: 4, status: "Overloaded" },
      { faculty: "Prof. A. Nair", department: "ECE", hoursPerWeek: 15.2, duties: 2, status: "Balanced" },
      { faculty: "Dr. Meera", department: "Mechanical", hoursPerWeek: 18.1, duties: 3, status: "Monitor" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/hr/load-balancer/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadData();
  }

  async function createLoad() {
    if (!draft.faculty || !draft.department || draft.hoursPerWeek <= 0) return;
    await fetch("/api/ops/hr/load-balancer/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ faculty: "", department: "", hoursPerWeek: 0, duties: 0, status: "Balanced" });
    await loadData();
  }

  async function updateStatus(item: FacultyLoad, status: LoadStatus) {
    await fetch(`/api/ops/hr/load-balancer/records/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...item, status } }),
    });
    await loadData();
  }

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Faculty Load Balancer</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Faculty Tracked</p><p className="text-2xl font-bold text-slate-900">{loads.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Average Hours</p><p className="text-2xl font-bold text-indigo-700">{avgHours}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Overloaded</p><p className="text-2xl font-bold text-rose-700">{overloadCount}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Faculty Load Records</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {loads.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.faculty}</p>
                      <p className="text-xs text-slate-500">{item.department} · {item.hoursPerWeek} hrs/week · duties {item.duties}</p>
                    </div>
                    <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as LoadStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Faculty Load</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Faculty" value={draft.faculty} onChange={(e) => setDraft((d) => ({ ...d, faculty: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Department" value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} step="0.1" placeholder="Hours per week" value={draft.hoursPerWeek} onChange={(e) => setDraft((d) => ({ ...d, hoursPerWeek: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Duties" value={draft.duties} onChange={(e) => setDraft((d) => ({ ...d, duties: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createLoad()} className="w-full rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700">Save Record</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
