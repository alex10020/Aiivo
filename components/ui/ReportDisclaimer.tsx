import Link from "next/link";
import { Scale } from "lucide-react";

/* The legal boundary of every report, stated where the user actually reads it.
   Mirrors the ToS ("not legal advice", AI-assisted output, verify-with-authority)
   so the report itself carries the disclaimer — not just a footer link. */
export function ReportDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3.5 rounded-xl border border-line bg-paper-2/60 p-5 ${className}`}
    >
      <Scale className="mt-0.5 h-5 w-5 shrink-0 text-seal" aria-hidden />
      <div className="text-xs leading-relaxed text-muted">
        <p>
          <strong className="text-ink-soft">
            This report is informational research, not legal advice,
          </strong>{" "}
          and Aiivo is not a law firm. It is generated with AI assistance from
          government-source data and may contain errors or be out of date.
          Requirements change; the issuing authority&rsquo;s own published rules
          control. Confirm each item with the authority before relying on it —
          especially items marked{" "}
          <span className="font-mono text-[0.9em] text-gold">Likely Required</span>{" "}
          or <span className="font-mono text-[0.9em] text-stamp">Verify</span>.
        </p>
        <p className="mt-2">
          <Link href="/accuracy" className="underline decoration-line underline-offset-2 transition-colors hover:text-ink">
            How we source &amp; score
          </Link>
          {" · "}
          <Link href="/terms" className="underline decoration-line underline-offset-2 transition-colors hover:text-ink">
            Terms of service
          </Link>
        </p>
      </div>
    </div>
  );
}
