"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AgenzaLogo from "@/components/brand/AgenzaLogo";
import { TechnicalGrid } from "@/components/brand/EngineeringVisual";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => { if (res.ok) router.push("/admin/dashboard"); })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) router.push("/admin/dashboard");
      else setError(data.error || "Login failed");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 font-body focus:outline-none focus:border-electric transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-obsidian relative overflow-hidden">
      <TechnicalGrid />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-10">
          <AgenzaLogo variant="primary" size={36} href={null} />
        </div>

        <form onSubmit={handleSubmit} className="bg-graphite border border-white/[0.08] rounded-[12px] p-8">
          <div className="mb-8">
            <span className="font-mono text-[10px] tracking-[0.2em] text-electric">CMS / ADMIN ACCESS</span>
            <h1 className="mt-2 font-display font-semibold text-2xl text-agenza-white">Sign in</h1>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="admin@agenza.com" required />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[8px] text-red-400 text-sm font-mono">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 disabled:opacity-50">
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>

        </form>
      </div>
    </div>
  );
}
