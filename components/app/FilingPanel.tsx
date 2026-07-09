"use client";

/* [E] Filing panel on the record page: file each permit, watch its status. */
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  FileCheck2,
  Loader2,
  Send,
} from "lucide-react";
import type { Filing, RecordItem } from "@/lib/engine/types";

const STATUS_STYLE: Record<string, string> = {
  queued: "border-line bg-paper text-muted",
  prefilled: "border-gold/40 bg-gold/[0.08] text-gold",
  needs_info: "border-gold/40 bg-gold/[0.08] text-gold",
  submitted: "border-seal/30 bg-seal/[0.07] text-seal",
  approved: "border-seal/30 bg-seal/[0.07] text-seal",
  rejected: "border-stamp/40 bg-stamp/[0.07] text-stamp",
};

export function FilingPanel({
  recordId,
  items,
}: {
  recordId: string;
  items: RecordItem[];
}) {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/filings?record=${recordId}`);
      if (!res.ok) return;
      const data = await res.json();
      setFilings(data.filings ?? []);
    } catch {
      /* panel is best-effort */
    }
  }, [recordId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function file(itemId: string) {
    setBusy(itemId);
    setError("");
    try {
      const res = await fetch("/api/filings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ record_id: recordId, record_item_id: itemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Filing failed.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  const byItem = new Map(filings.map((f) => [f.recordItemId, f]));

  return (
    <div className="sheet perforated-top relative overflow-hidden rounded-2xl">
      <div className="paper-grain p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-seal" />
          <h2 className="font-sans text-lg font-semibold tracking-normal text-ink">
            File your permits
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          We prefill each application from your record and track it through
          submission. Every filing is human-reviewed before it reaches an
          agency.
        </p>

        <div className="mt-5 divide-y divide-line rounded-xl border border-line bg-card">
          {items.map((it) => {
            const filing = byItem.get(it.id);
            return (
              <div key={it.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{it.name}</p>
                  <p className="mt-0.5 truncate font-mono text-[0.64rem] text-faint">
                    {it.authority}
                  </p>
                </div>
                {filing ? (
                  <>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider ${
                        STATUS_STYLE[filing.status] ?? STATUS_STYLE.queued
                      }`}
                    >
                      {filing.status.replace("_", " ")}
                    </span>
                    {filing.portal && (
                      <a
                        href={filing.portal}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open portal for ${it.name}`}
                        className="shrink-0 text-faint transition-colors hover:text-seal"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => file(it.id)}
                    disabled={busy !== null}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-seal/35 bg-card px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-seal transition-colors hover:bg-seal hover:text-on-seal disabled:opacity-50"
                  >
                    {busy === it.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    File this
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 font-mono text-xs text-stamp">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
