import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { Seal } from "../ui/Seal";

const SAMPLES = [
  { label: "Coffee shop · Austin, TX", q: "Coffee shop, Austin TX" },
  { label: "Food truck · Denver, CO", q: "Food truck, Denver CO" },
  { label: "Hair salon · Nashville, TN", q: "Hair salon, Nashville TN" },
];

export function Demo() {
  return (
    <section
      id="demo"
      className="relative scroll-mt-24 border-t border-line py-24 sm:py-32"
    >
      <div className="container-x">
        <Reveal>
          <div className="sheet relative mx-auto max-w-4xl overflow-hidden rounded-3xl">
            <div
              className="pointer-events-none absolute inset-4 rounded-[1.4rem] border border-line-strong/50"
              aria-hidden
            />
            <Seal
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.05]"
              aria-hidden
            />

            <div className="paper-grain relative p-10 text-center sm:p-14">
              <Eyebrow className="justify-center">Live demo</Eyebrow>

              <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.6rem]">
                Watch your compliance record get{" "}
                <span className="italic seal-text">issued</span> — live.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                Type your business and city. Aiivo scans 8,300 jurisdictions in
                real time and stamps out every permit you need — costs, timelines
                and filing links included.
              </p>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/demo"
                  className="group inline-flex items-center gap-2 rounded-lg bg-seal px-6 py-3.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                >
                  Open the live demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* sample shortcuts — prefilled into the live demo */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                <span className="label text-faint">Try a sample</span>
                {SAMPLES.map((s) => (
                  <Link
                    key={s.label}
                    href={`/demo?q=${encodeURIComponent(s.q)}`}
                    className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[0.72rem] text-ink-soft transition-colors hover:border-seal/40 hover:text-seal"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-line pt-6">
                <span className="label text-faint">8,300 jurisdictions</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="label text-faint">300+ license types</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="label text-faint">98% accurate</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
