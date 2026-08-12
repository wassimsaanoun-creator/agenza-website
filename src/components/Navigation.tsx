"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AgenzaLogo, { AgenzaSymbol } from "./brand/AgenzaLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mechanical", label: "Engineering" },
  { href: "/software", label: "Digital" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-obsidian/85 backdrop-blur-md border-b border-white/[0.08]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <AgenzaLogo variant="primary" size={30} />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-body text-sm transition-colors ${
                    active ? "text-electric" : "text-titanium hover:text-agenza-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-px bg-electric" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/contact" className="font-body text-sm text-titanium hover:text-agenza-white transition-colors">
              Contact
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-electric text-obsidian font-medium text-sm rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
            >
              START A PROJECT
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-agenza-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-obsidian z-40 border-t border-white/[0.08]">
          <div className="flex flex-col p-6 gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-4 border-b border-white/[0.06] font-display text-2xl ${
                    active ? "text-electric" : "text-agenza-white"
                  }`}
                >
                  {link.label}
                  <span className="font-mono text-xs text-titanium">
                    0{NAV_LINKS.indexOf(link) + 1}
                  </span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-4 bg-electric text-obsidian font-medium rounded-[8px]"
            >
              START A PROJECT →
            </Link>
            <div className="mt-8 flex items-center gap-3">
              <AgenzaSymbol size={24} />
              <span className="font-mono text-[10px] tracking-[0.25em] text-titanium">
                ENGINEERING × DIGITAL
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
