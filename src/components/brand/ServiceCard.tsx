interface ServiceCardProps {
  index: number;
  name: string;
  description: string;
  accent?: "electric" | "titanium";
}

export function ServiceCard({ index, name, description }: ServiceCardProps) {
  return (
    <div className="group relative bg-graphite border border-white/[0.08] rounded-[12px] p-7 transition-all duration-300 hover:border-electric/40 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-eng-grid-fine opacity-40" />
      <span className="font-mono text-electric text-sm tracking-[0.2em]">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="mt-4 font-display font-semibold text-xl text-agenza-white leading-tight">
        {name}
      </h3>
      <p className="mt-3 text-titanium text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase text-titanium group-hover:text-electric transition-colors">
        EXPLORE SERVICE
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}
