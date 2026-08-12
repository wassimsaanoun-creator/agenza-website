"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  division: string;
  service: string | null;
  description: string;
  status: string;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "qualified", "meeting", "proposal", "won", "lost"];

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch("/api/admin/leads");
    if (res.ok) { const data = await res.json(); setLeads(data.leads); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    load();
    setSelected(null);
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <AdminShell title="Leads" counts={{ leads: leads.length }}>
      <div className="mb-8">
        <span className="font-mono text-[10px] tracking-[0.2em] text-electric">PIPELINE / LEADS</span>
        <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Manage inquiries</h2>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-[8px] text-xs font-mono uppercase whitespace-nowrap ${filter === "all" ? "bg-electric text-obsidian" : "bg-graphite text-titanium border border-white/[0.08]"}`}>All / {String(leads.length).padStart(2, "0")}</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-[8px] text-xs font-mono uppercase whitespace-nowrap ${filter === s ? "bg-electric text-obsidian" : "bg-graphite text-titanium border border-white/[0.08]"}`}>{s} / {String(leads.filter((l) => l.status === s).length).padStart(2, "0")}</button>
        ))}
      </div>

      <div className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/[0.08]">
              <tr>{["Name", "Contact", "Division", "Status", "Date", "Actions"].map((h) => (<th key={h} className={`px-6 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-titanium ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>))}</tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.length > 0 ? filtered.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelected(l)}>
                  <td className="px-6 py-4"><div className="text-agenza-white font-medium">{l.name}</div><div className="text-titanium text-sm">{l.company || "—"}</div></td>
                  <td className="px-6 py-4 text-titanium text-sm">{l.email}</td>
                  <td className="px-6 py-4"><span className="font-mono text-[10px] uppercase text-titanium">{l.division}</span></td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="bg-obsidian border border-white/[0.08] rounded px-2 py-1 text-xs text-agenza-white font-mono uppercase">
                      {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-titanium">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}><button onClick={() => handleDelete(l.id)} className="font-mono text-[11px] text-red-400 hover:text-red-300">DELETE</button></td>
                </tr>
              )) : <tr><td colSpan={6} className="px-6 py-16 text-center text-titanium">No leads found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-xl text-agenza-white">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-titanium hover:text-agenza-white">×</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "EMAIL", value: selected.email },
                { label: "COMPANY", value: selected.company },
                { label: "DIVISION", value: selected.division },
                { label: "SERVICE", value: selected.service },
                { label: "STATUS", value: selected.status },
              ].filter((r) => r.value).map((row) => (
                <div key={row.label} className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="font-mono text-[10px] tracking-wide text-titanium">{row.label}</span>
                  <span className="text-agenza-white">{row.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <span className="font-mono text-[10px] tracking-wide text-titanium block mb-2">PROJECT DESCRIPTION</span>
                <p className="text-agenza-white leading-relaxed">{selected.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
