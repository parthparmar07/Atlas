import { useState } from "react";
import { FileCheck2, FileSearch, Sparkles, Target } from "lucide-react";

interface ResumeWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function ResumeWorkflow({ onExecute, isExecuting }: ResumeWorkflowProps) {
  const [student, setStudent] = useState("S-2026-142");
  const [targetRole, setTargetRole] = useState("Data Analyst");
  const [resumeSummary, setResumeSummary] = useState("Projects in SQL and Python, internship in analytics, basic dashboarding");

  const context = [
    `Student ID: ${student}`,
    `Target Role: ${targetRole}`,
    `Resume Summary: ${resumeSummary}`,
    "Need: ATS scoring, keyword gap analysis, and role-optimized rewrite guidance.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Student ID" value={student} setValue={setStudent} />
        <Input label="Target Role" value={targetRole} setValue={setTargetRole} />
        <Input label="Resume Summary" value={resumeSummary} setValue={setResumeSummary} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<FileCheck2 className="w-6 h-6 text-emerald-600 mb-3" />} title="Score Resumes" desc="Run ATS score + weakness diagnostics." onClick={() => onExecute("Score Resumes", context)} disabled={isExecuting} />
        <ActionCard icon={<Sparkles className="w-6 h-6 text-emerald-600 mb-3" />} title="Optimise Resume" desc="Generate high-impact resume rewrite suggestions." onClick={() => onExecute("Optimise Resume", context)} disabled={isExecuting} />
        <ActionCard icon={<FileSearch className="w-6 h-6 text-emerald-600 mb-3" />} title="Bulk Audit" desc="Batch-level resume readiness assessment." onClick={() => onExecute("Bulk Audit", context)} disabled={isExecuting} />
        <ActionCard icon={<Target className="w-6 h-6 text-emerald-600 mb-3" />} title="JD Matcher" desc="Role-specific keyword and fit checklist." onClick={() => onExecute("JD Matcher", context)} disabled={isExecuting} />
      </div>
    </div>
  );
}

function Input({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, disabled }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
