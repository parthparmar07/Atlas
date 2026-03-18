import { useState } from "react";
import { Building2, CalendarRange, FileSearch, Target } from "lucide-react";

interface PlacementIntelligenceWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function PlacementIntelligenceWorkflow({ onExecute, isExecuting }: PlacementIntelligenceWorkflowProps) {
  const [batch, setBatch] = useState("B.Tech CSE 2026");
  const [companies, setCompanies] = useState("TCS, Infosys, Wipro, Accenture, Capgemini");
  const [skills, setSkills] = useState("DSA, SQL, Python, OOP, React, Cloud Basics");

  const context = [
    `Batch: ${batch}`,
    `Target Companies: ${companies}`,
    `Current Skill Profile: ${skills}`,
    "Need: company matching, skill-gap intelligence, and outreach prioritization.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Batch" value={batch} setValue={setBatch} />
        <Input label="Target Companies" value={companies} setValue={setCompanies} />
        <Input label="Skill Profile" value={skills} setValue={setSkills} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<Target className="w-6 h-6 text-emerald-600 mb-3" />} title="Run Predictor" desc="Predict placement probabilities and CTC bands." onClick={() => onExecute("Run Predictor", context)} disabled={isExecuting} />
        <ActionCard icon={<Building2 className="w-6 h-6 text-emerald-600 mb-3" />} title="Match Companies" desc="Map students to visiting companies with fit scores." onClick={() => onExecute("Match Companies", context)} disabled={isExecuting} />
        <ActionCard icon={<CalendarRange className="w-6 h-6 text-emerald-600 mb-3" />} title="Outreach Calendar" desc="Generate drive and outreach strategy calendar." onClick={() => onExecute("Outreach Calendar", context)} disabled={isExecuting} />
        <ActionCard icon={<FileSearch className="w-6 h-6 text-emerald-600 mb-3" />} title="Generate Report" desc="Build monthly placement intelligence report." onClick={() => onExecute("Generate Report", context)} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
