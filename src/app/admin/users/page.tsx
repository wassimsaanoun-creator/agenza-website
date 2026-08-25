"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) { const data = await res.json(); setUsers(data.users); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setEmail(""); setPassword(""); setRole("admin"); setShowForm(false);
      loadUsers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) loadUsers();
    else { const data = await res.json(); alert(data.error || "Could not delete user"); }
  };

  return (
    <AdminShell title="Users" counts={{}}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-electric">SETTINGS / USERS</span>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Manage admin users</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] transition-all hover:brightness-110">
          {showForm ? "CANCEL" : "+ NEW USER"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-graphite border border-white/[0.08] rounded-[12px] p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-titanium mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 focus:outline-none focus:border-electric" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-titanium mb-2">Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 focus:outline-none focus:border-electric" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-titanium mb-2">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white focus:outline-none focus:border-electric">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          {error && <div className="sm:col-span-3 font-mono text-[11px] text-red-400">{error}</div>}
          <div className="sm:col-span-3">
            <button type="submit" disabled={submitting} className="px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] transition-all hover:brightness-110 disabled:opacity-50">
              {submitting ? "CREATING..." : "CREATE USER"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/[0.08]">
              <tr>
                {["Email", "Role", "Created", "Actions"].map((h) => (
                  <th key={h} className={`px-6 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-titanium ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users.length > 0 ? users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-agenza-white font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] tracking-wide uppercase text-titanium">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-titanium text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => handleDelete(u.id)} className="font-mono text-[11px] text-red-400 hover:text-red-300">DELETE</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-titanium">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
