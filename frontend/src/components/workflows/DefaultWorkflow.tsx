"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, TerminalSquare } from "lucide-react";
import { AgentConfig } from "@/components/agents/AgentPageTemplate";

interface DefaultWorkflowProps {
  config: AgentConfig;
  onExecute: (action: string, context: string) => Promise<void>;
  isExecuting: boolean;
}

export default function DefaultWorkflow({ config, onExecute, isExecuting }: DefaultWorkflowProps) {
  const [selectedAction, setSelectedAction] = useState<string>(config.actions[0]?.label || "");
  const [customContext, setCustomContext] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Auto-select first action if current selection is invalid after config update
  useEffect(() => {
    if (config.actions.length > 0 && (!selectedAction || !config.actions.find(a => a.label === selectedAction))) {
      setSelectedAction(config.actions[0].label);
    }
  }, [config.actions, selectedAction]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleRun = () => {
    if (!selectedAction) {
      alert("Please select an action to execute.");
      return;
    }

    const formLines = Object.entries(formData)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    
    const fullContext = [
      ...formLines,
      customContext
    ].filter(Boolean).join("\n");

    onExecute(selectedAction, fullContext);
  };

  const renderDomainFields = () => {
    const commonClass = "w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none text-sm font-bold";
    const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]";

    switch (config.domain) {
      case "Admissions & Leads":
        return (
          <>
            <div className="space-y-2">
              <label className={labelClass}>Batch/Cohort</label>
              <input type="text" placeholder="e.g. 2026-A" className={commonClass} onChange={(e) => handleInputChange("Batch", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Program Level</label>
              <select className={commonClass} onChange={(e) => handleInputChange("Program Level", e.target.value)}>
                <option value="">Select Level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctoral">Doctoral</option>
              </select>
            </div>
          </>
        );
      case "HR & Faculty":
        return (
          <>
            <div className="space-y-2">
              <label className={labelClass}>Department</label>
              <input type="text" placeholder="e.g. Computer Science" className={commonClass} onChange={(e) => handleInputChange("Department", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Employee/Faculty ID</label>
              <input type="text" placeholder="e.g. AT-1024" className={commonClass} onChange={(e) => handleInputChange("Entity ID", e.target.value)} />
            </div>
          </>
        );
      case "Academics":
        return (
          <>
            <div className="space-y-2">
              <label className={labelClass}>Semester</label>
              <select className={commonClass} onChange={(e) => handleInputChange("Semester", e.target.value)}>
                <option value="">Select Sem</option>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Course Code</label>
              <input type="text" placeholder="e.g. CS301" className={commonClass} onChange={(e) => handleInputChange("Course Code", e.target.value)} />
            </div>
          </>
        );
      case "Finance":
        return (
          <>
            <div className="space-y-2">
              <label className={labelClass}>Financial Year</label>
              <input type="text" placeholder="e.g. FY 2026-27" className={commonClass} onChange={(e) => handleInputChange("FY", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Budget Category</label>
              <select className={commonClass} onChange={(e) => handleInputChange("Budget Category", e.target.value)}>
                <option value="">Select Category</option>
                <option value="Operational">Operational</option>
                <option value="Capital">Capital</option>
                <option value="Grants">Grants</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
          <TerminalSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Standard Workflow Engine</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Action</label>
          <select 
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none text-sm font-bold"
          >
            <option value="" disabled>-- Choose an action --</option>
            {config.actions.map(action => (
              <option key={action.label} value={action.label}>{action.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {renderDomainFields()}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Additional Context / Special Instructions</label>
          <textarea
            className="w-full min-h-[100px] p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
            placeholder="Provide any specific details, overrides, or instructions for the agent..."
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleRun}
            disabled={isExecuting || !selectedAction}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Execute Action
          </button>
        </div>
      </div>
    </div>
  );
}
