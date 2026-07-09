"use client";

import { motion } from "framer-motion";
import { Search, Scale, PhoneCall, FileX2, X } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";

const ease = [0.16, 1, 0.3, 1] as const;
const stampEase = [0.2, 1.4, 0.3, 1] as const;

// Local copy/data — declared here so we never touch lib/data.ts.
const STATS = [
  {
    value: 51,
    suffix: "%",
    cap: "Business owners",
    t: "say licensing makes it harder to grow.",
  },
  {
    value: 33,
    suffix: "%",
    cap: "New owners",
    t: "are blocked from new opportunities entirely.",
  },
  {
    display: "$10k+",
    cap: "Penalty",
    t: "in fines for operating without the right permit.",
    stamp: true,
  },
];

const BROKEN = [
  {
    n: "01",
    icon: Search,
    name: "Google it",
    detail:
      "Incomplete, conflicting and outdated. Misses county rules, links 404, a different answer every time.",
  },
  {
    n: "02",
    icon: Scale,
    name: "Hire a lawyer",
    detail:
      "$1,500–$3,000 per engagement. Slow — and most won’t track your renewals afterward.",
  },
  {
    n: "03",
    icon: PhoneCall,
    name: "Call the county clerk",
    detail: "Hold music, blind transfers, and “just check the website.”",
  },
  {
    n: "04",
    icon: FileX2,
    name: "LegalZoom",
    detail:
      "Forms your LLC, then stops. No permit research, no filing, no monitoring.",
  },
];

function NonCompliantStamp() {
  return (
    <motion.div
      initial={{ scale: 1.9, opacity: 0, rotate: -24 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -8 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.5, ease: stampEase, delay: 0.2 }}
      className="relative select-none [mix-blend-mode:multiply]"
      aria-hidden
    >
      <div className="rounded-lg border-[3px] border-stamp/85 p-1.5">
        <div className="rounded border border-stamp/45 px-6 py-4 text-center">
          <span className="block whitespace-nowrap font-mono text-2xl font-bold uppercase leading-none tracking-[0.06em] text-stamp sm:text-[1.7rem]">
            Non-Compliant
          </span>
          <span className="mt-2 block font-mono text-[0.55rem] uppercase tracking-[0.28em] text-stamp/80">
            No. AIV · Status&nbsp;: Unfiled
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Problem() {
  return (
    <section className="relative border-t border-line bg-paper py-24 sm:py-32">
      <div className="container-x relative">
        {/* ---- header ---- */}
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
              Nobody tells you which permits you{" "}
              <span className="italic seal-text">actually</span> need.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              Every new business has to navigate permits, licenses and
              registrations across federal, state, county and city lines —{" "}
              <span className="text-ink">
                300+ license types across 110+ industries, spread over 8,300
                jurisdictions
              </span>
              . There is no single source of truth for what applies to you. Get
              it wrong and the bill is real: fines, forced closure, lost
              insurance, personal liability.
            </p>
          </Reveal>
        </div>

        {/* ---- impact stats (record figures) ---- */}
        <Stagger className="mt-12 grid overflow-hidden rounded-2xl border border-line bg-card sm:grid-cols-3">
          {STATS.map((s, i) => (
            <StaggerItem
              key={s.cap}
              className={`p-6 sm:p-7 ${
                i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""
              }`}
            >
              <span className="label text-faint">{s.cap}</span>
              <div
                className={`mt-3 font-mono text-4xl tracking-tight sm:text-5xl ${
                  s.stamp ? "text-stamp" : "text-ink"
                }`}
              >
                {s.display ? (
                  s.display
                ) : (
                  <CountUp value={s.value!} suffix={s.suffix} duration={1.4} />
                )}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                {s.t}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ---- broken options + NON-COMPLIANT anchor ---- */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="label whitespace-nowrap">
                Today’s options are broken
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>
          </Reveal>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_0.4fr] lg:items-center">
            <Stagger className="paper-grain relative divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
              {BROKEN.map((b) => (
                <StaggerItem
                  key={b.name}
                  className="flex items-start gap-4 px-5 py-5 sm:px-7"
                >
                  <span className="label mt-1 shrink-0 text-faint">{b.n}</span>
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-paper text-faint">
                    <b.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-base text-ink line-through decoration-stamp/55 decoration-2">
                      {b.name}
                    </span>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {b.detail}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 -rotate-3 items-center gap-1 rounded border border-stamp/45 px-2 py-0.5 font-mono text-[0.58rem] font-medium uppercase tracking-[0.18em] text-stamp">
                    <X className="h-3 w-3" strokeWidth={2.5} />
                    Rejected
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="flex justify-center lg:justify-end">
              <NonCompliantStamp />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
