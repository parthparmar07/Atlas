import { useState } from "react";
import { BookOpenCheck, FileBarChart, ShieldCheck } from "lucide-react";

interface CourseBuilderWorkflowProps {
  agentId: string;
  onExecute: (action: string, context: string) => void;
  isExecuting: boolean;
}

export default function CourseBuilderWorkflow({ onExecute, isExecuting }: CourseBuilderWorkflowProps) {
  const [course, setCourse] = useState("Applied AI Systems");
  const [credits, setCredits] = useState("4");
  const [semester, setSemester] = useState("Semester 5");
  const [outcomes, setOutcomes] = useState("Design ML pipelines, evaluate model fairness, deploy monitored APIs");
  const [topic, setTopic] = useState("Model Evaluation and Drift Monitoring");
  const [topics, setTopics] = useState("Prompt design, retrieval augmentation, model governance");
  const [resourceDepth, setResourceDepth] = useState("Core + Advanced");
  const [hrCapabilityBridge, setHrCapabilityBridge] = useState("Placement Cell + HR Industry Mentor");
  const [moduleRows, setModuleRows] = useState(
    "M1|Foundations of ML Ops|12|Quiz|CO1\nM2|Evaluation and Monitoring|14|Lab|CO2\nM3|Responsible AI in Production|10|Case Study|CO3\nM4|Capstone Delivery|16|Project|CO4"
  );

  const csv = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");

  const moduleContextRows = moduleRows
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [module, title, hours, assessment, outcome] = line.split("|").map((part) => part.trim());
      return `Module | module=${module || "M"} | title=${title || "Topic Block"} | hours=${hours || "8"} | assessment=${assessment || "Quiz"} | outcome=${outcome || "CO-Gen"}`;
    });

  const buildContext = (action: string, requiredOutput: string) => {
    return [
      `Course: ${course}`,
      `Credits: ${credits}`,
      `Semester: ${semester}`,
      `Outcomes: ${outcomes}`,
      `Topic: ${topic}`,
      `Topics: ${csv(topics)}`,
      `Resource Depth: ${resourceDepth}`,
      `HR Capability Bridge: ${hrCapabilityBridge}`,
      ...moduleContextRows,
      `Action: ${action}`,
      `Required Outputs: ${requiredOutput}`,
    ].join("\n");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-8 shadow-xl shadow-slate-200/30 grid grid-cols-2 gap-4">
        <Input label="Course" value={course} setValue={setCourse} />
        <Input label="Credits" value={credits} setValue={setCredits} />
        <Input label="Semester" value={semester} setValue={setSemester} />
        <Input label="Primary Topic" value={topic} setValue={setTopic} />
        <Input label="Outcomes" value={outcomes} setValue={setOutcomes} />
        <Input label="Topics List" value={topics} setValue={setTopics} />
        <Input label="Resource Depth" value={resourceDepth} setValue={setResourceDepth} />
        <Input label="HR Capability Bridge" value={hrCapabilityBridge} setValue={setHrCapabilityBridge} />
        <TextArea label="Module Rows (Module|Title|Hours|Assessment|Outcome)" value={moduleRows} setValue={setModuleRows} rows={5} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ActionCard
          icon={<BookOpenCheck className="w-6 h-6 text-cyan-600 mb-3" />}
          title="Design Course Outline"
          desc="Generate modular structure and outcome mapping."
          onClick={() => onExecute("Design Course Outline", buildContext("Design Course Outline", "module sequence, week plan, and outcome coverage report"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<ShieldCheck className="w-6 h-6 text-cyan-600 mb-3" />}
          title="Find Learning Resources"
          desc="Recommend references aligned to topic depth."
          onClick={() => onExecute("Find Learning Resources", buildContext("Find Learning Resources", "resource list with level tags and rationale"))}
          disabled={isExecuting}
        />
        <ActionCard
          icon={<FileBarChart className="w-6 h-6 text-cyan-600 mb-3" />}
          title="Create Assessment"
          desc="Build assessment pack and rubric logic."
          onClick={() => onExecute("Create Assessment", buildContext("Create Assessment", "assessment blueprint, rubric, and difficulty spread"))}
          disabled={isExecuting}
        />
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  setValue,
  rows = 4,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="col-span-2">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
      />
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
