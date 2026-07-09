import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "The Aiivo compliance API — one call returns every permit a business needs, with costs, timelines, confidence scores and filing links. For platforms that create businesses.",
};

const REQUEST = `POST https://api.aiivo.ai/v1/permits
Authorization: Bearer sk_live_•••••••••••••••
Content-Type: application/json

{
  "business_type": "Coffee shop",
  "location": "Austin, TX",
  "sells": "Coffee, pastries, beer & wine"
}`;

const RESPONSE = `{
  "business_summary": "Coffee shop — Austin, TX",
  "jurisdiction": "Austin, Travis County, TX",
  "total_permits": 8,
  "estimated_total_cost": "$1,340",
  "estimated_timeline": "4–6 weeks",
  "permits": [
    {
      "name": "Sales & Use Tax Permit",
      "issuing_authority": "Texas Comptroller",
      "level": "state",
      "estimated_cost": "$0",
      "processing_time": "2–3 weeks",
      "renewal": "Ongoing",
      "description": "Authorises collection of sales tax …",
      "requirements": ["EIN", "Business address"],
      "confidence": "confirmed",
      "url": "https://comptroller.texas.gov/taxes/permit/"
    }
    // … 7 more
  ],
  "notes": [
    "Zoning must permit food service at the address.",
    "Beer & wine adds a TABC license (~8–12 weeks)."
  ]
}`;

const FIELDS = [
  { f: "level", t: "federal · state · county · city" },
  { f: "confidence", t: "confirmed · likely_required · verify" },
  { f: "estimated_cost", t: "Per-permit fee, human-readable" },
  { f: "processing_time", t: "Expected agency turnaround" },
  { f: "renewal", t: "Renewal cadence (annual, one-time…)" },
  { f: "url", t: "Direct link to the filing portal" },
];

const PARTNERS = ["Stripe Atlas", "LegalZoom", "Gusto", "Deel"];

function Specimen({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <Terminal className="h-3.5 w-3.5 text-seal" />
        <span className="label">{title}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.78rem] leading-relaxed text-ink-soft">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* slim top bar */}
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

      <main className="container-x py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          {/* masthead */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -right-2 -top-4 hidden opacity-[0.06] sm:block"
              aria-hidden
            >
              <Seal className="h-44 w-44" />
            </div>
            <Eyebrow>API reference</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl">
              The compliance API,{" "}
              <span className="italic seal-text">one call</span>.
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-soft">
              Stripe Atlas, LegalZoom, Gusto and Deel each create businesses that
              immediately need permits — and have no structured data to serve
              them. Aiivo is the endpoint they embed. One request returns the
              full permit map, scored and linked.
            </p>
          </div>

          {/* request / response */}
          <div className="mt-10 space-y-5">
            <Specimen title="Request" code={REQUEST} />
            <Specimen title="Response · 200 OK" code={RESPONSE} />
          </div>

          {/* field reference */}
          <div className="mt-12">
            <h2 className="font-sans text-xl font-semibold tracking-normal text-ink">
              Response fields
            </h2>
            <dl className="mt-5 overflow-hidden rounded-2xl border border-line bg-card">
              {FIELDS.map((row, i) => (
                <div
                  key={row.f}
                  className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <dt className="shrink-0 font-mono text-sm text-seal sm:w-44">
                    {row.f}
                  </dt>
                  <dd className="text-sm text-ink-soft">{row.t}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* pricing band */}
          <div className="mt-12 rounded-2xl border border-seal/30 bg-seal/[0.05] p-7 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="label text-seal">Platform pricing</span>
                <p className="mt-2 font-mono text-3xl text-ink">
                  $2–5{" "}
                  <span className="text-base text-muted">/ lookup</span>
                </p>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
                Volume-priced, near-zero marginal cost. Embed permit discovery
                directly into your onboarding flow.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-seal/20 pt-5">
              <span className="label text-faint">Built for</span>
              {PARTNERS.map((p) => (
                <span
                  key={p}
                  className="font-mono text-xs uppercase tracking-wider text-ink-soft"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-10 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
            AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
          </p>
        </div>
      </main>
    </div>
  );
}
