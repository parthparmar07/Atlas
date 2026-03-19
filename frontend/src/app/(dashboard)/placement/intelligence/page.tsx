"use client";

import { useEffect, useMemo, useState } from "react";

type PipelineStatus = "Ingested" | "Analyzed" | "Matched" | "Drive Planned";

type PlacementPipeline = {
  id: string;
  company: string;
  role: string;
  openings: number;
  averageMatch: number;
  status: PipelineStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: PipelineStatus[] = ["Ingested", "Analyzed", "Matched", "Drive Planned"];

export default function PlacementIntelligencePage() {
  const [items, setItems] = useState<PlacementPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<PlacementPipeline, "id">>({
    company: "",
    role: "",
    openings: 1,
    averageMatch: 70,
    status: "Ingested",
  });

  const totalOpenings = useMemo(() => items.reduce((acc, item) => acc + item.openings, 0), [items]);
  const avgMatch = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((items.reduce((acc, item) => acc + item.averageMatch, 0) / items.length) * 10) / 10;
  }, [items]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/placement/intelligence/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load placement pipeline");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<PlacementPipeline>[];
      setItems(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (items.length > 0) return;
    const seed: Omit<PlacementPipeline, "id">[] = [
      { company: "Infosys", role: "System Engineer", openings: 35, averageMatch: 82, status: "Matched" },
      { company: "Wipro", role: "Project Engineer", openings: 28, averageMatch: 77, status: "Drive Planned" },
      { company: "TCS", role: "Digital Profile", openings: 42, averageMatch: 71, status: "Analyzed" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/placement/intelligence/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadItems();
  }

  async function createItem() {
    if (!draft.company || !draft.role || draft.openings <= 0) return;
    await fetch("/api/ops/placement/intelligence/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ company: "", role: "", openings: 1, averageMatch: 70, status: "Ingested" });
    await loadItems();
  }

  async function updateStatus(item: PlacementPipeline, status: PipelineStatus) {
    await fetch(`/api/ops/placement/intelligence/records/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...item, status } }),
    });
    await loadItems();
  }

  useEffect(() => {
    void loadItems();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Placement Intelligence</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Companies</p><p className="text-2xl font-bold text-slate-900">{items.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Openings</p><p className="text-2xl font-bold text-emerald-700">{totalOpenings}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Avg Match</p><p className="text-2xl font-bold text-indigo-700">{avgMatch}%</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Company Pipeline</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.company} · {item.role}</p>
                      <p className="text-xs text-slate-500">openings {item.openings} · avg match {item.averageMatch}%</p>
                    </div>
                    <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as PipelineStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Company Pipeline</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Company" value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Role" value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={1} placeholder="Openings" value={draft.openings} onChange={(e) => setDraft((d) => ({ ...d, openings: Number(e.target.value) || 1 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} max={100} placeholder="Average match" value={draft.averageMatch} onChange={(e) => setDraft((d) => ({ ...d, averageMatch: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createItem()} className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save Pipeline</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
