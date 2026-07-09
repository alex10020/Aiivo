/* =============================================================================
   REPORT VIEW — the $99 deliverable.
   Fully server-rendered and deterministic (no animations, no client state), so
   screen, print, and save-as-PDF all produce the same official document.
   ========================================================================== */

import { ExternalLink, MapPin, PhoneCall, ShieldCheck } from "lucide-react";
import { Seal } from "@/components/ui/Seal";
import { ReportDisclaimer } from "@/components/ui/ReportDisclaimer";
import type { ComplianceRecord, JurisdictionLevel, RecordItem } from "@/lib/engine/types";

const LEVELS: Record<
  JurisdictionLevel,
  { label: string; abbr: string; text: string; ring: string; dot: string }
> = {
  federal: { label: "Federal", abbr: "FED", text: "text-seal-deep", ring: "border-seal-deep/30 bg-seal-deep/[0.06]", dot: "bg-seal-deep" },
  state: { label: "State", abbr: "ST", text: "text-seal", ring: "border-seal/30 bg-seal/[0.06]", dot: "bg-seal" },
  county: { label: "County", abbr: "CO", text: "text-gold", ring: "border-gold/40 bg-gold/[0.08]", dot: "bg-gold" },
  city: { label: "City", abbr: "CITY", text: "text-muted", ring: "border-line bg-paper", dot: "bg-muted" },
  special: { label: "District", abbr: "DIST", text: "text-muted", ring: "border-line bg-paper", dot: "bg-muted" },
};

const CONF: Record<string, { label: string; cls: string; dot: string }> = {
  confirmed: { label: "Confirmed", cls: "border-seal/30 bg-seal/[0.06] text-seal", dot: "bg-seal" },
  likely_required: { label: "Likely Required", cls: "border-gold/40 bg-gold/[0.08] text-gold", dot: "bg-gold" },
  verify: { label: "Verify with jurisdiction", cls: "border-stamp/40 bg-stamp/[0.07] text-stamp", dot: "bg-stamp" },
};

