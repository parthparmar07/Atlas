"use client";

import { useState } from "react";
import { Microscope, Search, BarChart3, FileText, Loader2, CheckCircle2 } from "lucide-react";

interface ResearchWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const ACTIONS = [
  { key: "Find Literature", label: "Find Literature", icon: Search, color: "teal", desc: "Discover state-of-the-art papers with topical relevance and research-gap extraction." },
  { key: "Analyze Data", label: "Analyze Data", icon: BarChart3, color: "indigo", desc: "Produce analysis summary with trend reporting, anomalies, and study limitations." },
  { key: "Prepare Manuscript", label: "Manuscript Skeleton", icon: FileText, color: "emerald", desc: "Generate publication-ready manuscript skeleton with venue-specific formatting checklist." },
];

export default function ResearchWorkflow({ onExecute, isExecuting }: ResearchWorkflowProps) {
  const [topic, setTopic] = useState("AI in Higher Education - Personalised Learning");
  const [method, setMethod] = useState("Qualitative / Case Study");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const run = (actionKey: string) => {
    const context = `Research Topic: ${topic}\nPrimary Method: ${method}\nAction: ${actionKey}`;
    setLastRan(actionKey);
    onExecute(actionKey, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Microscope className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-widest uppercase text-xs">Research Intelligence Suite</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Research Topic / Keywords</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Primary methodology</label>
            <input value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => run(a.key)}
              disabled={isExecuting}
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-6 rounded-2xl hover:border-teal-500 hover:shadow-lg transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-4">
                <a.icon className="w-7 h-7 text-teal-600" />
                {isExecuting && lastRan === a.key && <Loader2 className="w-5 h-5 animate-spin text-teal-600" />}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{a.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {lastRan && !isExecuting && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span><span className="font-black">{lastRan}</span> executed. Scholarship results available in the output drawer.</span>
        </div>
      )}
    </div>
  );
}
