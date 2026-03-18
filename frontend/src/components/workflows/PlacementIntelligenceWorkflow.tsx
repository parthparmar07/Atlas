import { useState } from "react";
import { Building2, FileSearch, BarChart2, Users, BookOpen, Star } from "lucide-react";

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
    "Need: JD analysis, company matching, skill-gap intelligence, resume review, interview prep, and outreach strategy.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Batch" value={batch} setValue={setBatch} />
        <Input label="Target Companies" value={companies} setValue={setCompanies} />
        <Input label="Skill Profile" value={skills} setValue={setSkills} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard
          icon={<FileSearch className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Analyse Job Descriptions"
          desc="Extract skills, qualifications, screen criteria and map to curriculum coverage score."
          onClick={() => onExecute("Analyse Job Descriptions", context)}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Users className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Match Students to Jobs"
          desc="Score each student 0–100 per active opening. Surface top 3 fits with reasoning."
          onClick={() => onExecute("Match Students to Jobs", context)}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<BarChart2 className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Analyse Batch Skill Gaps"
          desc="Identify top 5 high-demand skills missing from batch. Recommend workshops to close gaps."
          onClick={() => onExecute("Analyse Batch Skill Gaps", context)}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<BookOpen className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Review Resumes"
          desc="Score resumes, rewrite weak bullet points, check ATS keyword compatibility."
          onClick={() => onExecute("Review Resumes", context)}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Star className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Prepare for Interviews"
          desc="Generate role-specific Q&A packs, STAR answers, and weak-point coaching."
          onClick={() => onExecute("Prepare for Interviews", context)}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Building2 className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Manage Company Pipeline"
          desc="Tier companies, generate outreach letters, track season progress and offers."
          onClick={() => onExecute("Manage Company Pipeline", context)}
          disabled={isExecuting}
        />
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
      <h3 className="font-bold text-slate-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
