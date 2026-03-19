"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, GripVertical, CheckCircle, Save, Sparkles, AlertTriangle, PlayCircle, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

type CatalogCourse = { id: number; name: string; credits: number; type: "core" | "elective" };
type OpsRecord = { id: number; title: string; metadata?: Record<string, unknown> };

const CATALOG: CatalogCourse[] = [
  { id: 1, name: "Core: Data Structures", credits: 4, type: "core" },
  { id: 2, name: "Elective: Quantum Phys", credits: 3, type: "elective" },
  { id: 3, name: "Core: Algorithms", credits: 4, type: "core" },
  { id: 4, name: "Elective: App Dev", credits: 3, type: "elective" },
  { id: 5, name: "Elective: Psych 101", credits: 3, type: "elective" },
  { id: 6, name: "Core: Databases", credits: 4, type: "core" },
];

export default function CourseBuilderPage() {
  const [records, setRecords] = useState<OpsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ records: OpsRecord[]; count: number }>("/api/ops/students/course-builder");
      setRecords(data.records ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load course plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlan();
  }, []);

  const courses = useMemo(
    () =>
      records.map((record) => ({
        id: record.id,
        courseId: Number(record.metadata?.courseId ?? 0),
        name: record.title,
        credits: Number(record.metadata?.credits ?? 0),
        type: String(record.metadata?.type ?? "elective"),
      })),
    [records]
  );

  const selectedCourseIds = useMemo(() => new Set(courses.map((c) => c.courseId)), [courses]);
  const available = useMemo(() => CATALOG.filter((c) => !selectedCourseIds.has(c.id)), [selectedCourseIds]);

  const [aiSuggestions] = useState([
    { text: "Based on your major (CS), you need 1 more Core subject.", action: () => moveCourse(6, true) },
    { text: "Take 'App Dev' to complete your software engineering track.", action: () => moveCourse(4, true) }
  ]);

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  const moveCourse = async (id: number, toSelected: boolean) => {
    setBusyCourseId(id);
    setError("");
    if (toSelected) {
      const course = CATALOG.find(c => c.id === id);
      if (course) {
        try {
          await api("/api/ops/students/course-builder", {
            method: "POST",
            body: JSON.stringify({
              title: course.name,
              status: "selected",
              source: "planner",
              metadata: { courseId: course.id, credits: course.credits, type: course.type },
            }),
          });
          await loadPlan();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to add course.");
        }
      }
    } else {
      const course = courses.find(c => c.id === id);
      if (course) {
        try {
          await api(`/api/ops/students/course-builder/${course.id}`, { method: "DELETE" });
          await loadPlan();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to remove course.");
        }
      }
    }
    setBusyCourseId(null);
  };

  const savePlan = async () => {
    setError("");
    try {
      await api("/api/ops/students/course-builder/actions", {
        method: "POST",
        body: JSON.stringify({ action: "Enrol Schedule", context: `Credits=${totalCredits}` }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save plan.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-pink-500" />
            AI Course Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Drag & drop degree planning with AI path validation</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => void loadPlan()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={() => void savePlan()} className="bg-pink-600 border border-pink-500 shadow-lg shadow-pink-500/30 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-700 flex items-center gap-2 transition">
            <Save className="h-5 w-5" /> Enrol Schedule
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Available Courses */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col h-[650px]">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <PlayCircle className="w-5 h-5 text-slate-400" /> Available Catalog
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {available.map(c => (
                    <div 
                        key={c.id} 
                    onClick={() => void moveCourse(c.id, true)}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:border-pink-500 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <GripVertical className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</div>
                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
                                    {c.credits} Credits • {c.type}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {available.length === 0 && (
                    <div className="text-center p-8 text-slate-500 border border-dashed rounded-2xl mt-4">
                        Catalog empty.
                    </div>
                )}
            </div>
        </div>

        {/* Right Side: Selected Plan + AI Context */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Context/AI area */}
            <div className="bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 rounded-3xl p-6 shadow-sm">
                 <h3 className="text-sm font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4" /> Copilot Path Suggestions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {aiSuggestions.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-pink-100 dark:border-pink-900/50 shadow-sm flex flex-col justify-between items-start gap-3">
                             <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.text}</p>
                             <button onClick={() => void s.action()} className="text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-colors">
                                 Add Recommended
                             </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Droppable Selection Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                        <CheckCircle className="w-6 h-6 text-emerald-500" /> Your Semester Plan
                    </h3>
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm tracking-wide ${totalCredits >= 12 && totalCredits <= 18 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        Total Credits: {totalCredits} / 18
                        {totalCredits < 12 && <AlertTriangle className="inline w-4 h-4 ml-2" />}
                    </div>
                </div>

                <div className="flex-1 grid gap-3 content-start">
                    {loading ? <div className="text-sm text-slate-500">Loading selected courses...</div> : null}
                    {courses.map((c, idx) => (
                        <div 
                            key={c.id}
                        onClick={() => void moveCourse(c.id, false)}
                            className="p-4 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 hover:border-rose-300 cursor-pointer transition-all flex items-center justify-between group"
                        >
                             <div className="flex items-center gap-4">
                                <div className="text-emerald-500 font-black text-xl w-6 text-center">{idx + 1}</div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
                                        {c.credits} Credits • {c.type}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              {busyCourseId === c.id ? "Saving..." : "Remove (Click)"}
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="text-center p-12 text-slate-500 font-medium">
                            Drag subjects here to build your schedule
                        </div>
                    )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
