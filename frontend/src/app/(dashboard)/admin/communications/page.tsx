"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, RefreshCw, RotateCw, Search } from "lucide-react";
import { api } from "@/lib/api";

type CommunicationItem = {
  id: number;
  domain: string;
  module: string;
  channel: string;
  recipient: string;
  message: string;
  status: "delivered" | "queued" | "failed" | string;
  provider: string;
  provider_detail: string;
  attempts?: number;
  last_attempt_at?: string;
  created_at?: string;
};

type CommunicationListResponse = {
  items: CommunicationItem[];
  count: number;
};

export default function AdminCommunicationsPage() {
  const [items, setItems] = useState<CommunicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "delivered" | "queued" | "failed">("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const loadCommunications = async () => {
    setLoading(true);
    setError("");
    try {
      const qs = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const data = await api<CommunicationListResponse>(`/api/ops/communications${qs}`);
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load communications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCommunications();
  }, [statusFilter]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      i.recipient.toLowerCase().includes(q) ||
      i.channel.toLowerCase().includes(q) ||
      i.domain.toLowerCase().includes(q) ||
      i.module.toLowerCase().includes(q) ||
      i.provider.toLowerCase().includes(q)
    );
  }, [items, query]);

  const retryDelivery = async (item: CommunicationItem) => {
    setRetryingId(item.id);
    setError("");
    try {
      await api(`/api/ops/${item.domain}/${item.module}/communications/${item.id}/retry`, {
        method: "POST",
      });
      await loadCommunications();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to retry delivery.");
    } finally {
      setRetryingId(null);
    }
  };

  const deliveredCount = items.filter((i) => i.status === "delivered").length;
  const queuedCount = items.filter((i) => i.status === "queued").length;
  const failedCount = items.filter((i) => i.status === "failed").length;

  const statusClass = (status: string) => {
    if (status === "delivered") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "queued") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Delivery Monitor</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track queued, delivered, and failed outbound communication across all modules.</p>
        </div>
        <button onClick={() => void loadCommunications()} className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm inline-flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Delivered</p>
          <p className="text-3xl font-black text-emerald-800">{deliveredCount}</p>
        </div>
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
          <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Queued</p>
          <p className="text-3xl font-black text-amber-800">{queuedCount}</p>
        </div>
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50">
          <p className="text-xs font-black text-rose-700 uppercase tracking-widest">Failed</p>
          <p className="text-3xl font-black text-rose-800">{failedCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipient, channel, domain, module..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "delivered" | "queued" | "failed")}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          >
            <option value="all">All statuses</option>
            <option value="delivered">Delivered</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Target</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Domain / Module</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Provider</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading deliveries...</td>
                </tr>
              ) : null}

              {!loading && filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No communication entries found.</td>
                </tr>
              ) : null}

              {filteredItems.map((item) => (
                <tr key={`${item.domain}-${item.module}-${item.id}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</div>
                    <div className="text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleTimeString() : "-"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.recipient}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{item.channel}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-mono">{item.domain} / {item.module}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.provider}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.provider_detail}</div>
                    <div className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                      <Clock3 className="w-3 h-3" /> Attempts: {item.attempts ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusClass(item.status)}`}>
                      {item.status === "delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> : item.status === "queued" ? <Clock3 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      disabled={retryingId === item.id}
                      onClick={() => void retryDelivery(item)}
                      className="px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${retryingId === item.id ? "animate-spin" : ""}`} /> Retry
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
