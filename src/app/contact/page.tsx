"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Eyebrow } from "@/components/brand/primitives";
import { TechnicalGrid, DigitalNetwork } from "@/components/brand/EngineeringVisual";
import { AgenzaSymbol } from "@/components/brand/AgenzaLogo";

const SERVICES = {
  mechanical: ["CAD / 3D Modeling", "Product Development", "CAD/CAM", "Injection Mold Design", "Engineering Calculations", "Simulation", "Manufacturing Support"],
  software: ["Website", "Web Application", "Business System", "AI Automation", "SaaS Development", "Mobile App", "Digital Transformation"],
};

const inputClass = "w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 font-body focus:outline-none focus:border-electric transition-colors";
const labelClass = "block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [division, setDivision] = useState("mechanical");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else setError(data.error || "Something went wrong");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main>
        <section className="relative pt-40 pb-24 px-6 bg-obsidian overflow-hidden min-h-screen">
          <TechnicalGrid />
          <DigitalNetwork className="opacity-30" />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6"><Eyebrow>LET'S TALK</Eyebrow></div>
              <h1 className="font-display font-bold text-agenza-white text-5xl md:text-6xl leading-[0.98] tracking-tight">
                Let's build<br /><span className="text-electric">something.</span>
              </h1>
              <p className="mt-6 text-titanium text-lg">
                Tell us what you're trying to build, improve or automate.
              </p>
            </div>

            {submitted ? (
              <div className="bg-graphite border border-electric/20 rounded-[12px] p-10 text-center">
                <div className="flex justify-center mb-6"><AgenzaSymbol size={48} /></div>
                <h2 className="font-display font-semibold text-2xl text-agenza-white mb-3">Request received.</h2>
                <p className="text-titanium mb-8">Your project request has been received. We'll get back to you within 24 hours.</p>
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-electric hover:brightness-110">
                  ← BACK TO HOME
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-graphite border border-white/[0.08] rounded-[12px] p-8 md:p-10 space-y-8">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[8px] text-red-400 text-sm font-mono">
                    {error}
                  </div>
                )}

                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-electric mb-4">01 / PERSONAL</div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Name *</label>
                      <input type="text" name="name" required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input type="email" name="email" required className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className={labelClass}>Phone</label>
                    <input type="tel" name="phone" className={inputClass} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08]">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-electric mb-4 mt-6">02 / COMPANY</div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input type="text" name="company" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Website</label>
                      <input type="url" name="website" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <input type="text" name="country" className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08]">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-electric mb-4 mt-6">03 / PROJECT</div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Division *</label>
                      <select name="division" value={division} onChange={(e) => setDivision(e.target.value)} required className={inputClass}>
                        <option value="mechanical">Mechanical Engineering</option>
                        <option value="software">Software & Digital</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Service</label>
                      <select name="service" className={inputClass}>
                        <option value="">Select a service</option>
                        {SERVICES[division as keyof typeof SERVICES].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className={labelClass}>What are you trying to build or solve? *</label>
                    <textarea name="description" rows={5} required className={inputClass} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label className={labelClass}>Timeline</label>
                      <select name="timeline" className={inputClass}>
                        <option value="">Select timeline</option>
                        <option value="ASAP">ASAP</option>
                        <option value="1-4 weeks">1-4 weeks</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3+ months">3+ months</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Budget (Optional)</label>
                      <input type="text" name="budget" placeholder="e.g. $5,000 - $10,000" className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className={labelClass}>Attachments</label>
                    <input type="file" name="files" multiple accept=".pdf,.jpg,.jpeg,.png,.zip" className="w-full text-titanium text-sm file:mr-4 file:py-2 file:px-4 file:rounded-[6px] file:border-0 file:bg-white/5 file:text-agenza-white file:font-mono file:text-xs hover:file:bg-white/10 file:cursor-pointer" />
                    <p className="text-titanium/60 text-xs mt-2 font-mono">PDF · JPG · PNG · ZIP (MAX 50MB EACH)</p>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="group w-full inline-flex items-center justify-center gap-2 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 disabled:opacity-50">
                  {loading ? "SENDING..." : "SEND PROJECT REQUEST"}
                  {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
