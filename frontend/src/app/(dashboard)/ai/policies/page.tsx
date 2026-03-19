"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Lock, Plus, RefreshCw, ServerOff, Settings2, ShieldCheck, Zap } from "lucide-react";
import { api } from "@/lib/api";

type Policy = {
  id: number;
  name: string;
  description: string | null;
  policy_type: "LOGICAL" | "NATURAL_LANGUAGE";
  natural_language: string | null;
  dsl: string | null;
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  priority: number;
  created_at: string;
};

export default function AIPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ name: "", description: "", natural_language: "" });
  const [translating, setTranslating] = useState(false);
  const [translatedDSL, setTranslatedDSL] = useState("");

  const loadPolicies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<Policy[]>("/api/ai/policies");
      setPolicies(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPolicies();
  }, []);

  const handleTranslate = async () => {
    if (!newPolicy.natural_language.trim()) return;
    setTranslating(true);
    try {
      const data = await api<{ dsl: string }>("/api/ai/policies/translate", {
        method: "POST",
        body: JSON.stringify({ natural_language: newPolicy.natural_language }),
      });
      setTranslatedDSL(data.dsl ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to translate policy.");
    } finally {
      setTranslating(false);
    }
  };

  const handleCreate = async () => {
    if (!newPolicy.name.trim() || !translatedDSL) return;
    setError("");
    try {
      await api("/api/ai/policies", {
        method: "POST",
        body: JSON.stringify({
          name: newPolicy.name,
          description: newPolicy.description || null,
          policy_type: "NATURAL_LANGUAGE",
          natural_language: newPolicy.natural_language,
          dsl: translatedDSL,
          priority: 100,
        }),
      });
      setShowCreateModal(false);
      setNewPolicy({ name: "", description: "", natural_language: "" });
      setTranslatedDSL("");
      await loadPolicies();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create policy.");
    }
  };

  const toggleStatus = async (policy: Policy) => {
    const nextStatus = policy.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setError("");
    try {
      await api(`/api/ai/policies/${policy.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      await loadPolicies();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update policy.");
    }
  };

  const handleDelete = async (id: number) => {
    setError("");
    try {
      await api(`/api/ai/policies/${id}`, { method: "DELETE" });
      await loadPolicies();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete policy.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
            AI Access Policies
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Real policy guardrails stored in backend database.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => void loadPolicies()} className="px-4 py-3 rounded-xl border bg-white dark:bg-slate-800">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-500/20">
            <Plus className="w-5 h-5 -ml-1" />
            Create Policy
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid gap-6">
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">Loading policies...</div>
        ) : null}
        {!loading && policies.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Policies Found</h3>
            <p className="text-slate-500 mt-2">Create your first AI guardrail policy.</p>
          </div>
        ) : null}
        {policies.map((policy) => (
          <div key={policy.id} className={`bg-white dark:bg-slate-800 rounded-3xl border transition-all duration-300 p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm ${policy.status === "ACTIVE" ? "border-indigo-200 dark:border-indigo-500/30" : "border-slate-200 dark:border-slate-700 opacity-90"}`}>
            <div className={`shrink-0 p-4 rounded-2xl ${policy.status === "ACTIVE" ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
              {policy.status === "ACTIVE" ? <Lock className="w-6 h-6" /> : <ServerOff className="w-6 h-6" />}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{policy.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${policy.status === "ACTIVE" ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-widest mr-2">Priority: {policy.priority}</span>
                  <button onClick={() => void toggleStatus(policy)} className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    {policy.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => void handleDelete(policy.id)} className="px-3 py-1.5 text-sm font-semibold text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{policy.description || "No description."}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Natural Language Rule</p>
                  <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">"{policy.natural_language || "-"}"</p>
                </div>
                <div className="bg-slate-900 dark:bg-black/40 rounded-2xl p-5 border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings2 className="w-3 h-3 text-emerald-400" /> Compiled DSL Map
                  </p>
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">{policy.dsl || "-"}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-500" /> New AI Policy
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">X</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Policy Name</label>
                <input type="text" placeholder="e.g. Employee Salary Protection" value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <input type="text" placeholder="What does this policy achieve?" value={newPolicy.description} onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Natural Language Rule</label>
                <textarea value={newPolicy.natural_language} onChange={e => setNewPolicy({ ...newPolicy, natural_language: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y font-medium" placeholder="Describe the rule plainly." />
              </div>

              {!translatedDSL ? (
                <button onClick={() => void handleTranslate()} disabled={translating || !newPolicy.natural_language} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {translating ? "Compiling to DSL..." : "Compile to DSL"}
                </button>
              ) : (
                <div className="bg-slate-900 dark:bg-black/50 rounded-xl p-4 border border-slate-800">
                  <label className="block text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Generated DSL</label>
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">{translatedDSL}</pre>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                <button onClick={() => void handleCreate()} disabled={!translatedDSL} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Enforce Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
