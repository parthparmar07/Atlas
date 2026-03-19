"use client";

import { useState } from "react";
import { MessageSquare, FileText, Send, UserCheck, Calculator, Loader2 } from "lucide-react";

interface HRBotWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const QUICK_ACTIONS = [
  { label: "Check Leave Balance", action: "Process Leaves", icon: Calculator, desc: "How many casual leaves do I have left?" },
  { label: "Request Policy Notice", action: "Draft Notice", icon: FileText, desc: "Draft a notice for upcoming Diwali holidays" },
  { label: "Get Payroll Summary", action: "Payroll Summary", icon: MessageSquare, desc: "Give me a summary of my current basic and HRA" },
  { label: "Staff Onboarding", action: "Onboarding Checklist", icon: UserCheck, desc: "Create a checklist for a new Faculty joining CSE" },
];

export default function HRBotWorkflow({ agentId, onExecute, isExecuting }: HRBotWorkflowProps) {
  const [query, setQuery] = useState("");
  const [employeeId, setEmployeeId] = useState("EMP-2024-089");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const runQuery = (action: string, customQuery?: string) => {
    const context = [
      `Employee ID: ${employeeId}`,
      `Query: ${customQuery || query}`,
      `Action: ${action}`
    ].join("\n");
    
    setLastRan(action);
    onExecute(action, context);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Column: Chat / Direct Input */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">HR Chat Interface</h2>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6 flex-1 overflow-y-auto border border-slate-100 dark:border-slate-800 flex items-center justify-center">
            {!isExecuting && !lastRan ? (
              <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
                Bot is ready. Ask about policies, leave balance, or payroll.
              </div>
            ) : isExecuting ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="text-sm font-bold text-purple-600">Processing Your Request...</p>
              </div>
            ) : (
              <div className="text-center text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                Action "<span className="underline">{lastRan}</span>" Sent Successfully.
                <p className="font-medium text-xs mt-1 text-slate-500">Check terminal for output.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How many casual leaves do I have left?"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && runQuery("Process Leaves")}
            />
            <button
              onClick={() => runQuery("Process Leaves")}
              disabled={isExecuting || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isExecuting ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((a) => (
             <button 
               key={a.label}
               onClick={() => runQuery(a.action, a.desc)} 
               disabled={isExecuting}
               className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-6 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
             >
               <a.icon className="w-6 h-6 text-purple-400 mb-3 group-hover:text-purple-600 transition-colors" />
               <h3 className="font-bold text-slate-900 dark:text-white mb-1">{a.label}</h3>
               <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{a.desc}</p>
             </button>
          ))}
        </div>
      </div>

      {/* Right Column: Context Settings */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-6 h-6 text-purple-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Context</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Simulated Employee ID</label>
              <input 
                type="text" 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none"
              />
            </div>
            
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-2">HR Bot Capabilities</h4>
              <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-2 list-disc pl-4 font-medium">
                <li>Natural language understanding (EN/HI)</li>
                <li>ERP Integration: Leave, Payroll, Appraisals</li>
                <li>Policy Search ( Maharashtra Service Rules)</li>
                <li>Official Circular/Notice Generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
