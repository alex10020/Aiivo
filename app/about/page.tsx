import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Users,
  Gauge,
  Layers,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aiivo is building the compliance record for every new business — the single source of truth for which permits you need, and the agent that files and renews them.",
};

const META = [
  { k: "Record no.", v: "AIV-ORG-2026" },
  { k: "Established", v: "2026" },
  { k: "Headquarters", v: "United States" },
  { k: "Status", v: "Active" },
];

const FIGURES = [
  { value: 8300, label: "U.S. filing jurisdictions in scope" },
  { value: 300, suffix: "+", label: "license types tracked" },
  { value: 110, suffix: "+", label: "industries covered" },
  { value: 100, suffix: "%", label: "published-benchmark accuracy" },
];

const PRINCIPLES = [
  {
    n: "P-01",
    icon: Database,
    title: "Real data, never guessed",
    body: "Every requirement is scraped, validated and timestamped from official government sources. The model selects from real records — it never invents a permit.",
  },
  {
    n: "P-02",
    icon: Users,
    title: "Built for the first-time owner",
    body: "No legal jargon, no agency phone trees. If you can describe your business in a sentence, you can find out exactly what it takes to operate legally.",
  },
  {
    n: "P-03",
    icon: Gauge,
    title: "Honest about uncertainty",
    body: "Every item is scored Confirmed, Likely Required, or Verify. Anything below 90% confidence is sent to human review before it ever reaches you.",
  },
  {
    n: "P-04",
    icon: Layers,
    title: "Defensible by depth",
    body: "8,300 jurisdictions × 300+ license types is grinding, thankless data work. We do it so no founder has to — and so the answer is actually right.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* slim top bar */}
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="label flex items-center gap-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      {/* masthead + mission */}
      <main className="container-x">
        <div className="mx-auto max-w-3xl">
          <div className="relative py-16 sm:py-20">
            <div
              className="pointer-events-none absolute -right-2 -top-2 hidden opacity-[0.06] sm:block"
              aria-hidden
            >
              <Seal className="h-48 w-48" />
            </div>

            <Reveal>
              <Eyebrow>About Aiivo</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-balance text-4xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
                We make compliance{" "}
                <span className="italic seal-text">official</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                Starting a business shouldn&apos;t require a law degree. Aiivo
                tells you exactly which permits you need — across every level of
                government — then files and renews them on your behalf.
              </p>
            </Reveal>

            {/* record metadata */}
            <Reveal delay={0.15}>
              <dl className="mt-9 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-card sm:grid-cols-4">
                {META.map((m, i) => (
                  <div
                    key={m.k}
                    className={`px-5 py-4 ${
                      i % 2 === 1 ? "border-l border-line" : ""
                    } ${i >= 2 ? "border-t border-line" : ""} sm:border-t-0 ${
                      i > 0 ? "sm:border-l sm:border-line" : ""
                    }`}
                  >
                    <dt className="label text-faint">{m.k}</dt>
                    <dd className="mt-1.5 font-mono text-sm text-ink">{m.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* mission statement */}
          <div className="border-t border-line py-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
              <div className="shrink-0 sm:w-28">
                <span className="label text-seal">Mission</span>
              </div>
              <div className="min-w-0 flex-1">
                <Reveal>
                  <p className="text-balance text-2xl leading-snug text-ink sm:text-[1.95rem]">
                    To become the single source of truth for business
                    compliance — so no founder is ever{" "}
                    <span className="italic seal-text">caught off the books</span>
                    .
                  </p>
                </Reveal>
                <Reveal delay={0.05}>
                  <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
                    <p>
                      Every year, millions of new businesses open without knowing
                      which of 300+ license types apply to them across 8,300
                      jurisdictions. The information exists — but it&apos;s
                      scattered across government websites, buried in PDFs, and
                      nearly impossible to assemble by hand. Lawyers are
                      expensive, search is unreliable, and formation tools stop at
                      the LLC.
                    </p>
                    <p>
                      Aiivo closes that gap: structured government data, an AI
                      that interprets it for your exact business, and a team that
                      files the paperwork and keeps you compliant as the rules
                      change. One record, always current — instead of a hundred
                      open browser tabs.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* by the record — figures */}
      <section className="border-t border-line bg-paper-2 py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Eyebrow>By the record</Eyebrow>
            </Reveal>
            <Stagger className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-card sm:grid-cols-4">
              {FIGURES.map((f, i) => (
                <StaggerItem
                  key={f.label}
                  className={`p-6 ${
                    i % 2 === 1 ? "border-l border-line" : ""
                  } ${i >= 2 ? "border-t border-line" : ""} sm:border-t-0 ${
                    i > 0 ? "sm:border-l sm:border-line" : ""
                  }`}
                >
                  <div className="font-mono text-3xl tracking-tight text-ink sm:text-4xl">
                    <CountUp value={f.value} suffix={f.suffix} duration={1.4} />
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {f.label}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* operating principles */}
      <section className="border-t border-line py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <Eyebrow>Operating principles</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-balance text-3xl leading-[1.1] tracking-tight text-ink sm:text-[2.2rem]">
                What we put <span className="italic seal-text">on the record</span>.
              </h2>
            </Reveal>

            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <StaggerItem
                  key={p.n}
                  className="rounded-2xl border border-line bg-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-seal/25 bg-seal/5 text-seal">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <span className="label text-faint">{p.n}</span>
                  </div>
                  <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {p.body}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section className="border-t border-line py-20 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="text-balance text-3xl leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
                Make your business{" "}
                <span className="italic seal-text">officially</span> legal.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/#demo"
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                >
                  Check my business
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="mailto:alexander@aiivo.ai"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
                >
                  Talk to us
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="label text-faint">Indexing 8,300 jurisdictions</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="label text-faint">300+ license types</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="label text-faint">Source-verified data</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* document colophon */}
      <footer className="border-t border-line bg-paper-2">
        <div className="container-x py-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-muted">
              Aiivo is an informational research tool, not a law firm, and does
              not provide legal advice. Using the Service does not create an
              attorney–client relationship.
            </p>
            <div className="perforated-top mt-8 h-3" aria-hidden />
            <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
              </p>
              <Seal className="h-10 w-10 opacity-70" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
