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

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Student ID: ${student}`,
      `Target Role: ${targetRole}`,
      `Resume Summary: ${resumeSummary}`,
      "Resumes[]:",
      `${student} | target_role=${targetRole} | sections=Education,Projects,Skills | ats_score=68 | keyword_hit=54 | version=V2`,
      "S-2026-188 | target_role=Business Analyst | sections=Education,Experience,Skills | ats_score=72 | keyword_hit=62 | version=V3",
      "S-2026-204 | target_role=Data Engineer | sections=Education,Projects | ats_score=61 | keyword_hit=48 | version=V1",
      "JD Text:",
      "Role requires SQL, Python, dashboarding, analytics storytelling, and stakeholder communication.",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Student ID" value={student} setValue={setStudent} />
        <Input label="Target Role" value={targetRole} setValue={setTargetRole} />
        <Input label="Resume Summary" value={resumeSummary} setValue={setResumeSummary} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard
          icon={<FileCheck2 className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Score Resumes"
          desc="Run ATS score + weakness diagnostics."
          onClick={() => onExecute("Score Resumes", buildContext("Score Resumes", "resume scorecards with ATS and keyword coverage"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Sparkles className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Optimise Resume"
          desc="Generate high-impact resume rewrite suggestions."
          onClick={() => onExecute("Optimise Resume", buildContext("Optimise Resume", "rewrite suggestions and impact statements"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<FileSearch className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Bulk Audit"
          desc="Batch-level resume readiness assessment."
          onClick={() => onExecute("Bulk Audit", buildContext("Bulk Audit", "cohort readiness summary with risk tiers"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Target className="w-6 h-6 text-emerald-600 mb-3" />}
          title="JD Matcher"
          desc="Role-specific keyword and fit checklist."
          onClick={() => onExecute("JD Matcher", buildContext("JD Matcher", "keyword fit map and missing skill checklist"))}
          disabled={isExecuting}
        />
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
