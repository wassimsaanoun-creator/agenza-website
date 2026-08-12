"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Service {
  id: string;
  name: string;
  slug: string;
  division: string;
  description: string;
  content: string | null;
  status: string;
}

const inputClass = "w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 focus:outline-none focus:border-electric transition-colors";
const labelClass = "block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2";

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", division: "mechanical", description: "", content: "", status: "published" });

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    const res = await fetch("/api/admin/services");
    if (res.ok) { const data = await res.json(); setServices(data.services); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/services/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    } else {
      await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    }
    loadServices();
    setShowModal(false);
    setEditing(null);
    setFormData({ name: "", division: "mechanical", description: "", content: "", status: "published" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    loadServices();
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setFormData({ name: s.name, division: s.division, description: s.description, content: s.content || "", status: s.status });
    setShowModal(true);
  };

  const filtered = filter === "all" ? services : services.filter((s) => s.division === filter);

  return (
    <AdminShell title="Services" counts={{ services: services.length }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-electric">CONTENT / SERVICES</span>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Manage services</h2>
        </div>
        <button onClick={() => { setEditing(null); setFormData({ name: "", division: "mechanical", description: "", content: "", status: "published" }); setShowModal(true); }} className="px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] hover:brightness-110">+ NEW SERVICE</button>
      </div>

      <div className="flex gap-2 mb-6">
        {["all", "mechanical", "software"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-[8px] text-xs font-mono uppercase ${filter === f ? "bg-electric text-obsidian" : "bg-graphite text-titanium border border-white/[0.08]"}`}>{f}</button>
        ))}
      </div>

      <div className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/[0.02] border-b border-white/[0.08]">
            <tr>
              {["Service", "Division", "Status", "Actions"].map((h) => (
                <th key={h} className={`px-6 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-titanium ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filtered.length > 0 ? filtered.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4"><div className="text-agenza-white font-medium">{s.name}</div><div className="text-titanium text-sm line-clamp-1">{s.description}</div></td>
                <td className="px-6 py-4"><span className="font-mono text-[10px] uppercase text-titanium">{s.division}</span></td>
                <td className="px-6 py-4"><span className={`font-mono text-[10px] px-2 py-1 rounded ${s.status === "published" ? "bg-electric/10 text-electric" : "bg-amber-400/10 text-amber-300"}`}>{s.status.toUpperCase()}</span></td>
                <td className="px-6 py-4 text-right"><button onClick={() => openEdit(s)} className="font-mono text-[11px] text-agenza-white hover:text-electric mr-4">EDIT</button><button onClick={() => handleDelete(s.id)} className="font-mono text-[11px] text-red-400 hover:text-red-300">DELETE</button></td>
              </tr>
            )) : <tr><td colSpan={4} className="px-6 py-16 text-center text-titanium">No services found</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-8 w-full max-w-lg">
            <h3 className="font-display font-semibold text-xl text-agenza-white mb-6">{editing ? "Edit Service" : "New Service"}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className={labelClass}>Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required /></div>
              <div><label className={labelClass}>Division</label><select value={formData.division} onChange={(e) => setFormData({ ...formData, division: e.target.value })} className={inputClass}><option value="mechanical">Mechanical Engineering</option><option value="software">Software & Digital</option></select></div>
              <div><label className={labelClass}>Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={inputClass} required /></div>
              <div><label className={labelClass}>Content</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className={inputClass} /></div>
              <div><label className={labelClass}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}><option value="published">Published</option><option value="draft">Draft</option></select></div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 py-3 bg-electric text-obsidian font-medium rounded-[8px] hover:brightness-110">SAVE</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/[0.08] text-agenza-white rounded-[8px] hover:border-electric">CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
