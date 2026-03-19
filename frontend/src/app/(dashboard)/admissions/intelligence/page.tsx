"use client";

import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Mail, Phone, RefreshCw, ShieldAlert, Sparkles, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  programme_interest: string;
  source: string;
  stage: string;
  score: number;
  ai_summary?: string;
};

export default function AdmissionsIntelligencePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringIds, setScoringIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", programme: "B.Tech CSE", source: "web_form" });

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<Lead[]>("/api/admissions/leads");
      setLeads(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admissions intelligence data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const onCreateLead = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setError("");
    try {
      await api("/api/admissions/leads", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setIsAddOpen(false);
      setForm({ name: "", email: "", phone: "", programme: "B.Tech CSE", source: "web_form" });
      await loadLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create lead.");
    }
  };

  const runProfiler = async (leadId: number) => {
    setScoringIds((prev) => [...prev, leadId]);
    setError("");
    try {
      const profile = await api<Lead>(`/api/admissions/leads/${leadId}/profile`);
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...profile } : l)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run AI profiler.");
    } finally {
      setScoringIds((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const stats = useMemo(() => ({
    total: leads.length,
    hot: leads.filter((l) => l.score >= 80).length,
    warm: leads.filter((l) => l.score >= 50 && l.score < 80).length,
    cold: leads.filter((l) => l.score < 50).length,
    unscored: leads.filter((l) => !l.score || l.score === 0).length,
  }), [leads]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-orange-500" />
            Admissions Intelligence AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Data comes from admissions leads API with source attribution and AI profile summaries.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => void loadLeads()} className="bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 flex items-center gap-2 transition"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
          <button onClick={() => setIsAddOpen(true)} className="bg-orange-600 border border-orange-500 shadow-lg shadow-orange-500/20 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center gap-2 transition"><UserPlus className="h-5 w-5" /> Create Lead</button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-200"><div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Pipeline</div><div className="text-3xl font-black text-slate-900">{stats.total}</div></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Hot (80+)</div><div className="text-3xl font-black text-slate-900">{stats.hot}</div></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Warm (50-79)</div><div className="text-3xl font-black text-slate-900">{stats.warm}</div></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center"><div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Cold (&lt;50)</div><div className="text-3xl font-black text-slate-900">{stats.cold}</div></div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center"><div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Unscored</div><div className="text-3xl font-black text-slate-700">{stats.unscored}</div></div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Prospect Profile</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Metadata / Interest</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">AI Intelligence</th>
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading prospects...</td></tr> : null}
            {!loading && leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center"><ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500 font-medium">No prospects tracked.</p></td>
              </tr>
            ) : null}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-6 min-w-[200px]">
                  <div className="font-bold text-slate-900 dark:text-white mb-1.5 text-base">{lead.name}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2 mb-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {lead.email}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {lead.phone}</div>
                </td>
                <td className="px-6 py-6 max-w-[200px]">
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">{lead.programme_interest}</div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-500">Source: <span className="text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{lead.source}</span></div>
                </td>
                <td className="px-6 py-6 min-w-[250px] max-w-[400px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-lg uppercase tracking-wider ${lead.score >= 80 ? "bg-rose-100 text-rose-700" : lead.score >= 50 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>Score: {Math.round(lead.score || 0)}%</span>
                      <span className="text-xs font-black text-slate-400 uppercase">{lead.stage}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{lead.ai_summary || "Run profiler to generate AI profile summary."}</div>
                  </div>
                </td>
                <td className="px-6 py-6 text-right align-top">
                  <button disabled={scoringIds.includes(lead.id)} onClick={() => void runProfiler(lead.id)} className="px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-60">
                    {scoringIds.includes(lead.id) ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Run AI Profiler</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Import Prospect</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Program</label><input value={form.programme} onChange={e => setForm({ ...form, programme: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Source</label><select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"><option value="web_form">Web Form</option><option value="whatsapp">WhatsApp</option><option value="walk_in">Walk In</option><option value="referral">Referral</option><option value="social">Social</option><option value="agent">Agent</option></select></div>
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700"><button onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Cancel</button><button onClick={() => void onCreateLead()} className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30">Save Record</button></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}