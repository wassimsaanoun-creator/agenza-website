"use client";

import Link from "next/link";
import { ReactNode } from "react";

/* ============ TECHNICAL LABEL ============ */
export function TechnicalLabel({
  children,
  className = "",
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`font-mono text-[11px] tracking-[0.25em] uppercase ${
        accent ? "text-electric" : "text-titanium"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* ============ PROJECT NUMBER ============ */
export function ProjectNumber({
  number,
  className = "",
}: {
  number: string | number;
  className?: string;
}) {
  const padded = String(number).padStart(3, "0");
  return (
    <span className={`font-mono text-electric text-sm tracking-[0.2em] ${className}`}>
      PROJECT {padded}
    </span>
  );
}

/* ============ EYEBROW ============ */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-8 h-px bg-electric" />
      <span className="font-mono text-[11px] tracking-[0.28em] uppercase text-electric">
        {children}
      </span>
    </div>
  );
}

/* ============ SECTION HEADING ============ */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "text-center items-center" : "items-start"} flex flex-col ${className}`}
    >
      {eyebrow && (
        <div className={`mb-5 ${align === "center" ? "mx-auto" : ""}`}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="font-display font-semibold text-agenza-white text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-titanium text-base md:text-lg leading-relaxed ${
            align === "center" ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ============ BUTTON ============ */
interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function AgenzaButton({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 font-body font-medium text-sm tracking-wide transition-all duration-300 px-6 py-3.5 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-electric text-obsidian hover:brightness-110 hover:-translate-y-0.5 shadow-[0_0_0_rgba(199,243,107,0)] hover:shadow-[0_8px_24px_-8px_rgba(199,243,107,0.5)]",
    secondary:
      "bg-transparent border border-white/20 text-agenza-white hover:border-electric hover:text-electric",
    ghost: "bg-transparent text-titanium hover:text-agenza-white",
  };
  const width = fullWidth ? "w-full" : "";
  const classes = `${base} ${variants[variant]} ${width} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

/* ============ BADGE ============ */
export function AgenzaBadge({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "electric" | "titanium" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    default: "bg-white/5 text-titanium border-white/10",
    electric: "bg-electric/10 text-electric border-electric/20",
    titanium: "bg-white/5 text-agenza-white border-white/10",
    success: "bg-electric/10 text-electric border-electric/20",
    warning: "bg-amber-400/10 text-amber-300 border-amber-400/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-[6px] border font-mono text-[10px] tracking-[0.15em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ============ CARD ============ */
export function AgenzaCard({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`bg-graphite border border-white/[0.08] rounded-[12px] ${
        hover
          ? "transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ============ INPUT ============ */
export function AgenzaInput({
  label,
  className = "",
  ...props
}: {
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && (
        <label className="block font-mono text-[11px] tracking-[0.15em] uppercase text-titanium mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-4 py-3 bg-obsidian border border-white/[0.08] rounded-[8px] text-agenza-white placeholder-titanium/40 font-body focus:outline-none focus:border-electric transition-colors ${className}`}
      />
    </div>
  );
}
