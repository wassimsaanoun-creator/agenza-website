import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Eyebrow, SectionHeading, TechnicalLabel } from "@/components/brand/primitives";
import { EngineeringVisual, TechnicalGrid } from "@/components/brand/EngineeringVisual";
import { ProjectCard } from "@/components/brand/ProjectCard";
import { ServiceCard } from "@/components/brand/ServiceCard";
import { Reveal } from "@/components/brand/Reveal";

export const dynamic = "force-dynamic";

async function getMechanicalServices() {
  try {
    return await db.query.services.findMany({ where: eq(schema.services.division, "mechanical") });
  } catch { return []; }
}

async function getMechanicalProjects() {
  try {
    const projects = await db.query.projects.findMany({ where: eq(schema.projects.division, "mechanical") });
    const published = projects.filter((p) => p.status === "published").slice(0, 6);
    return Promise.all(published.map(async (p) => {
      const media = await db.query.projectMedia.findMany({
        where: eq(schema.projectMedia.projectId, p.id),
        orderBy: asc(schema.projectMedia.sortOrder),
      });
      return { ...p, media };
    }));
  } catch { return []; }
}

export const metadata = {
  title: "Mechanical Engineering — AGENZA",
  description: "CAD/CAM, product design, injection mold design, engineering calculations, simulation and manufacturing support.",
};

export default async function MechanicalPage() {
  const [services, projects] = await Promise.all([getMechanicalServices(), getMechanicalProjects()]);
  const getCover = (media: any[]) => {
    const cover = media?.find((m) => m.isCover) || media?.[0];
    return cover ? { url: cover.fileUrl, type: cover.fileType } : { url: null, type: null };
  };

  return (
    <>
      <Navigation />
      <main>
        {/* HERO */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-obsidian pt-24">
          <TechnicalGrid />
          <EngineeringVisual className="opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <Reveal>
              <Eyebrow>AGENZA ENGINEERING / 01</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-8 font-display font-bold text-agenza-white text-5xl md:text-7xl leading-[0.98] tracking-tight">
                ENGINEERING<br />THE <span className="text-electric">PHYSICAL.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-titanium text-lg max-w-2xl leading-relaxed">
                AGENZA helps companies transform ideas into manufacturable, optimized and technically validated products — from CAD to production.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10">
                <Link href="/contact" className="group inline-flex items-center gap-2 px-7 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
                  START A PROJECT <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section className="relative py-24 px-6 bg-graphite border-y border-white/[0.08]">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <SectionHeading eyebrow="CAPABILITIES" title="Engineering services" subtitle="Precision engineering across the full product lifecycle." className="mb-14" />
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? services.map((service, i) => (
                <Reveal key={service.id} delay={(i % 3) * 60}>
                  <ServiceCard index={i + 1} name={service.name} description={service.description} />
                </Reveal>
              )) : (
                <div className="col-span-full text-center py-16 border border-dashed border-white/[0.08] rounded-[12px]">
                  <p className="text-titanium">Services coming soon. Contact us to learn more.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="relative py-24 px-6 bg-obsidian">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <SectionHeading eyebrow="SELECTED WORK" title="Engineering projects" />
                <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-agenza-white hover:text-electric transition-colors shrink-0">
                  VIEW ALL PROJECTS →
                </Link>
              </div>
            </Reveal>
            {projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => {
                  const cover = getCover(project.media);
                  return (
                    <Reveal key={project.id} delay={(i % 3) * 80}>
                      <ProjectCard slug={project.slug} title={project.title} division={project.division} category={project.category} shortDescription={project.shortDescription} tools={project.tools} index={project.sortOrder || i + 1} coverUrl={cover.url} coverType={cover.type} />
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-[12px]">
                <p className="text-titanium">Engineering projects will appear here soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-32 px-6 bg-graphite border-t border-white/[0.08] overflow-hidden">
          <TechnicalGrid />
          <div className="relative max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-agenza-white leading-tight tracking-tight">
                Ready to engineer<br />your next product?
              </h2>
              <p className="mt-6 text-titanium text-lg">From concept to manufacturing, we're here to help.</p>
              <div className="mt-10">
                <Link href="/contact" className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
                  GET IN TOUCH <span className="transition-transform group-hover:translate-x-1">→</span>
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
