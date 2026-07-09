import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FilePlus2, FileText } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { currentUser } from "@/lib/engine/session";
import { listRecordsForOwner } from "@/lib/engine/store";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  ready: "border-seal/30 bg-seal/[0.07] text-seal",
  in_review: "border-gold/40 bg-gold/[0.08] text-gold",
  scanning: "border-line bg-paper text-muted",
  draft: "border-line bg-paper text-muted",
  failed: "border-stamp/40 bg-stamp/[0.07] text-stamp",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/signin?next=/app");
  const records = await listRecordsForOwner(user.id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Your office</Eyebrow>
          <h1 className="mt-4 text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
            Compliance <span className="italic seal-text">records</span>.
          </h1>
        </div>
        <Link
          href="/app/new"
          className="group inline-flex items-center gap-2 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
        >
          <FilePlus2 className="h-4 w-4" />
          New lookup
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="sheet paper-grain mt-10 rounded-2xl p-10 text-center sm:p-14">
          <FileText className="mx-auto h-8 w-8 text-faint" />
          <h2 className="mt-4 font-sans text-lg font-semibold tracking-normal text-ink">
            No records yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            Run your first lookup — tell us your business and address, and
            we&apos;ll issue its compliance record.
          </p>
          <Link
            href="/app/new"
            className="group mt-6 inline-flex items-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
          >
            Start my record
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-card">
          {records.map((r, i) => (
            <Link
              key={r.id}
              href={`/app/records/${r.id}`}
              className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper/60 sm:px-6 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.95rem] font-medium text-ink">
                  {r.summary || r.jurisdictionLabel}
                </p>
                <p className="mt-0.5 font-mono text-[0.68rem] text-faint">
                  {r.jurisdictionLabel} · {r.itemCount} permits · issued{" "}
                  {fmtDate(r.createdAt)}
                </p>
              </div>
              <span className="hidden font-mono text-sm text-ink sm:block">
                {r.estimatedCost}
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider ${
                  STATUS_STYLE[r.status] ?? STATUS_STYLE.draft
                }`}
              >
                {r.status.replace("_", " ")}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
