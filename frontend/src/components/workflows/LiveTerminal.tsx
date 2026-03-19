"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Shield, Wifi, WifiOff } from "lucide-react";

interface TerminalEvent {
  id: number;
  event_type: "started" | "completed" | "error" | "info" | "step" | "chatting";
  agent_id: string;
  agent_name: string;
  action: string;
  detail: string;
  duration_ms: number;
  timestamp: string;
}

const STATIC_BOOT: TerminalEvent[] = [
  { id: -1, event_type: "info", agent_id: "system", agent_name: "System", action: "Bootstrap", detail: "Atlas command node initialised — Groq LPU online", duration_ms: 0, timestamp: new Date().toISOString() },
  { id: -2, event_type: "info", agent_id: "system", agent_name: "System", action: "Registry", detail: "35 agents loaded across 7 domains", duration_ms: 0, timestamp: new Date().toISOString() },
];

function fmtTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString("en-IN", { hour12: false }); } catch { return ""; }
}

import { Brain, MessageSquare, ChevronRight } from "lucide-react";

function EventLine({ ev }: { ev: TerminalEvent }) {
  const isStarted   = ev.event_type === "started";
  const isCompleted = ev.event_type === "completed";
  const isError     = ev.event_type === "error";
  const isInfo      = ev.event_type === "info";
  const isStep      = ev.event_type === "step";
  const isChatting  = ev.event_type === "chatting";

  if (isStep) {
    return (
      <div className="flex items-start gap-2 pl-4 border-l-2 border-indigo-900/50 animate-in fade-in slide-in-from-left-1 py-0.5">
        <Brain className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
        <span className="text-[12px] text-indigo-300/80 font-medium">
          <span className="text-indigo-200">[{ev.agent_name}]</span> {ev.detail}
        </span>
      </div>
    );
  }

  if (isChatting) {
    return (
      <div className="flex items-start gap-2 pl-4 border-l-2 border-violet-900/50 animate-in fade-in slide-in-from-left-1 py-0.5">
        <MessageSquare className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
        <span className="text-[12px] text-violet-300 font-bold italic tracking-tight">
          <span className="text-violet-200">@{ev.agent_name}:</span> {ev.detail}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
      {/* Command line */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-emerald-400 font-bold shrink-0">root@atlas:~$</span>
        <span className="text-slate-300">
          {isInfo
            ? `echo "${ev.detail}"`
            : `exec --agent ${ev.agent_id} --action "${ev.action}"`}
        </span>
        <span className="text-slate-600 text-[11px] ml-auto shrink-0">{fmtTime(ev.timestamp)}</span>
      </div>
      {/* Output lines */}
      {isStarted && (
        <div className="pl-4 border-l-2 border-slate-800 ml-2 flex items-center gap-2 text-slate-400">
          <RefreshCw className="w-3 h-3 animate-spin text-amber-400 shrink-0" />
          <span>Processing — {ev.agent_name} executing <span className="text-amber-300 font-medium">{ev.action}</span>...</span>
        </div>
      )}
      {isCompleted && (
        <div className="pl-4 border-l-2 border-emerald-800 ml-2 flex items-center gap-2">
          <div className="text-emerald-400 inline-flex items-center gap-2 bg-emerald-500/10 px-2 py-0.5 rounded text-[12px]">
            <Shield className="w-3 h-3 shrink-0" />
            <span>[OK] {ev.agent_name} · <span className="font-bold">{ev.action}</span> completed in <span className="text-emerald-300">{ev.duration_ms}ms</span>{ev.detail ? ` via ${ev.detail}` : ""}</span>
          </div>
        </div>
      )}
      {isError && (
        <div className="pl-4 border-l-2 border-rose-800 ml-2 flex items-center gap-2">
          <div className="text-rose-400 inline-flex items-center gap-2 bg-rose-500/10 px-2 py-0.5 rounded text-[12px]">
            [ERR] {ev.agent_name} · {ev.action} failed{ev.detail ? `: ${ev.detail}` : ""}
          </div>
        </div>
      )}
      {isInfo && (
        <div className="pl-4 border-l-2 border-slate-800 ml-2 text-slate-500 text-[12px]">
          {ev.detail}
        </div>
      )}
    </div>
  );
}

interface LiveTerminalProps {
  apiBase?: string;
}

export default function LiveTerminal({ apiBase }: LiveTerminalProps) {
  const base = apiBase ?? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");
  const wsUrl = base.replace(/^http/, "ws") + "/api/telemetry/live";

  const [events, setEvents] = useState<TerminalEvent[]>(STATIC_BOOT);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const counterRef = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addEvent = (ev: Omit<TerminalEvent, "id">) => {
    counterRef.current += 1;
    const id = counterRef.current;
    setEvents(prev => {
      const next = [...prev, { ...ev, id }];
      return next.slice(-60); // keep last 60 events
    });
  };

  const connect = () => {
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setReconnecting(false);
        addEvent({ event_type: "info", agent_id: "system", agent_name: "WebSocket", action: "Connect", detail: "Live stream connected — watching all agent executions", duration_ms: 0, timestamp: new Date().toISOString() });
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.type === "terminal_event") {
            addEvent({
              event_type: data.event_type,
              agent_id: data.agent_id,
              agent_name: data.agent_name,
              action: data.action,
              detail: data.detail ?? "",
              duration_ms: data.duration_ms ?? 0,
              timestamp: data.timestamp,
            });
          } else if (data.type === "pong") {
            // heartbeat OK — no display needed
          }
        } catch {
          // ignore malformed
        }
      };

      ws.onclose = () => {
        setConnected(false);
        schedule_reconnect();
      };

      ws.onerror = () => {
        setConnected(false);
        ws.close();
      };
    } catch {
      schedule_reconnect();
    }
  };

  const schedule_reconnect = () => {
    setReconnecting(true);
    reconnectTimer.current = setTimeout(() => { connect(); }, 4000);
  };

  useEffect(() => {
    connect();
    // Heartbeat ping
    const ping = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
    return () => {
      clearInterval(ping);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-[#0b1120] rounded-[1.5rem] shadow-2xl border border-slate-700/50 font-mono text-sm relative overflow-hidden group">
      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold tracking-widest uppercase">
              <Wifi className="w-3 h-3" />
              Live Stream
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          ) : reconnecting ? (
            <span className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold tracking-widest uppercase">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Reconnecting
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              <WifiOff className="w-3 h-3" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-5 space-y-3 text-slate-300 relative z-10 overflow-y-auto max-h-[220px] custom-scrollbar"
        style={{ scrollbarColor: "#1e293b transparent" }}
      >
        {events.map(ev => <EventLine key={ev.id} ev={ev} />)}

        {/* Blinking cursor */}
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">root@atlas:~$</span>
          <span className="w-2 h-4 bg-slate-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
