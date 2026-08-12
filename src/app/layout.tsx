import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGENZA — Engineering the physical. Building the digital.",
  description: "AGENZA is a premium technology studio combining mechanical engineering, software development and AI to transform ideas into engineered products, digital systems and intelligent solutions.",
  keywords: ["mechanical engineering", "software development", "CAD", "CAD/CAM", "injection mold design", "web development", "AI automation", "SaaS", "product design", "digital transformation"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AGENZA — Engineering × Digital",
    description: "Engineering the physical. Building the digital.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
