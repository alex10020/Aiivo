import { clsx } from "clsx";

/* A notary / certification seal: concentric guilloché rose curves, a ring of
   circular record text, and a compliance check at the core. Pure SVG so it is
   always razor-sharp. Deterministic — safe in a server component. */

function rosePath(
  cx: number,
  cy: number,
  R0: number,
  A: number,
  k: number,
  phase: number,
  steps = 720
) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * Math.PI * 2;
    const r = R0 + A * Math.cos(k * th + phase);
    const x = cx + r * Math.cos(th);
    const y = cy + r * Math.sin(th);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
}

export function Seal({
  className,
  text = "AIIVO · OFFICIAL COMPLIANCE RECORD · ",
}: {
  className?: string;
  text?: string;
}) {
  const C = 100;
  return (
    <svg
      viewBox="0 0 200 200"
      className={clsx("text-seal", className)}
      role="img"
      aria-label="Aiivo official compliance seal"
    >
      <defs>
        <path
          id="seal-textpath"
          d="M100,18 a82,82 0 1,1 -0.01,0"
          fill="none"
        />
      </defs>

      {/* outer rings */}
      <circle cx={C} cy={C} r="96" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.9" />
      <circle cx={C} cy={C} r="90" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.9" />
      <circle cx={C} cy={C} r="72" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />

      {/* circular text */}
      <text
        fontFamily="var(--font-mono)"
        fontSize="8.2"
        letterSpacing="2.1"
        fill="currentColor"
        opacity="0.95"
      >
        <textPath href="#seal-textpath" startOffset="0">
          {text + text}
        </textPath>
      </text>

      {/* rotating guilloché rose-work */}
      <g className="animate-seal" style={{ transformOrigin: "100px 100px" }}>
        <path d={rosePath(C, C, 56, 9, 12, 0)} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
        <path d={rosePath(C, C, 46, 11, 18, 0.4)} fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
        <path d={rosePath(C, C, 34, 7, 24, 0.8)} fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      </g>

      {/* core mark */}
      <circle cx={C} cy={C} r="20" fill="currentColor" opacity="0.08" />
      <circle cx={C} cy={C} r="20" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M90 100.5l6.4 6.4L112 91"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
