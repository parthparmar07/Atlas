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

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("atlas_ai_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("atlas_ai_chat_history", JSON.stringify(messages));
  }, [messages]);

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

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("atlas_ai_chat_history");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm">
      <div 
        className="flex flex-col w-full max-w-3xl overflow-hidden shadow-2xl bg-white border border-slate-200 rounded-2xl"
        style={{ height: "min(820px, 92vh)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              🤖
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">AI Command Manager</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-slate-500 font-semibold">GROQ POWERED • LOGGED IN</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearHistory}
              className="text-[11px] px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-semibold"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-white"
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4 border border-violet-200">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">How can I help you today?</h3>
              <p className="text-slate-500 text-[13px] max-w-[360px] mx-auto">
                I can manage system telemetry, analyze audit logs, update security policies, and answer questions about the platform.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mt-10">
                {["Show system health", "Analyze recent errors", "List active users", "Summarize audit logs"].map(tip => (
                  <button
                    key={tip}
                    onClick={() => setInput(tip)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-left text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all font-medium"
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
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none shadow-violet-300/40"
                    : "bg-slate-50 border border-slate-200 text-slate-800"
                }`}
              >
                <div className={`prose prose-sm max-w-none leading-relaxed ${message.role === "user" ? "text-white prose-headings:text-white prose-p:text-white prose-strong:text-white prose-li:text-white" : "text-slate-800 prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700"}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                
                {message.tool_calls && message.tool_calls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.tool_calls.map((call, i) => (
                      <div
                        key={i}
                        className="text-xs bg-white rounded-xl p-3 border border-slate-200"
                      >
                        <p className="font-bold text-emerald-600 mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {call.tool.toUpperCase()}
                        </p>
                        <pre className="text-[10px] text-slate-600 overflow-x-auto">
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
               <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for system stats, logs, or policy updates..."
              className="w-full pl-4 pr-32 py-3.5 rounded-2xl border border-slate-300 outline-none text-sm transition-all bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 px-6 py-2 rounded-xl text-white font-bold text-xs transition-all uppercase tracking-widest disabled:opacity-50 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 15px rgba(124,58,237,0.3)" }}
            >
              {loading ? "..." : "Execute"}
            </button>
          </div>
          <div className="flex justify-between mt-3 px-2">
             <p className="text-slate-500 text-[10px] uppercase tracking-tight font-semibold">
              Awaiting commands • Context: {pathname}
            </p>
            <p className="text-slate-500 text-[10px] uppercase tracking-tight font-semibold">
              Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
