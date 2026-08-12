"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  status: string;
}

const inputClass = "w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 focus:outline-none focus:border-electric transition-colors";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({ name: "", company: "", position: "", content: "", status: "published" });

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) { const data = await res.json(); setTestimonials(data.testimonials); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await fetch(`/api/admin/testimonials/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    else await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    load();
    setShowModal(false);
    setEditing(null);
    setFormData({ name: "", company: "", position: "", content: "", status: "published" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell title="Testimonials" counts={{ testimonials: testimonials.length }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-electric">CONTENT / TESTIMONIALS</span>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Client feedback</h2>
        </div>
        <button onClick={() => { setEditing(null); setFormData({ name: "", company: "", position: "", content: "", status: "published" }); setShowModal(true); }} className="px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] hover:brightness-110">+ NEW</button>
      </div>

      <div className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/[0.02] border-b border-white/[0.08]">
            <tr>{["Client", "Content", "Status", "Actions"].map((h) => (<th key={h} className={`px-6 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-titanium ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>))}</tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {testimonials.length > 0 ? testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4"><div className="text-agenza-white font-medium">{t.name}</div><div className="text-titanium text-sm">{t.company}{t.position && ` · ${t.position}`}</div></td>
                <td className="px-6 py-4 text-titanium max-w-md line-clamp-1">{t.content}</td>
                <td className="px-6 py-4"><span className={`font-mono text-[10px] px-2 py-1 rounded ${t.status === "published" ? "bg-electric/10 text-electric" : "bg-amber-400/10 text-amber-300"}`}>{t.status.toUpperCase()}</span></td>
                <td className="px-6 py-4 text-right"><button onClick={() => { setEditing(t); setFormData({ name: t.name, company: t.company || "", position: t.position || "", content: t.content, status: t.status }); setShowModal(true); }} className="font-mono text-[11px] text-agenza-white hover:text-electric mr-4">EDIT</button><button onClick={() => handleDelete(t.id)} className="font-mono text-[11px] text-red-400 hover:text-red-300">DELETE</button></td>
              </tr>
            )) : <tr><td colSpan={4} className="px-6 py-16 text-center text-titanium">No testimonials yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-8 w-full max-w-lg">
            <h3 className="font-display font-semibold text-xl text-agenza-white mb-6">{editing ? "Edit" : "New"} Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required />
              <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} /><input type="text" placeholder="Position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className={inputClass} /></div>
              <textarea placeholder="Testimonial content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className={inputClass} required />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}><option value="published">Published</option><option value="draft">Draft</option></select>
              <div className="flex gap-4 pt-2"><button type="submit" className="flex-1 py-3 bg-electric text-obsidian font-medium rounded-[8px] hover:brightness-110">SAVE</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/[0.08] text-agenza-white rounded-[8px] hover:border-electric">CANCEL</button></div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
