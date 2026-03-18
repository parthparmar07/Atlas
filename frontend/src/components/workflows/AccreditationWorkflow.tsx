import { useState } from "react";
import { CheckSquare, FileText, UploadCloud, AlertCircle } from "lucide-react";

interface AccreditationWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function AccreditationWorkflow({ agentId, onExecute, isExecuting }: AccreditationWorkflowProps) {
  const [body, setBody] = useState("NAAC");
  const [year, setYear] = useState("2026");

  const runAction = (action: string) => {
    const context = `Target Body: ${body}\nAssessment Year: ${year}`;
    onExecute(action, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Accrediting Body</label>
            <select 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="NAAC">NAAC (National Assessment and Accreditation Council)</option>
              <option value="NBA">NBA (National Board of Accreditation)</option>
              <option value="NIRF">NIRF Ranking</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cycle Year</label>
            <input 
              type="text" 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => runAction("Audit Compliance")}
            disabled={isExecuting}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            <CheckSquare className="w-10 h-10 text-red-500 mb-4" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">Audit Compliance</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">Check current metrics against {body} guidelines</span>
          </button>

          <button
            onClick={() => runAction("Prepare Documentation")}
            disabled={isExecuting}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-10 h-10 text-red-500 mb-4" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">Auto-Compile Docs</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">Gather required proofs and SSR documents</span>
          </button>

          <button
            onClick={() => runAction("Generate Report")}
            disabled={isExecuting}
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            <FileText className="w-10 h-10 text-red-500 mb-4" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">Readiness Report</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">Generate final gap analysis report</span>
          </button>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Continuous Compliance Engine</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            This agent dynamically loads the latest {body} criteria using vector search and directly queries the finance and academic ERPs to assess real-time readiness.
          </p>
        </div>
      </div>
    </div>
  );
}
