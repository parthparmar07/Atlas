"use client";

import { useEffect, useMemo, useState } from "react";

type SessionStatus = "Scheduled" | "Running" | "Completed";

type PrepSession = {
  id: string;
  student: string;
  targetRole: string;
  company: string;
  score: number;
  status: SessionStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: SessionStatus[] = ["Scheduled", "Running", "Completed"];

export default function PlacementInterviewPrepPage() {
  const [sessions, setSessions] = useState<PrepSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<PrepSession, "id">>({
    student: "",
    targetRole: "",
    company: "",
    score: 0,
    status: "Scheduled",
  });

  const completedCount = useMemo(() => sessions.filter((s) => s.status === "Completed").length, [sessions]);
  const averageScore = useMemo(() => {
    const scored = sessions.filter((s) => s.score > 0);
    if (!scored.length) return 0;
    return Math.round((scored.reduce((acc, s) => acc + s.score, 0) / scored.length) * 10) / 10;
  }, [sessions]);

  async function loadSessions() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/placement/interview-prep/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load mock interview sessions");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<PrepSession>[];
      setSessions(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (sessions.length > 0) return;
    const seed: Omit<PrepSession, "id">[] = [
      { student: "Aryan Kumar", targetRole: "SDE", company: "Amazon", score: 74, status: "Completed" },
      { student: "Divya Nair", targetRole: "Digital", company: "TCS", score: 90, status: "Completed" },
      { student: "Pranav S", targetRole: "Data Analyst", company: "Goldman Sachs", score: 0, status: "Scheduled" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/placement/interview-prep/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadSessions();
  }

  async function createSession() {
    if (!draft.student || !draft.targetRole || !draft.company) return;
    await fetch("/api/ops/placement/interview-prep/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ student: "", targetRole: "", company: "", score: 0, status: "Scheduled" });
    await loadSessions();
  }

  async function updateStatus(session: PrepSession, status: SessionStatus) {
    await fetch(`/api/ops/placement/interview-prep/records/${session.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...session, status } }),
    });
    await loadSessions();
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Interview Prep Agent</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Sessions</p><p className="text-2xl font-bold text-slate-900">{sessions.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Completed</p><p className="text-2xl font-bold text-emerald-700">{completedCount}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Avg Score</p><p className="text-2xl font-bold text-indigo-700">{averageScore}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Mock Sessions</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{session.student}</p>
                      <p className="text-xs text-slate-500">{session.targetRole} · {session.company} · score {session.score}</p>
                    </div>
                    <select value={session.status} onChange={(e) => void updateStatus(session, e.target.value as SessionStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Mock Session</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Student" value={draft.student} onChange={(e) => setDraft((d) => ({ ...d, student: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Target role" value={draft.targetRole} onChange={(e) => setDraft((d) => ({ ...d, targetRole: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Company" value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} max={100} placeholder="Score" value={draft.score} onChange={(e) => setDraft((d) => ({ ...d, score: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createSession()} className="w-full rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700">Save Session</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
