"use client";

import { useState } from "react";
import { Calendar, Search, Sliders, CheckCircle2, Loader2, Clipboard } from "lucide-react";

interface ExamSchedulerWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const ACTIONS = [
  { key: "Schedule Exams", label: "Schedule Exams", icon: Calendar, color: "rose", desc: "Build clash-free exam timetables with student/faculty/room validation." },
  { key: "Check for Clashes", label: "Audit Schedule", icon: Search, color: "orange", desc: "Audit existing schedule for capacity, student double-booking, and blackout dates." },
  { key: "Optimize Schedule", label: "Optimize Load", icon: Sliders, color: "rose", desc: "Optimize schedule spread and room utilization delta. Reduce same-day load." },
];

export default function ExamSchedulerWorkflow({ onExecute, isExecuting }: ExamSchedulerWorkflowProps) {
  const [examType, setExamType] = useState("End Semester");
  const [courses, setCourses] = useState("B.Tech CSE Semester 4, 6, 8");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const run = (actionKey: string) => {
    const context = JSON.stringify({
      action: actionKey,
      school_id: "atlas",
      exam_type: examType,
      course_scope: courses,
      exam_cycle: examType,
      halls: [
        { name: "Hall A", capacity: 120 },
        { name: "Hall B", capacity: 90 },
        { name: "Lab 1", capacity: 60 },
      ],
    });
    setLastRan(actionKey);
    onExecute(actionKey, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Exam Operations AI</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Examination Cycle</label>
            <select value={examType} onChange={(e) => setExamType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold">
              <option>End Semester (Finals)</option>
              <option>Internal Assessment (Mid-term)</option>
              <option>Improvement / Backlog</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Courses / Years</label>
            <input value={courses} onChange={(e) => setCourses(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => run(a.key)}
              disabled={isExecuting}
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl hover:border-rose-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-3">
                <a.icon className="w-6 h-6 text-rose-500" />
                {isExecuting && lastRan === a.key && <Loader2 className="w-4 h-4 animate-spin text-rose-500" />}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{a.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {lastRan && !isExecuting && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span><span className="font-black">{lastRan}</span> executed. Examination schedule available in the output drawer.</span>
        </div>
      )}
    </div>
  );
}
