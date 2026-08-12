import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ProjectNumber, TechnicalLabel } from "@/components/brand/primitives";
import { EngineeringVisual, DigitalNetwork, TechnicalGrid } from "@/components/brand/EngineeringVisual";
import { ProjectCard } from "@/components/brand/ProjectCard";
import { Reveal } from "@/components/brand/Reveal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const project = await db.query.projects.findFirst({
      where: and(eq(schema.projects.slug, slug), eq(schema.projects.status, "published")),
    });
    if (project) {
      return {
        title: `${project.title} — AGENZA`,
        description: project.seoDescription || project.shortDescription,
      };
    }
  } catch {}
  return { title: "Project not found — AGENZA" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await db.query.projects.findFirst({
    where: and(eq(schema.projects.slug, slug), eq(schema.projects.status, "published")),
  });

  if (!project) notFound();

  const media = await db.query.projectMedia.findMany({
    where: eq(schema.projectMedia.projectId, project.id),
    orderBy: asc(schema.projectMedia.sortOrder),
  });

  const cover = media.find((m) => m.isCover) || media[0];
  const gallery = media.filter((m) => m.id !== cover?.id);

  const relatedRaw = await db.query.projects.findMany({
    where: and(eq(schema.projects.status, "published"), eq(schema.projects.division, project.division)),
  });
  const related = await Promise.all(
    relatedRaw.filter((p) => p.id !== project.id).slice(0, 3).map(async (p) => {
      const m = await db.query.projectMedia.findMany({
        where: eq(schema.projectMedia.projectId, p.id),
        orderBy: asc(schema.projectMedia.sortOrder),
      });
      return { ...p, media: m };
    })
  );

  const isMechanical = project.division === "mechanical";

  const caseStudy = [
    { num: "01", label: "THE CHALLENGE", content: project.challenge },
    { num: "02", label: "THE APPROACH", content: project.solution },
    { num: "03", label: isMechanical ? "ENGINEERING" : "DEVELOPMENT", content: project.process },
    { num: "04", label: "THE RESULT", content: project.results },
  ].filter((s) => s.content);

  return (
    <>
      <Navigation />
      <main>
        {/* HERO */}
        <section className="relative pt-40 pb-12 px-6 bg-obsidian overflow-hidden">
          <TechnicalGrid />
          {isMechanical ? <EngineeringVisual className="opacity-30" /> : <DigitalNetwork className="opacity-40" />}
          <div className="relative max-w-5xl mx-auto">
            <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-titanium hover:text-electric transition-colors mb-8">
              ← BACK TO PROJECTS
            </Link>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <ProjectNumber number={project.sortOrder || 1} />
                <span className="text-titanium/40">/</span>
                <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-electric">
                  {isMechanical ? "MECHANICAL ENGINEERING" : "SOFTWARE & DIGITAL"}
                </span>
              </div>
              <h1 className="font-display font-bold text-agenza-white text-4xl md:text-6xl leading-[1] tracking-tight">
                {project.title}
              </h1>
              <p className="mt-6 text-titanium text-lg md:text-xl max-w-3xl leading-relaxed">
                {project.shortDescription}
              </p>
            </Reveal>
          </div>
        </section>

        {/* COVER */}
        {cover && (
          <section className="px-6 bg-obsidian">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
                {cover.fileType === "image" ? (
                  <img src={cover.fileUrl} alt={cover.altText || project.title} className="w-full h-full object-cover" />
                ) : cover.fileType === "video" ? (
                  <video src={cover.fileUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-eng-grid-fine">
                    <span className="font-mono text-titanium text-sm">DOCUMENT</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* METADATA */}
        <section className="py-12 px-6 bg-obsidian">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 bg-graphite border border-white/[0.08] rounded-[12px]">
              {[
                { label: "CLIENT", value: project.client },
                { label: "INDUSTRY", value: project.industry },
                { label: "YEAR", value: project.year },
                { label: "SERVICE", value: project.category },
                { label: "LOCATION", value: project.location },
              ].filter((f) => f.value).map((field) => (
                <div key={field.label}>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-titanium mb-2">{field.label}</div>
                  <div className="text-agenza-white font-medium">{field.value}</div>
                </div>
              ))}
            </div>
            {project.tools && project.tools.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TechnicalLabel>STACK / TOOLS</TechnicalLabel>
                {project.tools.map((tool) => (
                  <span key={tool} className="font-mono text-[11px] tracking-wide uppercase text-agenza-white border border-white/[0.08] rounded px-3 py-1">
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CASE STUDY */}
        {caseStudy.length > 0 && (
          <section className="py-16 px-6 bg-graphite border-y border-white/[0.08]">
            <div className="max-w-5xl mx-auto space-y-14">
              {caseStudy.map((section) => (
                <Reveal key={section.num}>
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <span className="font-mono text-electric text-sm tracking-[0.2em]">{section.num}</span>
                      <h2 className="mt-2 font-display font-semibold text-2xl text-agenza-white">{section.label}</h2>
                    </div>
                    <div className="md:col-span-9">
                      <p className="text-titanium leading-relaxed whitespace-pre-line text-lg">{section.content}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {gallery.length > 0 && (
          <section className="py-16 px-6 bg-obsidian">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="font-mono text-electric text-sm tracking-[0.2em]">
                  {String(caseStudy.length + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display font-semibold text-2xl text-agenza-white">PROJECT GALLERY</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {gallery.map((m) => (
                  <div key={m.id} className="bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden">
                    {m.fileType === "image" ? (
                      <img src={m.fileUrl} alt={m.altText || m.filename} className="w-full h-full object-cover aspect-video" />
                    ) : m.fileType === "video" ? (
                      <video src={m.fileUrl} controls className="w-full aspect-video object-cover" />
                    ) : (
                      <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-6 aspect-video justify-center bg-eng-grid-fine hover:bg-white/5 transition-colors">
                        <span className="font-mono text-electric text-sm">📄 {m.filename}</span>
                      </a>
                    )}
                    {m.caption && (
                      <div className="px-4 py-3 border-t border-white/[0.08]">
                        <p className="font-mono text-[11px] tracking-wide text-titanium">{m.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RELATED */}
        {related.length > 0 && (
          <section className="py-16 px-6 bg-graphite border-y border-white/[0.08]">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <TechnicalLabel accent>RELATED PROJECTS</TechnicalLabel>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((p, i) => {
                  const c = p.media.find((m) => m.isCover) || p.media[0];
                  return (
                    <ProjectCard key={p.id} slug={p.slug} title={p.title} division={p.division} category={p.category} shortDescription={p.shortDescription} tools={p.tools} index={p.sortOrder || i + 1} coverUrl={c?.fileUrl} coverType={c?.fileType} />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative py-24 px-6 bg-obsidian overflow-hidden">
          <TechnicalGrid />
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-agenza-white leading-tight tracking-tight">
              Have a similar<br />project?
            </h2>
            <p className="mt-6 text-titanium text-lg">Let's discuss how we can bring your ideas to life.</p>
            <div className="mt-10">
              <Link href="/contact" className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-obsidian font-medium rounded-[8px] transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5">
                START A PROJECT <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
