import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { clsx } from "clsx";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Accuracy policy",
  description:
    "How Aiivo sources permit data, grades its confidence, keeps it current, and corrects errors. Our methodology and accountability, on the record.",
};

const META = [
  { k: "Effective", v: "June 27, 2026" },
  { k: "Version", v: "1.0" },
  { k: "Re-verified", v: "Every 90 days" },
  { k: "Document", v: "AIV-POL-ACC" },
];

const CONFIDENCE = [
  {
    tag: "Confirmed",
    tone: "seal",
    meaning:
      "Verified against the issuing authority's current published requirements. As certain as the public record allows.",
  },
  {
    tag: "Likely Required",
    tone: "gold",
    meaning:
      "Strongly indicated for your business type and location, with a jurisdiction-specific nuance worth confirming. A to-do, not a maybe.",
  },
  {
    tag: "Verify",
    tone: "stamp",
    meaning:
      "Conditional or in flux — it depends on details only you or the agency can confirm. We flag it rather than guess.",
  },
];

const toneClass: Record<string, string> = {
  seal: "border-seal/30 bg-seal/[0.07] text-seal",
  gold: "border-gold/35 bg-gold/[0.08] text-gold",
  stamp: "border-stamp/30 bg-stamp/[0.07] text-stamp",
};

type Section = {
  n: string;
  label: string;
  title: string;
  body: string[];
  legend?: boolean;
};

const SECTIONS: Section[] = [
  {
    n: "01",
    label: "Scope",
    title: "What this policy covers",
    body: [
      "Aiivo is an informational research tool. We tell you which federal, state, county and city permits a business like yours is likely to need — what they cost, how long they take, and where to file them. This policy explains how we source that information, how confident we are in it, how current we keep it, and exactly what we do when we get something wrong.",
      "Aiivo is not a law firm and this is not legal advice. Using Aiivo does not create an attorney–client relationship. This is the same stance services like LegalZoom have operated under for 25 years.",
    ],
  },
  {
    n: "02",
    label: "Sourcing",
    title: "Where our data comes from",
    body: [
      "Every requirement we surface is drawn from official government sources — agency publications, statutes, municipal codes and licensing portals. That data is scraped, validated and timestamped before it enters our index, which we are building toward all 8,300 U.S. filing jurisdictions; today it runs deepest across 17 states, with federal and state coverage everywhere.",
      "We do not generate requirements with a language model. The AI reads your business description and matches it against this structured, real-world dataset; it selects from permits that already exist on the record. It never invents one.",
    ],
  },
  {
    n: "03",
    label: "Confidence",
    title: "How we grade each result",
    body: [
      "Honesty about uncertainty is the whole point. Every permit we return carries one of three confidence tags so you always know how sure we are — and where to look twice.",
    ],
    legend: true,
  },
  {
    n: "04",
    label: "Currency",
    title: "How current we keep it",
    body: [
      "Regulations move. Any record older than 90 days is automatically re-verified against its source before we rely on it again. Every line item on your report shows a “last verified” date, so you can see exactly how fresh each requirement is.",
      "When a requirement changes in a jurisdiction you're monitored in, we flag it and update your record rather than letting it quietly go stale.",
    ],
  },
  {
    n: "05",
    label: "Review",
    title: "Human review and filing checks",
    body: [
      "Anything scored below 90% confidence is routed to a human reviewer before it reaches you. For File-For-Me, the bar is higher still: every report is verified by a compliance reviewer before a single application is submitted on your behalf.",
      "Filing services will launch backed by errors-and-omissions insurance — accountability, not just a disclaimer.",
    ],
  },
  {
    n: "06",
    label: "Benchmark",
    title: "What our accuracy number means",
    body: [
      "We measure accuracy against a published benchmark: a versioned set of test businesses across our covered states, each checked for the permits the issuing authority actually requires — including trap cases like Oregon's missing sales tax or Chicago's city-run health department. On the current benchmark, Aiivo scores 100% with zero wrong-jurisdiction errors. The benchmark grows with our coverage, and it is a measured rate of performance — not a guarantee for any single business.",
      "Edge cases are precisely why confidence tags, “last verified” dates and source links exist on every report: so any miss is visible and checkable, never hidden.",
    ],
  },
  {
    n: "07",
    label: "Responsibility",
    title: "Your part in this",
    body: [
      "Aiivo gets you to a complete, well-sourced starting point in seconds instead of weeks. Final responsibility for compliance rests with the business owner. Before you rely on any result, confirm the specifics with the relevant agency — and we make that easy by linking the source and filing portal on every requirement.",
    ],
  },
  {
    n: "08",
    label: "Corrections",
    title: "Found something wrong?",
    body: [
      "Tell us. We treat every reported error as a priority: we re-verify the requirement against its source, correct the index, and refresh the “last verified” date — typically within two business days. If a paid report was affected, we reissue it.",
    ],
  },
];