function recordNo(seed: string): string {
  let h = 7;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return String(Math.abs(h) % 10000).padStart(4, "0");
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function ReportItem({ item, index }: { item: RecordItem; index: number }) {
  const lvl = LEVELS[item.level];
  const conf = CONF[item.confidence] ?? CONF.verify;
  return (
    <div className="break-inside-avoid rounded-xl border border-line bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-0.5 font-mono text-[0.62rem] font-medium tracking-wider ${lvl.ring} ${lvl.text}`}>
              {lvl.abbr}-{String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[0.95rem] font-medium text-ink">{item.name}</span>
          </div>
          <p className="mt-1 text-xs text-muted">{item.authority}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm text-ink">{item.cost}</p>
          <p className="mt-0.5 font-mono text-[0.68rem] text-faint">{item.time}</p>
        </div>
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.description}</p>
      )}

      {item.requirements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.requirements.map((r) => (
            <span key={r} className="rounded-md border border-line bg-paper px-2 py-1 text-xs text-ink-soft">
              {r}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${lvl.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${lvl.dot}`} />
          {lvl.label}
        </span>
        <span className="font-mono text-xs text-ink-soft">Renews: {item.renewal}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] ${conf.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
          {conf.label}
        </span>
        {item.lastVerifiedAt && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.66rem] text-faint">
            <ShieldCheck className="h-3.5 w-3.5 text-seal" />
            verified {fmtDate(item.lastVerifiedAt)}
          </span>
        )}
      </div>

      {item.confidence !== "confirmed" && (
        <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted">
          <PhoneCall className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.confidence === "verify" ? "text-stamp" : "text-gold"}`} />
          {item.confidence === "verify"
            ? `Confirm applicability with ${item.authority} before filing or skipping this item.`
            : `Applies in most cases like yours — confirm details with ${item.authority} when you file.`}
        </p>
      )}

      {item.filingUrl && (
        <p className="mt-3">
          <a
            href={item.filingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-seal hover:text-seal-bright"
          >
            Filing portal: {new URL(item.filingUrl).hostname}
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      )}
    </div>
  );
}

export function ReportView({ record }: { record: ComplianceRecord }) {
  const counts = (["federal", "state", "county", "city"] as const).map((lvl) => ({
    lvl,
    n: record.items.filter((i) => i.level === lvl).length,
  }));
  const no = `AIV-2026-${recordNo(record.summary)}`;

  return (
    <article className="mx-auto max-w-3xl">
      {/* certificate header */}
      <div className="sheet perforated-top relative overflow-hidden rounded-2xl">
        <Seal className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 opacity-[0.04]" aria-hidden />
        <div className="absolute right-5 top-5 hidden h-24 w-24 opacity-90 sm:block" aria-hidden>
          <Seal className="h-full w-full" text="AIIVO · COMPLIANCE RESEARCH RECORD · " />
        </div>

        <div className="paper-grain relative p-6 sm:p-8">
          <p className="label">Compliance Report</p>
          <p className="mt-1 font-mono text-xs text-faint">
            NO. {no} · GENERATED {fmtDate(record.createdAt)}
          </p>

          <p className="mt-4 flex items-start gap-2 pr-24 text-lg leading-snug text-ink sm:pr-28">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-seal" />
            <span>{record.summary}</span>
          </p>
          <p className="mt-1.5 pl-6 font-mono text-xs text-faint">
            Jurisdiction: {record.jurisdictionLabel}
          </p>

          {record.clarifications.length > 0 && (
            <p className="mt-2 pl-6 font-mono text-[0.66rem] text-faint">
              Tailored to: {record.clarifications.map((c) => c.answer).join(" · ")}
            </p>
          )}

          <div className="my-6 border-t border-dashed border-line" />

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
            <div className="bg-card p-4 sm:p-5">
              <span className="label text-faint">Permits</span>
              <p className="mt-1.5 font-mono text-2xl text-ink sm:text-3xl">{record.items.length}</p>
            </div>
            <div className="bg-card p-4 sm:p-5">
              <span className="label text-faint">Est. cost</span>
              <p className="mt-1.5 font-mono text-xl leading-snug text-ink sm:text-2xl">{record.estimatedCost}</p>
            </div>
            <div className="bg-card p-4 sm:p-5">
              <span className="label text-faint">Timeline</span>
              <p className="mt-1.5 font-mono text-xl leading-snug text-ink sm:text-2xl">{record.estimatedTimeline}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label text-faint">Coverage</span>
            {counts.map(({ lvl, n }) => (
              <span key={lvl} className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                <span className={`h-2 w-2 rounded-full ${LEVELS[lvl].dot}`} />
                {LEVELS[lvl].label} <span className="text-ink-soft">{n}</span>
              </span>
            ))}
          </div>

          <div className="my-6 border-t border-dashed border-line" />
          <div className="flex items-end justify-between gap-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
              AIIVO · OFFICIAL COMPLIANCE RECORD
            </p>
            <Barcode />
          </div>
        </div>
      </div>

      {/* line items */}
      <div className="mt-6 space-y-3">
        {record.items.map((item, i) => (
          <ReportItem key={item.id || i} item={item} index={i} />
        ))}
      </div>

      {/* notes */}
      {record.notes.length > 0 && (
        <div className="mt-6 break-inside-avoid rounded-2xl border border-gold/35 bg-gold/[0.06] p-6">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
            Important notes
          </p>
          <ul className="mt-4 space-y-2.5">
            {record.notes.map((note) => (
              <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ReportDisclaimer className="mt-6 break-inside-avoid" />

      {/* colophon */}
      <div className="mt-8 border-t border-line pt-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
          {no} · AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026 · Informational tool
          — not legal advice
        </p>
      </div>
    </article>
  );
}
