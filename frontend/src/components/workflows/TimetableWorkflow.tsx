import { useState } from "react";
import { Calendar, Cpu, Settings, Shuffle } from "lucide-react";

interface TimetableWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function TimetableWorkflow({ agentId, onExecute, isExecuting }: TimetableWorkflowProps) {
  const [department, setDepartment] = useState("Computer Science");
  const [semester, setSemester] = useState("Fall 2026");

  const runAction = (action: string) => {
    const context = `Department: ${department}\nSemester: ${semester}`;
    onExecute(action, context);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-500" />
            Parameters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Department</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white outline-none"
              >
                <option>Computer Science</option>
                <option>Business Admin</option>
                <option>Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Semester</label>
              <input 
                type="text" 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <button
          onClick={() => runAction("Generate Timetable")}
          disabled={isExecuting}
          className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-sky-400 hover:shadow-lg transition-all group disabled:opacity-50 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generate Full Timetable</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Runs constraint satisfaction solver to build clash-free schedule.</p>
            </div>
          </div>
          <Cpu className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
        </button>

        <button
          onClick={() => runAction("Resolve Conflicts")}
          disabled={isExecuting}
          className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-sky-400 hover:shadow-lg transition-all group disabled:opacity-50 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resolve Faculty Conflicts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Identify overlapping schedules and auto-suggest reallocations.</p>
            </div>
          </div>
          <Cpu className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
