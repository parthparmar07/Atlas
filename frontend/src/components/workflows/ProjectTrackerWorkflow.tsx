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
  const [attendanceCutoff, setAttendanceCutoff] = useState("75");
  const [projectSnapshot, setProjectSnapshot] = useState(
    "Team A | guide=Dr. Nair | status=On Track | progress=78 | last_update_days=2\n" +
      "Team B | guide=Dr. Mehta | status=Delayed | progress=44 | last_update_days=16\n" +
      "Team C | guide=Dr. Rao | status=At Risk | progress=52 | last_update_days=11"
  );

  const run = (action: string, requiredOutput: string) => {
    const context = [
      `Semester: ${semester}`,
      `Department: ${department}`,
      `Milestone Focus: ${milestone}`,
      `Attendance Cutoff: ${attendanceCutoff}`,
      "Projects[]:",
      "Project Snapshot:",
      projectSnapshot,
      "Student Signals:",
      "Rahul Verma | attendance=62 | project_status=Delayed | grievance=Open | internship=Not Allocated",
      "Nisha Rao | attendance=84 | project_status=On Track | grievance=None | internship=Allocated",
      "Grievances[]:",
      "GR-102 | category=Academic | severity=high | sla=48h | owner=HOD",
      "GR-119 | category=Infrastructure | severity=medium | sla=5d | owner=Admin",
      "Internships[]:",
      "STU-903 | company=Acme AI | status=In Progress | risk=Low",
      "STU-997 | company=DataWave | status=Offer Pending | risk=Medium",
      "Attendance[]:",
      "STU-903 | attendance=62 | absences=7 | last_login=5d",
      "STU-997 | attendance=84 | absences=1 | last_login=1d",
      `Required Outputs: ${requiredOutput}`,
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

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="Attendance Cutoff (%)" value={attendanceCutoff} setValue={setAttendanceCutoff} />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Snapshot</label>
          <textarea value={projectSnapshot} onChange={(e) => setProjectSnapshot(e.target.value)} className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard icon={<ClipboardList className="w-6 h-6 text-amber-600 mb-3" />} title="Track Projects" desc="Generate branch-wise lifecycle status summary." onClick={() => run("Track Projects", "project health map, missed milestones, and owner recommendations") } disabled={isExecuting} />
        <ActionCard icon={<AlertTriangle className="w-6 h-6 text-amber-600 mb-3" />} title="Flag Delays" desc="Identify milestone misses and escalation priority." onClick={() => run("Flag Delays", "delay queue, escalation reasons, and follow-up deadlines") } disabled={isExecuting} />
        <ActionCard icon={<FileSearch className="w-6 h-6 text-amber-600 mb-3" />} title="Monitor Dropout Risk" desc="Cross-check project delays with student retention signals." onClick={() => run("Monitor Dropout Risk", "risk tiers, trigger evidence, and counselor routing") } disabled={isExecuting} />
        <ActionCard icon={<FileText className="w-6 h-6 text-amber-600 mb-3" />} title="Manage Grievances" desc="Map active grievance load affecting project continuity." onClick={() => run("Manage Grievances", "category routing, sla watchlist, and escalation owners") } disabled={isExecuting} />
        <ActionCard icon={<FileText className="w-6 h-6 text-amber-600 mb-3" />} title="Manage Internships" desc="Check internship overlap impact on team delivery." onClick={() => run("Manage Internships", "internship conflict matrix and mitigation suggestions") } disabled={isExecuting} />
        <ActionCard icon={<FileText className="w-6 h-6 text-amber-600 mb-3" />} title="Generate Attendance Alerts" desc="Build attendance-linked intervention queue." onClick={() => run("Generate Attendance Alerts", "attendance alerts with severity and next best action") } disabled={isExecuting} />
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
