"use client";

import AdminShell from "@/components/admin/AdminShell";

export default function AdminSettings() {
  return (
    <AdminShell title="Settings">
      <div className="mb-8">
        <span className="font-mono text-[10px] tracking-[0.2em] text-electric">SYSTEM / SETTINGS</span>
        <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Configuration</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-4">Admin Account</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="font-mono text-[10px] tracking-wide text-titanium">EMAIL</span>
              <span className="text-agenza-white">admin@agenza.com</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="font-mono text-[10px] tracking-wide text-titanium">ROLE</span>
              <span className="text-electric font-mono text-xs">ADMIN</span>
            </div>
          </div>
          <p className="text-titanium/60 text-xs mt-4 leading-relaxed">
            For security in production, change these credentials via the database. Passwords are securely hashed with bcrypt.
          </p>
        </div>

        <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-6">
          <h3 className="font-display font-semibold text-agenza-white mb-4">System Information</h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "PLATFORM", value: "AGENZA CMS" },
              { label: "FRAMEWORK", value: "Next.js 16" },
              { label: "DATABASE", value: "PostgreSQL" },
              { label: "ORM", value: "Drizzle" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between border-b border-white/[0.06] pb-2">
                <span className="font-mono text-[10px] tracking-wide text-titanium">{row.label}</span>
                <span className="text-agenza-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
