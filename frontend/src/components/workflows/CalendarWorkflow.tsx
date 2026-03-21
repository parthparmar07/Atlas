import { useState } from "react";
import { CalendarClock, CalendarDays, Download, Landmark } from "lucide-react";

interface CalendarWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function CalendarWorkflow({ onExecute, isExecuting }: CalendarWorkflowProps) {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [boardDates, setBoardDates] = useState("University exam block: Nov 12-28, Apr 10-26");
  const [holidays, setHolidays] = useState("State gazetted + university declared holidays");

  const buildContext = (action: string) => {
    return JSON.stringify({
      action,
      school_id: "atlas",
      academic_year: academicYear,
      exam_board_dates: boardDates,
      holiday_inputs: holidays,
      start_date: "2026-07-01",
      end_date: "2027-05-31",
      event: {
        name: "Institutional Event",
        date: "2026-08-20",
        type: "event",
      },
      holidays: [
        { name: "Independence Day", date: "2026-08-15" },
        { name: "Republic Day", date: "2027-01-26" },
      ],
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Academic Year" value={academicYear} setValue={setAcademicYear} />
        <Input label="Exam Board Dates" value={boardDates} setValue={setBoardDates} />
        <Input label="Holiday Inputs" value={holidays} setValue={setHolidays} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ActionCard icon={<CalendarDays className="w-6 h-6 text-cyan-600 mb-3" />} title="Generate Calendar" desc="Build full year academic calendar." onClick={() => onExecute("Generate Calendar", buildContext("Generate Calendar"))} disabled={isExecuting} />
        <ActionCard icon={<CalendarClock className="w-6 h-6 text-cyan-600 mb-3" />} title="Add Event" desc="Insert event with conflict checks." onClick={() => onExecute("Add Event", buildContext("Add Event"))} disabled={isExecuting} />
        <ActionCard icon={<Landmark className="w-6 h-6 text-cyan-600 mb-3" />} title="Holiday Mapping" desc="Map holidays and calculate teaching-day impact." onClick={() => onExecute("Holiday Mapping", buildContext("Holiday Mapping"))} disabled={isExecuting} />
        <ActionCard icon={<Download className="w-6 h-6 text-cyan-600 mb-3" />} title="Export Calendar" desc="Generate publication-ready calendar output." onClick={() => onExecute("Export Calendar", buildContext("Export Calendar"))} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-cyan-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
