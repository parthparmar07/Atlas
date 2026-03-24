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
  const [slaPolicy, setSlaPolicy] = useState("Ragging/POSH:24h | Academic:5d | Admin:3d");
  const [hrEscalationOwner, setHrEscalationOwner] = useState("HR Conduct Desk");
  const [grievanceRows, setGrievanceRows] = useState(
    "GR-101|Academic|high|HOD Office|24h|open\nGR-102|Infrastructure|medium|Admin Office|72h|open\nGR-103|POSH|critical|ICC|24h|open\nGR-104|Administrative|low|Registrar|5d|resolved"
  );

  const caseRows = grievanceRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, category, severity, owner, sla, status] = line.split("|").map((part) => part.trim());
      return `Case | id=${id || "GR-000"} | category=${category || "Academic"} | severity=${severity || "medium"} | owner=${owner || "Student Affairs"} | sla=${sla || "5d"} | status=${status || "open"}`;
    });

  const buildContext = (action: string) => {
    return [
      `Reporting Window: ${windowPeriod}`,
      `Priority Focus: ${priority}`,
      `Input Channels: ${channels}`,
      `SLA Policy: ${slaPolicy}`,
      `HR Escalation Owner: ${hrEscalationOwner}`,
      ...caseRows,
      `Action: ${action}`,
      "Need: categorization, routing, SLA tracking, anonymization controls, and escalation evidence.",
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Reporting Window" value={windowPeriod} setValue={setWindowPeriod} />
        <Input label="Priority Focus" value={priority} setValue={setPriority} />
        <Input label="Input Channels" value={channels} setValue={setChannels} />
        <Input label="SLA Policy" value={slaPolicy} setValue={setSlaPolicy} />
        <Input label="HR Escalation Owner" value={hrEscalationOwner} setValue={setHrEscalationOwner} />
        <TextArea
          label="Grievance Rows (ID|Category|Severity|Owner|SLA|Status)"
          value={grievanceRows}
          setValue={setGrievanceRows}
          rows={5}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<FileWarning className="w-6 h-6 text-indigo-600 mb-3" />} title="Process Grievances" desc="Categorize incoming complaints and route owners." onClick={() => onExecute("Process Grievances", buildContext("Process Grievances"))} disabled={isExecuting} />
        <ActionCard icon={<Siren className="w-6 h-6 text-indigo-600 mb-3" />} title="Escalation Report" desc="List SLA breaches and escalation pipeline status." onClick={() => onExecute("Escalation Report", buildContext("Escalation Report"))} disabled={isExecuting} />
        <ActionCard icon={<Shield className="w-6 h-6 text-indigo-600 mb-3" />} title="Anonymise Report" desc="Generate privacy-safe grievance trends for IQAC." onClick={() => onExecute("Anonymise Report", buildContext("Anonymise Report"))} disabled={isExecuting} />
        <ActionCard icon={<Gauge className="w-6 h-6 text-indigo-600 mb-3" />} title="SLA Dashboard" desc="Produce compliance metrics by category and owner." onClick={() => onExecute("SLA Dashboard", buildContext("SLA Dashboard"))} disabled={isExecuting} />
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  setValue,
  rows = 4,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="col-span-3">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
      />
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
