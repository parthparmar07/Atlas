"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, RefreshCw, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

type OpsRecord = {
  id: number;
  title: string;
  status: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_PROJECTS = [
  { title: "Blockchain for Credentialing", team: "Team 42", guide: "Dr. Gupta", progress: 65, status: "active" },
  { title: "Campus EV Routing", team: "Team 11", guide: "Prof. Rao", progress: 90, status: "review" },
  { title: "Smart Library Bot", team: "Team 07", guide: "Dr. Shreya", progress: 40, status: "risk" },
];

export default function ProjectsPage() {
  const [records, setRecords] = useState<OpsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [guide, setGuide] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/projects");
      if ((data.records ?? []).length === 0) {
        await Promise.all(
          DEFAULT_PROJECTS.map((p) =>
            api("/api/ops/students/projects", {
              method: "POST",
              body: JSON.stringify({
                title: p.title,
                status: p.status,
                source: "seed",
                metadata: { team: p.team, guide: p.guide, progress: p.progress },
              }),
            })
          )
        );
        const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/projects");
        setRecords(seeded.records ?? []);
      } else {
        setRecords(data.records ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const projects = useMemo(
    () =>
      records.map((r) => ({
        id: r.id,
        title: r.title,
        team: String(r.metadata?.team ?? "-"),
        guide: String(r.metadata?.guide ?? "-"),
        progress: Number(r.metadata?.progress ?? 0),
        status: String(r.status ?? "active"),
      })),
    [records]
  );

  const addProject = async () => {
    if (!title.trim() || !team.trim() || !guide.trim()) return;
    setError("");
    try {
      await api("/api/ops/students/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          status: "active",
          source: "manual",
          metadata: { team, guide, progress: 0 },
        }),
      });
      await api("/api/ops/students/projects/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Project Registration", context: title }),
      });
      setTitle("");
      setTeam("");
      setGuide("");
      await loadProjects();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add project.");
    }
  };

  const updateStatus = async (id: number, status: "active" | "review" | "risk" | "completed") => {
    setBusyId(id);
    setError("");
    try {
      await api(`/api/ops/students/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await api("/api/ops/students/projects/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Milestone Tracking", context: `project_id=${id} status=${status}` }),
      });
      await loadProjects();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update project status.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Persisted milestone tracking for student project lifecycle.</p>
        </div>
        <button onClick={() => void loadProjects()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Team (e.g. Team 21)" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <input value={guide} onChange={(e) => setGuide(e.target.value)} placeholder="Guide name" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" />
        <button onClick={() => void addProject()} className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 inline-flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Register
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? <div className="text-sm text-slate-500">Loading projects...</div> : null}
        {!loading && projects.length === 0 ? <div className="text-sm text-slate-500">No projects tracked yet.</div> : null}

        {projects.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.team} • Guide: {p.guide}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${p.status === "risk" ? "bg-rose-50 text-rose-700" : p.status === "completed" ? "bg-emerald-50 text-emerald-700" : p.status === "review" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"}`}>
                  {p.status}
                </span>
                {p.status === "risk" ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex-1">
                <div className="h-full bg-indigo-500" style={{ width: `${Math.max(0, Math.min(100, p.progress))}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-600">{p.progress}%</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={busyId === p.id} onClick={() => void updateStatus(p.id, "active")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Active</button>
              <button disabled={busyId === p.id} onClick={() => void updateStatus(p.id, "review")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Review</button>
              <button disabled={busyId === p.id} onClick={() => void updateStatus(p.id, "risk")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200">Flag Risk</button>
              <button disabled={busyId === p.id} onClick={() => void updateStatus(p.id, "completed")} className="px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
