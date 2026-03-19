"use client";

import { useEffect, useMemo, useState } from "react";

type FeeStatus = "Upcoming" | "Reminder Sent" | "Partial" | "Paid" | "Escalated";

type FeeCase = {
  id: string;
  student: string;
  program: string;
  amountDue: number;
  dueDate: string;
  status: FeeStatus;
  channel: "Email" | "SMS" | "WhatsApp";
};

type OpsRecord<T> = {
  id: string;
  data: T;
};

const STATUSES: FeeStatus[] = ["Upcoming", "Reminder Sent", "Partial", "Paid", "Escalated"];

export default function FinanceFeesPage() {
  const [cases, setCases] = useState<FeeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<FeeCase, "id">>({
    student: "",
    program: "",
    amountDue: 0,
    dueDate: "",
    status: "Upcoming",
    channel: "WhatsApp",
  });

  const totalDue = useMemo(() => cases.reduce((acc, item) => acc + item.amountDue, 0), [cases]);
  const paidCount = useMemo(() => cases.filter((item) => item.status === "Paid").length, [cases]);
  const escalatedCount = useMemo(() => cases.filter((item) => item.status === "Escalated").length, [cases]);

  async function loadCases() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/finance/fees/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load fee cases");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<FeeCase>[];
      setCases(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (cases.length > 0) return;
    const seed: Omit<FeeCase, "id">[] = [
      { student: "Arjun Rao", program: "CSE S6", amountDue: 42500, dueDate: "2026-03-25", status: "Paid", channel: "WhatsApp" },
      { student: "Ritika Das", program: "ECE S4", amountDue: 38000, dueDate: "2026-03-22", status: "Reminder Sent", channel: "Email" },
      { student: "Sanjay Kumar", program: "ME S2", amountDue: 46500, dueDate: "2026-03-18", status: "Escalated", channel: "SMS" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/finance/fees/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadCases();
  }

  async function createCase() {
    if (!draft.student || !draft.program || !draft.dueDate || draft.amountDue <= 0) return;
    await fetch("/api/ops/finance/fees/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ student: "", program: "", amountDue: 0, dueDate: "", status: "Upcoming", channel: "WhatsApp" });
    await loadCases();
  }

  async function updateStatus(item: FeeCase, status: FeeStatus) {
    await fetch(`/api/ops/finance/fees/records/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...item, status } }),
    });
    await loadCases();
  }

  useEffect(() => {
    void loadCases();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Fee Collection Agent</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Total Due</p>
              <p className="text-2xl font-bold text-slate-900">{totalDue.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Paid Cases</p>
              <p className="text-2xl font-bold text-emerald-700">{paidCount}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Escalated</p>
              <p className="text-2xl font-bold text-rose-700">{escalatedCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Fee Cases</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {cases.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.student}</p>
                      <p className="text-xs text-slate-500">{item.program} · Due {item.dueDate} · {item.channel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.amountDue.toLocaleString()}</span>
                      <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as FeeStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && cases.length === 0 ? <p className="text-sm text-slate-500">No fee cases yet. Seed or add one.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Fee Case</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Student name" value={draft.student} onChange={(e) => setDraft((d) => ({ ...d, student: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Program" value={draft.program} onChange={(e) => setDraft((d) => ({ ...d, program: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Amount due" value={draft.amountDue} onChange={(e) => setDraft((d) => ({ ...d, amountDue: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="date" value={draft.dueDate} onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))} />
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={draft.channel} onChange={(e) => setDraft((d) => ({ ...d, channel: e.target.value as FeeCase["channel"] }))}>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>
              <button onClick={() => void createCase()} className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700">Save Case</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
