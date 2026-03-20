"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MessageSquare, Phone, RefreshCw, Send, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  programme_interest: string;
  source: string;
  score: number;
  stage: string;
};

type Provenance = {
  total_records: number;
  source_mix: Record<string, number>;
  latest_record_at: string | null;
  storage: string;
  note: string;
};

import { useSchool } from "@/context/SchoolContext";

export default function LeadNurturePage() {
  const { currentSchool } = useSchool();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [provenance, setProvenance] = useState<Provenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [channel, setChannel] = useState("whatsapp");
  const [context, setContext] = useState("Follow up on application status and pending documents.");
  const [sendingIds, setSendingIds] = useState<number[]>([]);
  const [messages, setMessages] = useState<Record<number, string>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", programme: "B.Tech CSE", source: "web_form" });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leadData, provData] = await Promise.all([
        api<Lead[]>(`/api/admissions/leads?school=${currentSchool.id}`),
        api<Provenance>(`/api/admissions/provenance?school=${currentSchool.id}`),
      ]);
      setLeads(leadData ?? []);
      setProvenance(provData ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [currentSchool.id]);

  const funnel = useMemo(() => {
    return {
      HOT: leads.filter((l) => l.score >= 80).length,
      WARM: leads.filter((l) => l.score >= 50 && l.score < 80).length,
      COLD: leads.filter((l) => l.score < 50).length,
      TOTAL: leads.length,
    };
  }, [leads]);

  const generateMessage = async (lead: Lead) => {
    setSendingIds((prev) => [...prev, lead.id]);
    setError("");
    try {
      const data = await api<{ message: string }>(`/api/admissions/leads/${lead.id}/message`, {
        method: "POST",
        body: JSON.stringify({ channel, context }),
      });
      setMessages((prev) => ({ ...prev, [lead.id]: data.message }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate follow-up message.");
    } finally {
      setSendingIds((prev) => prev.filter((id) => id !== lead.id));
    }
  };

  const logInteraction = async (leadId: number, interactionType: string) => {
    try {
      await api(`/api/admissions/leads/${leadId}/interactions`, {
        method: "POST",
        body: JSON.stringify({
          interaction_type: interactionType,
          notes: messages[leadId] || `${interactionType} initiated`,
          next_action: "await_response",
        }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to store interaction.");
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.phone) return;
    setError("");
    try {
      await api("/api/admissions/leads", {
        method: "POST",
        body: JSON.stringify({
          ...newLead,
          school_id: currentSchool.id
        }),
      });
      setIsAddOpen(false);
      setNewLead({ name: "", email: "", phone: "", programme: "B.Tech CSE", source: "web_form" });
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create lead.");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await api(`/api/admissions/leads/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete lead.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-orange-500" />
            Lead Nurture AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Leads are persisted in backend DB, with real source provenance and interaction history.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => void loadData()} className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 transition">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={() => setIsAddOpen(true)} className="bg-orange-600 border border-orange-500 shadow-lg shadow-orange-500/20 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center gap-2 transition">
            <UserPlus className="h-5 w-5" /> Add Lead
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      {provenance ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Data Provenance</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Storage: {provenance.storage} | Records: {provenance.total_records} | Last record: {provenance.latest_record_at ? new Date(provenance.latest_record_at).toLocaleString() : "N/A"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(provenance.source_mix || {}).map(([source, count]) => (
              <span key={source} className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{source}: {count}</span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Channel Strategy</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500">
            <option value="whatsapp">Twilio WhatsApp API</option>
            <option value="sms">Twilio SMS API</option>
            <option value="email">SendGrid Email</option>
            <option value="call">Twilio Voice API</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Campaign Context Prompt</label>
          <input value={context} onChange={(e) => setContext(e.target.value)} className="w-full mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Instruct AI on message focus..." />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Live Pipeline Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Hot Leads</div><div className="text-3xl font-black text-slate-900">{funnel.HOT}</div></div>
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Warm Leads</div><div className="text-3xl font-black text-slate-900">{funnel.WARM}</div></div>
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Cold Leads</div><div className="text-3xl font-black text-slate-900">{funnel.COLD}</div></div>
          <div className="bg-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center"><div className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Total Pipeline</div><div className="text-3xl font-black text-slate-900">{funnel.TOTAL}</div></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Lead Profile</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Source / Score</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">AI Draft</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading leads...</td></tr> : null}
            {!loading && leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center"><ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500 font-medium">No leads in the pipeline.</p></td>
              </tr>
            ) : null}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-6">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 text-base">{lead.name}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2 mb-1"><Mail className="w-3 h-3" /> {lead.email}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2"><Phone className="w-3 h-3" /> {lead.phone}</div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">{lead.programme_interest}</div>
                  <div className="text-xs text-slate-500 mb-2">source: {lead.source}</div>
                  <div className="flex items-center gap-2"><div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${lead.score >= 80 ? "bg-rose-500" : lead.score >= 50 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${Math.max(0, Math.min(100, lead.score))}%` }} /></div><span className="text-xs font-black text-slate-600 dark:text-slate-400">{lead.score}/100</span></div>
                </td>
                <td className="px-6 py-6 max-w-sm">
                  {messages[lead.id] ? <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-sm rounded-xl font-medium relative border border-indigo-100 dark:border-indigo-500/20">{messages[lead.id]}</div> : <span className="text-sm text-slate-400 font-medium italic">Generate follow-up draft</span>}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex flex-col items-end gap-2">
                    <button disabled={sendingIds.includes(lead.id)} onClick={() => void generateMessage(lead)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 w-full justify-center">{sendingIds.includes(lead.id) ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 text-emerald-500" />} Make Draft</button>
                    <div className="flex items-center gap-1 w-full justify-center">
                      <button title="WhatsApp" onClick={() => void logInteraction(lead.id, "whatsapp") } className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition"><MessageSquare className="w-4 h-4" /></button>
                      <button title="Call" onClick={() => void logInteraction(lead.id, "call") } className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition"><Phone className="w-4 h-4" /></button>
                      <button title="Email" onClick={() => void logInteraction(lead.id, "email") } className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"><Mail className="w-4 h-4" /></button>
                      <button title="Delete Lead" onClick={() => void handleDelete(lead.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition ml-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Pipeline Registration</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label><input type="text" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label><input type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label><input type="text" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Program</label><input type="text" value={newLead.programme} onChange={e => setNewLead({ ...newLead, programme: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source</label><select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl"><option value="web_form">Web Form</option><option value="whatsapp">WhatsApp</option><option value="walk_in">Walk In</option><option value="referral">Referral</option><option value="social">Social</option><option value="agent">Agent</option></select></div>
              <div className="pt-6 flex justify-end gap-3 border-t dark:border-slate-700"><button onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button><button onClick={() => void handleAddLead()} className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30">Add to Funnel</button></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
