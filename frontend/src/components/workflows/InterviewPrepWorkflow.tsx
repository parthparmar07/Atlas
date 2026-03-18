import { useState } from "react";
import { ClipboardList, Lightbulb, MessageSquareQuote } from "lucide-react";

interface InterviewPrepWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function InterviewPrepWorkflow({ onExecute, isExecuting }: InterviewPrepWorkflowProps) {
  const [student, setStudent] = useState("S-2026-142");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [jdSnippet, setJdSnippet] = useState("Python, DSA, SQL, system design basics, communication");

  const context = [
    `Student ID: ${student}`,
    `Target Role: ${targetRole}`,
    `JD Snippet: ${jdSnippet}`,
    "Need: role-specific interview prep artifacts with feedback and improvement tips.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Student ID" value={student} setValue={setStudent} />
        <Input label="Target Role" value={targetRole} setValue={setTargetRole} />
        <Input label="JD Snippet" value={jdSnippet} setValue={setJdSnippet} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard icon={<ClipboardList className="w-6 h-6 text-emerald-600 mb-3" />} title="Generate Questions" desc="Generate role-specific mock interview set." onClick={() => onExecute("Generate Questions", context)} disabled={isExecuting} />
        <ActionCard icon={<MessageSquareQuote className="w-6 h-6 text-emerald-600 mb-3" />} title="Review Answers" desc="Score and critique candidate responses." onClick={() => onExecute("Review Answers", context)} disabled={isExecuting} />
        <ActionCard icon={<Lightbulb className="w-6 h-6 text-emerald-600 mb-3" />} title="Provide Tips" desc="Generate focused improvement guidance." onClick={() => onExecute("Provide Tips", context)} disabled={isExecuting} />
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
