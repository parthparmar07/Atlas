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
  const [policyTrack, setPolicyTrack] = useState("3-bid + safety validation");
  const [hrSafetyLead, setHrSafetyLead] = useState("Campus Operations HR Safety Lead");
  const [requestRows, setRequestRows] = useState(
    "REQ-410|Computer Science|50 Lab Monitors|420000|TechCore|Raised|No\nREQ-422|Chemistry|Reagents|96000|LabLink|In Review|Yes\nREQ-436|Mechanical|Tool Set|185000|InduMart|Approved|No"
  );
  const [orderRows, setOrderRows] = useState("PO-1045|TechCore|7|Dispatched\nPO-1068|LabLink|3|Packed");
  const [invoiceRows, setInvoiceRows] = useState("INV-770|TechCore|210000|5|Pending\nINV-781|InduMart|92500|2|Approved");

  const requestContextRows = requestRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [reqId, reqDept, title, value, vendor, status, safetySensitive] = line.split("|").map((part) => part.trim());
      return `Request | request_id=${reqId || "REQ-100"} | department=${reqDept || "Department"} | title=${title || "Requirement"} | value=${value || "0"} | vendor=${vendor || "Vendor TBD"} | status=${status || "Raised"} | safety_sensitive=${safetySensitive || "No"}`;
    });

  const orderContextRows = orderRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [poId, vendor, etaDays, status] = line.split("|").map((part) => part.trim());
      return `Order | po_id=${poId || "PO-1000"} | vendor=${vendor || "Vendor TBD"} | eta_days=${etaDays || "5"} | status=${status || "In Transit"}`;
    });

  const invoiceContextRows = invoiceRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [invoiceId, vendor, amount, dueInDays, status] = line.split("|").map((part) => part.trim());
      return `Invoice | invoice_id=${invoiceId || "INV-1000"} | vendor=${vendor || "Vendor TBD"} | amount=${amount || "0"} | due_in_days=${dueInDays || "5"} | status=${status || "Pending"}`;
    });

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Requesting Department: ${department}`,
      `Purchase Category: ${category}`,
      `Budget Band: ${budgetBand}`,
      `Policy Track: ${policyTrack}`,
      `HR Safety Lead: ${hrSafetyLead}`,
      "Requests[]: Provided",
      "Orders[]: Provided",
      "Invoices[]: Provided",
      ...requestContextRows,
      ...orderContextRows,
      ...invoiceContextRows,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
      "Need: policy checks, ETA risk, vendor-payment sequencing, and safety/compliance owners.",
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Department" value={department} setValue={setDepartment} />
        <Input label="Category" value={category} setValue={setCategory} />
        <Input label="Budget Band" value={budgetBand} setValue={setBudgetBand} />
        <Input label="Policy Track" value={policyTrack} setValue={setPolicyTrack} />
        <Input label="HR Safety Lead" value={hrSafetyLead} setValue={setHrSafetyLead} />
        <TextArea label="Requests (ReqID|Dept|Title|Value|Vendor|Status|SafetySensitive)" value={requestRows} setValue={setRequestRows} rows={4} />
        <TextArea label="Orders (POID|Vendor|ETADays|Status)" value={orderRows} setValue={setOrderRows} rows={3} />
        <TextArea label="Invoices (InvoiceID|Vendor|Amount|DueInDays|Status)" value={invoiceRows} setValue={setInvoiceRows} rows={3} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
