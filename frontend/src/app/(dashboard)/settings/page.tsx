"use client";

import { useEffect, useState } from "react";
import { 
  Settings2, Shield, Bell, Key, Database, Globe, 
  Cpu, Lock, Zap, CheckCircle2, Mail
} from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dynamic state for form fields
  const [formData, setFormData] = useState({
    platformName: "Atlas University Ecosystem",
    adminEmail: "admin@atlas.edu",
    maxTokens: "1000000",
    model: "llama-3.3-70b-versatile",
    dbUrl: "postgresql://user:pass@localhost:5432/atlas",
    redisUrl: "redis://localhost:6379",
    mfa: true,
    sso: false,
    audit: true,
    emailAlerts: true,
    smsAlerts: false,
    systemLogs: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;
    const isCheckbox = target instanceof HTMLInputElement && target.type === "checkbox";
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? target.checked : value
    }));
  };

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ settings: typeof formData }>("/api/admin/settings");
      if (data?.settings) {
        setFormData((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleSave = async () => {
    setError("");
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings.");
    }
  };

  const tabs = [
    { id: "general", icon: Settings2, label: "General" },
    { id: "ai", icon: Cpu, label: "AI & Models" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "database", icon: Database, label: "Database" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-indigo-600" />
            Platform Settings
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Manage global system configuration and connected services dynamically.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <Settings2 className="w-5 h-5" />}
          {saved ? "Saved Globally" : "Save Changes"}
        </button>
      </div>

      {loading ? <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm">Loading platform settings...</div> : null}
      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "hover:bg-slate-50 text-slate-600 border border-transparent"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="bg-white border border-slate-200 rounded-[1.5rem] p-8 shadow-sm">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <Globe className="w-6 h-6 text-slate-400" />
                  <h2 className="text-xl font-bold text-slate-800">General Configuration</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Platform Name</label>
                    <input type="text" name="platformName" value={formData.platformName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Admin Contact Email</label>
                    <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "ai" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <Cpu className="w-6 h-6 text-indigo-500" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">AI Inference Settings</h2>
                    <p className="text-xs text-slate-500 font-medium">Manage LLM routers and rate limits.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Default Model</label>
                    <select name="model" value={formData.model} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-indigo-500 outline-none">
                      <option value="llama-3.3-70b-versatile">LLaMA 3.3 70B (Groq)</option>
                      <option value="llama-3-8b-8192">LLaMA 3 8B (Groq)</option>
                      <option value="mixtral-8x7b-32768">Mixtral 8x7B (Groq)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Global Token Limit (Daily)</label>
                    <input type="number" name="maxTokens" value={formData.maxTokens} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <Shield className="w-6 h-6 text-rose-500" />
                  <h2 className="text-xl font-bold text-slate-800">Security & Authentication</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <div><h4 className="font-bold text-slate-800">Require MFA</h4><p className="text-sm text-slate-500">Force multi-factor auth for all administrators.</p></div>
                    <input type="checkbox" name="mfa" checked={formData.mfa} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <div><h4 className="font-bold text-slate-800">Strict Audit Logging</h4><p className="text-sm text-slate-500">Log every state change in the AI framework.</p></div>
                    <input type="checkbox" name="audit" checked={formData.audit} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                  </label>
                </div>
              </div>
            )}
            {activeTab === "database" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <Database className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xl font-bold text-slate-800">Datastore Connections</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Primary Database URL</label>
                    <input type="text" name="dbUrl" value={formData.dbUrl} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Redis Cache URL</label>
                    <input type="text" name="redisUrl" value={formData.redisUrl} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 ring-indigo-500 outline-none" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <Bell className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-bold text-slate-800">Alerts & Messaging</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div><h4 className="font-bold text-slate-800">Email Alerts</h4><p className="text-sm text-slate-500">Send warnings for system anomalies.</p></div>
                    </div>
                    <input type="checkbox" name="emailAlerts" checked={formData.emailAlerts} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                  </label>
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <div><h4 className="font-bold text-slate-800">SMS / WhatsApp (Twilio)</h4><p className="text-sm text-slate-500">Critical escalations instantly routed to admins.</p></div>
                    </div>
                    <input type="checkbox" name="smsAlerts" checked={formData.smsAlerts} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
