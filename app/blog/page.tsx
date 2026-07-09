import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Footer } from "@/components/sections/Footer";
import { POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "The Bulletin",
  description:
    "Plain-English answers to the permit and licensing questions business owners actually search for — sourced, dated, and kept current by Aiivo.",
};

const [featured, ...rest] = POSTS;

function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-muted">
      <span className="h-1 w-1 rounded-full bg-seal" />
      {label}
    </span>
  );
}

export default function BlogIndexPage() {
  return (
    <>
      <BackgroundFX />

      {/* slim document header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="shrink-0" aria-label="Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative">
        <article className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            {/* masthead */}
            <Reveal>
              <div className="relative">
                <Seal className="pointer-events-none absolute -top-8 right-0 hidden h-28 w-28 opacity-[0.07] sm:block" />
                <Eyebrow>The bulletin</Eyebrow>
                <h1 className="mt-5 text-[2.6rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-6xl">
                  Notes from the <span className="italic seal-text">record</span>
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  Plain-English answers to the permit and licensing questions
                  business owners actually search for — sourced, dated, and kept
                  current.
                </p>
              </div>
            </Reveal>

            {/* record meta strip */}
            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-y border-line py-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
                <span>Vol. 1 · 2026</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>{POSTS.length} entries on file</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>Updated {featured.date}</span>
              </div>
            </Reveal>

            {/* featured dispatch */}
            <Reveal delay={0.08}>
              <Link
                href={`/blog/${featured.slug}`}
                className="sheet paper-grain group relative mt-10 block overflow-hidden rounded-2xl p-8 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-seal/30 sm:p-10"
              >
                <Seal className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-[0.06]" />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/[0.07] px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-seal">
                      <span className="h-1 w-1 rounded-full bg-seal" />
                      Latest
                    </span>
                    <CategoryChip label={featured.category} />
                  </div>

                  <h2 className="mt-5 max-w-2xl text-balance text-3xl leading-[1.1] text-ink sm:text-[2.4rem]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                    {featured.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                    <time dateTime={featured.iso}>{featured.date}</time>
                    <span className="h-1 w-1 rounded-full bg-line-strong" />
                    <span>{featured.readMins} min read</span>
                    <span className="h-1 w-1 rounded-full bg-line-strong" />
                    <span>No. {featured.recordNo}</span>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-seal">
                    Read the dispatch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* archive */}
            <div className="mt-14 flex items-center gap-3">
              <span className="label">Archive</span>
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-[0.66rem] text-faint">
                {rest.length} earlier entries
              </span>
            </div>

            <ol className="mt-2 divide-y divide-line border-b border-line">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block py-7 sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-8"
                  >
                    <time
                      dateTime={p.iso}
                      className="block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint"
                    >
                      {p.date}
                    </time>
                    <div className="mt-2.5 sm:mt-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <CategoryChip label={p.category} />
                        <span className="font-mono text-[0.66rem] text-faint">
                          {p.readMins} min read
                        </span>
                      </div>
                      <h3 className="mt-2.5 font-sans text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-seal sm:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {p.excerpt}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
