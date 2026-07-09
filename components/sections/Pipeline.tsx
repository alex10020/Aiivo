import { Database, BrainCircuit, Gauge, UserCheck } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { PIPELINE } from "@/lib/data";

const ICONS = [Database, BrainCircuit, Gauge, UserCheck];
const STACK = ["Next.js", "Supabase", "Anthropic SDK"];

export function Pipeline() {
  return (
    <section className="paper-grain relative border-y border-line bg-paper-2 py-24 sm:py-32">
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        {/* -------------------------------------------------------------- */}
        {/* left: narrative (sticky)                                       */}
        {/* -------------------------------------------------------------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>Under the hood</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] text-ink sm:text-[2.6rem]">
              Accuracy is <span className="italic seal-text">engineered</span>,
              not generated.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft">
              Four stamped layers turn fragmented government sources into a record
              you can file against. The model never invents a permit — it matches
              your business to data we&apos;ve already scraped, validated and
              timestamped. The gap between a raw model&apos;s guess and a
              source-verified answer is the gap between{" "}
              <span className="text-stamp">a $5,000 fine</span> and full
              compliance.
            </p>
          </Reveal>

          {/* re-verify note */}
          <Reveal delay={0.15}>
            <div className="mt-8 inline-flex items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted">
              <span className="grid h-2 w-2 place-items-center">
                <span className="h-2 w-2 animate-blink rounded-full bg-seal" />
              </span>
              Data older than 90 days is auto-flagged for re-verification.
            </div>
          </Reveal>

          {/* stack strip */}
          <Reveal delay={0.2}>
            <div className="mt-8">
              <span className="label text-faint">Built on</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-line bg-card px-3 py-1.5 font-mono text-xs text-ink-soft"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* right: stamped processing chain                                */}
        {/* -------------------------------------------------------------- */}
        <div className="relative">
          {/* connecting hairline between stamps */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-14 top-14 border-l border-dashed border-line-strong"
          />
          <Stagger className="space-y-5">
            {PIPELINE.map((l, i) => {
              const Icon = ICONS[i];
              const n = `0${i + 1}`;
              return (
                <StaggerItem key={l.layer}>
                  <div className="sheet group relative flex gap-5 rounded-2xl p-6">
                    {/* rubber stamp */}
                    <div className="relative z-10 shrink-0">
                      <span className="relative grid h-16 w-16 -rotate-6 place-items-center rounded-full border-2 border-seal/60 bg-card text-seal shadow-[0_2px_10px_-5px_rgba(21,98,61,0.45)] transition-transform duration-300 group-hover:rotate-0">
                        <span className="absolute inset-1.5 rounded-full border border-dashed border-seal/35" />
                        <Icon className="relative h-5 w-5" strokeWidth={1.75} />
                      </span>
                    </div>

                    {/* layer detail */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.2em] text-seal">
                          Layer {n}
                        </span>
                        <span className="font-display text-4xl leading-none text-line-strong">
                          {n}
                        </span>
                      </div>
                      <h3 className="mt-2 font-sans text-lg font-semibold tracking-tight text-ink">
                        {l.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {l.body}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
