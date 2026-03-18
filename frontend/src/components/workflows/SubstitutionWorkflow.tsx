import { useState } from "react";
import { Bell, UserCheck, Users } from "lucide-react";

interface SubstitutionWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function SubstitutionWorkflow({ onExecute, isExecuting }: SubstitutionWorkflowProps) {
  const [faculty, setFaculty] = useState("Dr. Reddy");
  const [subject, setSubject] = useState("Engineering Physics");
  const [slot, setSlot] = useState("Thu 10:00-11:00");
  const [section, setSection] = useState("FY-CSE-A");

  const context = [
    `Absent Faculty: ${faculty}`,
    `Subject: ${subject}`,
    `Class Slot: ${slot}`,
    `Section: ${section}`,
    "Goal: identify best substitute, notify HOD and students, and update timetable state.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Absent Faculty" value={faculty} setValue={setFaculty} />
          <Input label="Subject" value={subject} setValue={setSubject} />
          <Input label="Class Slot" value={slot} setValue={setSlot} />
          <Input label="Section" value={section} setValue={setSection} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard icon={<UserCheck className="w-6 h-6 text-cyan-600 mb-3" />} title="Find Substitute" desc="Rank substitutes by free slot and subject fit." onClick={() => onExecute("Find Substitute", context)} disabled={isExecuting} />
        <ActionCard icon={<Bell className="w-6 h-6 text-cyan-600 mb-3" />} title="Notify Students" desc="Generate student + HOD notification draft." onClick={() => onExecute("Notify Students", context)} disabled={isExecuting} />
        <ActionCard icon={<Users className="w-6 h-6 text-cyan-600 mb-3" />} title="Update Timetable" desc="Apply substitution into timetable state." onClick={() => onExecute("Update Timetable", context)} disabled={isExecuting} />
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
