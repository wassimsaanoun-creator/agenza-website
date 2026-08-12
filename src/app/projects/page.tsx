import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Eyebrow, TechnicalLabel } from "@/components/brand/primitives";
import { TechnicalGrid } from "@/components/brand/EngineeringVisual";
import { ProjectCard } from "@/components/brand/ProjectCard";
import { Reveal } from "@/components/brand/Reveal";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const projects = await db.query.projects.findMany({ where: eq(schema.projects.status, "published") });
    return Promise.all(projects.map(async (p) => {
      const media = await db.query.projectMedia.findMany({
        where: eq(schema.projectMedia.projectId, p.id),
        orderBy: asc(schema.projectMedia.sortOrder),
      });
      return { ...p, media };
    }));
  } catch { return []; }
}

export const metadata = {
  title: "Projects — AGENZA",
  description: "Explore our portfolio of mechanical engineering and software development work.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const mechanical = projects.filter((p) => p.division === "mechanical");
  const software = projects.filter((p) => p.division === "software");
  const getCover = (media: any[]) => {
    const cover = media?.find((m) => m.isCover) || media?.[0];
    return cover ? { url: cover.fileUrl, type: cover.fileType } : { url: null, type: null };
  };

  return (
    <>
      <Navigation />
      <main>
        {/* HERO */}
        <section className="relative pt-40 pb-16 px-6 bg-obsidian overflow-hidden">
          <TechnicalGrid />
          <div className="relative max-w-7xl mx-auto">
            <Reveal>
              <Eyebrow>SELECTED WORK / PORTFOLIO</Eyebrow>
              <h1 className="mt-8 font-display font-bold text-agenza-white text-5xl md:text-7xl leading-[0.98] tracking-tight">
                Our <span className="text-electric">projects.</span>
              </h1>
              <p className="mt-6 text-titanium text-lg max-w-2xl">
                Engineered products and digital systems across both AGENZA capabilities.
              </p>
            </Reveal>
          </div>
        </section>

        {/* MECHANICAL */}
        {mechanical.length > 0 && (
          <section className="relative py-16 px-6 bg-obsidian border-t border-white/[0.08]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="font-mono text-electric text-sm tracking-[0.2em]">01</span>
                <TechnicalLabel>AGENZA ENGINEERING</TechnicalLabel>
                <span className="flex-1 h-px bg-white/[0.08]" />
                <TechnicalLabel>{String(mechanical.length).padStart(2, "0")} PROJECTS</TechnicalLabel>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mechanical.map((project, i) => {
                  const cover = getCover(project.media);
                  return (
                    <Reveal key={project.id} delay={(i % 3) * 80}>
                      <ProjectCard slug={project.slug} title={project.title} division={project.division} category={project.category} shortDescription={project.shortDescription} tools={project.tools} index={project.sortOrder || i + 1} coverUrl={cover.url} coverType={cover.type} />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SOFTWARE */}
        {software.length > 0 && (
          <section className="relative py-16 px-6 bg-graphite border-t border-white/[0.08]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <span className="font-mono text-electric text-sm tracking-[0.2em]">02</span>
                <TechnicalLabel>AGENZA DIGITAL</TechnicalLabel>
                <span className="flex-1 h-px bg-white/[0.08]" />
                <TechnicalLabel>{String(software.length).padStart(2, "0")} PROJECTS</TechnicalLabel>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {software.map((project, i) => {
                  const cover = getCover(project.media);
                  return (
                    <Reveal key={project.id} delay={(i % 3) * 80}>
                      <ProjectCard slug={project.slug} title={project.title} division={project.division} category={project.category} shortDescription={project.shortDescription} tools={project.tools} index={project.sortOrder || i + 1} coverUrl={cover.url} coverType={cover.type} />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {projects.length === 0 && (
          <section className="py-24 px-6 bg-obsidian">
            <div className="max-w-2xl mx-auto text-center py-16 border border-dashed border-white/[0.08] rounded-[12px]">
              <p className="text-titanium">No projects published yet. Check back soon.</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
