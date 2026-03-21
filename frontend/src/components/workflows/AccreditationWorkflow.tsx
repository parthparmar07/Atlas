import { useState } from "react";
import { CheckSquare, FileText, UploadCloud } from "lucide-react";

interface AccreditationWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function AccreditationWorkflow({ onExecute, isExecuting }: AccreditationWorkflowProps) {
  const [body, setBody] = useState("NAAC");
  const [year, setYear] = useState("2026");

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Target Body: ${body}`,
      `Assessment Year: ${year}`,
      "Criteria Data[]:",
      "NAAC 3.4.3 | score=2.9 | evidence_count=6 | status=At Risk",
      "NBA Outcome Metrics | score=3.6 | evidence_count=14 | status=Met",
      "NIRF Outreach | score=0.0 | evidence_count=1 | status=Missing",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-2 gap-4">
        <Input label="Accrediting Body" value={body} setValue={setBody} />
        <Input label="Cycle Year" value={year} setValue={setYear} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard
          icon={<CheckSquare className="w-6 h-6 text-red-600 mb-3" />}
          title="Audit Compliance"
          desc="Assess criterion-level compliance and risk."
          onClick={() => onExecute("Audit Compliance", buildContext("Audit Compliance", "criterion compliance map with risk priority"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<UploadCloud className="w-6 h-6 text-red-600 mb-3" />}
          title="Prepare Documentation"
          desc="Generate missing evidence checklist and ownership."
          onClick={() => onExecute("Prepare Documentation", buildContext("Prepare Documentation", "documentation pack with missing evidence and owner mapping"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<FileText className="w-6 h-6 text-red-600 mb-3" />}
          title="Generate Report"
          desc="Produce consolidated readiness report."
          onClick={() => onExecute("Generate Report", buildContext("Generate Report", "accreditation report with score summary and closure plan"))}
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-red-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
