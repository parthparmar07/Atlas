import { useState } from "react";
import { AlertTriangle, BarChart3, ClipboardList, Shuffle } from "lucide-react";

interface FacultyLoadBalancerWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function FacultyLoadBalancerWorkflow({ onExecute, isExecuting }: FacultyLoadBalancerWorkflowProps) {
  const [department, setDepartment] = useState("Computer Science");
  const [semester, setSemester] = useState("Semester 4");
  const [maxHours, setMaxHours] = useState("16");
  const [facultyData, setFacultyData] = useState(
    "Dr. Sharma | Teaching=19 | Invigilation=4 | Committee=2\nDr. Nair | Teaching=14 | Invigilation=1 | Committee=1\nDr. Mehta | Teaching=11 | Invigilation=3 | Committee=3"
  );

  const run = (action: string) => {
    const context = [
      `Department: ${department}`,
      `Semester: ${semester}`,
      `Weekly Max Hours: ${maxHours}`,
      "Faculty Load Snapshot:",
      facultyData,
      "Goal: Detect overload/underload and produce equitable redistribution plan aligned with timetable constraints.",
    ].join("\n");
    onExecute(action, context);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900">Faculty Load Intake</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Semester Window</label>
            <input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Weekly Hours</label>
            <input
              value={maxHours}
              onChange={(e) => setMaxHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Faculty Workload Data</label>
          <textarea
            value={facultyData}
            onChange={(e) => setFacultyData(e.target.value)}
            className="w-full min-h-[140px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => run("Analyse Load")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition-colors text-left disabled:opacity-60"
        >
          <ClipboardList className="w-6 h-6 text-indigo-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Analyse Load</h3>
          <p className="text-xs text-slate-500">Compute per-faculty load, identify overload/underload, and fairness score.</p>
        </button>

        <button
          onClick={() => run("Recommend Changes")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition-colors text-left disabled:opacity-60"
        >
          <Shuffle className="w-6 h-6 text-indigo-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Recommend Changes</h3>
          <p className="text-xs text-slate-500">Propose a balanced reallocation plan aligned to academic constraints.</p>
        </button>

        <button
          onClick={() => run("Generate Report")}
          disabled={isExecuting}
          className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 transition-colors text-left disabled:opacity-60"
        >
          <AlertTriangle className="w-6 h-6 text-indigo-500 mb-3" />
          <h3 className="font-bold text-slate-900 mb-1">Generate Report</h3>
          <p className="text-xs text-slate-500">Create HOD-ready workload report with flagged risks and action list.</p>
        </button>
      </div>
    </div>
  );
}
