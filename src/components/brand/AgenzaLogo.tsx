import Link from "next/link";

interface AgenzaLogoProps {
  variant?: "primary" | "horizontal" | "symbol" | "monochrome";
  className?: string;
  href?: string | null;
  size?: number;
}

// AGENZA Symbol — the "A" mark built from two converging strokes
// (physical / mechanical stroke = titanium, digital stroke = electric lime)
export function AgenzaSymbol({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer A — engineering stroke */}
      <path
        d="M6 34 L20 6 L34 34"
        stroke="url(#agenza-metal)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner convergence — digital stroke */}
      <path
        d="M13 34 L20 20 L27 34"
        stroke="#C7F36B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="agenza-metal" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F6F7" />
          <stop offset="1" stopColor="#8A9099" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AgenzaLogo({
  variant = "primary",
  className = "",
  href = "/",
  size = 32,
}: AgenzaLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <AgenzaSymbol size={size} />
      {variant !== "symbol" && (
        <div className="flex flex-col leading-none">
          <span
            className="font-display font-semibold tracking-[0.18em] text-agenza-white"
            style={{ fontSize: size * 0.62 }}
          >
            AGENZA
          </span>
          {variant !== "monochrome" && (
            <span
              className="font-mono text-titanium tracking-[0.25em] mt-1"
              style={{ fontSize: size * 0.22 }}
            >
              ENGINEERING × DIGITAL
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="AGENZA — Home" className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
