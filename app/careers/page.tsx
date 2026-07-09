import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Mail,
} from "lucide-react";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Seal } from "@/components/ui/Seal";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Help build the compliance record every new business needs. Open roles at Aiivo — remote-first, seed-stage, high ownership.",
};

const APPLY_EMAIL = "careers@aiivo.ai";

const VALUES = [
  {
    tag: "Defensibility",
    title: "Own the unglamorous",
    body: "The data moat is grinding, thankless work. We do it because it compounds — whoever finishes first wins permanently.",
  },
  {
    tag: "Trust",
    title: "Ship the certificate, not the demo",
    body: "Every result is sourced, dated and confidence-scored. Accuracy and accountability beat anything that merely looks impressive.",
  },
  {
    tag: "Focus",
    title: "Vertical, not viral",
    body: "One workflow, one buyer, one source of truth — done properly. We go deep on permits while everyone else goes wide.",
  },
  {
    tag: "Ownership",
    title: "Small team, real surface area",
    body: "Seed-stage means your work ships to users this week and your name is on the record. No layers, no theatre.",
  },
];

type Role = {
  req: string;
  title: string;
  team: string;
  location: string;
  type: string;
  blurb: string;
};

const ROLES: Role[] = [
  {
    req: "REQ-2026-01",
    title: "Founding Software Engineer",
    team: "Engineering",
    location: "Remote / Austin, TX",
    type: "Full-time",
    blurb:
      "Own product end-to-end across Next.js, Supabase and our filing pipeline. You'll set the patterns the rest of the team builds on.",
  },
  {
    req: "REQ-2026-02",
    title: "Applied AI Engineer",
    team: "Engineering · ML",
    location: "Remote",
    type: "Full-time",
    blurb:
      "Build the interpretation and confidence-scoring layer — matching businesses to requirements against structured data, never hallucinating them.",
  },
  {
    req: "REQ-2026-03",
    title: "Compliance Data Lead",
    team: "Data & Research",
    location: "Remote",
    type: "Full-time",
    blurb:
      "Design how we scrape, validate and timestamp government data across 8,300 jurisdictions. This is the moat — you'll own its quality.",
  },
  {
    req: "REQ-2026-04",
    title: "Founding Product Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
    blurb:
      "Make compliance feel like a beautifully engineered certificate. Own the system from marketing site to the report a customer pays for.",
  },
  {
    req: "REQ-2026-05",
    title: "Growth Lead",
    team: "Go-to-Market",
    location: "Remote / Austin, TX",
    type: "Full-time",
    blurb:
      "77% of owners Google their compliance questions. Turn that intent into customers — SEO, content and the API distribution play.",
  },
];

const BENEFITS = [
  "Meaningful founding equity",
  "Top-of-market salary",
  "Remote-first, async by default",
  "Full health, dental & vision",
  "Hardware & home-office budget",
  "Direct line to the founders",
];

export default function CareersPage() {
  return (
    <>
      <BackgroundFX />

      {/* top bar */}
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Back to Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container-x py-16 sm:py-24">
        {/* ----------------------------------------------------------------- */}
        {/* hero                                                              */}
        {/* ----------------------------------------------------------------- */}
        <div className="relative">
          {/* faint seal flourish */}
          <div
            className="pointer-events-none absolute -top-10 right-0 hidden h-56 w-56 opacity-[0.05] lg:block"
            aria-hidden
          >
            <Seal className="h-full w-full" />
          </div>

          <div className="relative max-w-2xl">
            <Eyebrow>Careers · we&rsquo;re hiring</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl leading-[1.03] tracking-[-0.02em] text-ink sm:text-[3.4rem]">
              Build the record every business is{" "}
              <span className="italic seal-text">missing</span>.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
              Every year millions of new businesses open without knowing which
              permits they need. We&rsquo;re building the structured source of
              truth — and filing on their behalf. Come help us finish the moat.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
              <span>Seed-stage</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>Remote-first</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>Austin, TX</span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* how we work / values                                             */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-20 border-t border-line pt-14 sm:mt-24">
          <h2 className="text-3xl leading-[1.1] tracking-[-0.01em] text-ink">
            How we <span className="italic seal-text">work</span>
          </h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-card p-6 sm:p-7">
                <span className="label text-faint">{v.tag}</span>
                <h3 className="mt-3 font-sans text-lg font-semibold text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* open roles — hiring docket                                        */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-20 border-t border-line pt-14 sm:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl leading-[1.1] tracking-[-0.01em] text-ink">
              Open <span className="italic seal-text">requisitions</span>
            </h2>
            <span className="label text-faint">
              {ROLES.length} roles · all remote-friendly
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-card">
            {ROLES.map((r) => (
              <a
                key={r.req}
                href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(
                  `Application — ${r.title} (${r.req})`
                )}`}
                className="group grid gap-4 border-t border-line px-5 py-6 transition-colors first:border-t-0 hover:bg-paper-2/60 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-faint">
                      {r.req}
                    </span>
                    <span className="h-3 w-px bg-line-strong" />
                    <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink-soft">
                      {r.team}
                    </span>
                  </div>
                  <h3 className="mt-2 font-sans text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-seal">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {r.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[0.62rem] text-muted">
                      <MapPin className="h-3 w-3" />
                      {r.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[0.62rem] text-muted">
                      <Briefcase className="h-3 w-3" />
                      {r.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-self-start sm:flex-col sm:items-end sm:gap-2.5 sm:justify-self-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/[0.06] px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-seal">
                    <span className="h-1.5 w-1.5 rounded-full bg-seal" />
                    Open
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors group-hover:text-seal">
                    Apply
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* benefits                                                          */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-20 border-t border-line pt-14 sm:mt-24">
          <h2 className="text-3xl leading-[1.1] tracking-[-0.01em] text-ink">
            What you can <span className="italic seal-text">count on</span>
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3.5 text-sm text-ink-soft"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-seal" />
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* open application CTA                                              */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-20 sm:mt-24">
          <div className="sheet relative overflow-hidden rounded-2xl">
            <div className="paper-grain relative flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div className="max-w-xl">
                <h2 className="text-2xl leading-[1.15] tracking-[-0.01em] text-ink sm:text-[1.9rem]">
                  Don&rsquo;t see your role on the docket?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                  If you can help build the structured record of every business
                  requirement in the country, we want to hear from you. Tell us
                  what you&rsquo;d own.
                </p>
              </div>
              <a
                href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(
                  "Open application — Aiivo"
                )}`}
                className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
              >
                <Mail className="h-4 w-4" />
                Email us your pitch
              </a>
            </div>
          </div>
        </section>

        {/* colophon */}
        <footer className="mx-auto mt-20 max-w-3xl">
          <div className="border-t border-line pt-8">
            <div className="perforated-top -mt-8 mb-8 h-2 w-full" aria-hidden />
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faint">
              Aiivo · official compliance record · careers · ©&nbsp;2026
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
              Aiivo is an equal-opportunity employer. We hire for the work, not
              the pedigree — and we&rsquo;d rather see what you&rsquo;ve built
              than where you built it.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