export default function AccuracyPolicyPage() {
  return (
    <>
      <BackgroundFX />

      {/* slim document header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="/" className="shrink-0" aria-label="Aiivo home">
            <Logo />
          </a>
          <a
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </a>
        </div>
      </header>

      <main className="relative">
        <article className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            {/* masthead */}
            <Reveal>
              <div className="relative">
                <Seal className="pointer-events-none absolute -top-8 right-0 hidden h-28 w-28 opacity-[0.07] sm:block" />
                <Eyebrow>Trust &amp; methodology</Eyebrow>
                <h1 className="mt-5 text-[2.6rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-6xl">
                  Accuracy <span className="italic seal-text">policy</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  How Aiivo sources permit data, grades its confidence in it,
                  keeps it current — and exactly what we do when something is
                  wrong.
                </p>
              </div>
            </Reveal>

            {/* record meta strip */}
            <Reveal delay={0.05}>
              <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5 sm:grid-cols-4">
                {META.map((m) => (
                  <div key={m.k}>
                    <dt className="label text-faint">{m.k}</dt>
                    <dd className="mt-1.5 font-mono text-sm text-ink-soft">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* numbered ledger of clauses */}
            <div className="mt-2">
              {SECTIONS.map((s) => (
                <Reveal key={s.n} delay={0.04}>
                  <section className="grid gap-4 border-b border-line py-9 md:grid-cols-[7rem_1fr] md:gap-8">
                    <div className="md:pt-1">
                      <p className="font-mono text-2xl leading-none text-faint">
                        {s.n}
                      </p>
                      <p className="label mt-2">{s.label}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl leading-snug text-ink sm:text-[1.7rem]">
                        {s.title}
                      </h2>
                      <div className="mt-3 space-y-3 text-pretty leading-relaxed text-ink-soft">
                        {s.body.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>

                      {s.legend && (
                        <ul className="mt-6 space-y-3">
                          {CONFIDENCE.map((c) => (
                            <li
                              key={c.tag}
                              className="flex flex-col gap-2 rounded-xl border border-line bg-card p-4 sm:flex-row sm:items-center sm:gap-4"
                            >
                              <span
                                className={clsx(
                                  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider sm:w-40",
                                  toneClass[c.tone]
                                )}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {c.tag}
                              </span>
                              <span className="text-sm leading-relaxed text-muted">
                                {c.meaning}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                </Reveal>
              ))}
            </div>

            {/* report-an-error sheet */}
            <Reveal delay={0.05}>
              <div className="sheet paper-grain relative mt-12 overflow-hidden rounded-2xl p-8 sm:p-10">
                <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="max-w-xl">
                    <span className="label text-faint">Corrections desk</span>
                    <h2 className="mt-2 text-2xl leading-snug text-ink sm:text-[1.7rem]">
                      Spotted an inaccuracy? Put it on the record.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      We re-verify, correct the index, and refresh the “last
                      verified” date — usually within two business days.
                    </p>
                  </div>
                  <a
                    href="mailto:alexander@aiivo.ai?subject=Accuracy%20report"
                    className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                  >
                    <Mail className="h-4 w-4" />
                    Report an error
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
