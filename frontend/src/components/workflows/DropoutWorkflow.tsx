import { useState } from "react";
import { AlertCircle, BellRing, LineChart, ShieldCheck } from "lucide-react";

interface DropoutWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function DropoutWorkflow({ onExecute, isExecuting }: DropoutWorkflowProps) {
  const [programme, setProgramme] = useState("All Programmes");
  const [lookback, setLookback] = useState("Last 30 Days");
  const [signals, setSignals] = useState("Attendance, Internal Marks, Fee Delay, LMS Activity, Mentoring Visits");
  const [hrPartner, setHrPartner] = useState("Student Success + HR Wellbeing Desk");
  const [studentRows, setStudentRows] = useState(
    "Aman Bansal|61|8|16|42\nSneha Rao|74|4|0|68\nRitika Jain|58|10|24|35\nRohan Mehta|82|2|0|79"
  );

  const recordRows = studentRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, attendance, assignmentLatency, feeDelayDays, lmsActivity] = line.split("|").map((part) => part.trim());
      return `Student | name=${name || "Student"} | attendance=${attendance || "75"} | assignment_latency=${assignmentLatency || "3"} | fee_delay_days=${feeDelayDays || "0"} | lms_activity=${lmsActivity || "70"}`;
    });

  const buildContext = (action: string) => {
    return [
      `Programme Scope: ${programme}`,
      `Lookback Window: ${lookback}`,
      `Signals: ${signals}`,
      `HR Partner: ${hrPartner}`,
      ...recordRows,
      `Action: ${action}`,
      "Need: risk buckets, counselor queue, HR-supported escalation path, and measurable intervention follow-up plan.",
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Programme Scope" value={programme} setValue={setProgramme} />
        <Input label="Lookback Window" value={lookback} setValue={setLookback} />
        <Input label="Risk Signals" value={signals} setValue={setSignals} />
        <Input label="HR Partner Lane" value={hrPartner} setValue={setHrPartner} />
        <TextArea
          label="Student Signals (Name|Attendance|AssignmentLatency|FeeDelayDays|LMSActivity)"
          value={studentRows}
          setValue={setStudentRows}
          rows={5}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<LineChart className="w-6 h-6 text-rose-600 mb-3" />} title="Run Prediction" desc="Compute current high/medium/low risk cohorts." onClick={() => onExecute("Run Prediction", buildContext("Run Prediction"))} disabled={isExecuting} />
        <ActionCard icon={<ShieldCheck className="w-6 h-6 text-rose-600 mb-3" />} title="Intervention Plan" desc="Generate counselor-led action plans per risk profile." onClick={() => onExecute("Intervention Plan", buildContext("Intervention Plan"))} disabled={isExecuting} />
        <ActionCard icon={<BellRing className="w-6 h-6 text-rose-600 mb-3" />} title="Early Warning" desc="Build this week priority intervention alert queue." onClick={() => onExecute("Early Warning", buildContext("Early Warning"))} disabled={isExecuting} />
        <ActionCard icon={<AlertCircle className="w-6 h-6 text-rose-600 mb-3" />} title="Trend Analysis" desc="Review multi-year dropout patterns and drivers." onClick={() => onExecute("Trend Analysis", buildContext("Trend Analysis"))} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-rose-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
