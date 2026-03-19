"use client";

import { useState } from "react";
import { 
  Calendar, 
  Cpu, 
  Settings, 
  Shuffle, 
  Search, 
  UserPlus, 
  FileText, 
  BookOpen, 
  Layout,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface TimetableWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const ACTIONS = [
  { 
    key: "Parse Timetable Constraints", 
    label: "Parse Constraints", 
    icon: Settings, 
    color: "sky",
    desc: "Convert HOD/Faculty natural language requirements into structured JSON logic." 
  },
  { 
    key: "Detect Conflicts", 
    label: "Detect Conflicts", 
    icon: Search, 
    color: "amber",
    desc: "Audit the proposed schedule for faculty, room, and batch double-bookings." 
  },
  { 
    key: "Manage Substitutions", 
    label: "Manage Substitutions", 
    icon: Shuffle, 
    color: "indigo",
    desc: "Find available substitutes for today's reported absences based on subject/load." 
  },
  { 
    key: "Audit Curriculum Coverage", 
    label: "Audit Curriculum", 
    icon: BookOpen, 
    color: "emerald",
    desc: "Map syllabus topics to past exam frequencies and identify coverage gaps." 
  },
  { 
    key: "Generate Academic Calendar", 
    label: "Academic Calendar", 
    icon: Layout, 
    color: "violet",
    desc: "Build a week-by-week calendar with holidays, exams, and teaching days." 
  },
  { 
    key: "Schedule Examinations", 
    label: "Schedule Exams", 
    icon: Calendar, 
    color: "rose",
    desc: "Generate a clash-free exam timetable with hall capacity allotments." 
  },
];

const COLOR_MAP: Record<string, string> = {
  sky: "border-sky-400 bg-sky-50 text-sky-600",
  amber: "border-amber-400 bg-amber-50 text-amber-600",
  indigo: "border-indigo-400 bg-indigo-50 text-indigo-600",
  emerald: "border-emerald-400 bg-emerald-50 text-emerald-600",
  violet: "border-violet-400 bg-violet-50 text-violet-600",
  rose: "border-rose-400 bg-rose-50 text-rose-600",
};

export default function TimetableWorkflow({ onExecute, isExecuting }: TimetableWorkflowProps) {
  const [department, setDepartment] = useState("Computer Science");
  const [semester, setSemester] = useState("Fall 2026");
  const [customContext, setCustomContext] = useState("");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const runAction = (actionKey: string) => {
    const context = [
      `Department: ${department}`,
      `Semester: ${semester}`,
      customContext ? `Instructions: ${customContext}` : "",
      `Action: ${actionKey}`
    ].filter(Boolean).join("\n");
    
    setLastRan(actionKey);
    onExecute(actionKey, context);
  };

  return (
    <div className="space-y-6">
      {/* Parameters Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex items-center gap-6">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none"
          >
            <option>Computer Science</option>
            <option>Electronics & Comm</option>
            <option>Mechanical Eng</option>
            <option>Civil Engineering</option>
            <option>Design & Arts</option>
            <option>Business Admin</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Semester Context</label>
          <input 
            type="text" 
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none"
            placeholder="e.g. Fall 2026"
          />
        </div>
        <div className="flex-[2]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Specific Instructions (Optional)</label>
          <input 
            type="text" 
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium text-slate-900 dark:text-white outline-none"
            placeholder="e.g. Prioritize morning slots for Dr. Sharma..."
          />
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-4">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const active = lastRan === a.key && isExecuting;
          return (
            <button
              key={a.key}
              onClick={() => runAction(a.key)}
              disabled={isExecuting}
              className={`relative overflow-hidden group p-5 rounded-2xl border transition-all text-left bg-white dark:bg-slate-800 hover:shadow-lg disabled:opacity-60 ${
                active ? COLOR_MAP[a.color] : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              <div className={`p-2 rounded-lg w-fit mb-3 transition-colors ${active ? "bg-white/50" : "bg-slate-50 dark:bg-slate-900 group-hover:bg-slate-100"}`}>
                <Icon className={`w-5 h-5 ${active ? "" : "text-slate-500"}`} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">{a.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{a.desc}</p>
              
              {active && (
                <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Execution Feedback */}
      {lastRan && !isExecuting && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span><span className="font-black">{lastRan}</span> executed successfully. Review the terminal output for the result.</span>
        </div>
      )}
    </div>
  );
}
