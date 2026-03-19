"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartPulse, MessageSquareHeart, ShieldAlert, User, Clock, AlertTriangle, Send, Bell, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

type OpsCase = {
    id: number;
    title: string;
    status: string;
    metadata?: Record<string, unknown>;
};

type ChatMessage = { role: "ai" | "user"; text: string };

export default function WellbeingTriagePage() {
  const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: "Hi, I'm the initial triage bot for student support. I'm here to listen. How are you feeling right now? (Note: I am an AI. If this is an emergency, please use the SOS button or contact campus security immediately.)" }
  ]);
    const [cases, setCases] = useState<OpsCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCases = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api<{ records: OpsCase[]; count: number }>("/api/ops/students/wellbeing");
            if ((data.records ?? []).length === 0) {
                await Promise.all([
                    api("/api/ops/students/wellbeing", {
                        method: "POST",
                        body: JSON.stringify({ title: "Anonymous", status: "Given Self-Help Resources", source: "seed", metadata: { risk: "LOW", active: false } }),
                    }),
                    api("/api/ops/students/wellbeing", {
                        method: "POST",
                        body: JSON.stringify({ title: "M. T.", status: "Scheduled Counselor 2PM", source: "seed", metadata: { risk: "MEDIUM", active: true } }),
                    }),
                    api("/api/ops/students/wellbeing", {
                        method: "POST",
                        body: JSON.stringify({ title: "J. S.", status: "Escalated to Staff", source: "seed", metadata: { risk: "HIGH", active: true } }),
                    }),
                ]);
                const seeded = await api<{ records: OpsCase[]; count: number }>("/api/ops/students/wellbeing");
                setCases(seeded.records ?? []);
            } else {
                setCases(data.records ?? []);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load wellbeing cases.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadCases();
    }, []);

    const mappedCases = useMemo(
        () =>
            cases.map((c) => ({
                id: `CAS-${String(c.id).padStart(3, "0")}`,
                student: c.title,
                risk: String(c.metadata?.risk ?? "LOW").toUpperCase(),
                status: c.status,
                active: Boolean(c.metadata?.active),
            })),
        [cases]
    );

    const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput;
    setMessages([...messages, { role: "user", text: userText }]);
    setChatInput("");

        let aiResponse = "Thank you for sharing that. I will arrange for a counselor to reach out. In the meantime, would you like me to send you some grounding exercises?";
        let newRisk = "MEDIUM";
        let newStatus = "Queued for Counselor";

        if (userText.toLowerCase().includes("overwhelmed") || userText.toLowerCase().includes("stress")) {
            aiResponse = "It sounds like you're feeling very stressed. I'm sending over our exam-anxiety resource pack. A counselor will also follow up within 24 hours.";
            newRisk = "LOW";
            newStatus = "Sent Resource Pack";
        } else if (userText.toLowerCase().includes("hurt") || userText.toLowerCase().includes("end")) {
            aiResponse = "I'm escalating this to the immediate crisis response team. Please stay where you are, someone from staff will contact you at your phone number on record within the next 5 minutes.";
            newRisk = "CRITICAL";
            newStatus = "ESCALATED TO CRISIS TEAM";
        }

        setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);

        try {
            await api("/api/ops/students/wellbeing", {
                method: "POST",
                body: JSON.stringify({
                    title: "Current Chat",
                    status: newStatus,
                    source: "triage",
                    notes: userText,
                    metadata: { risk: newRisk, active: true },
                }),
            });
            await api("/api/ops/students/wellbeing/actions", {
                method: "POST",
                body: JSON.stringify({ action: `Triage ${newRisk}`, context: userText }),
            });
            await loadCases();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save triage case.");
        }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
       <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-rose-900 dark:text-rose-50 tracking-tight flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-rose-500" />
            Wellbeing Support & Triage
          </h1>
          <p className="text-rose-500/80 dark:text-rose-200/60 mt-2 text-lg font-medium">Confidential, safety-first routing for student support</p>
        </div>
        <button className="bg-red-600 border border-red-500 shadow-lg shadow-red-500/30 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 flex items-center gap-2 transition animate-pulse">
            <AlertTriangle className="h-5 w-5" /> OVERRIDE SOS
        </button>
      </div>

            <div className="flex justify-end">
                <button onClick={() => void loadCases()} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat Triage Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col h-[700px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
                    <MessageSquareHeart className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Active Triage Intake</h3>
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Strictly Confidential - Privacy Mode ON</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-4">
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                    <ShieldAlert className="w-5 h-5 shrink-0" />
                    <p><strong>Disclaimer:</strong> This is an AI triage assistant designed to route you to human help faster. It cannot provide medical advice. By continuing, you agree to the privacy terms.</p>
                </div>

                {messages.map((msg, i) => (
                    <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-4 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed ${msg.role === "user" ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-br-sm shadow-md" : "bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 text-slate-800 dark:text-rose-100 rounded-bl-sm"}`}>
                            {msg.text}
                         </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleChat} className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type safely here..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-5 pr-14 py-4 outline-none focus:ring-2 focus:ring-rose-500 font-medium text-slate-900 dark:text-white shadow-inner"
                />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors shadow-sm">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>

        {/* Staff Dashboard Panel */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 shadow-lg text-white">
                <h3 className="text-sm font-black uppercase tracking-widest text-rose-200 mb-2">Staff Triage Desk</h3>
                <div className="text-4xl font-black mb-1">{mappedCases.filter(c => c.active).length}</div>
                <p className="text-rose-100 font-medium text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Active cases requiring attention
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm min-h-[480px]">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-slate-400" /> Recent Escalations
                </h3>
                
                <div className="space-y-3">
                    {mappedCases.map((c, i) => (
                        <div key={i} className={`p-4 border rounded-2xl ${c.risk === "CRITICAL" ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" : c.risk === "HIGH" ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30" : c.risk === "MEDIUM" ? "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700" : "bg-slate-50 dark:bg-slate-900/50 border-transparent"}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{c.id}</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${c.risk === "CRITICAL" ? "bg-red-200 text-red-800" : c.risk === "HIGH" ? "bg-orange-200 text-orange-800" : c.risk === "MEDIUM" ? "bg-slate-200 text-slate-700" : "bg-slate-100 text-slate-500"}`}>
                                    {c.risk} RISK
                                </span>
                            </div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm mb-1">
                                <User className="w-4 h-4" /> {c.student}
                            </div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Status: {c.status}
                            </div>
                        </div>
                    ))}
                    {!loading && mappedCases.length === 0 ? <div className="text-sm text-slate-500">No cases logged yet.</div> : null}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
