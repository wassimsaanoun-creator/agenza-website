import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Eyebrow, SectionHeading } from "@/components/brand/primitives";
import { EngineeringVisual, DigitalNetwork, TechnicalGrid } from "@/components/brand/EngineeringVisual";
import { AgenzaSymbol } from "@/components/brand/AgenzaLogo";
import { Reveal } from "@/components/brand/Reveal";

export const metadata = {
  title: "About — AGENZA",
  description: "AGENZA is a technology studio where engineering and digital development meet.",
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* HERO */}
        <section className="relative pt-40 pb-16 px-6 bg-obsidian overflow-hidden">
          <TechnicalGrid />
          <div className="relative max-w-5xl mx-auto">
            <Reveal>
              <Eyebrow>ABOUT AGENZA</Eyebrow>
              <h1 className="mt-8 font-display font-bold text-agenza-white text-5xl md:text-7xl leading-[0.98] tracking-tight">
                One studio.<br /><span className="text-electric">Two capabilities.</span>
              </h1>
              <p className="mt-8 text-titanium text-xl max-w-3xl leading-relaxed">
                AGENZA brings physical engineering and digital development under one roof — a premium technology studio combining mechanical engineering, software development and AI.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="relative py-20 px-6 bg-graphite border-y border-white/[0.08]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="relative bg-obsidian border border-white/[0.08] rounded-[12px] p-8 md:p-10 overflow-hidden h-full">
                <EngineeringVisual className="opacity-30" />
                <div className="relative">
                  <span className="font-mono text-electric text-sm tracking-[0.2em]">01 / ENGINEERING</span>
                  <h2 className="mt-5 font-display font-semibold text-2xl text-agenza-white">Mechanical Engineering</h2>
                  <p className="mt-4 text-titanium leading-relaxed">
                    CAD/CAM, product design, injection mold design, engineering calculations, simulation, and manufacturing support — precision engineering from concept to production.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="relative bg-obsidian border border-white/[0.08] rounded-[12px] p-8 md:p-10 overflow-hidden h-full">
                <DigitalNetwork className="opacity-40" />
                <div className="relative">
                  <span className="font-mono text-electric text-sm tracking-[0.2em]">02 / DIGITAL</span>
                  <h2 className="mt-5 font-display font-semibold text-2xl text-agenza-white">Software & Digital</h2>
                  <p className="mt-4 text-titanium leading-relaxed">
                    Websites, web applications, business systems, AI automation, SaaS development, and digital transformation — intelligent software built around real needs.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* APPROACH */}
        <section className="py-24 px-6 bg-obsidian">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="OUR APPROACH" title="Precision meets innovation" className="mb-8" />
              <p className="text-titanium text-lg leading-relaxed">
                We believe in combining engineering precision with digital innovation. Whether you need a physical product designed and manufactured, or a digital system built to automate your business, AGENZA brings the same level of expertise and attention to detail.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-12 space-y-4">
                {[
                  "Dual expertise in mechanical and digital domains",
                  "End-to-end solutions from concept to delivery",
                  "Premium quality and professional excellence",
                  "Modern technology and proven methodologies",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4 p-5 bg-graphite border border-white/[0.08] rounded-[12px]">
                    <span className="text-electric font-mono text-sm mt-0.5">+</span>
                    <span className="text-agenza-white">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 px-6 bg-graphite border-t border-white/[0.08] overflow-hidden">
          <TechnicalGrid />
          <div className="relative max-w-3xl mx-auto text-center">
            <Reveal>
              <div className="flex justify-center mb-8"><AgenzaSymbol size={48} /></div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-agenza-white leading-tight tracking-tight">
                Ready to work<br />together?
              </h2>
              <div className="mt-10">
                <Link href="/contact" className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
                  START A PROJECT <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
