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

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Batch: ${batch}`,
      `Target Companies: ${companies}`,
      `Current Skill Profile: ${skills}`,
      "JD Library[]:",
      "JD-101 | role=Software Engineer | company=TCS | must_have=DSA, Java, SQL | bonus=System Design",
      "JD-117 | role=Data Analyst | company=Accenture | must_have=SQL, Python, BI | bonus=Statistics",
      "JD-133 | role=Backend Engineer | company=Infosys | must_have=API, OOP, DBMS | bonus=Cloud",
      "Student Profiles[]:",
      "Aarav Nair | cgpa=8.4 | skills=Python, SQL, React | mock_score=71 | preferred_role=Software Engineer",
      "Nisha Patel | cgpa=8.9 | skills=Python, BI, Statistics | mock_score=79 | preferred_role=Data Analyst",
      "Rahul Menon | cgpa=7.8 | skills=Java, API, DBMS | mock_score=65 | preferred_role=Backend Engineer",
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

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
          onClick={() =>
            onExecute(
              "Analyse Job Descriptions",
              buildContext("Analyse Job Descriptions", "jd analysis matrix, role skill weights, and screening checklist")
            )
          }
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Users className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Match Students to Jobs"
          desc="Score each student 0–100 per active opening. Surface top 3 fits with reasoning."
          onClick={() =>
            onExecute(
              "Match Students to Jobs",
              buildContext("Match Students to Jobs", "ranked job matches with score drivers and confidence")
            )
          }
          disabled={isExecuting}
        />
        <ActionCard
          icon={<BarChart2 className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Analyse Batch Skill Gaps"
          desc="Identify top 5 high-demand skills missing from batch. Recommend workshops to close gaps."
          onClick={() =>
            onExecute(
              "Analyse Batch Skill Gaps",
              buildContext("Analyse Batch Skill Gaps", "skill-gap report, impact estimate, and workshop plan")
            )
          }
          disabled={isExecuting}
        />
        <ActionCard
          icon={<BookOpen className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Review Resumes"
          desc="Score resumes, rewrite weak bullet points, check ATS keyword compatibility."
          onClick={() =>
            onExecute(
              "Review Resumes",
              buildContext("Review Resumes", "resume scorecards, keyword gaps, and rewrite recommendations")
            )
          }
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Star className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Prepare for Interviews"
          desc="Generate role-specific Q&A packs, STAR answers, and weak-point coaching."
          onClick={() =>
            onExecute(
              "Prepare for Interviews",
              buildContext("Prepare for Interviews", "question set, answer rubric, and coaching plan")
            )
          }
          disabled={isExecuting}
        />
        <ActionCard
          icon={<Building2 className="w-6 h-6 text-emerald-600 mb-3" />}
          title="Manage Company Pipeline"
          desc="Tier companies, generate outreach letters, track season progress and offers."
          onClick={() =>
            onExecute(
              "Manage Company Pipeline",
              buildContext("Manage Company Pipeline", "pipeline health board, outreach priorities, and risk flags")
            )
          }
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
