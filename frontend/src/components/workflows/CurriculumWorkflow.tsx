import { useState } from "react";
import { BookOpenCheck, FileBarChart, ShieldCheck, TrendingUp } from "lucide-react";

interface CurriculumWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function CurriculumWorkflow({ onExecute, isExecuting }: CurriculumWorkflowProps) {
  const [programme, setProgramme] = useState("B.Tech CSE");
  const [semester, setSemester] = useState("Semester 5");
  const [referenceSet, setReferenceSet] = useState("Last 5 years question papers + industry skills trend");

  const context = [
    `Programme: ${programme}`,
    `Semester: ${semester}`,
    `Reference Data: ${referenceSet}`,
    "Need: over-tested vs under-taught topic map and actionable curriculum revision recommendations.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Programme" value={programme} setValue={setProgramme} />
        <Input label="Semester" value={semester} setValue={setSemester} />
        <Input label="Reference Set" value={referenceSet} setValue={setReferenceSet} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<BookOpenCheck className="w-6 h-6 text-cyan-600 mb-3" />} title="Audit Syllabus" desc="Gap analysis with exam/skill trend alignment." onClick={() => onExecute("Audit Syllabus", context)} disabled={isExecuting} />
        <ActionCard icon={<ShieldCheck className="w-6 h-6 text-cyan-600 mb-3" />} title="NEP Compliance" desc="NEP 2020 policy readiness checks." onClick={() => onExecute("NEP Compliance", context)} disabled={isExecuting} />
        <ActionCard icon={<TrendingUp className="w-6 h-6 text-cyan-600 mb-3" />} title="Industry Alignment" desc="Compare syllabus with role-demand skills." onClick={() => onExecute("Industry Alignment", context)} disabled={isExecuting} />
        <ActionCard icon={<FileBarChart className="w-6 h-6 text-cyan-600 mb-3" />} title="Generate Audit Report" desc="Produce department-ready summary report." onClick={() => onExecute("Generate Audit Report", context)} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-cyan-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
