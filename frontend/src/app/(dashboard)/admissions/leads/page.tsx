"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquare, RefreshCw, Send } from "lucide-react";
import { api } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  email: string;
  programme_interest: string;
  score: number;
  stage: string;
};

type FunnelStats = Record<string, number>;

export default function LeadNurturePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [funnel, setFunnel] = useState<FunnelStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [channel, setChannel] = useState("whatsapp");
  const [context, setContext] = useState("Follow up on application status and pending documents.");
  const [sendingIds, setSendingIds] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, string>>({});

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leadData, funnelData] = await Promise.all([
        api<Lead[]>("/api/admissions/leads"),
        api<FunnelStats>("/api/admissions/funnel"),
      ]);
      setLeads(leadData ?? []);
      setFunnel(funnelData ?? {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load nurture data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const generateMessage = async (leadId: number) => {
    setSendingIds((prev) => [...prev, leadId]);
    setError("");
    try {
      const result = await api<{ message: string }>(`/api/admissions/leads/${leadId}/message`, {
        method: "POST",
        body: JSON.stringify({ channel, context }),
      });
      setMessages((prev) => ({ ...prev, [leadId]: result.message }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed generating follow-up message.");
    } finally {
      setSendingIds((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const stageEntries = Object.entries(funnel);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-800 bg-white min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-orange-500" />
            Lead Nurture AI
          </h1>
          <p className="text-gray-500 mt-1">Generate real follow-up outputs from live lead data.</p>
        </div>
        <button
          onClick={() => void fetchData()}
          className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}

      <div className="bg-white border rounded-xl p-4 shadow-sm grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-gray-500">Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-semibold uppercase text-gray-500">Context</label>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="What should the message focus on?"
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-3">Live Funnel</h2>
        {stageEntries.length ? (
          <div className="grid grid-cols-4 gap-3">
            {stageEntries.map(([stage, count]) => (
              <div key={stage} className="border rounded-lg p-3 bg-gray-50">
                <div className="text-xs uppercase text-gray-500 font-semibold">{stage}</div>
                <div className="text-xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No funnel data yet.</div>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-xs text-gray-500 bg-white uppercase tracking-wider">
              <th className="p-4 font-medium">Lead</th>
              <th className="p-4 font-medium">Programme</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Generated Output</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">Loading leads...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">No leads found. Create leads in Admissions Intelligence first.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{lead.email}</div>
                  </td>
                  <td className="p-4 text-gray-700">{lead.programme_interest}</td>
                  <td className="p-4 text-gray-700">{lead.score ?? 0}</td>
                  <td className="p-4">
                    {messages[lead.id] ? (
                      <div className="text-xs text-gray-700 bg-gray-50 border rounded p-2 max-w-md whitespace-pre-wrap">
                        {messages[lead.id]}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No message generated yet.</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => void generateMessage(lead.id)}
                      disabled={sendingIds.includes(lead.id)}
                      className="text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded text-xs font-bold border border-orange-100 transition-colors inline-flex items-center gap-2"
                    >
                      {sendingIds.includes(lead.id) ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {sendingIds.includes(lead.id) ? "Generating" : "Generate Message"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        Output cards above come directly from backend /message responses.
      </div>
    </div>
  );
}
