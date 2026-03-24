"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Play, Sparkles } from "lucide-react";

import ExecutionTrace from "@/components/agents/ExecutionTrace";

type RunnerAction = {
  label: string;
  description: string;
};

type RunResponse = {
  status: string;
  timestamp: string;
  result: {
    title?: string;
    summary?: string;
    hash?: string;
    [key: string]: unknown;
  };
  execution_details?: any[];
  [key: string]: unknown;
};

interface AcademicsActionRunnerProps {
  title: string;
  agentId: string;
  actions: RunnerAction[];
  buildContext?: (action: string) => Record<string, unknown>;
}

export default function AcademicsActionRunner({ title, agentId, actions, buildContext }: AcademicsActionRunnerProps) {
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<RunResponse | null>(null);
  const [lastContext, setLastContext] = useState<Record<string, unknown> | null>(null);

  const backendBase = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000", []);

  const runAction = async (action: RunnerAction) => {
    setRunningAction(action.label);
    setError("");
    setResponse(null);

    try {
      const payloadContext = buildContext ? buildContext(action.label) : { school_id: "atlas", action: action.label };
      setLastContext(payloadContext);
      const res = await fetch(`${backendBase}/api/agent-exec/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agentId,
          action: action.label,
          context: JSON.stringify(payloadContext),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail?.message || body?.detail || `Execution failed with status ${res.status}`;
        throw new Error(typeof detail === "string" ? detail : "Execution failed");
      }

      const data = (await res.json()) as RunResponse;
      setResponse(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to execute action.");
    } finally {
      setRunningAction(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Autonomous Runner</div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action) => {
          const active = runningAction === action.label;
          return (
            <button
              key={action.label}
              onClick={() => runAction(action)}
              disabled={!!runningAction}
              className="text-left border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all disabled:opacity-60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-900">{action.label}</span>
                {active ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" /> : <Play className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{action.description}</p>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
        </div>
      ) : null}

      {response ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <div className="text-sm font-black text-slate-900">{response.result?.title || "Execution completed"}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{response.result?.summary || "Action completed successfully."}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.18em] mt-2">
                {new Date(response.timestamp).toLocaleString()} {response.result?.hash ? `• ${response.result.hash}` : ""}
              </div>
            </div>
          </div>

          {response.execution_details && response.execution_details.length > 0 ? (
            <ExecutionTrace steps={response.execution_details} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No execution trace was returned for this run.</div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">Input Sent</div>
              <pre className="text-xs text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap break-words">
                {JSON.stringify(lastContext ?? {}, null, 2)}
              </pre>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">Output Received</div>
              <pre className="text-xs text-slate-700 overflow-auto max-h-80 whitespace-pre-wrap break-words">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
