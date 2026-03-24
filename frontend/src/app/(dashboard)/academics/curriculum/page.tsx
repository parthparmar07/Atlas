"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, TrendingUp, AlertTriangle, Send, Sparkles, Plus, Book, Activity, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { api } from "@/lib/api";
import CurriculumAuditorControl from "@/components/academics/CurriculumAuditorControl";

type OpsRecord = {
    id: number;
    title: string;
    status: string;
    metadata?: Record<string, unknown>;
};

type SubjectRow = {
    id: number;
    code: string;
    name: string;
    status: "ALIGNED" | "NEEDS UPDATE" | "REVIEWING";
    alignment: number;
    examFreq: number;
    syllabusWeight: number;
};

type ChatMessage = { role: "ai" | "user"; text: string };

const DEFAULT_SUBJECTS = [
    { code: "CS301", name: "Modern Web Frameworks", status: "NEEDS UPDATE", alignment: 65, examFreq: 30, syllabusWeight: 80 },
    { code: "CS304", name: "Intro to AI", status: "ALIGNED", alignment: 92, examFreq: 90, syllabusWeight: 45 },
    { code: "CS402", name: "Cloud Infrastructure", status: "REVIEWING", alignment: 78, examFreq: 50, syllabusWeight: 75 },
    { code: "CS220", name: "Data Structures", status: "ALIGNED", alignment: 84, examFreq: 85, syllabusWeight: 60 },
    { code: "CS410", name: "Cybersecurity", status: "REVIEWING", alignment: 74, examFreq: 75, syllabusWeight: 65 },
] as const;

