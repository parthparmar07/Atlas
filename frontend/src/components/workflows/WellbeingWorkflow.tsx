import { useState } from "react";
import { HeartHandshake, Users, BookOpenCheck } from "lucide-react";

interface WellbeingWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function WellbeingWorkflow({ onExecute, isExecuting }: WellbeingWorkflowProps) {
  const [studentIssue, setStudentIssue] = useState("High stress before exams and sleep disruption");
  const [priority, setPriority] = useState("Medium");
  const [history, setHistory] = useState("No prior escalation, one mentor check-in pending");

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Student Issue: ${studentIssue}`,
      `Priority: ${priority}`,
      `Support History: ${history}`,
      "Recent Signals:",
      "Week 1 | mood=Low | attendance=68 | support_request=Yes",
      "Week 2 | mood=Moderate | attendance=74 | support_request=Yes",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Student Issue" value={studentIssue} setValue={setStudentIssue} />
        <Input label="Priority" value={priority} setValue={setPriority} />
        <Input label="Support History" value={history} setValue={setHistory} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard icon={<HeartHandshake className="w-6 h-6 text-rose-600 mb-3" />} title="Connect with a Counselor" desc="Route to counselor with context summary." onClick={() => onExecute("Connect with a Counselor", buildContext("Connect with a Counselor", "counselor routing, urgency notes, and follow-up plan"))} disabled={isExecuting} />
        <ActionCard icon={<Users className="w-6 h-6 text-rose-600 mb-3" />} title="Find a Support Group" desc="Match suitable support circles." onClick={() => onExecute("Find a Support Group", buildContext("Find a Support Group", "support-group shortlist with suitability rationale"))} disabled={isExecuting} />
        <ActionCard icon={<BookOpenCheck className="w-6 h-6 text-rose-600 mb-3" />} title="Access Self-Help Resources" desc="Generate self-help starter resource pack." onClick={() => onExecute("Access Self-Help Resources", buildContext("Access Self-Help Resources", "resource kit with stepwise usage guidance"))} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-rose-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
