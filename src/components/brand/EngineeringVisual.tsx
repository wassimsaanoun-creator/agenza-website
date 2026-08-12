export function EngineeringVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.4]"
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Coordinate system */}
        <g stroke="rgba(200,205,210,0.25)" strokeWidth="1">
          <line x1="80" y1="500" x2="720" y2="500" />
          <line x1="80" y1="500" x2="80" y2="100" />
        </g>
        {/* X / Y / Z labels */}
        <text x="726" y="504" fill="#C8CDD2" fontFamily="JetBrains Mono, monospace" fontSize="12">X</text>
        <text x="74" y="94" fill="#C8CDD2" fontFamily="JetBrains Mono, monospace" fontSize="12">Y</text>
        <text x="120" y="140" fill="#C7F36B" fontFamily="JetBrains Mono, monospace" fontSize="11">Z</text>

        {/* CAD-style outline shape */}
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
          <path d="M300 220 L460 220 L500 300 L460 380 L300 380 L260 300 Z" />
          <path d="M300 220 L340 180 L500 180 L540 260 L500 300" strokeDasharray="4 4" />
          <path d="M460 220 L500 180" strokeDasharray="4 4" />
        </g>

        {/* Dimension lines */}
        <g stroke="rgba(199,243,107,0.4)" strokeWidth="1">
          <line x1="300" y1="410" x2="460" y2="410" />
          <line x1="300" y1="405" x2="300" y2="415" />
          <line x1="460" y1="405" x2="460" y2="415" />
        </g>
        <text x="360" y="428" fill="#C7F36B" fontFamily="JetBrains Mono, monospace" fontSize="10">160.0</text>

        {/* Nodes */}
        <circle cx="300" cy="220" r="3" fill="#C7F36B" />
        <circle cx="460" cy="220" r="3" fill="#C7F36B" />
        <circle cx="500" cy="300" r="3" fill="rgba(255,255,255,0.5)" />
        <circle cx="260" cy="300" r="3" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  );
}

export function DigitalNetwork({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.45]"
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Network edges */}
        <g stroke="rgba(255,255,255,0.12)" strokeWidth="1">
          <line x1="150" y1="150" x2="350" y2="250" />
          <line x1="350" y1="250" x2="550" y2="180" />
          <line x1="350" y1="250" x2="450" y2="420" />
          <line x1="550" y1="180" x2="650" y2="350" />
          <line x1="450" y1="420" x2="650" y2="350" />
          <line x1="150" y1="150" x2="250" y2="380" />
          <line x1="250" y1="380" x2="450" y2="420" />
        </g>
        {/* Nodes */}
        <circle cx="150" cy="150" r="4" fill="rgba(255,255,255,0.4)" />
        <circle cx="350" cy="250" r="6" fill="#C7F36B" className="pulse-node" />
        <circle cx="550" cy="180" r="4" fill="rgba(255,255,255,0.4)" />
        <circle cx="450" cy="420" r="5" fill="#C7F36B" className="pulse-node" />
        <circle cx="650" cy="350" r="4" fill="rgba(255,255,255,0.4)" />
        <circle cx="250" cy="380" r="4" fill="rgba(255,255,255,0.4)" />

        {/* Data labels */}
        <text x="360" y="240" fill="#C7F36B" fontFamily="JetBrains Mono, monospace" fontSize="9">AI</text>
        <text x="460" y="412" fill="#C7F36B" fontFamily="JetBrains Mono, monospace" fontSize="9">DATA</text>
      </svg>
    </div>
  );
}

export function TechnicalGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 bg-eng-grid ${className}`}
      aria-hidden="true"
    />
  );
}
