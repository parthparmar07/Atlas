import { useState } from "react";
import { CalendarCheck2, FileSearch, Megaphone, Send } from "lucide-react";

interface RecruitmentWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function RecruitmentWorkflow({ onExecute, isExecuting }: RecruitmentWorkflowProps) {
  const [role, setRole] = useState("Assistant Professor - AI/ML");
  const [department, setDepartment] = useState("Computer Science");
  const [openings, setOpenings] = useState("3");
  const [mustHave, setMustHave] = useState("PhD/ME, Teaching Experience, Publications");
  const [candidateData, setCandidateData] = useState(
    "Priya Nair | Exp=5y | Publications=8 | Teaching=Strong\nVikram Rao | Exp=8y | Publications=3 | Teaching=Strong\nAnita Sen | Exp=4y | Publications=11 | Teaching=Moderate"
  );

  const run = (action: string) => {
    const context = [
      `Role: ${role}`,
      `Department: ${department}`,
      `Openings: ${openings}`,
      `Must-Have Criteria: ${mustHave}`,
      "Candidate Snapshot:",
      candidateData,
      "Required Outputs: shortlist rationale, interview plan, and next-step communication drafts.",
    ].join("\n");
    onExecute(action, context);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-3 mb-6">
          <FileSearch className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Hiring Pipeline Inputs</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
            <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Openings</label>
            <input value={openings} onChange={(e) => setOpenings(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Must-Have Criteria</label>
            <input value={mustHave} onChange={(e) => setMustHave(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Pool</label>
          <textarea value={candidateData} onChange={(e) => setCandidateData(e.target.value)} className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <button onClick={() => run("Post Job")} disabled={isExecuting} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
          <Megaphone className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Post Job</h3>
          <p className="text-xs text-slate-500">Generate job posting content and publication plan.</p>
        </button>

        <button onClick={() => run("Screen CVs")} disabled={isExecuting} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
          <FileSearch className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Screen CVs</h3>
          <p className="text-xs text-slate-500">Rank candidates with role-fit justification.</p>
        </button>

        <button onClick={() => run("Schedule Interviews")} disabled={isExecuting} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
          <CalendarCheck2 className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Schedule Interviews</h3>
          <p className="text-xs text-slate-500">Create panel schedule and interview rubric.</p>
        </button>

        <button onClick={() => run("Generate Offer")} disabled={isExecuting} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-emerald-400 transition-colors text-left disabled:opacity-60">
          <Send className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Generate Offer</h3>
          <p className="text-xs text-slate-500">Draft offer and onboarding handoff details.</p>
        </button>
      </div>
    </div>
  );
}
