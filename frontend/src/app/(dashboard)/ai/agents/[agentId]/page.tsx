"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AgentPageTemplate, { AgentConfig } from "@/components/agents/AgentPageTemplate";

type AgentDetail = {
  agent_id: string;
  agent_name: string;
  domain: string;
  actions: string[];
};

function toDomainHref(domain: string): string {
  const v = (domain || "").toLowerCase();
  if (v.includes("admission")) return "/admissions";
  if (v.includes("academic")) return "/academics";
  if (v.includes("placement")) return "/placement";
  if (v.includes("finance")) return "/finance";
  if (v.includes("hr")) return "/hr";
  if (v.includes("student")) return "/students";
  if (v.includes("research")) return "/research";
  if (v.includes("it")) return "/ai/agents/it-support";
  return "/ai/agents";
}

function toDomainColor(domain: string): string {
  const v = (domain || "").toLowerCase();
  if (v.includes("admission")) return "#f97316";
  if (v.includes("academic")) return "#0ea5e9";
  if (v.includes("placement")) return "#6366f1";
  if (v.includes("finance")) return "#f59e0b";
  if (v.includes("hr")) return "#10b981";
  if (v.includes("student")) return "#ec4899";
  if (v.includes("research")) return "#0891b2";
  if (v.includes("it")) return "#14b8a6";
  return "#64748b";
}

export default function DynamicAgentPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = params?.agentId;

  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent-exec/agents/${agentId}`);
        if (!res.ok) throw new Error(`Agent not found (${res.status})`);
        const data = await res.json();
        setAgent(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load agent");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [agentId]);

  const config: AgentConfig | null = useMemo(() => {
    if (!agent) return null;
    return {
      name: agent.agent_name,
      agentId: agent.agent_id,
      badge: "core",
      domain: agent.domain || "Other",
      domainHref: toDomainHref(agent.domain || ""),
      domainColor: toDomainColor(agent.domain || ""),
      tagline: `Live dynamic execution page for ${agent.agent_name}.`,
      description: "This page is generated from backend metadata. Actions, contracts, and execution behavior are loaded dynamically at runtime.",
      stats: [
        { label: "Agent ID", value: agent.agent_id, change: "Backend registry" },
        { label: "Domain", value: agent.domain || "Other", change: "Live mapping" },
        { label: "Actions", value: String(agent.actions.length), change: "Contract driven", up: true },
        { label: "Mode", value: "Dynamic", change: "No hardcoding", up: true },
      ],
      pipeline: [
        { title: "Discover", desc: "Load actions and contracts from backend registry." },
        { title: "Validate", desc: "Apply action-level required inputs from contract." },
        { title: "Execute", desc: "Run backend endpoint with selected action context." },
        { title: "Observe", desc: "Capture telemetry and deterministic output blocks." },
      ],
      actions: agent.actions.map((a) => ({ label: a, desc: `Execute ${a}` })),
      activity: [
        { time: "Live", event: "Metadata loaded from backend registry", status: "success" },
        { time: "Live", event: "Contracts resolved for selected action", status: "info" },
      ],
      capabilities: [
        "Dynamic action retrieval",
        "Contract-driven input rendering",
        "Backend-executed workflows",
        "Telemetry and result traceability",
      ],
    };
  }, [agent]);

  if (loading) return <div className="p-8 text-slate-500">Loading dynamic agent page...</div>;
  if (error || !config) return <div className="p-8 text-red-600 font-semibold">{error || "Agent unavailable"}</div>;

  return <AgentPageTemplate config={config} />;
}
