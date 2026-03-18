import { useState } from "react";
import { Bell, ClipboardCheck, FileText } from "lucide-react";

interface AppraisalWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function AppraisalWorkflow({ onExecute, isExecuting }: AppraisalWorkflowProps) {
  const [cycle, setCycle] = useState("2025-26 Annual");
  const [department, setDepartment] = useState("Computer Science");
  const [kpiWeights, setKpiWeights] = useState("Research=30, Teaching=35, Feedback=20, Admin=15");
  const [facultyBatch, setFacultyBatch] = useState("FAC-1002, FAC-1011, FAC-1044");

  const run = (action: string) => {
    const context = [
      `Cycle: ${cycle}`,
      `Department: ${department}`,
      `KPI Weights: ${kpiWeights}`,
      `Faculty Batch: ${facultyBatch}`,
      "Required Outputs: KPI scorecards, summary rationale, and review-ready recommendations.",
    ].join("\n");
    onExecute(action, context);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardCheck className="w-6 h-6 text-violet-500" />
          <h2 className="text-xl font-bold text-slate-900">Appraisal Cycle Context</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cycle</label>
            <input value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">KPI Weights</label>
            <input value={kpiWeights} onChange={(e) => setKpiWeights(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Faculty IDs</label>
            <input value={facultyBatch} onChange={(e) => setFacultyBatch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => run("Run Appraisal")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60"
        >
          <ClipboardCheck className="w-6 h-6 text-violet-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Run Appraisal</h3>
          <p className="text-xs text-slate-500">Execute appraisal scoring for selected faculty using cycle context.</p>
        </button>

        <button
          onClick={() => run("Generate Report")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60"
        >
          <FileText className="w-6 h-6 text-violet-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Generate Report</h3>
          <p className="text-xs text-slate-500">Build HR-ready KPI report with strengths, gaps, and actions.</p>
        </button>

        <button
          onClick={() => run("Notify Faculty")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60"
        >
          <Bell className="w-6 h-6 text-violet-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Notify Faculty</h3>
          <p className="text-xs text-slate-500">Generate communication draft for faculty appraisal outcomes.</p>
        </button>
      </div>
    </div>
  );
}
