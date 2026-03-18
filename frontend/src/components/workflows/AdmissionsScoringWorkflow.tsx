"use client";

import { useState } from "react";
import { Play, Database, Loader2, FileText, CheckCircle2, Users, Mail, BarChart2, BookOpen, Award } from "lucide-react";

interface AdmissionsScoringWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => Promise<void>;
  isExecuting: boolean;
}

const ACTIONS = [
  {
    key: "Qualify Leads",
    icon: Users,
    color: "indigo",
    label: "Qualify Leads",
    desc: "Score all leads (0–100), tier as Hot/Warm/Cold, generate counsellor briefings for top 5.",
    fields: [
      { id: "batch", label: "Batch / Cohort", placeholder: "e.g. BATCH-2026-A", defaultValue: "BATCH-2026-A" },
      { id: "programme", label: "Programme Filter", placeholder: "e.g. B.Tech CSE or All", defaultValue: "All Programmes" },
    ],
  },
  {
    key: "Parse Documents",
    icon: FileText,
    color: "violet",
    label: "Parse Documents",
    desc: "Extract academic scores, skills, certifications from uploaded marksheets, CVs, certificates.",
    fields: [
      { id: "doc_type", label: "Document Type", placeholder: "Marksheet / CV / Certificate", defaultValue: "Marksheet" },
      { id: "source", label: "Upload Source", placeholder: "e.g. CRM upload or email attachment", defaultValue: "CRM Upload" },
    ],
  },
  {
    key: "Track Funnel",
    icon: BarChart2,
    color: "sky",
    label: "Track Funnel",
    desc: "Show stage counts, conversion rates, stalled leads >5 days, top 10 today's priority leads.",
    fields: [
      { id: "cycle", label: "Admission Cycle", placeholder: "e.g. 2026-27", defaultValue: "2026-27" },
      { id: "programme", label: "Programme", placeholder: "e.g. All or B.Tech CSE", defaultValue: "All Programmes" },
    ],
  },
  {
    key: "Generate Follow-Up Messages",
    icon: Mail,
    color: "emerald",
    label: "Generate Follow-Ups",
    desc: "Personalised WhatsApp + Email follow-ups for leads silent 3+ days. One clear CTA each.",
    fields: [
      { id: "channel", label: "Channel", placeholder: "WhatsApp / Email / Both", defaultValue: "Both" },
      { id: "days_stale", label: "Stale After (days)", placeholder: "e.g. 3", defaultValue: "3" },
    ],
  },
  {
    key: "Match Scholarships",
    icon: Award,
    color: "amber",
    label: "Match Scholarships",
    desc: "Match students against Central, Maharashtra state, and institutional scholarship schemes.",
    fields: [
      { id: "category", label: "Student Category", placeholder: "e.g. SC/ST, OBC, General", defaultValue: "All Categories" },
      { id: "min_income", label: "Income Limit (₹/yr)", placeholder: "e.g. 800000", defaultValue: "800000" },
    ],
  },
  {
    key: "Brief Counsellors",
    icon: BookOpen,
    color: "rose",
    label: "Brief Counsellors",
    desc: "Pre-call briefings: academic strength, programme fit, objections, talking points, red flags.",
    fields: [
      { id: "counsellor", label: "Counsellor Name", placeholder: "e.g. Ms. Sharma or All", defaultValue: "All Counsellors" },
      { id: "date", label: "Call Date", placeholder: "e.g. Today", defaultValue: "Today" },
    ],
  },
];

const COLOR_MAP: Record<string, string> = {
  indigo: "border-indigo-400 bg-indigo-50/60 text-indigo-600",
  violet: "border-violet-400 bg-violet-50/60 text-violet-600",
  sky: "border-sky-400 bg-sky-50/60 text-sky-600",
  emerald: "border-emerald-400 bg-emerald-50/60 text-emerald-600",
  amber: "border-amber-400 bg-amber-50/60 text-amber-600",
  rose: "border-rose-400 bg-rose-50/60 text-rose-600",
};

const BTN_MAP: Record<string, string> = {
  indigo: "bg-indigo-600 hover:bg-indigo-700",
  violet: "bg-violet-600 hover:bg-violet-700",
  sky: "bg-sky-600 hover:bg-sky-700",
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  rose: "bg-rose-600 hover:bg-rose-700",
};

export default function AdmissionsScoringWorkflow({ onExecute, isExecuting }: AdmissionsScoringWorkflowProps) {
  const [selected, setSelected] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, Record<string, string>>>({});
  const [customContext, setCustomContext] = useState("");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const action = ACTIONS[selected];

  const getField = (idx: number, fid: string) =>
    fieldValues[idx]?.[fid] ?? action.fields.find((f) => f.id === fid)?.defaultValue ?? "";

  const setField = (fid: string, val: string) =>
    setFieldValues((prev) => ({
      ...prev,
      [selected]: { ...(prev[selected] ?? {}), [fid]: val },
    }));

  const handleRun = () => {
    const fieldLines = action.fields
      .map((f) => `${f.label}: ${getField(selected, f.id)}`)
      .join("\n");

    const context = [
      `Action: ${action.key}`,
      fieldLines,
      customContext ? `Additional instructions: ${customContext}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setLastRan(action.key);
    onExecute(action.key, context);
  };

  return (
    <div className="space-y-6">
      {/* Action Selector Tabs */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-3 mb-5">
          <Database className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Admissions Workflow Engine</h2>
        </div>

        {/* Tab grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {ACTIONS.map((a, i) => {
            const Icon = a.icon;
            const active = selected === i;
            return (
              <button
                key={a.key}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border-2 text-left transition-all ${
                  active ? COLOR_MAP[a.color] : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "" : "text-slate-400"}`} />
                <span className={`text-[13px] font-bold leading-tight ${active ? "" : "text-slate-600"}`}>
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected action description */}
        <div className="text-sm text-slate-500 font-medium bg-slate-50 rounded-xl px-4 py-3 mb-6 border border-slate-100">
          {action.desc}
        </div>

        {/* Dynamic fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {action.fields.map((f) => (
            <div key={f.id}>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2">
                {f.label}
              </label>
              <input
                value={getField(selected, f.id)}
                onChange={(e) => setField(f.id, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          ))}
        </div>

        {/* Extra context */}
        <div className="mb-5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2">
            Additional Context / Override Instructions
          </label>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Any extra instructions for the agent..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
          />
        </div>

        {/* Run button */}
        <div className="flex justify-end">
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-7 py-3 ${BTN_MAP[action.color]} text-white font-bold rounded-2xl transition-colors disabled:opacity-50 shadow-lg`}
          >
            {isExecuting && lastRan === action.key ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isExecuting && lastRan === action.key ? "Running Agent..." : `Execute: ${action.label}`}
          </button>
        </div>
      </div>

      {/* Success state */}
      {!isExecuting && lastRan && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold animate-in fade-in duration-500">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <span className="font-black">{lastRan}</span> executed — results shown in the output drawer below.
          </span>
        </div>
      )}
    </div>
  );
}
