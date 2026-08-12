import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AgenzaSymbol } from "@/components/brand/AgenzaLogo";
import { Eyebrow, SectionHeading, TechnicalLabel } from "@/components/brand/primitives";
import { EngineeringVisual, DigitalNetwork, TechnicalGrid } from "@/components/brand/EngineeringVisual";
import { ProjectCard } from "@/components/brand/ProjectCard";
import { ServiceCard } from "@/components/brand/ServiceCard";
import { Reveal, Counter } from "@/components/brand/Reveal";

export const dynamic = "force-dynamic";

async function getFeaturedProjects() {
  try {
    const projects = await db.query.projects.findMany({
      where: and(eq(schema.projects.status, "published"), eq(schema.projects.featured, true)),
    });
    const withMedia = await Promise.all(
      projects.slice(0, 6).map(async (p) => {
        const media = await db.query.projectMedia.findMany({
          where: eq(schema.projectMedia.projectId, p.id),
          orderBy: asc(schema.projectMedia.sortOrder),
        });
        return { ...p, media };
      })
    );
    return withMedia;
  } catch {
    return [];
  }
}

async function getServices() {
  try {
    return await db.query.services.findMany({ where: eq(schema.services.status, "published") });
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    return await db.query.testimonials.findMany({ where: eq(schema.testimonials.status, "published") });
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const projects = await db.query.projects.findMany({ where: eq(schema.projects.status, "published") });
    return {
      total: projects.length,
      mechanical: projects.filter((p) => p.division === "mechanical").length,
      software: projects.filter((p) => p.division === "software").length,
    };
  } catch {
    return { total: 0, mechanical: 0, software: 0 };
  }
}

