"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, FileSearch, FileText, RefreshCw, ScanLine, Search, UploadCloud } from "lucide-react";
import { api, fetchWithAuth } from "@/lib/api";

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

  const loadLeads = async () => {
    const leadData = await api<Lead[]>("/api/admissions/leads");
    setLeads(leadData ?? []);
    if (!selectedLeadId && leadData?.length) {
      setSelectedLeadId(String(leadData[0].id));
    }
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
      await loadLeads();
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
        <button onClick={() => void loadAll()} className="px-4 py-3 rounded-xl border bg-white flex items-center gap-2 font-bold">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
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
    </div>
  );
}
