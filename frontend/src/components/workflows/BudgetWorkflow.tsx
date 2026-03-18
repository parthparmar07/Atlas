import { useState } from "react";
import { DollarSign, FileText, AlertTriangle, TrendingDown } from "lucide-react";

interface BudgetWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function BudgetWorkflow({ agentId, onExecute, isExecuting }: BudgetWorkflowProps) {
  const [department, setDepartment] = useState("All Departments");
  const [quarter, setQuarter] = useState("Q3 2026");

  const runAction = (action: string) => {
    const context = `Department: ${department}\nQuarter: ${quarter}`;
    onExecute(action, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Department</label>
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Mechanical Engineering</option>
              <option>Library</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Quarter</label>
            <input 
              type="text" 
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => runAction("Analyze Burn Rate")}
            disabled={isExecuting}
            className="flex flex-col items-start p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all disabled:opacity-50 group text-left"
          >
            <TrendingDown className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">Analyze Burn Rate</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">Evaluate current expenditure vs allocated limits</span>
          </button>

          <button
            onClick={() => runAction("Detect Anomalies")}
            disabled={isExecuting}
            className="flex flex-col items-start p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all disabled:opacity-50 group text-left"
          >
            <AlertTriangle className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900 dark:text-white text-lg">Detect Anomalies</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">Scan transaction logs for duplicate or suspicious invoices</span>
          </button>
        </div>
      </div>
    </div>
  );
}
