"use client";

import { motion } from "framer-motion";
import { PencilLine, Map, Send, Check, Clock } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";
import { STEPS } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

const ICONS = [PencilLine, Map, Send];

// each step maps to a stage in the filing's lifecycle — like tracking a
// government application from intake to submission.
const TRACK = [
  { status: "Received", solid: false },
  { status: "Reviewed", solid: false },
  { status: "Filed", solid: true },
];

function StatusChip({ status, solid }: { status: string; solid: boolean }) {
  return solid ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-seal px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-on-seal">
      <Check className="h-3 w-3" strokeWidth={3} />
      {status}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/5 px-2.5 py-1 font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-seal">
      <span className="h-1.5 w-1.5 rounded-full bg-seal" />
      {status}
    </span>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative scroll-mt-24 border-t border-line bg-paper-2 py-24 sm:py-32"
    >
      <div className="container-x relative">
        {/* ---- header ---- */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl leading-[1.1] tracking-tight text-ink sm:text-[2.6rem]">
              From first answer to{" "}
              <span className="italic seal-text">officially</span> filed — in
              three steps.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              No legal jargon, no agency phone trees. Track your filing from
              received to filed — the agent handles the paperwork, the review,
              and every renewal after.
            </p>
          </Reveal>
        </div>

        {/* ---- the application tracker ---- */}
        <Reveal delay={0.05} className="mt-14">
          <div className="sheet overflow-hidden rounded-2xl">
            {/* tracker header */}
            <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
              <div>
                <p className="label">Application Tracker</p>
                <p className="mt-1 font-mono text-xs text-faint">
                  NO. AIV-2026-0613 · FILE STATUS
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-seal/30 bg-seal/5 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-seal">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-seal" />
                Live tracking
              </span>
            </div>

            {/* tracker body */}
            <div className="paper-grain relative px-6 py-9 sm:px-8 sm:py-10">
              <div className="relative">
                {/* connector rails (desktop) */}
                <div className="pointer-events-none absolute inset-x-8 top-5 hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent lg:block" />
                <motion.div
                  className="pointer-events-none absolute inset-x-8 top-5 hidden h-px origin-left bg-gradient-to-r from-seal/0 via-seal to-seal/0 lg:block"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-90px" }}
                  transition={{ duration: 1.1, ease, delay: 0.25 }}
                />

                <Stagger className="grid gap-y-11 lg:grid-cols-3 lg:gap-x-10">
                  {STEPS.map((s, i) => {
                    const Icon = ICONS[i];
                    const track = TRACK[i];
                    return (
                      <StaggerItem key={s.n} className="relative">
                        {/* node row */}
                        <div className="flex items-center justify-between">
                          <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-seal/30 bg-card font-mono text-sm font-medium text-seal">
                            {s.n}
                          </span>
                          <StatusChip
                            status={track.status}
                            solid={track.solid}
                          />
                        </div>

                        {/* content */}
                        <div className="mt-6 flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-seal" />
                          <h3 className="font-sans text-lg font-medium tracking-normal text-ink">
                            {s.title}
                          </h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {s.body}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                          <Clock className="h-3 w-3 text-faint" />
                          {s.chip}
                        </span>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
