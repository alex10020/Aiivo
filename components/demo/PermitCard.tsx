"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, PhoneCall, ShieldCheck } from "lucide-react";
import { LEVELS, CONFIDENCE, type Permit } from "@/lib/permits";

const ease = [0.16, 1, 0.3, 1] as const;

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PermitCard({ permit, index }: { permit: Permit; index: number }) {
  const [open, setOpen] = useState(false);
  const lvl = LEVELS[permit.level];
  const conf = CONFIDENCE[permit.confidence];
  const code = `${lvl.abbr}-${String(index + 1).padStart(2, "0")}`;
  const confShort =
    permit.confidence === "confirmed"
      ? "Confirmed"
      : permit.confidence === "likely_required"
        ? "Likely"
        : "Verify";

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card transition-colors hover:border-line-strong">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span
          className={`hidden shrink-0 rounded-md border px-2 py-1 font-mono text-[0.62rem] font-medium tracking-wider sm:inline-block ${lvl.ring} ${lvl.text}`}
        >
          {code}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.95rem] font-medium text-ink">
            {permit.name}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {permit.issuing_authority}
          </span>
        </span>

        <span className="hidden shrink-0 text-right sm:block">
          <span className="block font-mono text-sm text-ink">
            {permit.estimated_cost}
          </span>
          <span className="mt-0.5 block font-mono text-[0.68rem] text-faint">
            {permit.processing_time}
          </span>
        </span>

        <span
          className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[0.56rem] uppercase tracking-widest sm:inline-flex ${conf.cls}`}
          title={conf.label}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
          {confShort}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-faint transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="border-t border-dashed border-line px-4 py-5 sm:px-5">
              {/* mobile cost row */}
              <div className="mb-4 flex items-center justify-between sm:hidden">
                <span className="font-mono text-sm text-ink">
                  {permit.estimated_cost}
                </span>
                <span className="font-mono text-[0.68rem] text-faint">
                  {permit.processing_time}
                </span>
              </div>

              {permit.description && (
                <p className="text-sm leading-relaxed text-ink-soft">
                  {permit.description}
                </p>
              )}

              {permit.requirements.length > 0 && (
                <div className="mt-4">
                  <span className="label text-faint">Requirements</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {permit.requirements.map((req) => (
                      <span
                        key={req}
                        className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-soft"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div>
                  <span className="label text-faint">Jurisdiction</span>
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 font-mono text-xs ${lvl.text}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${lvl.dot}`} />
                    {lvl.label}
                  </span>
                </div>
                <div>
                  <span className="label text-faint">Renews</span>
                  <span className="mt-1 block font-mono text-xs text-ink-soft">
                    {permit.renewal}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${conf.cls}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
                  {conf.label}
                </span>
              </div>

              {permit.last_verified && (
                <p className="mt-4 flex items-center gap-1.5 font-mono text-[0.66rem] text-faint">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-seal" />
                  Source: {permit.issuing_authority} · verified{" "}
                  {fmtDate(permit.last_verified)}
                </p>
              )}

              {/* Non-confirmed items actively route the owner to the authority —
                  the confidence tag is a legal boundary, not just a label. */}
              {permit.confidence !== "confirmed" && (
                <div
                  className={`mt-4 flex gap-2.5 rounded-lg border p-3.5 ${
                    permit.confidence === "verify"
                      ? "border-stamp/30 bg-stamp/[0.05]"
                      : "border-gold/35 bg-gold/[0.06]"
                  }`}
                >
                  <PhoneCall
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      permit.confidence === "verify" ? "text-stamp" : "text-gold"
                    }`}
                  />
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {permit.confidence === "verify" ? (
                      <>
                        <strong className="text-ink">
                          Confirm before relying on this item.
                        </strong>{" "}
                        Whether it applies depends on specifics of your business —
                        contact {permit.issuing_authority} directly
                        {permit.url ? " (link below)" : ""} before filing or
                        deciding to skip it.
                      </>
                    ) : (
                      <>
                        <strong className="text-ink">Likely required.</strong>{" "}
                        Applies in most cases like yours — confirm the details with{" "}
                        {permit.issuing_authority} when you file.
                      </>
                    )}
                  </p>
                </div>
              )}

              {permit.url && (
                <a
                  href={permit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-seal transition-colors hover:text-seal-bright"
                >
                  Visit filing portal
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
