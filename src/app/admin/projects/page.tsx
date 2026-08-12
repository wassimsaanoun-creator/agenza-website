"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

interface Project {
  id: string;
  title: string;
  slug: string;
  division: string;
  category: string;
  status: string;
  featured: boolean;
  updatedAt: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { loadProjects(); }, [filter]);

  const loadProjects = async () => {
    const params = new URLSearchParams();
    if (filter === "mechanical" || filter === "software") params.set("division", filter);
    else if (filter === "published" || filter === "draft") params.set("status", filter);
    else if (filter === "featured") params.set("featured", "true");
    const res = await fetch(`/api/admin/projects?${params}`);
    if (res.ok) { const data = await res.json(); setProjects(data.projects); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) loadProjects();
  };

  const toggleFeatured = async (project: Project) => {
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !project.featured }),
    });
    loadProjects();
  };

  const togglePublish = async (project: Project) => {
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: project.status === "published" ? "draft" : "published" }),
    });
    loadProjects();
  };

  const filtered = projects.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  const filters = ["all", "mechanical", "software", "published", "draft", "featured"];

  return (
    <AdminShell title="Projects" counts={{ projects: projects.length }}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-electric">CONTENT / PROJECTS</span>
          <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Manage projects</h2>
        </div>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 px-5 py-3 bg-electric text-obsidian font-medium rounded-[8px] transition-all hover:brightness-110">
          + NEW PROJECT
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-3 bg-graphite border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 focus:outline-none focus:border-electric" />
        <div className="flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-[8px] text-xs font-mono tracking-wide uppercase whitespace-nowrap transition-all ${filter === f ? "bg-electric text-obsidian" : "bg-graphite text-titanium border border-white/[0.08] hover:text-agenza-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.02] border-b border-white/[0.08]">
              <tr>
                {["Project", "Division", "Category", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className={`px-6 py-4 font-mono text-[10px] tracking-[0.15em] uppercase text-titanium ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.length > 0 ? filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-agenza-white font-medium">{p.title}</div>
                    <div className="font-mono text-[11px] text-titanium/60">/{p.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] tracking-wide uppercase text-titanium">{p.division}</span>
                  </td>
                  <td className="px-6 py-4 text-titanium text-sm">{p.category}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => togglePublish(p)} className={`font-mono text-[10px] px-2 py-1 rounded ${p.status === "published" ? "bg-electric/10 text-electric" : "bg-amber-400/10 text-amber-300"}`}>
                      {p.status.toUpperCase()}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleFeatured(p)} className={`text-lg ${p.featured ? "text-electric" : "text-titanium/40"}`}>
                      {p.featured ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link href={`/admin/projects/edit/${p.id}`} className="font-mono text-[11px] text-agenza-white hover:text-electric mr-4">EDIT</Link>
                    <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-titanium hover:text-electric mr-4">VIEW</a>
                    <button onClick={() => handleDelete(p.id)} className="font-mono text-[11px] text-red-400 hover:text-red-300">DELETE</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-titanium">No projects found. Create your first project.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
