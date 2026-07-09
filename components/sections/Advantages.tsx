import { Database, Crosshair, Search, Repeat, Plug } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { ADVANTAGES } from "@/lib/data";

const ICONS = [Database, Crosshair, Search, Repeat, Plug];
const EXHIBITS = ["A", "B", "C", "D", "E"];

export function Advantages() {
  return (
    <section id="why" className="relative scroll-mt-24 bg-paper py-24 sm:py-32">
      <div className="container-x relative">
        {/* ---------------------------------------------------------------- */}
        {/* header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Why Aiivo wins</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance text-3xl leading-[1.1] text-ink sm:text-[2.6rem]">
                A moat in five <span className="italic seal-text">exhibits</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-ink-soft">
              We searched every YC batch, Crunchbase and major VC portfolio. Not
              one funded startup does what Aiivo does. Entered into the record,
              here is why we keep the lead.
            </p>
          </Reveal>
        </div>

        {/* docket line */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-faint">
            <span>Dossier · AIV-MOAT-2026</span>
            <span className="h-px flex-1 bg-line" />
            <span>5 exhibits</span>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* bento of exhibits                                                */}
        {/* ---------------------------------------------------------------- */}
        <Stagger className="mt-6 grid gap-5 lg:grid-cols-2">
          {ADVANTAGES.map((a, i) => {
            const Icon = ICONS[i];
            const featured = i === 0;
            return (
              <StaggerItem
                key={a.title}
                className={featured ? "lg:row-span-2" : ""}
              >
                <article className="sheet paper-grain group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-seal/30">
                  {/* exhibit header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-seal">
                      Exhibit {EXHIBITS[i]}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-muted">
                      {a.tag}
                    </span>
                  </div>

                  <div className="my-5 border-t border-dashed border-line" />

                  <span
                    className={`grid place-items-center rounded-xl border border-seal/20 bg-seal/[0.07] text-seal ${
                      featured ? "h-14 w-14" : "h-12 w-12"
                    }`}
                  >
                    <Icon
                      className={featured ? "h-6 w-6" : "h-5 w-5"}
                      strokeWidth={1.75}
                    />
                  </span>

                  <h3
                    className={`mt-5 font-sans font-semibold tracking-tight text-ink ${
                      featured ? "text-2xl" : "text-lg"
                    }`}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {a.body}
                  </p>

                  {/* featured: the data-moat math */}
                  {featured && (
                    <div className="mt-auto pt-8">
                      <span className="label text-faint">The math</span>
                      <div className="mt-2 rounded-xl border border-seal/25 bg-seal/5 p-4 font-mono text-sm leading-relaxed text-ink-soft">
                        <CountUp value={8300} className="text-ink" duration={1.4} />{" "}
                        jurisdictions <span className="text-faint">×</span>{" "}
                        <span className="text-ink">300+</span> license types{" "}
                        <span className="text-faint">=</span>{" "}
                        <span className="font-medium text-seal">millions</span> of
                        combinations
                      </div>
                    </div>
                  )}
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
