"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Mail, RefreshCw, Search, Shield, Trash2, UserPlus, X } from "lucide-react";
import { api } from "@/lib/api";

type UserItem = {
  id: number;
  email: string;
  role: "ADMIN" | "DEVELOPER" | "USER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  is_active: boolean;
  created_at: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"ADMIN" | "DEVELOPER" | "USER">("USER");
  const [newUserPassword, setNewUserPassword] = useState("Atlas@12345");

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<UserItem[]>("/api/admin/users");
      setUsers(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((u) => u.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [users, searchQuery]
  );

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) return;
    setError("");
    try {
      await api<UserItem>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole,
          password: newUserPassword,
        }),
      });
      setIsAddOpen(false);
      setNewUserEmail("");
      setNewUserPassword("Atlas@12345");
      setNewUserRole("USER");
      await loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user permanently?")) return;
    setBusyUserId(id);
    setError("");
    try {
      await api(`/api/admin/users/${id}`, { method: "DELETE" });
      await loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete user.");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleApproval = async (id: number, action: "approve" | "reject") => {
    setBusyUserId(id);
    setError("");
    try {
      await api(`/api/admin/users/${id}/${action}`, { method: "POST" });
      await loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update approval status.");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Live CRUD for user provisioning, approvals, and deactivation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadUsers()}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
        >
          <UserPlus className="w-5 h-5" />
          Add User
          </button>
        </div>
      </div>

      {error ? <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div> : null}

      {isAddOpen && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="email" placeholder="Email Address" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500"
            />
            <input
              type="text" placeholder="Temporary Password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500"
            />
            <select
              value={newUserRole} onChange={e => setNewUserRole(e.target.value as "ADMIN" | "DEVELOPER" | "USER")}
              className="p-3 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DEVELOPER">DEVELOPER</option>
              <option value="USER">USER</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddUser} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl flex-1 hover:bg-indigo-700 transition-colors">Save</button>
              <button onClick={() => setIsAddOpen(false)} className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading users...</td></tr>
              )}
              {filteredUsers.length === 0 && (
                 <tr><td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td></tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">User #{user.id}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-4 h-4 ${user.role === 'ADMIN' ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                      user.status === 'APPROVED'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : user.status === 'PENDING'
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {user.status === "PENDING" ? (
                      <>
                        <button
                          disabled={busyUserId === user.id}
                          onClick={() => void handleApproval(user.id, "approve")}
                          className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-slate-400 transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          disabled={busyUserId === user.id}
                          onClick={() => void handleApproval(user.id, "reject")}
                          className="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg text-slate-400 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : null}
                    <button 
                      disabled={busyUserId === user.id}
                      onClick={() => void handleDelete(user.id)}
                      className="p-2 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
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
