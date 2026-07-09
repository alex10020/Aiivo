import {
  Scale,
  ShieldCheck,
  Gauge,
  UserCheck,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

const LAYERS = [
  {
    icon: Scale,
    title: "Legal disclaimers",
    body: "Informational guidance, not legal advice. Liability capped at amount paid.",
  },
  {
    icon: ShieldCheck,
    title: "E&O insurance",
    body: "Filing services launch backed by Technology Errors & Omissions cover.",
  },
  {
    icon: Gauge,
    title: "Confidence scoring",
    body: "Every item tagged so edge cases are flagged, never hidden.",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-loop",
    body: "Low-confidence reports and all filings get human review.",
  },
  {
    icon: Link2,
    title: "Source attribution",
    body: "Every permit links to its official source with a last-verified date.",
  },
];

/* a small notary-style credential medallion */
function Credential({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="relative grid h-16 w-16 place-items-center">
      <span className="absolute inset-0 rounded-full border border-seal/30" />
      <span className="absolute inset-1.5 rounded-full border border-dashed border-seal/35" />
      <span className="absolute inset-3 rounded-full bg-seal/[0.07]" />
      <Icon className="relative h-6 w-6 text-seal" strokeWidth={1.6} />
    </span>
  );
}

export function Trust() {
  return (
    <section className="relative border-t border-line bg-paper py-24 sm:py-32">
      <div className="container-x relative">
        {/* header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow>Liability &amp; accuracy</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] text-ink sm:text-[2.6rem]">
              Built to be <span className="italic seal-text">relied on</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Aiivo is an informational research tool — the same positioning
              LegalZoom has held for 25 years — wrapped in five layers of
              protection.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-seal/30 bg-seal/[0.07] px-3 py-1 font-mono text-[0.66rem] font-medium uppercase tracking-wider text-seal">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              5 layers of protection
            </span>
          </Reveal>
        </div>

        {/* credential badges */}
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((l, i) => (
            <StaggerItem key={l.title}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-card p-6 text-center transition-colors duration-300 hover:border-seal/30">
                <Credential icon={l.icon} />
                <span className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                  Layer 0{i + 1}
                </span>
                <h3 className="mt-1.5 font-sans text-sm font-semibold text-ink">
                  {l.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {l.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
