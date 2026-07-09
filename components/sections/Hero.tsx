"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Check } from "lucide-react";
import GuillocheField from "../three/GuillocheField";
import { Seal } from "../ui/Seal";
import { CountUp } from "../ui/CountUp";

const ease = [0.16, 1, 0.3, 1] as const;
const stamp = [0.2, 1.4, 0.3, 1] as const;

const RECORD = [
  { name: "Sales & Use Tax Permit", code: "TX", status: "CONFIRMED" },
  { name: "Retail Food Establishment", code: "TX · AUS", status: "CONFIRMED" },
  { name: "Certificate of Occupancy", code: "TX · AUS", status: "LIKELY" },
];

export function Hero() {
  const [q, setQ] = useState("Coffee shop, Austin TX");
  const router = useRouter();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-6 pb-20 pt-32 sm:pt-36"
    >
      {/* living security watermark */}
      <GuillocheField className="opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* ---------------------------------------------------------------- */}
        {/* left: the pitch                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="label flex items-center gap-3"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-seal" />
            Compliance, on the record
            <span className="h-px w-8 bg-line-strong" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
            className="mt-6 text-[2.9rem] leading-[0.98] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.6rem]"
          >
            Make your business{" "}
            <span className="italic seal-text">officially</span> legal.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft"
          >
            Tell us what you do and where. Aiivo finds every federal, state,
            county and city permit you need — then files them for you and keeps
            you renewed, so you&apos;re never caught off the books.
          </motion.p>

          {/* form field */}
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/demo?q=${encodeURIComponent(q)}`);
            }}
            className="mt-9 max-w-xl"
          >
            <span className="label mb-2 block text-faint">Your business</span>
            <div className="group flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
              <MapPin className="h-5 w-5 shrink-0 text-seal" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Food truck, Denver CO"
                aria-label="Your business type and location"
                className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
              >
                Find permits
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="label text-faint">Indexing 8,300 jurisdictions</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span className="label text-faint">300+ license types</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span className="label text-faint">Source-verified data</span>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* right: the compliance record                                     */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 26, rotate: 0.4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* stacked-paper depth */}
          <div className="absolute -inset-x-3 -bottom-3 top-3 -z-10 rotate-[1.4deg] rounded-[1.4rem] border border-line bg-paper-2/70" />

          <div className="sheet perforated-top relative overflow-hidden rounded-[1.4rem]">
            <div className="paper-grain p-6 sm:p-7">
              {/* header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="label">Compliance Record</p>
                  <p className="mt-1 font-mono text-xs text-faint">
                    NO. AIV-2026-0613 · ISSUED 06/2026
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-seal/30 bg-seal/[0.07] px-2.5 py-1 font-mono text-[0.66rem] font-medium uppercase tracking-wider text-seal">
                  <span className="h-1.5 w-1.5 rounded-full bg-seal" />
                  Record ready
                </span>
              </div>

              <div className="my-5 border-t border-dashed border-line" />

              {/* subject */}
              <p className="label text-faint">Subject</p>
              <p className="mt-1.5 flex items-center gap-2 text-lg text-ink">
                <MapPin className="h-4 w-4 text-seal" />
                Coffee shop — Austin, TX
              </p>

              {/* scan */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="label">
                    Checked{" "}
                    <CountUp
                      value={167}
                      className="text-ink-soft"
                      duration={1.4}
                    />{" "}
                    sourced requirements
                  </span>
                  <span className="font-mono text-xs font-medium text-seal">
                    7 matches
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease, delay: 0.6 }}
                    className="h-full rounded-full bg-seal"
                  />
                </div>
              </div>

              {/* permits */}
              <div className="mt-5 space-y-px">
                {RECORD.map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.9 + i * 0.12 }}
                    className="flex items-center gap-3 py-2"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-seal/10 text-seal">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="flex-1 truncate text-sm text-ink">
                      {r.name}
                    </span>
                    <span className="font-mono text-[0.66rem] text-faint">
                      {r.code}
                    </span>
                    <span
                      className={`font-mono text-[0.6rem] uppercase tracking-wider ${
                        r.status === "LIKELY" ? "text-gold" : "text-seal"
                      }`}
                    >
                      {r.status}
                    </span>
                  </motion.div>
                ))}
                <p className="pl-8 pt-1 font-mono text-[0.66rem] text-faint">
                  + 4 more on the full record
                </p>
              </div>

              <div className="my-5 border-t border-dashed border-line" />

              {/* totals + barcode */}
              <div className="flex items-end justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="label text-faint">Estimated cost</p>
                    <p className="font-mono text-xl text-ink">
                      <CountUp value={1340} prefix="$" duration={1.4} />
                    </p>
                  </div>
                  <div>
                    <p className="label text-faint">Time to comply</p>
                    <p className="font-mono text-sm text-ink-soft">4–6 weeks</p>
                  </div>
                </div>
                <div
                  className="h-9 w-28 opacity-70"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, var(--color-ink) 0 1px, transparent 1px 3px, var(--color-ink) 3px 4px, transparent 4px 7px, var(--color-ink) 7px 9px, transparent 9px 12px)",
                  }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          {/* stamped notary seal */}
          <motion.div
            initial={{ scale: 1.7, opacity: 0, rotate: -28 }}
            animate={{ scale: 1, opacity: 1, rotate: -11 }}
            transition={{ duration: 0.55, ease: stamp, delay: 1.25 }}
            className="absolute -bottom-6 -right-4 h-36 w-36 drop-shadow-[0_10px_20px_rgba(21,98,61,0.22)] sm:-right-7 sm:h-40 sm:w-40"
          >
            <span className="absolute inset-[12%] rounded-full bg-card/80" />
            <Seal className="relative h-full w-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
