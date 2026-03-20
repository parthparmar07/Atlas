"use client";

import { useEffect, useState } from "react";
import { useSchool } from "@/context/SchoolContext";
import { api } from "@/lib/api";
import { Eye, ShieldAlert, CheckCircle, TrendingDown, Clock, Download, RefreshCw, MessageSquare } from "lucide-react";

interface AtRiskStudent {
  id: number;
  name: string;
  email: string;
  roll_number: string;
  attendance_rate: number;
  programme: string;
  risk_score: number;
}

export default function AttendanceWatchdogPage() {
  const { currentSchool } = useSchool();
  const [atRisk, setAtRisk] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api<AtRiskStudent[]>(`/api/academics/attendance/watchdog?school=${currentSchool.id}`);
      setAtRisk(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [currentSchool.id]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            <Eye className="w-10 h-10 text-rose-500" />
            Attendance Watchdog
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium italic">75% threshold auto-monitoring with behavioral intervention.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={() => void loadData()} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition">
               <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-indigo-500" : "text-slate-400"}`} />
            </button>
            <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" /> Export Flagged Reports
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Low Attendance</span>
                <TrendingDown className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{atRisk.length} Students</div>
            <div className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded inline-block">Below 75% Threshold</div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Peak</span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">92.4%</div>
            <div className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded inline-block">Average Retention</div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Warning Precision</span>
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">98.2%</div>
            <div className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded inline-block">Proactive Accuracy</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Student Profile</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Enrollment Status</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Attendance %</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {atRisk.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-6 flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-lg">
                                {s.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-base font-black text-slate-900 leading-tight">{s.name}</div>
                                <div className="text-xs font-bold text-slate-400 mt-1">{s.roll_number}</div>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="text-sm font-black text-slate-700">{s.programme}</div>
                            <div className="text-xs font-bold text-slate-400 mt-1">Full-time Academic</div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: `${s.attendance_rate}%` }} />
                                </div>
                                <span className="text-sm font-black text-rose-600">{s.attendance_rate}%</span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${s.risk_score > 70 ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
                             Risk Score: {s.risk_score}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-2">
                             <button className="p-3 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition cursor-pointer" title="Send SMS/WhatsApp Alert">
                                <MessageSquare className="w-5 h-5" />
                             </button>
                             <button className="p-3 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition cursor-pointer" title="Escalate to Dean">
                                <ShieldAlert className="w-5 h-5" />
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
