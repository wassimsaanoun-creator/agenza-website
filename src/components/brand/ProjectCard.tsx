import Link from "next/link";
import { ProjectNumber, TechnicalLabel } from "./primitives";

interface ProjectCardProps {
  slug: string;
  title: string;
  division: string;
  category: string;
  shortDescription: string;
  tools?: string[] | null;
  index?: number;
  coverUrl?: string | null;
  coverType?: string | null;
}

export function ProjectCard({
  slug,
  title,
  division,
  category,
  shortDescription,
  tools,
  index = 1,
  coverUrl,
  coverType,
}: ProjectCardProps) {
  const isMechanical = division === "mechanical";
  return (
    <Link
      href={`/projects/${slug}`}
      className="group block bg-graphite border border-white/[0.08] rounded-[12px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] bg-obsidian overflow-hidden bg-eng-grid-fine">
        {coverUrl && coverType === "image" ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 40 40" fill="none" className="opacity-30">
              <path d="M6 34 L20 6 L34 34" stroke="#C8CDD2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 34 L20 20 L27 34" stroke="#C7F36B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <ProjectNumber number={index} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-obsidian/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-electric">
            {isMechanical ? "MECHANICAL" : "SOFTWARE"}
          </span>
          <span className="text-titanium/40">/</span>
          <TechnicalLabel>{category}</TechnicalLabel>
        </div>
        <h3 className="font-display font-semibold text-xl text-agenza-white mb-2 group-hover:text-electric transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-titanium text-sm line-clamp-2 mb-4 leading-relaxed">
          {shortDescription}
        </p>
        {tools && tools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="font-mono text-[10px] tracking-wide uppercase text-titanium border border-white/[0.08] rounded px-2 py-0.5"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-agenza-white group-hover:text-electric transition-colors">
          VIEW PROJECT
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
