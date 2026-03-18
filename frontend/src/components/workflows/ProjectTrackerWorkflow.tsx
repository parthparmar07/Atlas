import { useState } from "react";
import { AlertTriangle, ClipboardList, FileSearch, FileText } from "lucide-react";

interface ProjectTrackerWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function ProjectTrackerWorkflow({ onExecute, isExecuting }: ProjectTrackerWorkflowProps) {
  const [semester, setSemester] = useState("Even Sem 2025-26");
  const [department, setDepartment] = useState("Computer Science");
  const [milestone, setMilestone] = useState("Chapter-2 (Literature Review)");
  const [projectSnapshot, setProjectSnapshot] = useState(
    "Team A | Guide: Dr. Nair | Status: On Track | Last Update: 2d\n" +
      "Team B | Guide: Dr. Mehta | Status: Delayed | Last Update: 16d\n" +
      "Team C | Guide: Dr. Rao | Status: At Risk | Last Update: 11d"
  );

  const run = (action: string) => {
    const context = [
      `Semester: ${semester}`,
      `Department: ${department}`,
      `Milestone Focus: ${milestone}`,
      "Project Snapshot:",
      projectSnapshot,
      "Required Outputs: risk summary, escalation recommendations, and exam-cell ready notes.",
    ].join("\n");

    onExecute(action, context);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">Project Lifecycle Inputs</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="Semester" value={semester} setValue={setSemester} />
          <Input label="Department" value={department} setValue={setDepartment} />
          <Input label="Milestone" value={milestone} setValue={setMilestone} />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Snapshot</label>
          <textarea value={projectSnapshot} onChange={(e) => setProjectSnapshot(e.target.value)} className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<ClipboardList className="w-6 h-6 text-amber-600 mb-3" />} title="Track Projects" desc="Generate branch-wise lifecycle status summary." onClick={() => run("Track Projects")} disabled={isExecuting} />
        <ActionCard icon={<AlertTriangle className="w-6 h-6 text-amber-600 mb-3" />} title="Flag Delays" desc="Identify milestone misses and escalation priority." onClick={() => run("Flag Delays")} disabled={isExecuting} />
        <ActionCard icon={<FileSearch className="w-6 h-6 text-amber-600 mb-3" />} title="Synopsis Review" desc="Evaluate synopsis quality and feasibility signals." onClick={() => run("Synopsis Review")} disabled={isExecuting} />
        <ActionCard icon={<FileText className="w-6 h-6 text-amber-600 mb-3" />} title="Generate Report" desc="Produce exam-cell semester project report." onClick={() => run("Generate Report")} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-amber-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
