"use client";

import { useState, useEffect } from "react";
import AIManager from "@/components/ai/AIManager";
import { Search, Bell, Bot, ChevronDown } from "lucide-react";

export default function Header() {
  const [showAIManager, setShowAIManager] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleOpenAIManager = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.prompt) {
        setInitialPrompt(customEvent.detail.prompt);
      } else {
        setInitialPrompt(undefined);
      }
      setShowAIManager(true);
    };

    window.addEventListener("open-ai-manager", handleOpenAIManager);
    return () => window.removeEventListener("open-ai-manager", handleOpenAIManager);
  }, []);

  return (
    <>
      <header
        className="flex items-center justify-between shrink-0 bg-white z-20"
        style={{
          height: 64,
          padding: "0 28px",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        {/* Search */}
        <div className="flex-1 flex items-center" style={{ maxWidth: 460 }}>
          <div className="relative w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              placeholder="Search agents, students, or system logs..."
              className="w-full transition-all focus:ring-2 focus:ring-purple-500/20"
              style={{
                paddingLeft: 40,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                border: "1px solid #e2e8f0",
                borderRadius: "999px",
                background: "#f8fafc",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-5">
          {/* AI Manager Button */}
          <button
            onClick={() => setShowAIManager(true)}
            className="flex items-center gap-2 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              height: 40,
              padding: "0 18px",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
              letterSpacing: "0.02em",
            }}
          >
            <Bot className="w-4 h-4 text-white" />
            <span>AI Manager</span>
          </button>

          {/* Live system status */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            <span className="text-slate-600 text-sm font-medium">System: Optimal</span>
          </div>

          {/* Notifications */}
          <button
            className="relative flex items-center justify-center rounded-full transition-colors hover:bg-slate-100"
            style={{
              width: 40,
              height: 40,
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span
              className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
              style={{ background: "#ef4444", border: "2px solid white" }}
            />
          </button>

          {/* Avatar Area */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200">
            <div
              className="flex items-center justify-center rounded-full font-bold text-sm"
              style={{
                width: 36,
                height: 36,
                background: "#1e293b",
                color: "white",
                flexShrink: 0,
              }}
            >
              A
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <AIManager isOpen={showAIManager} onClose={() => setShowAIManager(false)} initialPrompt={initialPrompt} />
    </>
  );
}
