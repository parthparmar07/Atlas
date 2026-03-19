"use client";

import { useEffect, useMemo, useState } from "react";

type ReqStatus = "Raised" | "In Review" | "Approved" | "PO Issued" | "Rejected";

type Requisition = {
  id: string;
  title: string;
  department: string;
  value: number;
  vendor: string;
  status: ReqStatus;
};

type OpsRecord<T> = {
  id: string;
  data: T;
};

const STATUSES: ReqStatus[] = ["Raised", "In Review", "Approved", "PO Issued", "Rejected"];

export default function FinanceProcurementPage() {
  const [items, setItems] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Requisition, "id">>({
    title: "",
    department: "",
    value: 0,
    vendor: "",
    status: "Raised",
  });

  const totalValue = useMemo(() => items.reduce((acc, item) => acc + item.value, 0), [items]);
  const issuedCount = useMemo(() => items.filter((item) => item.status === "PO Issued").length, [items]);
  const rejectedCount = useMemo(() => items.filter((item) => item.status === "Rejected").length, [items]);

  async function loadItems() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/finance/procurement/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load requisitions");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<Requisition>[];
      setItems(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (items.length > 0) return;
    const seed: Omit<Requisition, "id">[] = [
      { title: "50 Lab Monitors", department: "CSE", value: 420000, vendor: "TechCore", status: "PO Issued" },
      { title: "Chemistry Reagents", department: "Chemistry", value: 96000, vendor: "LabLink", status: "In Review" },
      { title: "Workshop Tool Set", department: "Mechanical", value: 185000, vendor: "InduMart", status: "Approved" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/finance/procurement/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadItems();
  }

  async function createItem() {
    if (!draft.title || !draft.department || !draft.vendor || draft.value <= 0) return;
    await fetch("/api/ops/finance/procurement/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ title: "", department: "", value: 0, vendor: "", status: "Raised" });
    await loadItems();
  }

  async function updateStatus(item: Requisition, status: ReqStatus) {
    await fetch(`/api/ops/finance/procurement/records/${item.id}`, {
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
          <h1 className="text-2xl font-bold text-slate-900">Procurement Agent</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Requisition Value</p>
              <p className="text-2xl font-bold text-slate-900">{totalValue.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">PO Issued</p>
              <p className="text-2xl font-bold text-emerald-700">{issuedCount}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="text-2xl font-bold text-rose-700">{rejectedCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Requisitions</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.department} · {item.vendor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.value.toLocaleString()}</span>
                      <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as ReqStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && items.length === 0 ? <p className="text-sm text-slate-500">No requisitions yet. Seed or add one.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Requisition</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Item title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Department" value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Value" value={draft.value} onChange={(e) => setDraft((d) => ({ ...d, value: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Vendor" value={draft.vendor} onChange={(e) => setDraft((d) => ({ ...d, vendor: e.target.value }))} />
              <button onClick={() => void createItem()} className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save Requisition</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
