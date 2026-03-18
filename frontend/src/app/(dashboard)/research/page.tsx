import Link from "next/link";

const CARDS = [
  {
    href: "/research/assistant",
    title: "Research Assistant",
    desc: "Discover literature, synthesize gaps, and structure manuscript drafts.",
    badge: "Core",
  },
  {
    href: "/research/grant",
    title: "Grant Tracker",
    desc: "Track utilization, compliance milestones, and escalation-ready deadlines.",
    badge: "Unique",
  },
  {
    href: "/research/publication",
    title: "Publication Ops",
    desc: "Run journal-fit, readiness, and reviewer response workflows.",
    badge: "API",
  },
];

export default function ResearchDomainPage() {
  return (
    <div className="p-8 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest font-bold text-cyan-600">Domain</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Research & Innovation</h1>
        <p className="text-slate-600 text-lg">
          Operational agents for literature workflows, grant governance, and publication lifecycle management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-700">
              {card.badge}
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-slate-600 text-sm leading-6">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
