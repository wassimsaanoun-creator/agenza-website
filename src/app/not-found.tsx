import Link from "next/link";
import { AgenzaSymbol } from "@/components/brand/AgenzaLogo";
import { TechnicalGrid } from "@/components/brand/EngineeringVisual";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-obsidian relative overflow-hidden">
      <TechnicalGrid />
      <div className="relative text-center">
        <div className="flex justify-center mb-8"><AgenzaSymbol size={56} /></div>
        <div className="font-mono text-electric text-sm tracking-[0.2em] mb-4">ERROR / 404</div>
        <h1 className="font-display font-bold text-5xl md:text-7xl text-agenza-white tracking-tight">
          Page not found
        </h1>
        <p className="mt-6 text-titanium text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Link href="/" className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110">
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
