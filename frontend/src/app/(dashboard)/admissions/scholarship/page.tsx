"use client";

import { useEffect, useState } from "react";
import { Award, RefreshCw, Search, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  email: string;
  programme_interest: string;
};

type Match = {
  name: string;
  score: number;
};

export default function ScholarshipMatcherPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadId, setLeadId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    programme: "B.Tech CSE",
    source: "web_form",
  });

  const fetchLeads = async () => {
    setError("");
    try {
      const leadData = await api<Lead[]>("/api/admissions/leads");
      setLeads(leadData ?? []);
      if (!leadId && leadData?.length) setLeadId(String(leadData[0].id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads.");
    }
  };

  useEffect(() => {
    void fetchLeads();
  }, []);

  const createLead = async () => {
    if (!createForm.name || !createForm.email || !createForm.phone || !createForm.programme) {
      setError("All new lead fields are required.");
      return;
    }

    setError("");
    try {
      const result = await api<{ id: number }>("/api/admissions/leads", {
        method: "POST",
        body: JSON.stringify(createForm),
      });
      await fetchLeads();
      setLeadId(String(result.id));
      setCreateForm({ name: "", email: "", phone: "", programme: "B.Tech CSE", source: "web_form" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lead creation failed.");
    }
  };

  const runMatcher = async () => {
    if (!leadId) {
      setError("Select a lead first.");
      return;
    }

    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const data = await api<{ lead_id: number; matches: Match[] }>(`/api/admissions/leads/${leadId}/scholarships/match`, {
        method: "POST",
      });
      setMatches(data.matches ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scholarship matching failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white min-h-screen">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Award className="text-teal-500" /> Scholarship Matcher
          </h1>
          <p className="text-gray-500">Use a real lead profile and run live scholarship matching.</p>
        </div>
        <button
          onClick={() => void fetchLeads()}
          className="bg-white border text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Leads
        </button>
      </div>

      {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-teal-500" /> Create Lead For Matching
          </h2>
          <input
            value={createForm.name}
            onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border p-2 rounded text-sm"
            placeholder="Name"
          />
          <input
            value={createForm.email}
            onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border p-2 rounded text-sm"
            placeholder="Email"
          />
          <input
            value={createForm.phone}
            onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border p-2 rounded text-sm"
            placeholder="Phone"
          />
          <input
            value={createForm.programme}
            onChange={(e) => setCreateForm((f) => ({ ...f, programme: e.target.value }))}
            className="w-full border p-2 rounded text-sm"
            placeholder="Programme"
          />
          <select
            value={createForm.source}
            onChange={(e) => setCreateForm((f) => ({ ...f, source: e.target.value }))}
            className="w-full border p-2 rounded text-sm"
          >
            <option value="web_form">Web Form</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk_in">Walk In</option>
            <option value="referral">Referral</option>
            <option value="social">Social</option>
            <option value="agent">Agent</option>
          </select>
          <button onClick={() => void createLead()} className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-lg hover:bg-teal-700">
            Create Lead
          </button>
        </div>

        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
          <h2 className="font-bold text-gray-900">Run Scholarship Matching</h2>
          <div>
            <label className="text-xs text-gray-500 uppercase font-bold">Lead</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full mt-1 border p-2 rounded text-sm"
            >
              {!leads.length ? <option value="">No leads available</option> : null}
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>{lead.name} - {lead.programme_interest}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => void runMatcher()}
            disabled={loading || !leadId}
            className="w-full bg-gray-900 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg hover:bg-black flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Run Match
          </button>

          {!loading && matches.length === 0 ? (
            <div className="text-sm text-gray-500 border rounded p-3 bg-gray-50">
              No matches yet. If this stays empty, add scholarship rows in backend database.
            </div>
          ) : null}

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((m, i) => (
                <div key={`${m.name}-${i}`} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{m.name}</span>
                    <span className="text-green-600">{Math.round(m.score)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
