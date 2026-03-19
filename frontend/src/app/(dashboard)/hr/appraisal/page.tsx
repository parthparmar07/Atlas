"use client";

import { useEffect, useMemo, useState } from "react";

type AppraisalStatus = "Draft" | "Reviewed" | "Finalized";

type Appraisal = {
  id: string;
  faculty: string;
  department: string;
  kpiScore: number;
  publications: number;
  status: AppraisalStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: AppraisalStatus[] = ["Draft", "Reviewed", "Finalized"];

export default function HrAppraisalPage() {
  const [items, setItems] = useState<Appraisal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Appraisal, "id">>({
    faculty: "",
    department: "",
    kpiScore: 70,
    publications: 0,
    status: "Draft",
  });

  const averageScore = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((items.reduce((acc, item) => acc + item.kpiScore, 0) / items.length) * 10) / 10;
  }, [items]);
  const finalizedCount = useMemo(() => items.filter((i) => i.status === "Finalized").length, [items]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/hr/appraisal/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load appraisal records");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<Appraisal>[];
      setItems(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (items.length > 0) return;
    const seed: Omit<Appraisal, "id">[] = [
      { faculty: "Dr. Sharma", department: "CSE", kpiScore: 82, publications: 3, status: "Reviewed" },
      { faculty: "Dr. N. Iyer", department: "ECE", kpiScore: 76, publications: 2, status: "Draft" },
      { faculty: "Dr. P. Menon", department: "Mechanical", kpiScore: 88, publications: 4, status: "Finalized" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/hr/appraisal/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadItems();
  }

  async function createItem() {
    if (!draft.faculty || !draft.department || draft.kpiScore < 0 || draft.kpiScore > 100) return;
    await fetch("/api/ops/hr/appraisal/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ faculty: "", department: "", kpiScore: 70, publications: 0, status: "Draft" });
    await loadItems();
  }

  async function updateStatus(item: Appraisal, status: AppraisalStatus) {
    await fetch(`/api/ops/hr/appraisal/records/${item.id}`, {
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
        <section className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Appraisal Agent</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Faculty</p><p className="text-2xl font-bold text-slate-900">{items.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Avg KPI Score</p><p className="text-2xl font-bold text-indigo-700">{averageScore}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Finalized</p><p className="text-2xl font-bold text-emerald-700">{finalizedCount}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Appraisal Records</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.faculty}</p>
                      <p className="text-xs text-slate-500">{item.department} · score {item.kpiScore} · publications {item.publications}</p>
                    </div>
                    <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as AppraisalStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Appraisal</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Faculty" value={draft.faculty} onChange={(e) => setDraft((d) => ({ ...d, faculty: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Department" value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} max={100} placeholder="KPI score" value={draft.kpiScore} onChange={(e) => setDraft((d) => ({ ...d, kpiScore: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Publications" value={draft.publications} onChange={(e) => setDraft((d) => ({ ...d, publications: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createItem()} className="w-full rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700">Save Record</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
