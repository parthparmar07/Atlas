import { useState } from "react";
import { Network, Send, Users } from "lucide-react";

interface AlumniWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function AlumniWorkflow({ onExecute, isExecuting }: AlumniWorkflowProps) {
  const [targetDomain, setTargetDomain] = useState("Software Engineering");
  const [studentGroup, setStudentGroup] = useState("Final Year CSE");
  const [campaignTheme, setCampaignTheme] = useState("Referral drive for product + service companies");

  const context = [
    `Target Domain: ${targetDomain}`,
    `Student Group: ${studentGroup}`,
    `Campaign Theme: ${campaignTheme}`,
    "Need: mentorship mapping, alumni outreach, and referral-channel activation.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-3 gap-4">
        <Input label="Target Domain" value={targetDomain} setValue={setTargetDomain} />
        <Input label="Student Group" value={studentGroup} setValue={setStudentGroup} />
        <Input label="Campaign Theme" value={campaignTheme} setValue={setCampaignTheme} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard icon={<Users className="w-6 h-6 text-emerald-600 mb-3" />} title="Find Mentors" desc="Map best-fit alumni mentors for student cluster." onClick={() => onExecute("Find Mentors", context)} disabled={isExecuting} />
        <ActionCard icon={<Send className="w-6 h-6 text-emerald-600 mb-3" />} title="Post Job Opening" desc="Draft alumni-facing opportunity/referral brief." onClick={() => onExecute("Post Job Opening", context)} disabled={isExecuting} />
        <ActionCard icon={<Network className="w-6 h-6 text-emerald-600 mb-3" />} title="Organize Networking Event" desc="Plan alumni-student networking event agenda." onClick={() => onExecute("Organize Networking Event", context)} disabled={isExecuting} />
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
