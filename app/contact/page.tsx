import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Mail, Clock, MessagesSquare } from "lucide-react";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Footer } from "@/components/sections/Footer";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about permits, the Aiivo API, press or partnerships? Send a note and a human replies — usually within one business day.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "alexander@aiivo.ai",
    href: "mailto:alexander@aiivo.ai",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 1 business day",
  },
  {
    icon: MessagesSquare,
    label: "Best for",
    value: "Support · Sales & API · Press · Partnerships",
  },
];

export default function ContactPage() {
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
          <div className="mx-auto max-w-5xl">
            {/* masthead */}
            <Reveal>
              <div className="relative max-w-2xl">
                <Eyebrow>Correspondence</Eyebrow>
                <h1 className="mt-5 text-[2.6rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-6xl">
                  Get in <span className="italic seal-text">touch</span>.
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                  Questions about permits, the API, press or partnerships? Send a
                  note and a human gets back to you — usually within a business
                  day.
                </p>
              </div>
            </Reveal>

            {/* form + contact record */}
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
              <Reveal delay={0.05}>
                <ContactForm />
              </Reveal>

              <Reveal delay={0.12}>
                <aside className="sheet paper-grain relative h-full overflow-hidden rounded-2xl p-7 sm:p-8">
                  <Seal className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 opacity-[0.06]" />

                  <div className="relative">
                    <p className="label text-faint">Direct line</p>
                    <p className="mt-1 font-mono text-xs text-faint">
                      DESK · AIV-OPS · MON–FRI
                    </p>

                    <div className="my-5 border-t border-dashed border-line" />

                    <ul className="space-y-5">
                      {CHANNELS.map((c) => (
                        <li key={c.label} className="flex items-start gap-3.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-seal/25 bg-seal/[0.07] text-seal">
                            <c.icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="label text-faint">{c.label}</p>
                            {c.href ? (
                              <a
                                href={c.href}
                                className="mt-1 block break-words font-mono text-sm text-ink-soft underline-offset-4 transition-colors hover:text-seal hover:underline"
                              >
                                {c.value}
                              </a>
                            ) : (
                              <p className="mt-1 text-sm text-ink-soft">
                                {c.value}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="my-5 border-t border-dashed border-line" />

                    <p className="text-sm leading-relaxed text-muted">
                      Just need your permits? Skip the inbox — run your business
                      through the live record.
                    </p>
                    <a
                      href="/#demo"
                      className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-seal transition-colors hover:text-seal-bright"
                    >
                      Check my business
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>

                    <p className="mt-6 border-t border-line pt-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
                      Aiivo, Inc. · Remote · United States
                    </p>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
