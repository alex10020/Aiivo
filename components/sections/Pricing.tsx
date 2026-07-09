import { Check, ArrowRight, Plug } from "lucide-react";
import { clsx } from "clsx";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { PRICING } from "@/lib/data";

/* Local-only copy for this section (golden rule 4). */
const API_PARTNERS = ["Stripe Atlas", "LegalZoom", "Gusto", "Deel"];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 border-t border-line py-24 sm:py-32"
    >
      <div className="container-x relative">
        {/* ---------------------------------------------------------------- */}
        {/* header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">Schedule of fees</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] text-ink sm:text-[2.6rem]">
              Start <span className="italic seal-text">free</span>. Pay only when
              you need the answer.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-ink-soft sm:text-lg">
              See what you need for free. File one of these service forms when
              you want the full report, hands-off filing, or always-on
              monitoring.
            </p>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* the price ledger — four official service forms                   */}
        {/* ---------------------------------------------------------------- */}
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.map((p, i) => (
            <StaggerItem key={p.name} className="h-full">
              <article
                className={clsx(
                  "relative flex h-full flex-col rounded-2xl bg-card p-6 transition-colors duration-300",
                  p.featured
                    ? "border border-seal/45 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_28px_55px_-34px_rgba(21,98,61,0.45)] ring-1 ring-seal/20"
                    : "border border-line hover:border-line-strong"
                )}
              >
                {p.featured && (
                  <>
                    <span className="absolute inset-x-0 -top-px mx-6 h-px bg-seal/60" />
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-seal px-3 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-on-seal">
                      Most filed
                    </span>
                  </>
                )}

                {/* form header strip */}
                <div className="flex items-center justify-between">
                  <span className="label text-faint">
                    Form&nbsp;AIV·0{i + 1}
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
                    {p.cadence || "No charge"}
                  </span>
                </div>

                <div className="my-4 border-t border-dashed border-line" />

                {/* service name */}
                <h3 className="text-base font-semibold tracking-tight text-ink">
                  {p.name}
                </h3>

                {/* price — one number, mono */}
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-mono text-[2.6rem] leading-none text-ink">
                    {p.price}
                  </span>
                  {p.cadence && (
                    <span className="font-mono text-xs text-muted">
                      {p.cadence}
                    </span>
                  )}
                </p>

                <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-muted">
                  {p.desc}
                </p>

                {/* line items, ruled like a form */}
                <ul className="mt-5 flex-1 border-t border-line-soft">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 border-b border-line-soft py-2.5 text-sm"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-seal"
                        strokeWidth={2.5}
                      />
                      <span className="text-ink-soft">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/demo"
                  className={clsx(
                    "group mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    p.featured
                      ? "bg-seal text-on-seal hover:bg-seal-bright"
                      : "border border-seal/35 bg-card text-seal hover:bg-seal hover:text-on-seal"
                  )}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ---------------------------------------------------------------- */}
        {/* API band — the addendum form                                     */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={0.05}>
          <div className="paper-grain relative mt-5 overflow-hidden rounded-2xl border border-line bg-paper-2 p-8 sm:p-10">
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-seal/30 bg-seal/[0.07] px-3 py-1 font-mono text-[0.66rem] font-medium uppercase tracking-[0.16em] text-seal">
                  <Plug className="h-3.5 w-3.5" /> API · $2–5 per lookup
                </span>
                <h3 className="mt-4 text-2xl leading-tight text-ink">
                  Building a platform? Embed Aiivo.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Stripe Atlas, LegalZoom, Gusto and Deel each create customers
                  who immediately need permits — and have no structured data to
                  serve them. Complete your product with one API call. Zero
                  marginal cost at volume.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {API_PARTNERS.map((b) => (
                    <span
                      key={b}
                      className="rounded-md border border-line bg-card px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="/api-docs"
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-seal/35 bg-card px-5 py-3 text-sm font-medium text-seal transition-colors hover:bg-seal hover:text-on-seal"
              >
                Get API access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