export default function CurriculumAuditorPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [records, setRecords] = useState<OpsRecord[]>([]);
    const [importing, setImporting] = useState(false);
  const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "I've analyzed the CS department syllabus. I noticed 'Web Dev Basics' has high syllabus weight but very low exam frequency over the last 5 years. Would you like me to draft a revised unit structure?" }
  ]);

    const loadSubjects = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/academics/curriculum");
            if ((data.records ?? []).length === 0) {
                await Promise.all(
                    DEFAULT_SUBJECTS.map((subject) =>
                        api("/api/ops/academics/curriculum", {
                            method: "POST",
                            body: JSON.stringify({
                                title: subject.name,
                                status: subject.status,
                                source: "seed",
                                metadata: {
                                    code: subject.code,
                                    alignment: subject.alignment,
                                    examFreq: subject.examFreq,
                                    syllabusWeight: subject.syllabusWeight,
                                },
                            }),
                        })
                    )
                );
                const seeded = await api<{ records: OpsRecord[]; count: number }>("/api/ops/academics/curriculum");
                setRecords(seeded.records ?? []);
            } else {
                setRecords(data.records ?? []);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load curriculum data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSubjects();
    }, []);

    const subjects = useMemo<SubjectRow[]>(
        () =>
            records.map((record) => ({
                id: record.id,
                code: String(record.metadata?.code ?? `CS${record.id}`),
                name: record.title,
                status: (String(record.status || "REVIEWING").toUpperCase() as SubjectRow["status"]),
                alignment: Number(record.metadata?.alignment ?? 0),
                examFreq: Number(record.metadata?.examFreq ?? 0),
                syllabusWeight: Number(record.metadata?.syllabusWeight ?? 0),
            })),
        [records]
    );

    const heatmapData = useMemo(
        () =>
            subjects.map((s) => ({
                topic: s.name,
                examFreq: s.examFreq,
                syllabusWeight: s.syllabusWeight,
            })),
        [subjects]
    );

    const handleImportSyllabus = async () => {
        setImporting(true);
        setError("");
        try {
            await api("/api/ops/academics/curriculum", {
                method: "POST",
                body: JSON.stringify({
                    title: `Imported Subject ${records.length + 1}`,
                    status: "REVIEWING",
                    source: "import",
                    metadata: {
                        code: `CS${500 + records.length + 1}`,
                        alignment: 70,
                        examFreq: 60,
                        syllabusWeight: 68,
                    },
                }),
            });
            await api("/api/ops/academics/curriculum/actions", {
                method: "POST",
                body: JSON.stringify({ action: "Import Syllabus", context: "Course pack imported from faculty upload" }),
            });
            await loadSubjects();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to import syllabus.");
        } finally {
            setImporting(false);
        }
    };

    const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

        const userMessage = chatInput;
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatInput("");

        const aiMessage = "Based on current industry demand (React, Next.js, Node.js), I recommend dropping legacy jQuery concepts from Unit 2 and introducing modern App Router concepts. I will update the draft.";
        setMessages((prev) => [...prev, { role: "ai", text: aiMessage }]);

        try {
            await api("/api/ops/academics/curriculum/actions", {
                method: "POST",
                body: JSON.stringify({ action: "Copilot Suggestion", context: userMessage }),
            });
        } catch {
            // keep chat responsive even if action logging fails
        }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-500" />
            Curriculum Auditor AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">AI-driven gap analysis between syllabus, exams & industry</p>
        </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => void loadSubjects()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button onClick={() => void handleImportSyllabus()} disabled={importing || loading} className="bg-cyan-600 border border-cyan-500 shadow-lg shadow-cyan-500/20 text-white px-5 py-3 rounded-xl font-bold hover:bg-cyan-700 flex items-center gap-2 transition disabled:opacity-60">
            <Plus className="h-5 w-5" /> Import Syllabus
                    </button>
                </div>
      </div>

            {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

            <CurriculumAuditorControl schoolId="atlas" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Analytics Area */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Exam vs Syllabus Weight
                    </h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={heatmapData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="examFreq" name="Exam Frequency" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="syllabusWeight" name="Syllabus Weight" fill="#c084fc" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Industry Alignment Trend
                    </h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                                     <AreaChart data={heatmapData}>
                             <defs>
                                <linearGradient id="colorAlign" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                            <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="syllabusWeight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAlign)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Book className="w-5 h-5 text-cyan-500" /> Active Course Audits
                    </h3>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Course</th>
                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Alignment Score</th>
                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Audit Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {loading ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-6 text-sm text-slate-500">Loading course audits...</td>
                          </tr>
                        ) : null}
                        {subjects.map(sub => (
                             <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                 <td className="px-6 py-4">
                                     <div className="font-bold text-slate-900 dark:text-white mb-0.5">{sub.name}</div>
                                     <div className="text-xs font-mono text-slate-500">{sub.code}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full ${sub.alignment >= 80 ? "bg-emerald-500" : sub.alignment >= 60 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${sub.alignment}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{sub.alignment}%</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${sub.status === "ALIGNED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : sub.status === "NEEDS UPDATE" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
                                         {sub.status === "NEEDS UPDATE" && <AlertTriangle className="w-3 h-3" />}
                                         {sub.status}
                                     </span>
                                 </td>
                             </tr>
                        ))}
                        {!loading && subjects.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-8 text-sm text-slate-500">No curriculum audits found.</td>
                          </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>

        {/* AI Copilot Side Panel */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-inner flex flex-col h-[700px]">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-xl">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Curriculum Copilot</h3>
                    <p className="text-xs text-slate-500">Ask for draft updates & insight</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                         <div className={`text-xs font-bold uppercase tracking-widest mb-1 mx-2 ${msg.role === "user" ? "text-slate-400" : "text-indigo-400"}`}>
                             {msg.role === "user" ? "You" : "AI Copilot"}
                         </div>
                         <div className={`p-4 rounded-2xl max-w-[90%] text-sm font-medium leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-sm"}`}>
                            {msg.text}
                         </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleChat} className="mt-auto relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask for syllabus revisions..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-12 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-900 dark:text-white shadow-sm"
                />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>

      </div>
    </div>
  );
}
