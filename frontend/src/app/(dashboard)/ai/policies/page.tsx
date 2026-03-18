"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Shield, Plus, Lock, Settings2 } from "lucide-react";

interface Policy {
  id: number;
  name: string;
  description: string | null;
  policy_type: string;
  natural_language: string | null;
  dsl: string | null;
  status: string;
  priority: number;
  created_at: string;
}

export default function AIPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ name: "", description: "", natural_language: "" });
  const [translating, setTranslating] = useState(false);
  const [translatedDSL, setTranslatedDSL] = useState("");

  useEffect(() => { loadPolicies(); }, []);

  const loadPolicies = async () => {
    try {
      const response = await fetchWithAuth("/api/ai/policies");
      if (!response.ok) throw new Error("Failed to load policies");
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error("Failed to load policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!newPolicy.natural_language.trim()) return;
    setTranslating(true);
    try {
      const response = await fetchWithAuth("/api/ai/policies/translate", {
        method: "POST",
        body: JSON.stringify({ natural_language: newPolicy.natural_language }),
      });
      if (!response.ok) throw new Error("Failed to translate policy");
      const data = await response.json();
      setTranslatedDSL(data.dsl);
    } catch (error) {
      alert("Failed to translate policy");
      console.error(error);
    } finally {
      setTranslating(false);
    }
  };

  const handleCreate = async () => {
    if (!newPolicy.name.trim() || !translatedDSL) return;
    try {
      const response = await fetchWithAuth("/api/ai/policies", {
        method: "POST",
        body: JSON.stringify({
          name: newPolicy.name,
          description: newPolicy.description,
          policy_type: "NATURAL_LANGUAGE",
          natural_language: newPolicy.natural_language,
          dsl: translatedDSL,
          priority: 100,
        }),
      });
      if (!response.ok) throw new Error("Failed to create policy");
      setShowCreateModal(false);
      setNewPolicy({ name: "", description: "", natural_language: "" });
      setTranslatedDSL("");
      await loadPolicies();
    } catch (error) {
      alert("Failed to create policy");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading security policies...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Access Policies</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Define natural language rules mapped to RBAC</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5" />
          Create Policy
        </button>
      </div>

      <div className="grid gap-6">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 flex items-start gap-6 shadow-sm">
            <div className="shrink-0 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{policy.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  Priority: {policy.priority}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-6">{policy.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Natural Language Rule</p>
                  <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">"{policy.natural_language}"</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings2 className="w-3 h-3" /> Compiled DSL
                  </p>
                  <pre className="text-xs font-mono text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{policy.dsl}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Create New AI Policy</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Policy Name</label>
                <input
                  type="text"
                  value={newPolicy.name}
                  onChange={e => setNewPolicy({...newPolicy, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <input
                  type="text"
                  value={newPolicy.description}
                  onChange={e => setNewPolicy({...newPolicy, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Natural Language Rule</label>
                <textarea
                  value={newPolicy.natural_language}
                  onChange={e => setNewPolicy({...newPolicy, natural_language: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="e.g. 'Only HODs can view faculty appraisals'"
                />
                <button
                  onClick={handleTranslate}
                  disabled={translating || !newPolicy.natural_language.trim()}
                  className="mt-3 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  {translating ? "Compiling..." : "Compile to DSL"}
                </button>
              </div>

              {translatedDSL && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-2">Generated DSL</p>
                  <pre className="text-xs font-mono text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap">{translatedDSL}</pre>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newPolicy.name || !translatedDSL}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  Save Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}