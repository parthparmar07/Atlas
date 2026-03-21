import { useState } from "react";
import { ClipboardCheck, PackageSearch, ReceiptText, WalletCards } from "lucide-react";

interface ProcurementWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function ProcurementWorkflow({ onExecute, isExecuting }: ProcurementWorkflowProps) {
  const [department, setDepartment] = useState("Computer Science");
  const [category, setCategory] = useState("Lab Equipment");
  const [budgetBand, setBudgetBand] = useState("2L - 5L");

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Requesting Department: ${department}`,
      `Purchase Category: ${category}`,
      `Budget Band: ${budgetBand}`,
      "Requests[]:",
      "REQ-410 | department=Computer Science | title=50 Lab Monitors | value=420000 | vendor=TechCore | status=Raised",
      "REQ-422 | department=Chemistry | title=Reagents | value=96000 | vendor=LabLink | status=In Review",
      "REQ-436 | department=Mechanical | title=Tool Set | value=185000 | vendor=InduMart | status=Approved",
      "Orders[]:",
      "PO-1045 | vendor=TechCore | eta_days=7 | status=Dispatched",
      "PO-1068 | vendor=LabLink | eta_days=3 | status=Packed",
      "Invoices[]:",
      "INV-770 | vendor=TechCore | amount=210000 | due_in_days=5 | status=Pending",
      "INV-781 | vendor=InduMart | amount=92500 | due_in_days=2 | status=Approved",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Department" value={department} setValue={setDepartment} />
        <Input label="Category" value={category} setValue={setCategory} />
        <Input label="Budget Band" value={budgetBand} setValue={setBudgetBand} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard
          icon={<ClipboardCheck className="w-6 h-6 text-violet-600 mb-3" />}
          title="Process Requests"
          desc="Validate requisitions and issue POs."
          onClick={() => onExecute("Process Requests", buildContext("Process Requests", "request triage, policy checks, and PO recommendations"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<PackageSearch className="w-6 h-6 text-violet-600 mb-3" />}
          title="Track Orders"
          desc="Track delivery timelines and exceptions."
          onClick={() => onExecute("Track Orders", buildContext("Track Orders", "order tracking board with ETA risk and blockers"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<WalletCards className="w-6 h-6 text-violet-600 mb-3" />}
          title="Pay Vendors"
          desc="Prepare payment run with approvals and invoice checks."
          onClick={() => onExecute("Pay Vendors", buildContext("Pay Vendors", "vendor payment queue and approval sequence"))}
          disabled={isExecuting}
        />
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 flex items-start gap-3">
        <ReceiptText className="w-5 h-5 text-violet-700 mt-0.5" />
        <p className="text-sm text-violet-900">
          Workflow context includes department, category, and budget band so the agent can return approval-ready procurement artifacts.
        </p>
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
