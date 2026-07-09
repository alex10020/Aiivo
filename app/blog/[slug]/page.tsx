import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Reveal } from "@/components/ui/Reveal";
import { Footer } from "@/components/sections/Footer";
import { POSTS, BYLINE } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Entry not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

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
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            The bulletin
          </Link>
        </div>
      </header>

      <main className="relative">
        <article className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-3xl">
            {/* masthead */}
            <Reveal>
              <div className="relative">
                <Seal className="pointer-events-none absolute -top-9 right-0 hidden h-28 w-28 opacity-[0.06] sm:block" />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/[0.07] px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-wider text-seal">
                    <span className="h-1 w-1 rounded-full bg-seal" />
                    {post.category}
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                    {post.readMins} min read
                  </span>
                </div>

                <h1 className="mt-5 text-balance text-[2.3rem] leading-[1.08] tracking-[-0.01em] text-ink sm:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-soft">
                  {post.excerpt}
                </p>
              </div>
            </Reveal>

            {/* record meta strip */}
            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-y border-line py-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
                <time dateTime={post.iso}>{post.date}</time>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>{BYLINE}</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span>No. {post.recordNo}</span>
              </div>
            </Reveal>

            {/* body */}
            <Reveal delay={0.06}>
              <div className="mt-10 space-y-8">
                {post.body.map((sec, i) => (
                  <section key={i} className="space-y-4">
                    {sec.heading && (
                      <h2 className="text-2xl leading-snug text-ink sm:text-[1.7rem]">
                        {sec.heading}
                      </h2>
                    )}
                    {sec.paras.map((p, j) => (
                      <p
                        key={j}
                        className="text-pretty text-[1.05rem] leading-[1.75] text-ink-soft"
                      >
                        {p}
                      </p>
                    ))}
                  </section>
                ))}
              </div>
            </Reveal>

            {/* informational disclaimer + CTA */}
            <Reveal delay={0.05}>
              <div className="mt-12 flex gap-3.5 rounded-xl border border-seal/25 bg-seal/[0.05] p-5">
                <Scale className="mt-0.5 h-5 w-5 shrink-0 text-seal" />
                <p className="text-sm leading-relaxed text-ink-soft">
                  <strong className="text-ink">
                    This is general information, not legal advice.
                  </strong>{" "}
                  Requirements vary by jurisdiction and change over time — always
                  confirm the specifics with the issuing authority before you
                  file. Or let Aiivo check your exact business in seconds.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-7">
                <Link
                  href="/#demo"
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                >
                  Check my business
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

            {/* more from the bulletin */}
            <section className="mt-16 border-t border-line pt-10">
              <div className="flex items-center gap-3">
                <span className="label">More from the bulletin</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <ul className="mt-4 divide-y divide-line border-b border-line">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-baseline gap-4 py-5"
                    >
                      <time
                        dateTime={p.iso}
                        className="hidden shrink-0 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint sm:block sm:w-28"
                      >
                        {p.date}
                      </time>
                      <span className="flex-1 font-sans text-base font-semibold tracking-tight text-ink-soft transition-colors group-hover:text-seal">
                        {p.title}
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-seal" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
