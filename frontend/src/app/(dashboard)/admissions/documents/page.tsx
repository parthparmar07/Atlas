"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, FileText, ScanSearch, UploadCloud } from "lucide-react";
import { API_BASE, api } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  email: string;
};

type VerifyResult = {
  is_valid: boolean;
  confidence_score: number;
  issues_found: string[];
  extracted_key_info: Record<string, string>;
};

export default function DocumentVerifierPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadId, setLeadId] = useState<string>("");
  const [docType, setDocType] = useState("id_proof");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const leadData = await api<Lead[]>("/api/admissions/leads");
        setLeads(leadData ?? []);
        if (leadData?.length) setLeadId(String(leadData[0].id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load leads.");
      }
    };
    void run();
  }, []);

  const onFileChange = (incoming: File | null) => {
    setFile(incoming);
    setResult(null);
    setError("");
  };

  const runVerification = async () => {
    if (!leadId) {
      setError("Select a lead first.");
      return;
    }
    if (!file) {
      setError("Upload a document first.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`${API_BASE}/api/admissions/leads/${leadId}/documents?doc_type=${encodeURIComponent(docType)}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(await uploadRes.text());
      }

      const uploadData = (await uploadRes.json()) as { doc_id: number };
      const verifyData = await api<VerifyResult>(`/api/admissions/documents/${uploadData.doc_id}/verify`, {
        method: "POST",
      });

      setResult(verifyData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Document verification failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white min-h-screen">
      <div className="mb-2">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <ScanSearch className="text-teal-500" /> Document Verifier AI
        </h1>
        <p className="text-gray-500">Upload for a real lead and verify via backend extraction pipeline.</p>
      </div>

      {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold uppercase text-gray-500">Lead</label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          >
            {!leads.length ? <option value="">No leads available</option> : null}
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>{lead.name} ({lead.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-gray-500">Document Type</label>
          <input
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="aadhar, marksheet, transcript"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => void runVerification()}
            disabled={busy || !file || !leadId}
            className="w-full bg-teal-600 disabled:bg-gray-400 text-white font-bold py-2.5 rounded-lg shadow hover:bg-teal-700 transition"
          >
            {busy ? "Processing..." : "Run Verification"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div
          className="border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 transition-colors rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[280px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0] ?? null;
            onFileChange(dropped);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <UploadCloud className="h-14 w-14 text-teal-500 mb-3" />
          <h3 className="font-bold text-lg text-gray-900">Drag and drop document</h3>
          <p className="text-gray-500 text-sm mt-2">PDF or image files supported.</p>
          {file ? (
            <div className="mt-5 p-3 bg-white border border-teal-200 rounded-lg flex items-center gap-3 text-teal-800 font-semibold shadow-sm w-full max-w-xs">
              <FileText className="text-teal-500" />
              <span className="truncate">{file.name}</span>
            </div>
          ) : null}
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="font-bold border-b pb-3 mb-4 text-gray-900">Verification Output</h2>
          {!result && !busy ? <div className="text-sm text-gray-400">No result yet.</div> : null}
          {busy ? <div className="text-sm text-teal-600">Running OCR and verification checks...</div> : null}

          {result ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${result.is_valid ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${result.is_valid ? "text-green-600" : "text-orange-600"}`} />
                  {result.is_valid ? "Valid" : "Needs Review"}
                </div>
                <div className="text-sm text-gray-700 mt-2">Confidence: {result.confidence_score}%</div>
              </div>

              <div>
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Issues</h3>
                {result.issues_found?.length ? (
                  <ul className="text-sm text-gray-700 list-disc pl-5">
                    {result.issues_found.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No issues reported.</div>
                )}
              </div>

              <div>
                <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Extracted Fields</h3>
                <div className="space-y-2">
                  {Object.entries(result.extracted_key_info || {}).map(([k, v]) => (
                    <div key={k} className="text-sm border rounded p-2 bg-gray-50 flex justify-between gap-3">
                      <span className="text-gray-500">{k}</span>
                      <span className="text-gray-900 font-medium">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
