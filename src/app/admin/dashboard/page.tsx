"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface Stats {
  totalProjects: number;
  mechanicalProjects: number;
  softwareProjects: number;
  publishedProjects: number;
  draftProjects: number;
  featuredProjects: number;
  totalServices: number;
  publishedTestimonials: number;
  leads: { total: number; new: number; contacted: number; qualified: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<{ projects: any[]; leads: any[] } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats(data.stats);
          setRecent(data.recentActivity);
        }
      })
      .catch(() => {});
  }, []);

  const counts = {
    projects: stats?.totalProjects || 0,
    services: stats?.totalServices || 0,
    leads: stats?.leads?.total || 0,
    testimonials: stats?.publishedTestimonials || 0,
  };

  const bigStats = [
    { value: stats?.totalProjects || 0, label: "TOTAL PROJECTS", tone: "electric" },
    { value: stats?.publishedProjects || 0, label: "PUBLISHED", tone: "white" },
    { value: stats?.leads?.new || 0, label: "NEW LEADS", tone: "electric" },
    { value: stats?.totalServices || 0, label: "SERVICES", tone: "white" },
  ];

  return (
    <AdminShell title="Dashboard" counts={counts}>
      <div className="mb-8">
        <span className="font-mono text-[10px] tracking-[0.2em] text-electric">OVERVIEW</span>
        <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Welcome back</h2>
      </div>

      {/* Big stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {bigStats.map((stat) => (
          <div key={stat.label} className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
            <div className={`font-display font-bold text-4xl ${stat.tone === "electric" ? "text-electric" : "text-agenza-white"}`}>
              {String(stat.value).padStart(2, "0")}
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-titanium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Detail cards */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-5">Projects by Division</h3>
          <div className="space-y-4">
            {[
              { label: "Mechanical Engineering", value: stats?.mechanicalProjects || 0 },
              { label: "Software & Digital", value: stats?.softwareProjects || 0 },
              { label: "Featured", value: stats?.featuredProjects || 0 },
              { label: "Drafts", value: stats?.draftProjects || 0 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-titanium text-sm">{row.label}</span>
                <span className="font-mono text-electric">{String(row.value).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-5">Leads Pipeline</h3>
          <div className="space-y-4">
            {[
              { label: "New", value: stats?.leads?.new || 0 },
              { label: "Contacted", value: stats?.leads?.contacted || 0 },
              { label: "Qualified", value: stats?.leads?.qualified || 0 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-titanium text-sm">{row.label}</span>
                <span className="font-mono text-electric">{String(row.value).padStart(2, "0")}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <span className="text-agenza-white text-sm font-medium">Total</span>
              <span className="font-mono text-agenza-white font-semibold">{String(stats?.leads?.total || 0).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-5">Recent Projects</h3>
          <div className="space-y-3">
            {recent?.projects && recent.projects.length > 0 ? recent.projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <div>
                  <div className="text-agenza-white text-sm font-medium">{p.title}</div>
                  <div className="font-mono text-[10px] tracking-wide text-titanium uppercase">{p.division}</div>
                </div>
                <span className={`font-mono text-[10px] px-2 py-1 rounded ${p.status === "published" ? "bg-electric/10 text-electric" : "bg-amber-400/10 text-amber-300"}`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            )) : <p className="text-titanium text-sm">No projects yet</p>}
          </div>
        </div>

        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-5">Recent Leads</h3>
          <div className="space-y-3">
            {recent?.leads && recent.leads.length > 0 ? recent.leads.map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <div>
                  <div className="text-agenza-white text-sm font-medium">{l.name}</div>
                  <div className="font-mono text-[10px] tracking-wide text-titanium">{l.company || "—"}</div>
                </div>
                <span className="font-mono text-[10px] px-2 py-1 rounded bg-electric/10 text-electric uppercase">{l.status}</span>
              </div>
            )) : <p className="text-titanium text-sm">No leads yet</p>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
