import { Logo } from "../ui/Logo";

/* Local-only nav (golden rule 4). In-page anchors point at real section ids. */
const COLS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Live demo", href: "/demo" },
      { label: "Why Aiivo", href: "/why" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Disclaimer", href: "/terms#warranty" },
      { label: "Accuracy policy", href: "/accuracy" },
    ],
  },
];

const BARCODE =
  "repeating-linear-gradient(90deg, var(--color-ink) 0 1px, transparent 1px 3px, var(--color-ink) 3px 4px, transparent 4px 7px, var(--color-ink) 7px 9px, transparent 9px 12px)";

/* Back-of-certificate fine print. Aligns with the Trust section's stance:
   informational tool, verify with the authority, liability capped at amount paid. */
const DISCLAIMER =
  "Aiivo is an informational research tool — not a law firm — and does not provide legal, tax, or other professional advice; no attorney-client relationship is created by using it. Permit requirements, fees, and timelines are compiled from public government sources and may be incomplete, change without notice, or vary with your specific circumstances, and confidence scores are estimates, not guarantees. You remain solely responsible for your own compliance: always confirm each requirement with the issuing authority before filing or otherwise relying on any result. To the fullest extent permitted by law, Aiivo's liability is limited to the amount you paid for the relevant service.";

export function Footer() {
  return (
    <footer className="perforated-top relative bg-paper-2">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="container-x relative pt-16 sm:pt-20">
        {/* ---------------------------------------------------------------- */}
        {/* masthead + link columns                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The compliance office for every new business. Tell us what you do
              and where — get every permit you need, filed and kept on the
              record.
            </p>
            <a
              href="mailto:alexander@aiivo.ai"
              className="mt-4 inline-block font-mono text-sm text-ink-soft underline-offset-4 transition-colors hover:text-seal hover:underline"
            >
              alexander@aiivo.ai
            </a>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="label text-faint">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* the colophon — bottom of an official document                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-14 border-t border-line pt-7">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2.5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-seal" />
              Aiivo · Official Compliance Record · © 2026
            </p>
            <div
              className="h-7 w-32 opacity-50"
              style={{ backgroundImage: BARCODE }}
              aria-hidden
            />
          </div>

          {/* fine print — back-of-certificate disclaimer */}
          <div className="mt-6 border-t border-dashed border-line pt-5">
            <p className="flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
              <span>Disclaimer</span>
              <span className="h-px flex-1 bg-line" />
              <span>Rec. No. AIV-2026-0613</span>
            </p>
            <p className="mt-3 max-w-3xl font-mono text-[0.66rem] leading-relaxed text-muted">
              {DISCLAIMER}
            </p>
          </div>
        </div>

        <div className="h-12" />
      </div>
    </footer>
  );
}
