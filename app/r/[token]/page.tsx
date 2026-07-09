/* Public read-only report — the shareable/printable $99 deliverable.
   The token is an unguessable capability: no auth, but unlisted and unindexed. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ReportView } from "@/components/report/ReportView";
import { PrintButton } from "@/components/report/PrintButton";
import { getRecordByShareToken } from "@/lib/engine/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compliance Report",
  robots: { index: false, follow: false }, // capability URLs stay unindexed
};

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // basic shape check before hitting the DB
  if (!/^[0-9a-f-]{36}$/i.test(token)) notFound();
  const record = await getRecordByShareToken(token);
  if (!record) notFound();

  return (
    <div className="min-h-screen bg-paper print:bg-white">
      {/* chrome — hidden when printing */}
      <header className="border-b border-line print:hidden">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Aiivo home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="container-x py-10 print:py-0">
        <ReportView record={record} />

        {/* conversion for report recipients — hidden in the printed document */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-seal/30 bg-seal/[0.05] p-6 text-center print:hidden">
          <p className="text-sm leading-relaxed text-ink-soft">
            This report was issued by Aiivo — the compliance record for every
            new business.
          </p>
          <Link
            href="/demo"
            className="group mt-3 inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-seal hover:text-seal-bright"
          >
            Run your own business
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
