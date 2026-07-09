import { Check, X, Gavel, Bot, ShieldCheck } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { COMPETITORS } from "@/lib/data";

/* Side-by-side audit, paired by dimension. Declared locally — we never edit
   lib/data.ts. The "bad" column is intentionally where the only tension lives. */
const AUDIT = [
  {
    dim: "Jurisdiction depth",
    bad: "Misses county & city rules",
    good: "Federal → state → county → city",
  },
  {
    dim: "Data currency",
    bad: "Lists permits that no longer exist",
    good: "Scraped, validated, date-stamped",
  },
  {
    dim: "Filing links",
    bad: "Dead links that 404",
    good: "Live links to official portals",
  },
  {
    dim: "Consistency",
    bad: "A different answer every time",
    good: "Deterministic & reproducible",
  },
  {
    dim: "Lifecycle",
    bad: "No renewals, no monitoring",
    good: "Monitoring + automatic renewals",
  },
  {
    dim: "Accountability",
    bad: "No source, no review",
    good: "Source-attributed + human-reviewed",
  },
];

export function Competitive() {
  return (
    <section className="relative border-t border-line bg-paper-2 py-24 sm:py-32">
      <div className="container-x relative">
        {/* section header */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="mx-auto">Competitive landscape</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.6rem]">
              Nobody else is <span className="italic seal-text">building</span>{" "}
              this.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              We filed the adjacent players against our docket. Each solves a
              different problem for a different buyer — every one dismissed for
              lack of overlap.
            </p>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* docket: adjacent filings, dismissed for no overlap               */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-line bg-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-7">
              <span className="label">Docket · adjacent filings</span>
              <span className="label text-faint">
                {COMPETITORS.length} entries · all dismissed
              </span>
            </div>

            <Stagger>
              {COMPETITORS.map((c, i) => (
                <StaggerItem key={c.cat}>
                  <div className="grid gap-4 border-t border-line px-5 py-5 first:border-t-0 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-faint">
                          Case No. 2026-0{i + 1}
                        </span>
                        <span className="h-3 w-px bg-line-strong" />
                        <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink">
                          {c.cat}
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-xs text-muted">
                        {c.names}
                      </p>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                        {c.note}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 justify-self-start sm:justify-self-end">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/[0.06] px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-seal">
                        <Gavel className="h-3 w-3" />
                        Overlap: none
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* the ChatGPT objection, run as a side-by-side audit ledger        */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <h3 className="text-balance text-2xl leading-[1.15] tracking-[-0.01em] text-ink sm:text-3xl">
              &ldquo;Can&apos;t someone just use ChatGPT?&rdquo;
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-ink-soft">
              Try it. The gap between a generic chat answer and a validated
              dataset <span className="text-ink">is the product</span>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-line bg-card">
            {/* audit header */}
            <div className="grid grid-cols-[84px_1fr_1fr] sm:grid-cols-[170px_1fr_1fr]">
              <div className="flex items-center border-b border-line px-3 py-3 sm:px-5">
                <span className="label text-faint">Audit</span>
              </div>
              <div className="flex items-center gap-1.5 border-b border-l border-line px-3 py-3 sm:px-5">
                <Bot className="h-4 w-4 shrink-0 text-muted" />
                <span className="font-mono text-[0.66rem] font-medium uppercase tracking-wider text-muted sm:text-xs">
                  Raw ChatGPT
                </span>
              </div>
              <div className="flex items-center gap-1.5 border-b border-l border-line bg-seal/[0.05] px-3 py-3 sm:px-5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-seal" />
                <span className="font-mono text-[0.66rem] font-medium uppercase tracking-wider text-seal sm:text-xs">
                  Aiivo
                </span>
              </div>

              {/* hero accuracy row */}
              <div className="flex items-center border-t border-line px-3 py-4 sm:px-5">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint sm:text-[0.7rem]">
                  Match accuracy
                </span>
              </div>
              <div className="flex items-baseline border-l border-t border-line px-3 py-4 sm:px-5">
                <span className="font-mono text-2xl text-muted sm:text-3xl">
                  ~60%
                </span>
              </div>
              <div className="flex items-baseline border-l border-t border-line bg-seal/[0.05] px-3 py-4 sm:px-5">
                <CountUp
                  value={98}
                  suffix="%"
                  className="font-mono text-2xl text-seal sm:text-3xl"
                />
              </div>

              {/* dimension rows */}
              {AUDIT.map((r) => (
                <Row key={r.dim} dim={r.dim} bad={r.bad} good={r.good} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* thesis validation (market validation only — not an endorsement)  */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <span className="label text-faint">Thesis validation · for the record</span>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-soft sm:text-base">
              a16z committed{" "}
              <span className="font-mono text-ink">$55M</span> to SMB-compliance
              startup Town — which then pivoted to a general assistant, leaving the
              permit-and-licensing wedge wide open. Cited as market validation
              only; a16z has no affiliation with Aiivo.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ dim, bad, good }: { dim: string; bad: string; good: string }) {
  return (
    <>
      <div className="flex items-center border-t border-line px-3 py-4 sm:px-5">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint sm:text-[0.7rem]">
          {dim}
        </span>
      </div>
      <div className="flex items-start gap-2 border-l border-t border-line px-3 py-4 sm:px-5">
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stamp" strokeWidth={2.5} />
        <span className="text-[0.8rem] leading-snug text-muted sm:text-sm">
          {bad}
        </span>
      </div>
      <div className="flex items-start gap-2 border-l border-t border-line bg-seal/[0.05] px-3 py-4 sm:px-5">
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seal" strokeWidth={2.5} />
        <span className="text-[0.8rem] leading-snug text-ink-soft sm:text-sm">
          {good}
        </span>
      </div>
    </>
  );
}
