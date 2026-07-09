"use client";

import { motion } from "framer-motion";
import { MapPin, ShieldCheck } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Seal } from "@/components/ui/Seal";
import { LEVELS, sumCosts, type Level, type PermitResult } from "@/lib/permits";

const ease = [0.16, 1, 0.3, 1] as const;
const stampEase = [0.2, 1.4, 0.3, 1] as const;
const ORDER: Level[] = ["federal", "state", "county", "city"];

function recordNo(seed: string): string {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return String(Math.abs(h) % 10000).padStart(4, "0");
}

const Barcode = () => (
  <div
    className="h-9 w-32 opacity-70"
    style={{
      backgroundImage:
        "repeating-linear-gradient(90deg, var(--color-ink) 0 1px, transparent 1px 3px, var(--color-ink) 3px 4px, transparent 4px 7px, var(--color-ink) 7px 9px, transparent 9px 12px)",
    }}
    aria-hidden
  />
);

export function ResultsSummary({ result }: { result: PermitResult }) {
  const { min, max } = sumCosts(result.permits);
  const total = result.permits.length;
  const agencies = new Set(result.permits.map((p) => p.issuing_authority)).size;
  const sourced = result.permits.some((p) => p.last_verified);

  const counts = ORDER.map(
    (lvl) => result.permits.filter((p) => p.level === lvl).length
  );

  const now = new Date();
  const issued = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  return (
    <div className="sheet perforated-top relative overflow-hidden rounded-2xl">
      {/* faint security watermark */}
      <Seal
        className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 opacity-[0.04]"
        aria-hidden
      />

      {/* stamped seal */}
      <motion.div
        initial={{ scale: 1.7, opacity: 0, rotate: -26 }}
        animate={{ scale: 1, opacity: 1, rotate: -9 }}
        transition={{ duration: 0.55, ease: stampEase, delay: 0.55 }}
        className="absolute -right-3 -top-3 z-10 h-24 w-24 drop-shadow-[0_8px_18px_rgba(21,98,61,0.2)] sm:right-4 sm:top-4 sm:h-28 sm:w-28"
        aria-hidden
      >
        <span className="absolute inset-[14%] rounded-full bg-card/80" />
        <Seal className="relative h-full w-full" text="AIIVO · ON RECORD · COMPLIANT · " />
      </motion.div>

      <div className="paper-grain relative p-6 sm:p-8">
        {/* header */}
        <div>
          <p className="label">Compliance Record</p>
          <p className="mt-1 font-mono text-xs text-faint">
            NO. AIV-2026-{recordNo(result.business_summary)} · ISSUED {issued}
          </p>
        </div>

        <p className="mt-4 flex items-start gap-2 pr-24 text-lg leading-snug text-ink sm:pr-28">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-seal" />
          <span>{result.business_summary}</span>
        </p>
        <p className="mt-1.5 pl-6 font-mono text-xs text-faint">
          Jurisdiction: {result.jurisdiction}
        </p>
        {sourced && (
          <p className="mt-2 flex items-center gap-1.5 pl-6 font-mono text-[0.66rem] text-faint">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-seal" />
            Sourced from {agencies} government {agencies === 1 ? "agency" : "agencies"} · every line verified within 90 days
          </p>
        )}

        <div className="my-6 border-t border-dashed border-line" />

        {/* metrics */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          <div className="bg-card p-5">
            <span className="label text-faint">Permits required</span>
            <div className="mt-2 font-mono text-3xl text-ink">
              <CountUp value={total} duration={1.1} />
            </div>
          </div>
          <div className="bg-card p-5">
            <span className="label text-faint">Estimated cost</span>
            <div className="mt-2 font-mono text-3xl text-ink">
              {max > 0 ? (
                min === max ? (
                  <CountUp value={max} prefix="$" duration={1.5} />
                ) : (
                  <span className="inline-flex items-baseline">
                    <CountUp value={min} prefix="$" duration={1.5} />
                    <span className="mx-1 text-muted">–</span>
                    <CountUp value={max} prefix="$" duration={1.6} />
                  </span>
                )
              ) : (
                result.estimated_total_cost
              )}
            </div>
            <span className="mt-1.5 block font-mono text-[0.62rem] uppercase tracking-wider text-faint">
              Summed · {total} filings
            </span>
          </div>
          <div className="bg-card p-5">
            <span className="label text-faint">Time to comply</span>
            <div className="mt-2 font-mono text-2xl leading-tight text-ink">
              {result.estimated_timeline}
            </div>
          </div>
        </div>

        {/* jurisdiction breakdown */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="label text-faint">Jurisdiction coverage</span>
            <span className="font-mono text-[0.66rem] text-faint">
              {ORDER.filter((_, i) => counts[i] > 0).length} of 4 levels
            </span>
          </div>
          <div className="mt-2.5 flex h-2.5 overflow-hidden rounded-full bg-paper-3">
            {ORDER.map((lvl, i) =>
              counts[i] > 0 ? (
                <motion.div
                  key={lvl}
                  className={`h-full ${LEVELS[lvl].dot}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(counts[i] / total) * 100}%` }}
                  transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.1 }}
                />
              ) : null
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {ORDER.map((lvl, i) => (
              <span
                key={lvl}
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted"
              >
                <span className={`h-2 w-2 rounded-full ${LEVELS[lvl].dot}`} />
                {LEVELS[lvl].label}
                <span className="text-ink-soft">{counts[i]}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-line" />

        {/* footer row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label text-faint">Verified</p>
            <p className="mt-1 font-mono text-xs text-ink-soft">
              {now.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Barcode />
        </div>
      </div>
    </div>
  );
}
