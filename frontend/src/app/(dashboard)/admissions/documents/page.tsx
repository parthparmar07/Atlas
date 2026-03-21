"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, FileSearch, FileText, RefreshCw, ScanLine, Search, UploadCloud, Play, X } from "lucide-react";
import { api, fetchWithAuth } from "@/lib/api";
import ExecutionTrace from "@/components/agents/ExecutionTrace";

type Lead = {
  id: number;
  name: string;
};

type Doc = {
  id: number;
  lead_id: number;
  doc_type: string;
  file_path: string;
  verified: boolean;
  ai_extracted: Record<string, unknown>;
  uploaded_at: string | null;
};

const DOCUMENT_AGENT_ACTIONS = [
  { value: "Verify Batch", label: "Verify Batch" },
  { value: "Flag Issues", label: "Flag Issues" },
  { value: "Generate Checklist", label: "Generate Checklist" },
  { value: "Push to ERP", label: "Push to ERP" },
];

export default function DocumentVerifierPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [docType, setDocType] = useState("resume");

  const loadLeads = async (): Promise<string> => {
    const leadData = await api<Lead[]>("/api/admissions/leads");
    setLeads(leadData ?? []);
    if (!selectedLeadId && leadData?.length) {
      const defaultLeadId = String(leadData[0].id);
      setSelectedLeadId(defaultLeadId);
      return defaultLeadId;
    }
    return selectedLeadId;
  };

  const loadDocs = async (leadId: string) => {
    if (!leadId) {
      setDocs([]);
      return;
    }
    const docData = await api<Doc[]>(`/api/admissions/leads/${leadId}/documents`);
    setDocs(docData ?? []);
  };

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const activeLeadId = await loadLeads();
      if (activeLeadId) {
        await loadDocs(activeLeadId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load document data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  useEffect(() => {
    if (!selectedLeadId) return;
    void loadDocs(selectedLeadId).catch((e) => {
      setError(e instanceof Error ? e.message : "Failed to load lead documents.");
    });
  }, [selectedLeadId]);

  const selectedLeadName = useMemo(() => {
    return leads.find((l) => String(l.id) === selectedLeadId)?.name || "Unknown";
  }, [leads, selectedLeadId]);

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => d.file_path.toLowerCase().includes(q) || d.doc_type.toLowerCase().includes(q));
  }, [docs, query]);

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLeadId) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetchWithAuth(`/api/admissions/leads/${selectedLeadId}/documents?doc_type=${encodeURIComponent(docType)}`, {
        method: "POST",
        headers: {},
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      await loadDocs(selectedLeadId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const verifyDoc = async (docId: number) => {
    setVerifyingId(docId);
    setError("");
    try {
      await api(`/api/admissions/documents/${docId}/verify`, { method: "POST" });
      if (selectedLeadId) await loadDocs(selectedLeadId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to verify document.");
    } finally {
      setVerifyingId(null);
    }
  };

  const [agentRunning, setAgentRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<any>(null);
  const [agentAction, setAgentAction] = useState<string>(DOCUMENT_AGENT_ACTIONS[0].value);

  const buildAgentContext = (action: string) => {
    const verifiedCount = docs.filter((d) => d.verified).length;
    const pendingCount = docs.length - verifiedCount;
    return {
      action,
      lead_id: selectedLeadId ? Number(selectedLeadId) : null,
      lead_name: selectedLeadName,
      doc_type: docType,
      total_docs_for_lead: docs.length,
      verified_docs_for_lead: verifiedCount,
      pending_docs_for_lead: pendingCount,
      limit: Math.max(5, Math.min(30, docs.length || 8)),
      generated_at: new Date().toISOString(),
    };
  };

  const runAutonomousAgent = async () => {
    setAgentRunning(true);
    setError("");
    setAgentResult(null);
    try {
      const context = buildAgentContext(agentAction);
      const data = await api<any>("/api/agent-exec/run", {
        method: "POST",
        body: JSON.stringify({
          agent_id: "admissions-documents",
          action: agentAction,
          context: JSON.stringify(context),
        }),
      });
      setAgentResult(data);
      await loadAll();
      if (selectedLeadId) {
        await loadDocs(selectedLeadId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run bulk OCR agent.");
    } finally {
      setAgentRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-blue-500" />
            AI Document Verification
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Upload lead documents, run OCR verification, and track extracted metadata.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={agentAction}
            onChange={(e) => setAgentAction(e.target.value)}
            className="px-3 py-3 rounded-xl border bg-white text-sm font-bold text-slate-700"
          >
            {DOCUMENT_AGENT_ACTIONS.map((action) => (
              <option key={action.value} value={action.value}>{action.label}</option>
            ))}
          </select>
          <button onClick={runAutonomousAgent} disabled={agentRunning} className="bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-500/20 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition disabled:opacity-50">
            <RefreshCw className={`h-5 w-5 ${agentRunning ? "animate-spin" : ""}`} /> {agentRunning ? "Running..." : `Run ${agentAction}`}
          </button>
          <button onClick={() => void loadAll()} className="px-4 py-3 rounded-xl border bg-white flex items-center gap-2 font-bold">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Lead</label>
          <select value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} className="w-full mt-2 border rounded-xl px-4 py-3 bg-slate-50">
            {!leads.length ? <option value="">No leads found</option> : null}
            {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Document Type</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full mt-2 border rounded-xl px-4 py-3 bg-slate-50">
            <option value="resume">Resume</option>
            <option value="marksheet">Marksheet</option>
            <option value="id_proof">ID Proof</option>
            <option value="recommendation">Recommendation</option>
            <option value="certificate">Certificate</option>
          </select>
        </div>
        <label className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-4 flex items-center justify-center gap-2 text-blue-700 font-bold hover:bg-blue-100 transition">
          <UploadCloud className={`w-5 h-5 ${uploading ? "animate-bounce" : ""}`} />
          {uploading ? "Uploading..." : "Upload Document"}
          <input type="file" className="hidden" onChange={onUpload} disabled={uploading || !selectedLeadId} />
        </label>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by file name or document type..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium" />
          </div>
          <div className="text-sm text-slate-600 self-center">Lead: <span className="font-bold">{selectedLeadName}</span></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/50">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Document</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading documents...</td></tr> : null}
              {!loading && filteredDocs.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No documents uploaded for this lead.</td></tr> : null}
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{doc.file_path.split("/").slice(-1)[0]}</div>
                        <div className="text-xs font-medium text-slate-500">Uploaded {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-semibold text-slate-700">{doc.doc_type}</td>
                  <td className="px-6 py-6">
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider"><AlertCircle className="w-3.5 h-3.5" /> Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button disabled={verifyingId === doc.id || doc.verified} onClick={() => void verifyDoc(doc.id)} className="px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ml-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 disabled:opacity-60">
                      {verifyingId === doc.id ? <><RefreshCw className="h-4 w-4 animate-spin" /> Verifying...</> : doc.verified ? <><CheckCircle className="h-4 w-4" /> Finalized</> : <><ScanLine className="h-4 w-4" /> Start OCR</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {agentResult && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Play className="h-5 w-5 text-indigo-500" /> Agent Execution Result
              </h2>
              <button onClick={() => setAgentResult(null)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Summary</h3>
                <p className="text-slate-700 dark:text-slate-300">{agentResult.result?.summary}</p>
              </div>

              {agentResult.execution_details && agentResult.execution_details.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Execution Pipeline</h3>
                  <ExecutionTrace steps={agentResult.execution_details} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
