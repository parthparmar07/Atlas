"use client";

import { useState } from "react";
import { Monitor, Laptop, Key, Loader2, CheckCircle2, Ticket } from "lucide-react";

interface ITSupportWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

const ACTIONS = [
  { key: "Troubleshoot Issue", label: "Triage Incident", icon: Monitor, color: "blue", desc: "Process incident, classify severity (P1/P2/P3), assign queue and generate remediation." },
  { key: "Request Equipment", label: "Equipment Request", icon: Laptop, color: "cyan", desc: "Process procurement request, validate context, assign fulfillment state and approval path." },
  { key: "Access IT Services", label: "Access Control", icon: Key, color: "blue", desc: "Process role-based access request, validate eligibility and required approvals." },
];

export default function ITSupportWorkflow({ onExecute, isExecuting }: ITSupportWorkflowProps) {
  const [ticketId, setTicketId] = useState("INC-2024-501");
  const [severity, setSeverity] = useState("P2");
  const [lastRan, setLastRan] = useState<string | null>(null);

  const run = (actionKey: string) => {
    const context = `Ticket ID: ${ticketId}\nSeverity: ${severity}\nAction: ${actionKey}`;
    setLastRan(actionKey);
    onExecute(actionKey, context);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Ticket className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">IT Service Operations</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Reference ID (Ticket/Asset)</label>
            <input value={ticketId} onChange={(e) => setTicketId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority / Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold">
              <option>P1 - Critical</option>
              <option>P2 - High</option>
              <option>P3 - Normal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => run(a.key)}
              disabled={isExecuting}
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center justify-between mb-3">
                <a.icon className="w-6 h-6 text-blue-500" />
                {isExecuting && lastRan === a.key && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{a.label}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {lastRan && !isExecuting && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span><span className="font-black">{lastRan}</span> executed. IT triage results available in the output drawer.</span>
        </div>
      )}
    </div>
  );
}
