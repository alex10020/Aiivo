import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { DiscoveryWizard } from "@/components/app/DiscoveryWizard";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "The deterministic permit engine — answer structured facts, get an exact compliance record with no AI on the path.",
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="label flex items-center gap-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container-x py-12 sm:py-16">
        <DiscoveryWizard />
      </main>

      <footer className="border-t border-line bg-paper-2">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
            AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
            Deterministic · informational tool · not legal advice
          </p>
        </div>
      </footer>
    </div>
  );
}
