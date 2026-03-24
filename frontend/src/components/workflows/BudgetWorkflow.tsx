import { useState } from "react";
import { TrendingDown, AlertTriangle } from "lucide-react";

interface BudgetWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function BudgetWorkflow({ onExecute, isExecuting }: BudgetWorkflowProps) {
  const [department, setDepartment] = useState("All Departments");
  const [quarter, setQuarter] = useState("Q3 2026");
  const [releaseMode, setReleaseMode] = useState("Rolling release");
  const [hrCostOwner, setHrCostOwner] = useState("HR Workforce Planning Cell");
  const [budgetRows, setBudgetRows] = useState(
    "Computer Science|12000000|8900000|2|31|On Track\nECE|8600000|7800000|1|18|Warning\nCentral Facilities|6400000|6400000|3|5|Critical"
  );
  const [txRows, setTxRows] = useState(
    "TX-1901|Computer Science|420000|Lab|No|Approved\nTX-1936|ECE|96000|Consumables|No|Approved\nTX-1982|Central Facilities|185000|Maintenance|Yes|Bypass"
  );

  const budgetContextRows = budgetRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [dept, allocated, spent, pendingApprovals, headcountGap, status] = line.split("|").map((part) => part.trim());
      return `Budget | department=${dept || "Department"} | allocated=${allocated || "0"} | spent=${spent || "0"} | pending_approvals=${pendingApprovals || "0"} | headcount_gap=${headcountGap || "0"} | status=${status || "On Track"}`;
    });

  const txContextRows = txRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [txId, dept, amount, category, duplicateFlag, approvalTrail] = line.split("|").map((part) => part.trim());
      return `Transaction | tx_id=${txId || "TX-1000"} | dept=${dept || "Department"} | amount=${amount || "0"} | category=${category || "General"} | duplicate_flag=${duplicateFlag || "No"} | approval_trail=${approvalTrail || "Approved"}`;
    });

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Department: ${department}`,
      `Quarter: ${quarter}`,
      `Release Mode: ${releaseMode}`,
      `HR Cost Owner: ${hrCostOwner}`,
      "Budgets[]: Provided",
      "Transactions[]: Provided",
      ...budgetContextRows,
      ...txContextRows,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
      "Need: burn trend, anomaly confidence, spend controls, and owner-tagged approvals.",
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-2 gap-4">
        <Input label="Department" value={department} setValue={setDepartment} />
        <Input label="Quarter" value={quarter} setValue={setQuarter} />
        <Input label="Release Mode" value={releaseMode} setValue={setReleaseMode} />
        <Input label="HR Cost Owner" value={hrCostOwner} setValue={setHrCostOwner} />
        <TextArea label="Budget Rows (Dept|Allocated|Spent|PendingApprovals|HeadcountGap|Status)" value={budgetRows} setValue={setBudgetRows} rows={4} />
        <TextArea label="Transactions (TxID|Dept|Amount|Category|DuplicateFlag|ApprovalTrail)" value={txRows} setValue={setTxRows} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          icon={<TrendingDown className="w-6 h-6 text-blue-600 mb-3" />}
          title="Analyze Burn Rate"
          desc="Evaluate spend behavior against allocations."
          onClick={() => onExecute("Analyze Burn Rate", buildContext("Analyze Burn Rate", "burn analysis, variance table, and runway estimate"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<AlertTriangle className="w-6 h-6 text-blue-600 mb-3" />}
          title="Detect Anomalies"
          desc="Detect suspicious or duplicate transaction patterns."
          onClick={() => onExecute("Detect Anomalies", buildContext("Detect Anomalies", "anomaly flags with confidence and control actions"))}
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
    <div className="col-span-2">
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-blue-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
