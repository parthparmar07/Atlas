import { useState } from "react";
import { MessageSquare, FileText, Send, UserCheck, Calculator } from "lucide-react";

interface HRBotWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function HRBotWorkflow({ agentId, onExecute, isExecuting }: HRBotWorkflowProps) {
  const [query, setQuery] = useState("");
  const [employeeId, setEmployeeId] = useState("EMP-2024-089");

  const runQuery = (action: string, customQuery?: string) => {
    const context = `Employee ID: ${employeeId}\nQuery: ${customQuery || query}`;
    onExecute(action, context);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Chat / Direct Input */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">HR Chat Interface</h2>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6 h-64 overflow-y-auto border border-slate-100 dark:border-slate-800">
            <div className="text-center text-slate-400 dark:text-slate-500 text-sm mt-20">
              Agent is ready. Ask about policies, leave balance, or payroll.
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How many casual leaves do I have left?"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && runQuery("Process Leave Requests")}
            />
            <button
              onClick={() => runQuery("Process Leave Requests")}
              disabled={isExecuting || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isExecuting ? "Processing..." : "Ask Bot"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button onClick={() => runQuery("HR Policy Lookup", "Draft a notice for upcoming Diwali holidays")} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl hover:border-purple-400 transition-colors text-left group">
             <FileText className="w-6 h-6 text-purple-400 mb-3 group-hover:text-purple-600 transition-colors" />
             <h3 className="font-bold text-slate-900 dark:text-white mb-1">HR Policy Lookup</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Check leave rules, allowances & service norms</p>
           </button>
           <button onClick={() => runQuery("Analyse Faculty Load", "Generate load analysis for all departments")} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl hover:border-purple-400 transition-colors text-left group">
             <Calculator className="w-6 h-6 text-purple-400 mb-3 group-hover:text-purple-600 transition-colors" />
             <h3 className="font-bold text-slate-900 dark:text-white mb-1">Analyse Faculty Load</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Detect overload & rebalancing needs</p>
           </button>
        </div>
      </div>

      {/* Right Column: Context Settings */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-6 h-6 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Context</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Simulated Employee ID</label>
              <input 
                type="text" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
            
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-2">HR Bot Capabilities</h4>
              <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-2 list-disc pl-4">
                <li>Understands natural language</li>
                <li>Connects to ERP & Payroll</li>
                <li>Verifies policies instantly</li>
                <li>Automates notices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
