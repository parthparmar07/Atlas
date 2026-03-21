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

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Department: ${department}`,
      `Quarter: ${quarter}`,
      "Budget Lines[]:",
      "Computer Science | allocated=12000000 | spent=8900000 | pending_approvals=2 | status=On Track",
      "ECE | allocated=8600000 | spent=7800000 | pending_approvals=1 | status=Warning",
      "Central Facilities | allocated=6400000 | spent=6400000 | pending_approvals=3 | status=Critical",
      "Transactions[]:",
      "TX-1901 | dept=Computer Science | amount=420000 | category=Lab | duplicate_flag=No",
      "TX-1936 | dept=ECE | amount=96000 | category=Consumables | duplicate_flag=No",
      "TX-1982 | dept=Central Facilities | amount=185000 | category=Maintenance | duplicate_flag=Yes",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-2 gap-4">
        <Input label="Department" value={department} setValue={setDepartment} />
        <Input label="Quarter" value={quarter} setValue={setQuarter} />
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
