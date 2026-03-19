"use client";

import { useEffect, useMemo, useState } from "react";

type RiskLevel = "Low" | "Medium" | "High";
type CaseStatus = "New" | "Counsellor Assigned" | "Intervention Running" | "Stabilized";

type DropoutCase = {
  id: string;
  student: string;
  program: string;
  risk: RiskLevel;
  score: number;
  trigger: string;
  status: CaseStatus;
};

type OpsRecord<T> = {
  id: string;
  data: T;
};

const RISKS: RiskLevel[] = ["Low", "Medium", "High"];
const STATUSES: CaseStatus[] = ["New", "Counsellor Assigned", "Intervention Running", "Stabilized"];

export default function DropoutPredictorPage() {
  const [cases, setCases] = useState<DropoutCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<DropoutCase, "id">>({
    student: "",
    program: "",
    risk: "Medium",
    score: 65,
    trigger: "",
    status: "New",
  });

  const highRiskCount = useMemo(() => cases.filter((c) => c.risk === "High").length, [cases]);
  const stabilizedCount = useMemo(() => cases.filter((c) => c.status === "Stabilized").length, [cases]);

  async function loadCases() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/students/dropout/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load risk cases");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<DropoutCase>[];
      setCases(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (cases.length > 0) return;
    const seed: Omit<DropoutCase, "id">[] = [
      {
        student: "Aman Bansal",
        program: "S4 Mechanical",
        risk: "High",
        score: 88,
        trigger: "Attendance down 40% in 3 weeks",
        status: "Counsellor Assigned",
      },
      {
        student: "Sameer Sheikh",
        program: "S2 Civil",
        risk: "High",
        score: 82,
        trigger: "Fee delay + poor internals",
        status: "Intervention Running",
      },
      {
        student: "Sneha Rao",
        program: "S2 IT",
        risk: "Medium",
        score: 58,
        trigger: "Low LMS activity trend",
        status: "Stabilized",
      },
    ];

    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/students/dropout/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );

    await loadCases();
  }

  async function createCase() {
    if (!draft.student || !draft.program || !draft.trigger) return;
    const payload: DropoutCase = { ...draft, id: crypto.randomUUID() };
    await fetch("/api/ops/students/dropout/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });
    setDraft({ student: "", program: "", risk: "Medium", score: 65, trigger: "", status: "New" });
    await loadCases();
  }

  async function updateCase(riskCase: DropoutCase, status: CaseStatus) {
    await fetch(`/api/ops/students/dropout/records/${riskCase.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...riskCase, status } }),
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
          <h1 className="text-2xl font-bold text-slate-900">Dropout Predictor</h1>
          <p className="mt-1 text-sm text-slate-600">Predict risk 6 weeks early and trigger intervention while it still matters.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Tracked Cases</p>
              <p className="text-2xl font-bold text-slate-900">{cases.length}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">High Risk</p>
              <p className="text-2xl font-bold text-rose-700">{highRiskCount}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500">Stabilized</p>
              <p className="text-2xl font-bold text-emerald-700">{stabilizedCount}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Risk Cases</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Seed Sample Data
              </button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="space-y-3">
              {cases.map((riskCase) => (
                <div key={riskCase.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{riskCase.student}</p>
                      <p className="text-xs text-slate-500">{riskCase.program} · {riskCase.trigger}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{riskCase.risk} · {riskCase.score}</span>
                      <select
                        value={riskCase.status}
                        onChange={(e) => void updateCase(riskCase, e.target.value as CaseStatus)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && cases.length === 0 ? <p className="text-sm text-slate-500">No risk cases yet. Seed data or add one manually.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Risk Case</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Student name" value={draft.student} onChange={(e) => setDraft((d) => ({ ...d, student: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Program/Semester" value={draft.program} onChange={(e) => setDraft((d) => ({ ...d, program: e.target.value }))} />
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={draft.risk} onChange={(e) => setDraft((d) => ({ ...d, risk: e.target.value as RiskLevel }))}>
                {RISKS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} max={100} placeholder="Risk score" value={draft.score} onChange={(e) => setDraft((d) => ({ ...d, score: Number(e.target.value) || 0 }))} />
              <textarea className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} placeholder="Primary trigger" value={draft.trigger} onChange={(e) => setDraft((d) => ({ ...d, trigger: e.target.value }))} />
              <button onClick={() => void createCase()} className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                Save Case
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
