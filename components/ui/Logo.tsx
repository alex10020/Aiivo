import { clsx } from "clsx";

/* The Aiivo mark — a notary "certification seal": a reeded double ring (the
   stamp / coin edge that signals an official document) around a confident
   check (approved · compliant · on the record). Drawn with `currentColor`
   so it inherits the surrounding text color and stays razor-sharp at any size. */

const TICKS = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Aiivo"
      fill="none"
    >
      {/* reeded edge — one static tick rotated by integer degrees, so the
         server and client render byte-identical markup (no float drift) */}
      {TICKS.map((deg) => (
        <line
          key={deg}
          x1="42.4"
          y1="24"
          x2="44.8"
          y2="24"
          transform={`rotate(${deg} 24 24)`}
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}
      {/* notary double ring */}
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="16.6" stroke="currentColor" strokeWidth="1" opacity="0.42" />
      {/* the check */}
      <path
        d="M15.6 24.7l5.9 5.9L33 18.3"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0 text-seal" />
      {withWordmark && (
        <span className="text-[1.32rem] font-semibold tracking-tight text-ink">
          A<span className="text-seal">ii</span>vo
        </span>
      )}
    </span>
  );
}
