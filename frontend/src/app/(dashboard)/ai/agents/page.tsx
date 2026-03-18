"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AgentSummary = {
  agent_id: string;
  agent_name: string;
  domain: string;
  actions: string[];
};

export default function AgentCatalogPage() {
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent-exec/agents`);
        if (!res.ok) throw new Error(`Failed to load agents (${res.status})`);
        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load catalog");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const byDomain: Record<string, AgentSummary[]> = {};
    for (const agent of agents) {
      const domain = agent.domain || "Other";
      byDomain[domain] = byDomain[domain] || [];
      byDomain[domain].push(agent);
    }
    return Object.entries(byDomain).sort(([a], [b]) => a.localeCompare(b));
  }, [agents]);

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest font-bold text-indigo-600">Dynamic Registry</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agent Catalog</h1>
        <p className="text-slate-600 text-lg">
          Live list from backend registry. Every card opens a dynamic execution page wired to action contracts.
        </p>
      </div>

      {loading && <div className="text-slate-500">Loading agents...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {grouped.map(([domain, items]) => (
            <section key={domain} className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">{domain}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items
                  .slice()
                  .sort((a, b) => a.agent_name.localeCompare(b.agent_name))
                  .map((agent) => (
                    <Link
                      key={agent.agent_id}
                      href={`/ai/agents/${agent.agent_id}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{agent.agent_id}</p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{agent.agent_name}</h3>
                      <p className="text-slate-600 text-sm mt-2">{agent.actions.length} actions available</p>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
