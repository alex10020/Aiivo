import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { ResultsSummary } from "@/components/demo/ResultsSummary";
import { PermitCard } from "@/components/demo/PermitCard";
import { FilingPanel } from "@/components/app/FilingPanel";
import { ShareReport } from "@/components/app/ShareReport";
import { ReportDisclaimer } from "@/components/ui/ReportDisclaimer";
import { currentUser } from "@/lib/engine/session";
import { getRecordOwned } from "@/lib/engine/store";
import { previewEnabled, PREVIEW_RECORD } from "@/lib/engine/preview";
import { PreviewBanner } from "@/components/app/PreviewBanner";
import type { ComplianceRecord } from "@/lib/engine/types";
import type { PermitResult } from "@/lib/permits";

export const dynamic = "force-dynamic";

/* Map the engine's domain record onto the demo components' display shape. */
function toDisplay(record: ComplianceRecord): PermitResult {
  return {
    business_summary: record.summary,
    jurisdiction: record.jurisdictionLabel,
    total_permits: record.items.length,
    estimated_total_cost: record.estimatedCost,
    estimated_timeline: record.estimatedTimeline,
    notes: record.notes,
    permits: record.items.map((it) => ({
      name: it.name,
      issuing_authority: it.authority,
      level: it.level === "special" ? "city" : it.level,
      estimated_cost: it.cost,
      processing_time: it.time,
      renewal: it.renewal,
      description: it.description,
      requirements: it.requirements,
      confidence: it.confidence,
      url: it.filingUrl ?? "",
      last_verified: it.lastVerifiedAt ?? undefined,
    })),
  };
}

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const preview = !user && previewEnabled();
  if (!user && !preview) redirect("/signin?next=/app");
  const { id } = await params;
  const record = preview
    ? id === PREVIEW_RECORD.id
      ? PREVIEW_RECORD
      : null
    : await getRecordOwned(id, user!.id);
  if (!record) notFound();

  const display = toDisplay(record);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {preview && <PreviewBanner />}
      <Link
        href="/app"
        className="label inline-flex items-center gap-2 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All records
      </Link>

      <ResultsSummary result={display} />

      <div className="space-y-2.5">
        {display.permits.map((p, i) => (
          <PermitCard key={`${p.name}-${i}`} permit={p} index={i} />
        ))}
      </div>

      {record.notes.length > 0 && (
        <div className="rounded-2xl border border-gold/35 bg-gold/[0.06] p-6">
          <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
            <AlertTriangle className="h-4 w-4" />
            Important notes
          </p>
          <ul className="mt-4 space-y-2.5">
            {record.notes.map((note) => (
              <li
                key={note}
                className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ReportDisclaimer />

      {record.shareToken && (
        <ShareReport recordId={record.id} shareToken={record.shareToken} />
      )}

      <FilingPanel recordId={record.id} items={record.items} />
    </div>
  );
}
