"use client";

import { useEffect, useMemo, useState } from "react";
import { useSchool } from "@/context/SchoolContext";
import { api } from "@/lib/api";
import { BookOpen, Sparkles, LayoutList, CheckSquare, Target, Clock, ArrowRight, RefreshCw, Activity } from "lucide-react";

type RecoveryCandidate = {
  id: number;
  name: string;
  roll_number: string;
  school_id: string;
  programme: string;
  attendance_rate: number;
  gpa: number;
  risk_score: number;
};

export default function AcademicRecoveryPage() {
  const { currentSchool } = useSchool();
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidates, setCandidates] = useState<RecoveryCandidate[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [priorityMarks, setPriorityMarks] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");

  const selectedSchoolId = useMemo(() => {
    if (!currentSchool?.id || currentSchool.id === "all") {
      return "atlas";
    }
    return currentSchool.id;
  }, [currentSchool?.id]);

  useEffect(() => {
    const loadCandidates = async () => {
      setLoadingCandidates(true);
      try {
        const data = await api<RecoveryCandidate[]>(
          `/api/academics/students/recovery-candidates?school=${encodeURIComponent(selectedSchoolId)}&limit=12`
        );
        setCandidates(data);
        if (data.length > 0) {
          setStudentId((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) {
              return String(data[0].id);
            }
            const parsed = Number.parseInt(trimmed, 10);
            const exists = data.some((candidate) => candidate.id === parsed);
            return exists ? trimmed : String(data[0].id);
          });
        }
      } catch {
        setCandidates([]);
      } finally {
        setLoadingCandidates(false);
      }
    };

    void loadCandidates();
  }, [selectedSchoolId]);

  const generatePlan = async () => {
    const trimmed = studentId.trim();
    if (!trimmed) {
      setError("Enter a valid student ID to generate blueprint.");
      setPlan(null);
      return;
    }

    const parsedId = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError("Student ID must be a positive number.");
      setPlan(null);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await api<any>(`/api/academics/students/${parsedId}/recovery`, {
        method: "POST"
      });
      setPlan(data);
      setPriorityMarks({});
    } catch (e) {
      setError("Student ID not found or blueprint generation failed.");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-1000">
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-[3.5rem] p-16 border border-white/10 shadow-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
           <Sparkles className="w-96 h-96 text-white" />
         </div>
         <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                 Recovery Intelligence v2.1
               </span>
            </div>
            <h1 className="text-7xl font-black text-white leading-none tracking-tighter">
               Academic <br/>
               <span className="text-white/40">Recovery Advisor</span>
            </h1>
            <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed italic border-l-4 border-indigo-500 pl-6">
              Empowering students through AI-driven restoration: Productivity paths, synthesized study plans, and career recovery roadmaps.
            </p>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
                <input 
                  type="text" 
                  placeholder="Enter Student ID (e.g., 1, 102)..."
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold text-lg min-w-[350px] shadow-inner"
                />
                <button 
                  onClick={() => void generatePlan()}
                  disabled={loading}
                  className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Target className="w-6 h-6" />}
                  Generate Recovery Blueprint
                </button>
            </div>

            <div className="pt-2 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                {loadingCandidates ? "Loading test student IDs..." : "Quick Test Student IDs"}
              </div>
              {!loadingCandidates && candidates.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidates.map((candidate) => {
                    const active = studentId.trim() === String(candidate.id);
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => setStudentId(String(candidate.id))}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors ${
                          active
                            ? "bg-indigo-500/25 border-indigo-400 text-indigo-100"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                        title={`${candidate.name} • ${candidate.roll_number}`}
                      >
                        ID {candidate.id} • {candidate.name}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
         </div>
      </div>

      {error && <div className="px-6 py-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl font-bold italic tracking-tight">{error}</div>}

      {plan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Summary and Productivity */}
            <div className="space-y-8 lg:col-span-1">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
                    <div className={`p-4 rounded-2xl ${currentSchool.bg} ${currentSchool.color} w-fit mb-4`}>
                        <Activity className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Recovery Summary</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">{plan.summary}</p>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-6">
                    <h3 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                        <Clock className="w-6 h-6 text-indigo-400" />
                        Productivity Tips
                    </h3>
                    <div className="space-y-4">
                        {plan.productivity_tips?.map((tip: string, i: number) => (
                           <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition group">
                              <span className="text-indigo-500 font-black text-xs">0{i+1}</span>
                              <span className="text-white/80 font-medium text-sm leading-snug">{tip}</span>
                           </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Steps Roadmap */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                            <LayoutList className="w-7 h-7 text-indigo-500" />
                            Step-by-Step Restoration
                        </h3>
                        <span className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase text-slate-400">Institutional Route</span>
                    </div>

                    <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-1 before:bg-slate-50 before:rounded-full">
                        {plan.steps?.map((step: string, i: number) => (
                           <div key={i} className="relative pl-20 group">
                              <div className="absolute left-0 top-0 w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm z-10">
                                {i+1}
                              </div>
                              <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                 {priorityMarks[i] ? (
                                   <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-indigo-700">
                                     Priority Marked
                                   </div>
                                 ) : null}
                                 <h4 className="text-lg font-black text-slate-900 mb-2">Phase {i+1} Implementation</h4>
                                 <p className="text-slate-500 font-medium leading-relaxed italic">{step}</p>
                                 <div className="mt-4 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPriorityMarks((prev) => ({
                                          ...prev,
                                          [i]: !prev[i],
                                        }))
                                      }
                                      className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500 tracking-widest py-2 px-4 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        {priorityMarks[i] ? "Unmark Priority" : "Mark Phase Priority"} <ArrowRight className="w-3 h-3" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-indigo-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div className="space-y-1">
                            <div className="text-white font-black text-xl">Confirm Recovery Path</div>
                            <div className="text-white/40 text-xs font-bold font-mono">Institutional recovery plan will be sent to counselor</div>
                        </div>
                        <button className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm hover:scale-105 transition active:scale-95 shadow-lg">
                            Finalize Blueprint
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
