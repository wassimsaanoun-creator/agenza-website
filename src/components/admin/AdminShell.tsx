"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AgenzaSymbol } from "@/components/brand/AgenzaLogo";

interface NavItem {
  href: string;
  label: string;
  count?: number;
}

const ICONS: Record<string, ReactNode> = {
  Dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/></svg>
  ),
  Projects: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
  ),
  Services: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="1.5"/><path strokeWidth="1.5" strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>
  ),
  Media: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" strokeWidth="1.5"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/></svg>
  ),
  Leads: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-5 9 5"/></svg>
  ),
  Testimonials: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
  ),
  Settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="1.5"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  ),
};

interface AdminShellProps {
  children: ReactNode;
  title: string;
  counts?: Record<string, number>;
}

export default function AdminShell({ children, title, counts = {} }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
      } catch {
        router.push("/admin/login");
        return;
      }
      setChecking(false);
    };
    checkAuth();
  }, [router]);

  const navItems: NavItem[] = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/projects", label: "Projects", count: counts.projects },
    { href: "/admin/services", label: "Services", count: counts.services },
    { href: "/admin/media", label: "Media", count: counts.media },
    { href: "/admin/leads", label: "Leads", count: counts.leads },
    { href: "/admin/testimonials", label: "Testimonials", count: counts.testimonials },
    { href: "/admin/settings", label: "Settings" },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <AgenzaSymbol size={40} className="animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-graphite border-r border-white/[0.08] z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/[0.08]">
          <AgenzaSymbol size={30} />
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold tracking-[0.15em] text-agenza-white text-sm">AGENZA</span>
            <span className="font-mono text-[9px] tracking-[0.2em] text-titanium mt-1">CMS / ADMIN</span>
          </div>
        </div>

        <nav className="mt-4 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 px-3 py-3 rounded-[8px] mb-1 transition-all ${
                  active ? "bg-electric/10 text-electric" : "text-titanium hover:text-agenza-white hover:bg-white/[0.03]"
                }`}
              >
                <span className="flex items-center gap-3">
                  {ICONS[item.label]}
                  <span className="font-body text-sm">{item.label}</span>
                </span>
                {item.count !== undefined && (
                  <span className={`font-mono text-[10px] tracking-wide ${active ? "text-electric" : "text-titanium/60"}`}>
                    {String(item.count).padStart(3, "0")}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.08]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-titanium hover:text-red-400 hover:bg-red-500/5 rounded-[8px] transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span className="font-body text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-obsidian/85 backdrop-blur-md border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-titanium hover:text-agenza-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="font-display font-semibold text-lg text-agenza-white">{title}</h1>
            </div>
          </div>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
