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
  const [policyMode, setPolicyMode] = useState("Scholarship-aware recovery");
  const [hrEscalationOwner, setHrEscalationOwner] = useState("Student Welfare + HR Support Cell");
  const [feeRows, setFeeRows] = useState(
    "Arjun Rao|CSE S6|42500|2026-03-25|Paid|WhatsApp|0|No|Connected\nRitika Das|ECE S4|38000|2026-03-22|Reminder Sent|Email|9|Yes|Pending\nSanjay Kumar|ME S2|46500|2026-03-18|Escalated|SMS|18|No|Not Reachable"
  );

  const recordRows = feeRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [student, program, amountDue, dueDate, status, channel, overdueDays, scholarshipHold, guardianReach] = line.split("|").map((part) => part.trim());
      return `FeeCase | student=${student || "Student"} | program=${program || "Program"} | amount_due=${amountDue || "0"} | due_date=${dueDate || "2026-03-30"} | status=${status || "Upcoming"} | channel=${channel || "Email"} | overdue_days=${overdueDays || "0"} | scholarship_hold=${scholarshipHold || "No"} | guardian_reach=${guardianReach || "Pending"}`;
    });

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Fee Term: ${term}`,
      `Programme Scope: ${programme}`,
      `Overdue Segment: ${overdueBand}`,
      `Policy Mode: ${policyMode}`,
      `HR Escalation Owner: ${hrEscalationOwner}`,
      "Fees[]: Provided",
      ...recordRows,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
      "Need: aging buckets, collection strategy, welfare-aware escalation, and weekly closure ownership.",
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Fee Term" value={term} setValue={setTerm} />
        <Input label="Programme Scope" value={programme} setValue={setProgramme} />
        <Input label="Overdue Segment" value={overdueBand} setValue={setOverdueBand} />
        <Input label="Policy Mode" value={policyMode} setValue={setPolicyMode} />
        <Input label="HR Escalation Owner" value={hrEscalationOwner} setValue={setHrEscalationOwner} />
        <TextArea
          label="Fee Rows (Student|Program|AmountDue|DueDate|Status|Channel|OverdueDays|ScholarshipHold|GuardianReach)"
          value={feeRows}
          setValue={setFeeRows}
          rows={5}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard
          icon={<ReceiptIndianRupee className="w-6 h-6 text-red-600 mb-3" />}
          title="Collect Dues"
          desc="Compute paid/partial/default cohorts and amount due."
          onClick={() => onExecute("Collect Dues", buildContext("Collect Dues", "dues summary by status, channel, and aging bucket"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<BellRing className="w-6 h-6 text-red-600 mb-3" />}
          title="Send Reminders"
          desc="Draft segmented reminder messages with payment links."
          onClick={() => onExecute("Send Reminders", buildContext("Send Reminders", "reminder queue with channel strategy and urgency"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Calculator className="w-6 h-6 text-red-600 mb-3" />}
          title="Defaulter Report"
          desc="Generate finance committee defaulter intelligence report."
          onClick={() => onExecute("Defaulter Report", buildContext("Defaulter Report", "defaulter ranking with risk score and owner"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Scale className="w-6 h-6 text-red-600 mb-3" />}
          title="Recovery Plan"
          desc="Create chronic defaulter recovery and legal timeline."
          onClick={() => onExecute("Recovery Plan", buildContext("Recovery Plan", "recovery plan with timeline and escalation path"))}
          disabled={isExecuting}
        />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-red-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
