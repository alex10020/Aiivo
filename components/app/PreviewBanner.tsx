import { Eye } from "lucide-react";

/* Shown only in dev-only dashboard preview (no Supabase configured). */
export function PreviewBanner() {
  return (
    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-gold/35 bg-gold/[0.06] px-5 py-4">
      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
          Preview mode — sample data
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          This is how your dashboard will look. Connect Supabase (keys in{" "}
          <code className="font-mono">.env.local</code> + run the migrations)
          to enable real accounts, saved records and filings.
        </p>
      </div>
    </div>
  );
}
