import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AGENZA Admin",
  description: "AGENZA CMS Dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-obsidian">{children}</div>;
}
