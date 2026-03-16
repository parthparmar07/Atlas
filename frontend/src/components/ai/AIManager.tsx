"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { fetchWithAuth } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  tool_calls?: Array<{ tool: string; result: any }>;
}

interface AIManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export default function AIManager({ isOpen, onClose, initialPrompt }: AIManagerProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-fill and send initial prompt
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetchWithAuth("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          current_page: pathname,
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");
      
      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div 
        className="glass-card flex flex-col w-full max-w-2xl overflow-hidden shadow-2xl"
        style={{ height: "min(800px, 90vh)", background: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              🤖
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">AI Command Manager</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p style={{ color: "var(--text-muted)", fontSize: 10 }}>GEMINI POWERED • LOGGED IN</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">How can I help you today?</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, maxWidth: 360, margin: "0 auto" }}>
                I can manage system telemetry, analyze audit logs, update security policies, and answer questions about the platform.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-10">
                {["Show system health", "Analyze recent errors", "List active users", "Summarize audit logs"].map(tip => (
                  <button
                    key={tip}
                    onClick={() => setInput(tip)}
                    className="p-3 rounded-xl border border-white/5 bg-white/5 text-xs text-left text-slate-300 hover:bg-white/10 hover:border-white/10 transition-all"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                  message.role === "user"
                    ? "bg-purple-600 text-white border-none"
                    : "bg-white/5 border border-white/10 text-slate-200"
                }`}
              >
                <div className={`prose prose-invert prose-sm max-w-none ${message.role === "user" ? "text-white" : "text-slate-200"}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                
                {message.tool_calls && message.tool_calls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.tool_calls.map((call, i) => (
                      <div
                        key={i}
                        className="text-xs bg-black/40 rounded-xl p-3 border border-white/5"
                      >
                        <p className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {call.tool.toUpperCase()}
                        </p>
                        <pre className="text-[10px] text-slate-400 overflow-x-auto">
                          {JSON.stringify(call.result, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
               <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/5 bg-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for system stats, logs, or policy updates..."
              className="w-full pl-4 pr-32 py-3.5 rounded-2xl border border-white/10 outline-none text-sm transition-all"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 px-6 py-2 rounded-xl text-white font-bold text-xs transition-all uppercase tracking-widest disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 15px rgba(124,58,237,0.3)" }}
            >
              {loading ? "..." : "Execute"}
            </button>
          </div>
          <div className="flex justify-between mt-3 px-2">
             <p style={{ color: "var(--text-muted)", fontSize: 9 }} className="uppercase tracking-tighter">
              Awaiting commands • Context: {pathname}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 9 }} className="uppercase tracking-tighter">
              Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
