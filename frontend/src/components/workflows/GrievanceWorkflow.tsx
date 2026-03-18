import { useState } from "react";
import { FileWarning, Gauge, Shield, Siren } from "lucide-react";

interface GrievanceWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function GrievanceWorkflow({ onExecute, isExecuting }: GrievanceWorkflowProps) {
  const [windowPeriod, setWindowPeriod] = useState("Current Month");
  const [priority, setPriority] = useState("High + Critical");
  const [channels, setChannels] = useState("Portal, Email, Anonymous Box");

  const context = [
    `Reporting Window: ${windowPeriod}`,
    `Priority Focus: ${priority}`,
    `Input Channels: ${channels}`,
    "Need: categorization, routing, SLA tracking, and escalation evidence.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Reporting Window" value={windowPeriod} setValue={setWindowPeriod} />
        <Input label="Priority Focus" value={priority} setValue={setPriority} />
        <Input label="Input Channels" value={channels} setValue={setChannels} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<FileWarning className="w-6 h-6 text-indigo-600 mb-3" />} title="Process Grievances" desc="Categorize incoming complaints and route owners." onClick={() => onExecute("Process Grievances", context)} disabled={isExecuting} />
        <ActionCard icon={<Siren className="w-6 h-6 text-indigo-600 mb-3" />} title="Escalation Report" desc="List SLA breaches and escalation pipeline status." onClick={() => onExecute("Escalation Report", context)} disabled={isExecuting} />
        <ActionCard icon={<Shield className="w-6 h-6 text-indigo-600 mb-3" />} title="Anonymise Report" desc="Generate privacy-safe grievance trends for IQAC." onClick={() => onExecute("Anonymise Report", context)} disabled={isExecuting} />
        <ActionCard icon={<Gauge className="w-6 h-6 text-indigo-600 mb-3" />} title="SLA Dashboard" desc="Produce compliance metrics by category and owner." onClick={() => onExecute("SLA Dashboard", context)} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
