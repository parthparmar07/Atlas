import { useState } from "react";
import { Building2, FileStack, Link2, UserCheck } from "lucide-react";

interface InternshipWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function InternshipWorkflow({ onExecute, isExecuting }: InternshipWorkflowProps) {
  const [batch, setBatch] = useState("3rd Year 2026");
  const [domains, setDomains] = useState("AI/ML, Full Stack, Cybersecurity, VLSI");
  const [partners, setPartners] = useState("Microsoft, Intel, Infosys, TCS");

  const context = [
    `Eligible Batch: ${batch}`,
    `Target Domains: ${domains}`,
    `Partner Pool: ${partners}`,
    "Need: matching logic, MOU readiness, reporting compliance and completion pipeline.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Eligible Batch" value={batch} setValue={setBatch} />
        <Input label="Target Domains" value={domains} setValue={setDomains} />
        <Input label="Partner Pool" value={partners} setValue={setPartners} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<UserCheck className="w-6 h-6 text-sky-600 mb-3" />} title="Match Now" desc="Run student-to-role matching with fit scores." onClick={() => onExecute("Match Now", context)} disabled={isExecuting} />
        <ActionCard icon={<Building2 className="w-6 h-6 text-sky-600 mb-3" />} title="Add Partner" desc="Draft onboarding + MOU plan for new partner." onClick={() => onExecute("Add Partner", context)} disabled={isExecuting} />
        <ActionCard icon={<FileStack className="w-6 h-6 text-sky-600 mb-3" />} title="Monthly Reports" desc="Generate internship progress and risk report." onClick={() => onExecute("Monthly Reports", context)} disabled={isExecuting} />
        <ActionCard icon={<Link2 className="w-6 h-6 text-sky-600 mb-3" />} title="Template Library" desc="Produce templates for logs, MOU and final evaluation." onClick={() => onExecute("Template Library", context)} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-sky-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