export default async function HomePage() {
  const [featuredProjects, services, testimonials, stats] = await Promise.all([
    getFeaturedProjects(),
    getServices(),
    getTestimonials(),
    getStats(),
  ]);

  const mechanicalServices = services.filter((s) => s.division === "mechanical");
  const softwareServices = services.filter((s) => s.division === "software");

  const getCover = (media: any[]) => {
    const cover = media?.find((m) => m.isCover) || media?.[0];
    return cover ? { url: cover.fileUrl, type: cover.fileType } : { url: null, type: null };
  };

  return (
    <>
      <Navigation />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian">
        <TechnicalGrid />
        <EngineeringVisual className="left-1/2 opacity-60" />
        <div className="absolute top-0 right-0 w-[45%] h-full">
          <DigitalNetwork />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>AGENZA / ENGINEERING × DIGITAL</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-8 font-display font-bold text-agenza-white text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.98] tracking-tight">
                ENGINEERING
                <br />
                THE PHYSICAL.
                <br />
                <span className="text-electric">BUILDING</span>
                <br />
                <span className="text-electric">THE DIGITAL.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-titanium text-lg md:text-xl max-w-xl leading-relaxed">
                AGENZA combines mechanical engineering, software development and AI to transform ideas into engineered products, digital systems and intelligent solutions.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                >
                  START A PROJECT
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-white/20 text-agenza-white font-medium rounded-[8px] transition-all duration-300 hover:border-electric hover:text-electric"
                >
                  EXPLORE OUR WORK
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative border-y border-white/[0.08] bg-graphite">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: stats.total, label: "PROJECTS DELIVERED", suffix: "+" },
            { value: stats.mechanical, label: "ENGINEERING", suffix: "" },
            { value: stats.software, label: "DIGITAL", suffix: "" },
            { value: 2, label: "CAPABILITIES", suffix: "" },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="font-display font-bold text-4xl md:text-5xl text-electric">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-titanium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TWO AXES */}
      <section className="relative py-24 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="TWO CAPABILITIES / ONE STUDIO"
              title={<>From concept to execution.</>}
              subtitle="AGENZA brings physical engineering and digital development under one roof."
              align="center"
              className="mx-auto mb-16"
            />
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Engineering */}
            <Reveal>
              <div className="group relative bg-graphite border border-white/[0.08] rounded-[12px] p-8 md:p-10 transition-all duration-300 hover:border-white/20 overflow-hidden h-full">
                <EngineeringVisual className="opacity-30" />
                <div className="relative">
                  <span className="font-mono text-electric text-sm tracking-[0.2em]">01 / ENGINEERING</span>
                  <h3 className="mt-5 font-display font-semibold text-3xl text-agenza-white leading-tight">
                    Engineering<br />the physical.
                  </h3>
                  <p className="mt-4 text-titanium leading-relaxed">
                    AGENZA helps companies transform ideas into manufacturable, optimized and technically validated products.
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
                    {["CAD / 3D", "CAD/CAM", "Product Dev", "Injection Molds", "Calculations", "Simulation"].map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-agenza-white">
                        <span className="text-electric font-mono text-xs">+</span> {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/mechanical"
                    className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-agenza-white group-hover:text-electric transition-colors"
                  >
                    EXPLORE ENGINEERING
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Digital */}
            <Reveal delay={100}>
              <div className="group relative bg-graphite border border-white/[0.08] rounded-[12px] p-8 md:p-10 transition-all duration-300 hover:border-white/20 overflow-hidden h-full">
                <DigitalNetwork className="opacity-40" />
                <div className="relative">
                  <span className="font-mono text-electric text-sm tracking-[0.2em]">02 / DIGITAL</span>
                  <h3 className="mt-5 font-display font-semibold text-3xl text-agenza-white leading-tight">
                    Building<br />the digital.
                  </h3>
                  <p className="mt-4 text-titanium leading-relaxed">
                    AGENZA creates websites, applications, business systems, automation workflows and SaaS products designed around real business needs.
                  </p>
                  <ul className="mt-6 grid grid-cols-2 gap-y-2 gap-x-4">
                    {["Websites", "Web Apps", "Business Systems", "AI Automation", "SaaS", "Mobile Apps"].map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-agenza-white">
                        <span className="text-electric font-mono text-xs">+</span> {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/software"
                    className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-agenza-white group-hover:text-electric transition-colors"
                  >
                    EXPLORE DIGITAL
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section id="projects" className="relative py-24 px-6 bg-graphite border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <SectionHeading
                eyebrow="SELECTED WORK"
                title="Projects"
                subtitle="Engineered products and digital systems across both capabilities."
              />
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-agenza-white hover:text-electric transition-colors shrink-0"
              >
                VIEW ALL PROJECTS →
              </Link>
            </div>
          </Reveal>

          {featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => {
                const cover = getCover(project.media);
                return (
                  <Reveal key={project.id} delay={(i % 3) * 80}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      division={project.division}
                      category={project.category}
                      shortDescription={project.shortDescription}
                      tools={project.tools}
                      index={project.sortOrder || i + 1}
                      coverUrl={cover.url}
                      coverType={cover.type}
                    />
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-[12px]">
              <p className="text-titanium">Featured projects will appear here soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-24 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="WHAT WE DO"
              title="Services"
              subtitle="Comprehensive solutions for engineering and digital challenges."
              align="center"
              className="mx-auto mb-16"
            />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-electric text-sm tracking-[0.2em]">01</span>
                <TechnicalLabel>AGENZA ENGINEERING</TechnicalLabel>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {mechanicalServices.slice(0, 4).map((service, i) => (
                  <Reveal key={service.id} delay={i * 60}>
                    <ServiceCard index={i + 1} name={service.name} description={service.description} />
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-electric text-sm tracking-[0.2em]">02</span>
                <TechnicalLabel>AGENZA DIGITAL</TechnicalLabel>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {softwareServices.slice(0, 4).map((service, i) => (
                  <Reveal key={service.id} delay={i * 60}>
                    <ServiceCard index={i + 1} name={service.name} description={service.description} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="relative py-24 px-6 bg-graphite border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeading
              eyebrow="HOW WE WORK"
              title="The AGENZA process"
              subtitle="A proven methodology from concept to delivery."
              align="center"
              className="mx-auto mb-16"
            />
          </Reveal>
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-white/[0.08]" />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {["Discover", "Design", "Engineer", "Develop", "Validate", "Deliver"].map((step, i) => (
                <Reveal key={step} delay={i * 60}>
                  <div className="relative">
                    <div className="relative z-10 w-16 h-16 mx-auto md:mx-0 rounded-full bg-obsidian border border-white/[0.08] flex items-center justify-center">
                      <span className="font-mono text-electric text-sm">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h4 className="mt-4 font-display font-medium text-agenza-white text-center md:text-left">{step}</h4>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="relative py-24 px-6 bg-obsidian">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="CLIENT FEEDBACK"
                title="Trusted by builders"
                align="center"
                className="mx-auto mb-16"
              />
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 80}>
                  <div className="bg-graphite border border-white/[0.08] rounded-[12px] p-7 h-full flex flex-col">
                    <div className="text-electric font-mono text-sm mb-4">{"★".repeat(t.rating || 5)}</div>
                    <p className="text-agenza-white leading-relaxed flex-1">"{t.content}"</p>
                    <div className="mt-6 pt-6 border-t border-white/[0.08]">
                      <div className="font-display font-medium text-agenza-white">{t.name}</div>
                      <div className="font-mono text-[11px] tracking-wide text-titanium mt-1">
                        {t.position}{t.company && ` · ${t.company}`}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-32 px-6 bg-graphite border-t border-white/[0.08] overflow-hidden">
        <TechnicalGrid />
        <EngineeringVisual className="opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="flex justify-center mb-8">
              <AgenzaSymbol size={48} />
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl text-agenza-white leading-tight tracking-tight">
              Have a project<br />in mind?
            </h2>
            <p className="mt-6 text-titanium text-lg max-w-xl mx-auto">
              Let's discuss how AGENZA can help bring your ideas to life — whether physical or digital.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
              >
                START A PROJECT
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
