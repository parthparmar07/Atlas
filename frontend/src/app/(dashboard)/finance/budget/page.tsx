"use client";

import { useEffect, useMemo, useState } from "react";

type BudgetStatus = "On Track" | "Warning" | "Critical";

type BudgetLine = {
  id: string;
  department: string;
  allocated: number;
  spent: number;
  pendingApprovals: number;
  status: BudgetStatus;
};

type OpsRecord<T> = {
  id: string;
  data: T;
};

const STATUSES: BudgetStatus[] = ["On Track", "Warning", "Critical"];

export default function FinanceBudgetPage() {
  const [lines, setLines] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<BudgetLine, "id">>({
    department: "",
    allocated: 0,
    spent: 0,
    pendingApprovals: 0,
    status: "On Track",
  });

  const allocatedTotal = useMemo(() => lines.reduce((acc, item) => acc + item.allocated, 0), [lines]);
  const spentTotal = useMemo(() => lines.reduce((acc, item) => acc + item.spent, 0), [lines]);
  const warningCount = useMemo(() => lines.filter((item) => item.status !== "On Track").length, [lines]);

  async function loadLines() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/finance/budget/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load budget lines");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<BudgetLine>[];
      setLines(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (lines.length > 0) return;
    const seed: Omit<BudgetLine, "id">[] = [
      { department: "CSE", allocated: 12000000, spent: 8900000, pendingApprovals: 2, status: "On Track" },
      { department: "ECE", allocated: 8600000, spent: 7800000, pendingApprovals: 1, status: "Warning" },
      { department: "Central Facilities", allocated: 6400000, spent: 6400000, pendingApprovals: 3, status: "Critical" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/finance/budget/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadLines();
  }

  async function createLine() {
    if (!draft.department || draft.allocated <= 0 || draft.spent < 0) return;
    await fetch("/api/ops/finance/budget/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ department: "", allocated: 0, spent: 0, pendingApprovals: 0, status: "On Track" });
    await loadLines();
  }

  async function updateStatus(line: BudgetLine, status: BudgetStatus) {
    await fetch(`/api/ops/finance/budget/records/${line.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...line, status } }),
    });
    await loadLines();
  }

  useEffect(() => {
    void loadLines();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Budget Monitor</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Allocated</p>
              <p className="text-2xl font-bold text-slate-900">{allocatedTotal.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Spent</p>
              <p className="text-2xl font-bold text-indigo-700">{spentTotal.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Warning/Critical</p>
              <p className="text-2xl font-bold text-rose-700">{warningCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Department Budget Lines</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{line.department}</p>
                      <p className="text-xs text-slate-500">Allocated {line.allocated.toLocaleString()} · Spent {line.spent.toLocaleString()} · Pending approvals {line.pendingApprovals}</p>
                    </div>
                    <select value={line.status} onChange={(e) => void updateStatus(line, e.target.value as BudgetStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {!loading && lines.length === 0 ? <p className="text-sm text-slate-500">No budget lines yet. Seed or add one.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Budget Line</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Department" value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Allocated" value={draft.allocated} onChange={(e) => setDraft((d) => ({ ...d, allocated: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Spent" value={draft.spent} onChange={(e) => setDraft((d) => ({ ...d, spent: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Pending approvals" value={draft.pendingApprovals} onChange={(e) => setDraft((d) => ({ ...d, pendingApprovals: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createLine()} className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Line</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
