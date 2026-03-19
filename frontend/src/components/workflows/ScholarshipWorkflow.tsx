"use client";

import { useState } from "react";
import { Award, Search, FileText, BarChart2, Loader2, CheckCircle2 } from "lucide-react";

interface ScholarshipWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const ACTIONS = [
  { key: "Match Now", label: "Run Matcher", icon: Award, color: "amber", desc: "Match student pool to Central, State, and Institutional schemes." },
  { key: "Update Database", label: "Update Catalog", icon: Search, color: "blue", desc: "Generate catalog update proposal with new schemes and deadlines." },
  { key: "Generate Letters", label: "Draft Letters", icon: FileText, color: "emerald", desc: "Generate tailored recommendation letters for matched schemes." },
  { key: "Track Applications", label: "Track Status", icon: BarChart2, color: "indigo", desc: "Generate scholarship application tracking and risk report." },
];

export default function ScholarshipWorkflow({ onExecute, isExecuting }: ScholarshipWorkflowProps) {
  const [studentId, setStudentId] = useState("STUDENT-2026-X1");
  const [minScore, setMinScore] = useState("75");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const run = (actionKey: string) => {
    const context = `Student ID: ${studentId}\nMin Merit Score: ${minScore}\nAction: ${actionKey}`;
    setLastRan(actionKey);
    onExecute(actionKey, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scholarship Intelligence</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Student ID Filter</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Merit Score (%)</label>
            <input type="number" value={minScore} onChange={(e) => setMinScore(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => run(a.key)}
              disabled={isExecuting}
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl hover:border-amber-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-3">
                <a.icon className="w-6 h-6 text-amber-500" />
                {isExecuting && lastRan === a.key && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{a.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {lastRan && !isExecuting && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span><span className="font-black">{lastRan}</span> executed. Scholarship results available in the output drawer.</span>
        </div>
      )}
    </div>
  );
}
