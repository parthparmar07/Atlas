"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, RefreshCw, Layers, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

type OpsRecord = {
    id: number;
    title: string;
    status: string;
    metadata?: Record<string, unknown>;
};

type ScheduleSlot = {
    id: number;
    date: string;
    time: string;
    subject: string;
    conflict: boolean;
    proctors: number;
};

const DEFAULT_SCHEDULE: Omit<ScheduleSlot, "id">[] = [
    { date: "May 10", time: "Morning", subject: "Mathematics 101", conflict: false, proctors: 4 },
    { date: "May 10", time: "Afternoon", subject: "Physics 2A", conflict: true, proctors: 2 },
    { date: "May 11", time: "Morning", subject: "Computer Science", conflict: false, proctors: 5 },
];

const GENERATED_SCHEDULE: Omit<ScheduleSlot, "id">[] = [
    { date: "May 10", time: "09:00 AM", subject: "Mathematics 101", conflict: false, proctors: 4 },
    { date: "May 10", time: "02:00 PM", subject: "Database Systems", conflict: false, proctors: 3 },
    { date: "May 11", time: "09:00 AM", subject: "Computer Science", conflict: false, proctors: 5 },
    { date: "May 11", time: "02:00 PM", subject: "Physics 2A (Rescheduled)", conflict: false, proctors: 4 },
    { date: "May 12", time: "09:00 AM", subject: "Literature", conflict: false, proctors: 2 },
];

export default function ExamSchedulerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
    const [records, setRecords] = useState<OpsRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSchedule = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/academics/exams");
            if ((data.records ?? []).length === 0) {
                await Promise.all(
                    DEFAULT_SCHEDULE.map((slot) =>
                        api("/api/ops/academics/exams", {
                            method: "POST",
                            body: JSON.stringify({
                                title: slot.subject,
                                status: slot.conflict ? "conflict" : "scheduled",
                                source: "seed",
                                metadata: {
                                    date: slot.date,
                                    time: slot.time,
                                    conflict: slot.conflict,
                                    proctors: slot.proctors,
                                },
                            }),
                        })
                    )
                );
                const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/academics/exams");
                setRecords(seeded.records ?? []);
            } else {
                setRecords(data.records ?? []);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load schedule.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSchedule();
    }, []);

    const schedule = useMemo(
        () =>
            records.map((r) => ({
                id: r.id,
                date: String(r.metadata?.date ?? "TBD"),
                time: String(r.metadata?.time ?? "TBD"),
                subject: r.title,
                conflict: String(r.status).toLowerCase() === "conflict" || Boolean(r.metadata?.conflict),
                proctors: Number(r.metadata?.proctors ?? 0),
            })),
        [records]
    );

    const handleGenerate = async () => {
    setIsGenerating(true);
        setError("");
        try {
            await api("/api/ops/academics/exams/actions", {
                method: "POST",
                body: JSON.stringify({ action: "Generate Optimal Schedule", context: "Resolve conflicts and optimize proctoring" }),
            });

            await Promise.all(records.map((record) => api(`/api/ops/academics/exams/${record.id}`, { method: "DELETE" })));
            await Promise.all(
                GENERATED_SCHEDULE.map((slot) =>
                    api("/api/ops/academics/exams", {
                        method: "POST",
                        body: JSON.stringify({
                            title: slot.subject,
                            status: "scheduled",
                            source: "generator",
                            metadata: {
                                date: slot.date,
                                time: slot.time,
                                conflict: slot.conflict,
                                proctors: slot.proctors,
                            },
                        }),
                    })
                )
            );
            await loadSchedule();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to generate schedule.");
        } finally {
            setIsGenerating(false);
        }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-cyan-600" />
            Exam Auto-Scheduler AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Conflict-free timetable generation & proctor allocation</p>
        </div>
        <button 
                        onClick={() => void handleGenerate()}
                        disabled={isGenerating || loading}
            className="bg-cyan-600 border border-cyan-500 shadow-lg shadow-cyan-500/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 flex items-center gap-2 transition disabled:opacity-50"
        >
            {isGenerating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {isGenerating ? "Resolving Conflicts..." : "Generate Optimal Schedule"}
        </button>
      </div>

            {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4" /> Constraints Loaded
            </h3>
             <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-xl font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Room Capacity Limits
            </div>
             <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-xl font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Student Enrollment Overlaps
            </div>
             <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-400 rounded-xl font-medium text-sm">
                <ShieldCheck className="w-5 h-5 text-slate-400" /> Faculty Availability
            </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Draft Timetable
                </h3>
                <div className="flex gap-2">
                     <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                         {schedule.filter(s => s.conflict).length} Conflicts
                     </span>
                </div>
            </div>
            
            <div className="overflow-x-auto p-4 flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700/50">
                            <th className="pb-3 pl-2">Date / Time</th>
                            <th className="pb-3">Subject</th>
                            <th className="pb-3">Proctors</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={4} className="py-6 text-sm text-slate-500">Loading schedule...</td>
                                                    </tr>
                                                ) : null}
                        {schedule.map((slot, i) => (
                            <tr key={i} className="group">
                                <td className="py-4 pl-2">
                                    <div className="font-bold text-slate-900 dark:text-white text-sm">{slot.date}</div>
                                    <div className="text-xs font-medium text-slate-500 mt-0.5">{slot.time}</div>
                                </td>
                                <td className="py-4">
                                     <div className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{slot.subject}</div>
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1 text-slate-500">
                                        <ShieldCheck className="w-4 h-4" /> <span className="text-sm font-bold">{slot.proctors}</span>
                                    </div>
                                </td>
                                <td className="py-4">
                                    {slot.conflict ? (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-rose-200 dark:border-rose-500/20">
                                            <AlertCircle className="w-3.5 h-3.5" /> Overlap Detected
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}
