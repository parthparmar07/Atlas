"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ShieldAlert, CheckCircle, Clock, Download, RefreshCw, FileText } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

interface AuditLog {
  id: number;
  user_email: string;
  action: string;
  resource: string;
  status: string;
  ip_address: string;
  created_at: string;
  details?: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [narrative, setNarrative] = useState<any>(null);
  const [loadingNarrative, setLoadingNarrative] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<AuditLog[]>("/api/admin/audit?limit=300");
      setLogs(data ?? []);
      
      const nar = await api<any>("/api/academics/audit-narrative");
      setNarrative(nar);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadLogs().finally(() => {
      setIsRefreshing(false);
    });
  };

  const handleExport = async () => {
    try {
      const data = await api<{ logs: unknown[]; exported_at: string }>("/api/admin/audit/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-export-${new Date().toISOString().slice(0, 19)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to export logs.");
    }
  };

  const filteredLogs = useMemo(
    () => logs.filter(log => 
      log.user_email.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase())
    ),
    [logs, search]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Immutable execution trail & security events</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/communications" className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold shadow-sm">
            Delivery Monitor
          </Link>
          <button onClick={handleRefresh} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold shadow-sm">
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button onClick={() => void handleExport()} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-bold shadow-sm flex items-center gap-2">
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      {narrative && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <ShieldAlert className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-indigo-200 tracking-[0.2em] border border-white/5">
                  AI Synthesis Engine
                </span>
                <span className="text-white/40 text-xs font-bold font-mono">
                  Analysis of last 50 events
                </span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                {narrative.narrative}
              </h2>
              <div className="flex flex-wrap gap-2">
                {narrative.categories?.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-64 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Risk Sentiment</div>
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * narrative.risk_score) / 100} className={`${narrative.risk_score > 50 ? "text-rose-500" : "text-emerald-500"} transition-all duration-1000`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white leading-none">{narrative.risk_score}</span>
                  <span className="text-[8px] font-bold text-white/40 uppercase mt-1">Score</span>
                </div>
              </div>
              {narrative.anomalies?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 w-full">
                  <div className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Anomalies Detect
                  </div>
                  <div className="text-[10px] text-white/80 font-medium leading-tight italic">
                    {narrative.anomalies[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search logs by email, action, or resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-medium shadow-inner"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-bold shadow-sm">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900">
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">User / IP</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Event</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-400" />
                    Loading secure logs...
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {new Date(log.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                       {log.user_email}
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded inline-block">
                      {log.ip_address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-1">
                      {log.action}
                    </div>
                    <div className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1">
                      {log.resource}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.status === "SUCCESS" ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> SUCCESS
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-full text-xs font-bold border border-rose-200 dark:border-rose-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" /> FAILED
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate" title={log.details}>
                        {log.details || "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matches found</h3>
                    <p className="text-slate-500 font-medium mt-1">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center text-sm font-medium text-slate-500">
          Showing {filteredLogs.length} of {logs.length} entries
        </div>
      </div>
    </div>
  );
}
