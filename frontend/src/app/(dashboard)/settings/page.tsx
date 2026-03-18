"use client";

import { useState } from "react";
import { Save, User, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Manage your Command Center preferences, API keys, and account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-2xl font-bold flex items-center gap-3">
            <User className="w-5 h-5" /> Profile
          </div>
          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-2xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </div>
          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-2xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
            <Key className="w-5 h-5" /> API Keys
          </div>
          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-2xl font-medium flex items-center gap-3 cursor-pointer transition-colors">
            <Shield className="w-5 h-5" /> Security
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                <input
                  type="text"
                  defaultValue="Dean Henderson"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="dean.henderson@atlas.edu"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Email Notifications</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Receive daily summaries</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-800" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Agent Alerts</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">When agents require approval</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-800" />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-5 h-5" />
              Save Preferences
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-4">
                Changes saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
