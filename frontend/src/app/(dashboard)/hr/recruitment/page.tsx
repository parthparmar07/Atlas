"use client";

import { useEffect, useMemo, useState } from "react";

type HiringStatus = "Posted" | "Screening" | "Interviewing" | "Offer" | "Closed";

type RolePipeline = {
  id: string;
  role: string;
  department: string;
  applicants: number;
  shortlisted: number;
  status: HiringStatus;
};

type OpsRecord<T> = { id: string; data: T };

const STATUSES: HiringStatus[] = ["Posted", "Screening", "Interviewing", "Offer", "Closed"];

export default function HrRecruitmentPage() {
  const [roles, setRoles] = useState<RolePipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<RolePipeline, "id">>({
    role: "",
    department: "",
    applicants: 0,
    shortlisted: 0,
    status: "Posted",
  });

  const totalApplicants = useMemo(() => roles.reduce((acc, item) => acc + item.applicants, 0), [roles]);
  const openRoles = useMemo(() => roles.filter((item) => item.status !== "Closed").length, [roles]);

  async function loadRoles() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ops/hr/recruitment/records", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load recruitment pipeline");
      const json = await res.json();
      const records = (json.records ?? []) as OpsRecord<RolePipeline>[];
      setRoles(records.map((r) => r.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (roles.length > 0) return;
    const seed: Omit<RolePipeline, "id">[] = [
      { role: "Assistant Professor (CSE)", department: "CSE", applicants: 86, shortlisted: 12, status: "Interviewing" },
      { role: "Lab Technician", department: "Chemistry", applicants: 34, shortlisted: 5, status: "Screening" },
      { role: "Training & Placement Officer", department: "Placement", applicants: 21, shortlisted: 3, status: "Offer" },
    ];
    await Promise.all(
      seed.map((item) =>
        fetch("/api/ops/hr/recruitment/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...item, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadRoles();
  }

  async function createRole() {
    if (!draft.role || !draft.department || draft.applicants < 0 || draft.shortlisted < 0) return;
    await fetch("/api/ops/hr/recruitment/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft({ role: "", department: "", applicants: 0, shortlisted: 0, status: "Posted" });
    await loadRoles();
  }

  async function updateStatus(item: RolePipeline, status: HiringStatus) {
    await fetch(`/api/ops/hr/recruitment/records/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...item, status } }),
    });
    await loadRoles();
  }

  useEffect(() => {
    void loadRoles();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">Recruitment Pipeline</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Roles</p><p className="text-2xl font-bold text-slate-900">{roles.length}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Applicants</p><p className="text-2xl font-bold text-indigo-700">{totalApplicants}</p></div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100"><p className="text-xs text-slate-500">Open Roles</p><p className="text-2xl font-bold text-emerald-700">{openRoles}</p></div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Hiring Pipeline</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {roles.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.role}</p>
                      <p className="text-xs text-slate-500">{item.department} · applicants {item.applicants} · shortlisted {item.shortlisted}</p>
                    </div>
                    <select value={item.status} onChange={(e) => void updateStatus(item, e.target.value as HiringStatus)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">Add Role</h2>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Role" value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Department" value={draft.department} onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Applicants" value={draft.applicants} onChange={(e) => setDraft((d) => ({ ...d, applicants: Number(e.target.value) || 0 }))} />
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} placeholder="Shortlisted" value={draft.shortlisted} onChange={(e) => setDraft((d) => ({ ...d, shortlisted: Number(e.target.value) || 0 }))} />
              <button onClick={() => void createRole()} className="w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Save Role</button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
