"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AIManager from "@/components/ai/AIManager";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAIManagerOpen, setIsAIManagerOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-primary)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Header onOpenAIManager={() => setIsAIManagerOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </main>
        <AIManager isOpen={isAIManagerOpen} onClose={() => setIsAIManagerOpen(false)} />
      </div>
    </div>
  );
}
