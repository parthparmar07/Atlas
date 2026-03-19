"use client";

import { useEffect, useMemo, useState } from "react";

type EventRun = {
  id: string;
  title: string;
  owner: string;
  date: string;
  venue: string;
  status: "Planned" | "Promoting" | "Go-Live" | "Completed";
  attendees: number;
};

type OpsRecord<T> = {
  id: string;
  data: T;
};

const EVENT_STATUSES: EventRun["status"][] = ["Planned", "Promoting", "Go-Live", "Completed"];

export default function StudentEventsPage() {
  const [runs, setRuns] = useState<EventRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<EventRun, "id">>({
    title: "",
    owner: "",
    date: "",
    venue: "",
    status: "Planned",
    attendees: 0,
  });

  const total = runs.length;
  const goLive = useMemo(() => runs.filter((r) => r.status === "Go-Live").length, [runs]);
  const done = useMemo(() => runs.filter((r) => r.status === "Completed").length, [runs]);

  async function loadRuns() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/students/events/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load event workflows");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<EventRun>[];
      setRuns(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (runs.length > 0) return;
    const seed: Omit<EventRun, "id">[] = [
      {
        title: "Annual Innovation Summit",
        owner: "Student Affairs",
        date: "2025-02-12",
        venue: "Main Auditorium",
        status: "Promoting",
        attendees: 420,
      },
      {
        title: "Industry Mock Drive",
        owner: "Placement Cell",
        date: "2025-02-18",
        venue: "Seminar Hall B",
        status: "Go-Live",
        attendees: 180,
      },
      {
        title: "Open Source Sprint",
        owner: "CSE Club",
        date: "2025-02-23",
        venue: "Lab Block 3",
        status: "Planned",
        attendees: 96,
      },
    ];

    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/students/events/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );

    await loadRuns();
  }

  async function createRun() {
    if (!draft.title || !draft.owner || !draft.date || !draft.venue) return;
    const payload: EventRun = { ...draft, id: crypto.randomUUID() };
    await fetch("/api/ops/students/events/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });
    setDraft({
      title: "",
      owner: "",
      date: "",
      venue: "",
      status: "Planned",
      attendees: 0,
    });
    await loadRuns();
  }

  async function updateStatus(run: EventRun, status: EventRun["status"]) {
    await fetch(`/api/ops/students/events/records/${run.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...run, status } }),
    });
    await loadRuns();
  }

  useEffect(() => {
    void loadRuns();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Events Coordinator</h1>
          <p className="mt-1 text-sm text-slate-600">Campus events run with operational rigor, not last-minute chaos.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Active Plans</p>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Go-Live</p>
              <p className="text-2xl font-bold text-amber-700">{goLive}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-700">{done}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Event Workflows</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Seed Sample Data
              </button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {runs.map((run) => (
                <div key={run.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{run.title}</p>
                      <p className="text-xs text-slate-500">{run.owner} · {run.venue} · {run.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{run.attendees} attendees</span>
                      <select
                        value={run.status}
                        onChange={(e) => void updateStatus(run, e.target.value as EventRun["status"])}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        {EVENT_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && runs.length === 0 ? <p className="text-sm text-slate-500">No events yet. Seed sample data or create one.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Create Event Plan</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Event title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Owner team" value={draft.owner} onChange={(e) => setDraft((d) => ({ ...d, owner: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Venue" value={draft.venue} onChange={(e) => setDraft((d) => ({ ...d, venue: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Expected attendees" value={draft.attendees} onChange={(e) => setDraft((d) => ({ ...d, attendees: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createRun()} className="w-full rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                Save Plan
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
