"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "../ui/Logo";
import { NAV_LINKS } from "@/lib/data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1240px] items-center px-4 pt-3 sm:px-6">
        <div
          className={clsx(
            "flex w-full items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-4",
            scrolled
              ? "border border-line bg-paper/85 backdrop-blur-md shadow-[0_14px_40px_-28px_rgba(27,24,19,0.6)]"
              : "border border-transparent"
          )}
        >
          <Link href="/" className="shrink-0" aria-label="Aiivo home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="hidden rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signin?mode=signup"
              className="hidden rounded-full border border-line px-3.5 py-2 text-sm text-ink transition-colors hover:border-line-strong lg:block"
            >
              Sign up
            </Link>
            <Link
              href="/demo"
              className="group hidden items-center gap-1.5 rounded-full bg-seal px-4 py-2 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright sm:inline-flex"
            >
              Check my business
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 overflow-hidden rounded-3xl border border-line bg-paper/95 p-2 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-3 py-3 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="block rounded-2xl px-3 py-3 text-sm text-ink-soft hover:bg-paper-2 hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-2xl bg-seal px-4 py-3 text-sm font-medium text-on-seal"
          >
            Check my business <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
