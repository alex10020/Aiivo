import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SignOutButton } from "@/components/app/SignOutButton";

const NAV = [
  { label: "Dashboard", href: "/app" },
  { label: "New lookup", href: "/app/new" },
  { label: "Account", href: "/app/account" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/app" aria-label="Dashboard">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="container-x flex-1 py-10">{children}</main>

      <footer className="border-t border-line bg-paper-2">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
            AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
            Informational tool · not legal advice
          </p>
        </div>
      </footer>
    </div>
  );
}
