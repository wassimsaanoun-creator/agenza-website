import Link from "next/link";
import AgenzaLogo from "./brand/AgenzaLogo";
import { TechnicalGrid } from "./brand/EngineeringVisual";

export default function Footer() {
  return (
    <footer className="relative bg-obsidian border-t border-white/[0.08] overflow-hidden">
      <TechnicalGrid className="opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <AgenzaLogo variant="primary" size={32} />
            <p className="mt-6 font-display text-lg text-agenza-white leading-snug max-w-sm">
              ENGINEERING THE PHYSICAL.
              <br />
              <span className="text-electric">BUILDING THE DIGITAL.</span>
            </p>
            <p className="mt-4 text-titanium text-sm max-w-sm leading-relaxed">
              A premium technology studio combining mechanical engineering, software development and AI.
            </p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-titanium mb-5">
              Capabilities
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/mechanical" className="text-agenza-white hover:text-electric transition-colors">Engineering</Link></li>
              <li><Link href="/software" className="text-agenza-white hover:text-electric transition-colors">Digital</Link></li>
              <li><Link href="/projects" className="text-agenza-white hover:text-electric transition-colors">Projects</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-titanium mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-agenza-white hover:text-electric transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-agenza-white hover:text-electric transition-colors">Contact</Link></li>
              <li><Link href="/admin/login" className="text-agenza-white hover:text-electric transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] tracking-[0.2em] uppercase text-titanium mb-5">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-agenza-white hover:text-electric transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-agenza-white hover:text-electric transition-colors">Instagram</a></li>
              <li><Link href="/contact" className="text-agenza-white hover:text-electric transition-colors">Start a Project</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.15em] text-titanium">
            © {new Date().getFullYear()} AGENZA / ENGINEERING × DIGITAL
          </p>
          <div className="flex gap-6 font-mono text-[11px] tracking-[0.15em] text-titanium">
            <Link href="#" className="hover:text-electric transition-colors">PRIVACY</Link>
            <Link href="#" className="hover:text-electric transition-colors">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
