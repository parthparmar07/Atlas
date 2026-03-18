"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Mail, Phone, RefreshCw, Sparkles, UserPlus } from "lucide-react";
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
};

type LeadProfile = Lead & {
  ai_summary?: string;
};

export default function AdmissionsIntelligencePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scoringIds, setScoringIds] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    programme: "B.Tech CSE",
    source: "web_form",
  });

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<Lead[]>("/api/admissions/leads");
      setLeads(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads();
  }, []);

  const onCreateLead = async () => {
    if (!form.name || !form.email || !form.phone || !form.programme) {
      setError("All fields are required to create a lead.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await api<{ id: number }>("/api/admissions/leads", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        programme: "B.Tech CSE",
        source: "web_form",
      });
      await fetchLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const runRealScoring = async (leadId: number) => {
    setScoringIds((prev) => [...prev, leadId]);
    setError("");
    try {
      await api<LeadProfile>(`/api/admissions/leads/${leadId}/profile`);
      await fetchLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scoring failed.");
    } finally {
      setScoringIds((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const scoreAllUnscored = async () => {
    const targets = leads.filter((lead) => !lead.score || lead.score <= 0);
    if (!targets.length) return;

    setError("");
    for (const lead of targets) {
      await runRealScoring(lead.id);
    }
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.score >= 75).length;
    const warm = leads.filter((l) => l.score >= 45 && l.score < 75).length;
    const cold = leads.filter((l) => l.score < 45).length;
    return { total, hot, warm, cold };
  }, [leads]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-orange-500" />
            Admissions Intelligence AI
          </h1>
          <p className="text-gray-500 mt-1">Real lead intake, scoring, and profile workflows from backend APIs.</p>
        </div>
        <button
          onClick={() => void fetchLeads()}
          className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats.total.toString()} tone="text-blue-600" />
        <StatCard label="Hot" value={stats.hot.toString()} tone="text-red-600" />
        <StatCard label="Warm" value={stats.warm.toString()} tone="text-orange-600" />
        <StatCard label="Cold" value={stats.cold.toString()} tone="text-gray-600" />
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-orange-500" /> Add New Lead
        </h2>
        <div className="grid grid-cols-5 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="Phone"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={form.programme}
            onChange={(e) => setForm((f) => ({ ...f, programme: e.target.value }))}
            placeholder="Programme"
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="web_form">Web Form</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk_in">Walk In</option>
            <option value="referral">Referral</option>
            <option value="social">Social</option>
            <option value="agent">Agent</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => void onCreateLead()}
            disabled={submitting}
            className="bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
          >
            {submitting ? "Creating..." : "Create Lead"}
          </button>
          <button
            onClick={() => void scoreAllUnscored()}
            disabled={!leads.length}
            className="bg-gray-900 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black flex items-center gap-2"
          >
            <Activity className="h-4 w-4" /> Score All Unscored
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-gray-500 bg-white">
              <th className="p-4 font-medium">Lead</th>
              <th className="p-4 font-medium">Source</th>
              <th className="p-4 font-medium">Programme</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td className="p-4 text-sm text-gray-500" colSpan={5}>Loading leads...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td className="p-4 text-sm text-gray-500" colSpan={5}>No leads yet. Create one above to start a real workflow.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3" /> {lead.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <Phone className="h-3 w-3" /> {lead.phone}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{lead.source}</td>
                  <td className="p-4 text-sm text-gray-700">{lead.programme_interest}</td>
                  <td className="p-4">
                    {lead.score > 0 ? (
                      <span className="text-sm font-semibold text-gray-900">{lead.score}</span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => void runRealScoring(lead.id)}
                      disabled={scoringIds.includes(lead.id)}
                      className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-200 disabled:opacity-50"
                    >
                      {scoringIds.includes(lead.id) ? "Scoring..." : "Run AI Profile"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}
