import { useState } from "react";
import { CalendarCheck, Megaphone, ShieldAlert, FileBarChart } from "lucide-react";

interface EventsWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function EventsWorkflow({ onExecute, isExecuting }: EventsWorkflowProps) {
  const [eventName, setEventName] = useState("Innovation Expo 2026");
  const [date, setDate] = useState("2026-04-12");
  const [venue, setVenue] = useState("Main Auditorium");
  const [budget, setBudget] = useState("450000");
  const [audienceSegments, setAudienceSegments] = useState("First-year, Final-year, Alumni, Industry Guests");
  const [channels, setChannels] = useState("Instagram, Email, Noticeboard, WhatsApp");
  const [checklist, setChecklist] = useState("Permissions, Security, Medical, AV, Registration");
  const [contacts, setContacts] = useState("Ops Lead, Student Volunteer Lead, Security Supervisor");
  const [attendanceSeries, setAttendanceSeries] = useState("180,220,195");
  const [feedback, setFeedback] = useState("Great sessions, Improve queue flow, Better mic setup");
  const [budgetActual, setBudgetActual] = useState("418000");
  const [hrSafetyLead, setHrSafetyLead] = useState("HR Safety & Compliance Desk");

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Event Name: ${eventName}`,
      `Date: ${date}`,
      `Venue: ${venue}`,
      `Budget: ${budget}`,
      `Audience Segments: ${audienceSegments}`,
      `Channels: ${channels}`,
      `Event Checklist: ${checklist}`,
      `Event Contacts: ${contacts}`,
      `Attendance: ${attendanceSeries}`,
      `Feedback: ${feedback}`,
      `Budget Actual: ${budgetActual}`,
      `HR Safety Lead: ${hrSafetyLead}`,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-2 gap-4">
        <Input label="Event Name" value={eventName} setValue={setEventName} />
        <Input label="Date" value={date} setValue={setDate} />
        <Input label="Venue" value={venue} setValue={setVenue} />
        <Input label="Budget" value={budget} setValue={setBudget} />
        <Input label="Audience Segments" value={audienceSegments} setValue={setAudienceSegments} />
        <Input label="Promotion Channels" value={channels} setValue={setChannels} />
        <Input label="Logistics Checklist" value={checklist} setValue={setChecklist} />
        <Input label="Escalation Contacts" value={contacts} setValue={setContacts} />
        <Input label="Attendance Series" value={attendanceSeries} setValue={setAttendanceSeries} />
        <Input label="Feedback Notes" value={feedback} setValue={setFeedback} />
        <Input label="Budget Actual" value={budgetActual} setValue={setBudgetActual} />
        <Input label="HR Safety Lead" value={hrSafetyLead} setValue={setHrSafetyLead} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard icon={<CalendarCheck className="w-6 h-6 text-violet-600 mb-3" />} title="Plan Event" desc="Build timeline and execution plan." onClick={() => onExecute("Plan Event", buildContext("Plan Event", "timeline, owner mapping, and budget split"))} disabled={isExecuting} />
        <ActionCard icon={<Megaphone className="w-6 h-6 text-violet-600 mb-3" />} title="Promote Event" desc="Create campaign strategy by segment." onClick={() => onExecute("Promote Event", buildContext("Promote Event", "channel strategy, posting cadence, and expected reach"))} disabled={isExecuting} />
        <ActionCard icon={<ShieldAlert className="w-6 h-6 text-violet-600 mb-3" />} title="Risk & Logistics Check" desc="Validate readiness and critical risk points." onClick={() => onExecute("Risk & Logistics Check", buildContext("Risk & Logistics Check", "risk matrix, blockers, and mitigation plan"))} disabled={isExecuting} />
        <ActionCard icon={<FileBarChart className="w-6 h-6 text-violet-600 mb-3" />} title="Generate Report" desc="Publish post-event summary and outcomes." onClick={() => onExecute("Generate Report", buildContext("Generate Report", "attendance summary, feedback trends, and budget variance"))} disabled={isExecuting} />
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
    <button onClick={onClick} disabled={disabled} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-violet-400 transition-colors text-left disabled:opacity-60">
      {icon}
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  );
}
