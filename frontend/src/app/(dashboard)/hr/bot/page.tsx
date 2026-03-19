"use client";

import { useEffect, useMemo, useState } from "react";

type TicketStatus = "Open" | "In Review" | "Resolved" | "Escalated";
type TicketType = "Leave" | "Policy" | "Payroll" | "Onboarding";

type HrTicket = {
  id: string;
  employee: string;
  type: TicketType;
  subject: string;
  assignee: string;
  status: TicketStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: TicketStatus[] = ["Open", "In Review", "Resolved", "Escalated"];

export default function HrBotPage() {
  const [tickets, setTickets] = useState<HrTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<HrTicket, "id">>({
    employee: "",
    type: "Leave",
    subject: "",
    assignee: "HR Desk",
    status: "Open",
  });

  const resolved = useMemo(() => tickets.filter((t) => t.status === "Resolved").length, [tickets]);
  const escalated = useMemo(() => tickets.filter((t) => t.status === "Escalated").length, [tickets]);

  async function loadTickets() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/hr/bot/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load HR tickets");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<HrTicket>[];
      setTickets(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (tickets.length > 0) return;
    const seed: Omit<HrTicket, "id">[] = [
      { employee: "Prof. Sharma", type: "Leave", subject: "EL request for March 25", assignee: "Dr. Mehta", status: "In Review" },
      { employee: "R. Patel", type: "Payroll", subject: "Payslip correction for Feb arrears", assignee: "HR Desk", status: "Open" },
      { employee: "Kavya Nair", type: "Policy", subject: "Maternity leave policy clarification", assignee: "HR Desk", status: "Resolved" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/hr/bot/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadTickets();
  }

  async function createTicket() {
    if (!draft.employee || !draft.subject || !draft.assignee) return;
    await fetch("/api/ops/hr/bot/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ employee: "", type: "Leave", subject: "", assignee: "HR Desk", status: "Open" });
    await loadTickets();
  }

  async function updateStatus(ticket: HrTicket, status: TicketStatus) {
    await fetch(`/api/ops/hr/bot/records/${ticket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...ticket, status } }),
    });
    await loadTickets();
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">HR Operations Bot</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Total Tickets</p><p className="text-2xl font-bold text-slate-900">{tickets.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Resolved</p><p className="text-2xl font-bold text-emerald-700">{resolved}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Escalated</p><p className="text-2xl font-bold text-rose-700">{escalated}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">HR Tickets</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{ticket.employee}</p>
                      <p className="text-xs text-slate-500">{ticket.type} · {ticket.subject} · {ticket.assignee}</p>
                    </div>
                    <select value={ticket.status} onChange={(e) => void updateStatus(ticket, e.target.value as TicketStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Create Ticket</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Employee" value={draft.employee} onChange={(e) => setDraft((d) => ({ ...d, employee: e.target.value }))} />
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as TicketType }))}>
                <option value="Leave">Leave</option><option value="Policy">Policy</option><option value="Payroll">Payroll</option><option value="Onboarding">Onboarding</option>
              </select>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Subject" value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Assignee" value={draft.assignee} onChange={(e) => setDraft((d) => ({ ...d, assignee: e.target.value }))} />
              <button onClick={() => void createTicket()} className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700">Save Ticket</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
