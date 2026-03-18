import { useState } from "react";
import { BellRing, Calculator, ReceiptIndianRupee, Scale } from "lucide-react";

interface FeeCollectionWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function FeeCollectionWorkflow({ onExecute, isExecuting }: FeeCollectionWorkflowProps) {
  const [term, setTerm] = useState("Semester 6");
  const [programme, setProgramme] = useState("All Programmes");
  const [overdueBand, setOverdueBand] = useState("7-30 days");

  const context = [
    `Fee Term: ${term}`,
    `Programme Scope: ${programme}`,
    `Overdue Segment: ${overdueBand}`,
    "Need: dues summary, reminder sequencing, recovery strategy and compliance-safe notices.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Fee Term" value={term} setValue={setTerm} />
        <Input label="Programme Scope" value={programme} setValue={setProgramme} />
        <Input label="Overdue Segment" value={overdueBand} setValue={setOverdueBand} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<ReceiptIndianRupee className="w-6 h-6 text-red-600 mb-3" />} title="Collect Dues" desc="Compute paid/partial/default cohorts and amount due." onClick={() => onExecute("Collect Dues", context)} disabled={isExecuting} />
        <ActionCard icon={<BellRing className="w-6 h-6 text-red-600 mb-3" />} title="Send Reminders" desc="Draft segmented reminder messages with payment links." onClick={() => onExecute("Send Reminders", context)} disabled={isExecuting} />
        <ActionCard icon={<Calculator className="w-6 h-6 text-red-600 mb-3" />} title="Defaulter Report" desc="Generate finance committee defaulter intelligence report." onClick={() => onExecute("Defaulter Report", context)} disabled={isExecuting} />
        <ActionCard icon={<Scale className="w-6 h-6 text-red-600 mb-3" />} title="Recovery Plan" desc="Create chronic defaulter recovery and legal timeline." onClick={() => onExecute("Recovery Plan", context)} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-red-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
