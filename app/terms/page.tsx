import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, ExternalLink } from "lucide-react";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing your use of Aiivo — an informational compliance research and filing service. Not legal advice.",
};

/* ---------------------------------------------------------------------------
   Record metadata. Hardcoded (not computed) so the page is deterministic and
   matches the "official record" voice. Bump VERSION + EFFECTIVE on each edit.
--------------------------------------------------------------------------- */
const EFFECTIVE = "July 9, 2026";
const VERSION = "1.1";
const RECORD_NO = "AIV-LEGAL-TOS-2026";
const LEGAL_EMAIL = "alexander@aiivo.ai";

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of these Terms",
    body: (
      <>
        <p>
          These Terms of Service (the &ldquo;Terms&rdquo;) form a binding
          agreement between you and Aiivo, Inc. (&ldquo;Aiivo,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and govern
          your access to and use of the Aiivo websites, applications, and
          services (collectively, the &ldquo;Services&rdquo;).
        </p>
        <p>
          By accessing the Services, creating an account, or purchasing any plan,
          you agree to be bound by these Terms and by our Privacy Policy. If you
          do not agree, do not use the Services. If you are using the Services on
          behalf of a business, you represent that you are authorized to bind that
          business to these Terms.
        </p>
      </>
    ),
  },
  {
    id: "not-legal-advice",
    title: "What Aiivo is — and is not",
    body: (
      <>
        <p>
          Aiivo is an <strong className="text-ink">informational research and
          filing tool</strong>. We help you discover the business permits and
          licenses that may apply to a business based on structured government
          data, and — where you ask us to — we help prepare and submit filings on
          your behalf.
        </p>
        <p>
          Aiivo is <strong className="text-ink">not a law firm</strong>, is not a
          substitute for the advice of a licensed attorney or accountant, and does
          not provide legal, tax, or financial advice. Using the Services does not
          create an attorney-client relationship. You are responsible for your own
          compliance decisions and should consult a qualified professional for
          advice specific to your situation.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility & accounts",
    body: (
      <>
        <p>
          You must be at least 18 years old and able to form a binding contract to
          use the Services. Some features require an account. You are responsible
          for the accuracy of the information you provide, for maintaining the
          confidentiality of your credentials, and for all activity that occurs
          under your account.
        </p>
        <p>
          Notify us promptly at {LEGAL_EMAIL} if you suspect any unauthorized use
          of your account.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "The Services",
    body: (
      <>
        <p>Aiivo currently offers the following:</p>
        <ul className="mt-3 space-y-2 pl-5 [&>li]:list-disc [&>li]:marker:text-seal">
          <li>
            <strong className="text-ink">Discover</strong> — a free estimate of
            how many permits a business may need and their approximate cost.
          </li>
          <li>
            <strong className="text-ink">Report</strong> — a detailed compliance
            report with permits, costs, timelines, filing links, and source
            attribution.
          </li>
          <li>
            <strong className="text-ink">File For Me</strong> — agent-assisted
            preparation and submission of filings on your behalf, subject to human
            review.
          </li>
          <li>
            <strong className="text-ink">Monitor</strong> — ongoing tracking of
            requirement changes and renewal reminders or automatic re-filing.
          </li>
        </ul>
        <p className="mt-3">
          We may add, modify, or discontinue features at any time. Specific plan
          inclusions and prices are described at the point of purchase.
        </p>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "Accuracy & confidence scoring",
    body: (
      <>
        <p>
          Regulatory requirements vary by jurisdiction and change frequently. We
          source data from official government records and label each item with a
          confidence level —{" "}
          <span className="font-mono text-[0.85em] text-seal">Confirmed</span>,{" "}
          <span className="font-mono text-[0.85em] text-gold">
            Likely Required
          </span>
          , or{" "}
          <span className="font-mono text-[0.85em] text-stamp">Verify</span> — so
          you can see how certain we are about each result.
        </p>
        <p>
          Confidence labels are estimates, not guarantees. We do not warrant that
          any result is complete, current, or applicable to your specific
          circumstances. You remain responsible for confirming requirements with
          the relevant authority before acting, and especially before relying on
          any item marked &ldquo;Likely Required&rdquo; or &ldquo;Verify.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "ai-output",
    title: "AI-assisted output",
    body: (
      <>
        <p>
          Aiivo uses artificial-intelligence systems to match your business
          description against regulatory data, to generate report text, and to
          answer clarifying questions. AI-generated output can contain errors,
          omissions, or statements that are out of date, and two similar queries
          may produce different results.
        </p>
        <p>
          Where a report item carries a source link and a
          &ldquo;last&nbsp;verified&rdquo; date, that refers to the underlying
          government-source data — not to the AI-generated summary text around
          it. Do not treat any AI-generated description as a substitute for the
          issuing authority&rsquo;s own published requirements, which control in
          the event of any difference.
        </p>
      </>
    ),
  },
  {
    id: "filing",
    title: "Filing services & authorization",
    body: (
      <>
        <p>
          When you purchase File For Me, you authorize Aiivo to prepare and submit
          the specified filings to the applicable authorities on your behalf, as a
          limited agent, using the information you provide. This authorization is
          limited to the filings you request and does not appoint Aiivo as your
          attorney, registered agent, or general representative.
        </p>
        <p>
          You are responsible for the accuracy and completeness of the information
          you submit. Government fees, taxes, and third-party charges are your
          responsibility and may be separate from Aiivo&rsquo;s service fee.
          Authorities may reject, delay, or request additional information for any
          filing; Aiivo does not control and cannot guarantee the outcome,
          approval, or timing of any government filing.
        </p>
      </>
    ),
  },
  {
    id: "fees",
    title: "Fees, billing & refunds",
    body: (
      <>
        <p>
          Prices are shown at purchase. One-time products (such as Report and File
          For Me) are billed once. Subscription products (such as Monitor) are
          billed on a recurring basis and{" "}
          <strong className="text-ink">renew automatically</strong> until
          cancelled. You may cancel a subscription at any time, effective at the
          end of the current billing period.
        </p>
        <p>
          Service fees are non-refundable once work has begun or a report has been
          delivered, except where required by law or expressly stated at purchase.
          Government and third-party fees are non-refundable. We may change prices
          prospectively; changes will not affect orders already placed.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="mt-3 space-y-2 pl-5 [&>li]:list-disc [&>li]:marker:text-seal">
          <li>provide false, misleading, or unlawful information;</li>
          <li>
            use the Services to violate any law or to file on behalf of a person
            or business you are not authorized to represent;
          </li>
          <li>
            scrape, copy, resell, or build a competing dataset or product from the
            Services or their output, except as permitted by an API agreement;
          </li>
          <li>
            interfere with, overload, or attempt to gain unauthorized access to
            the Services or related systems.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Government portals & third-party services",
    body: (
      <p>
        The Services link to government filing portals and may rely on
        third-party providers. We do not control those sites or services and are
        not responsible for their content, availability, accuracy, fees, or
        policies. Your use of any third-party site is governed by that
        site&rsquo;s own terms.
      </p>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <p>
        The Services, including our software, data compilations, confidence
        models, designs, and brand, are owned by Aiivo and protected by
        intellectual-property laws. We grant you a limited, non-exclusive,
        non-transferable license to use the Services and the reports we deliver
        for your own business-compliance purposes. You retain ownership of the
        information you submit and grant us the rights needed to provide and
        improve the Services.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <p>
        Our handling of personal information is described in our Privacy Policy,
        which is incorporated into these Terms by reference. By using the
        Services, you consent to the collection and use of information as
        described there.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Disclaimer of warranties",
    body: (
      <p className="uppercase tracking-wide text-muted">
        The Services and all content are provided &ldquo;as is&rdquo; and
        &ldquo;as available,&rdquo; without warranties of any kind, whether
        express, implied, or statutory, including warranties of merchantability,
        fitness for a particular purpose, accuracy, and non-infringement. Aiivo
        does not warrant that the Services will be uninterrupted, error-free, or
        that any result will satisfy any legal or regulatory requirement.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p className="uppercase tracking-wide text-muted">
        To the maximum extent permitted by law, Aiivo and its officers,
        employees, and agents will not be liable for any indirect, incidental,
        special, consequential, or punitive damages, or for lost profits, lost
        revenue, fines, penalties, or business interruption, arising out of or
        related to the Services. Aiivo&rsquo;s total aggregate liability for any
        claim will not exceed the amount you paid to Aiivo for the Services giving
        rise to the claim in the twelve (12) months preceding the event.
      </p>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnification",
    body: (
      <p>
        You agree to indemnify and hold Aiivo harmless from any claims, losses,
        liabilities, and expenses (including reasonable legal fees) arising from
        your use of the Services, your violation of these Terms, your violation of
        any law, or the inaccuracy of information you provide.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Governing law & disputes",
    body: (
      <>
        <p>
          These Terms are governed by the laws of the State of Delaware, without
          regard to its conflict-of-laws rules. Any dispute that cannot be
          resolved informally will be settled by binding arbitration administered
          by the American Arbitration Association on an individual basis; you and
          Aiivo waive any right to a jury trial or to participate in a class
          action.
        </p>
        <p>
          Either party may still bring an individual claim in small-claims court.
          You may opt out of arbitration by emailing {LEGAL_EMAIL} within 30 days
          of first accepting these Terms.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes & termination",
    body: (
      <>
        <p>
          We may update these Terms from time to time. When we do, we will revise
          the &ldquo;effective&rdquo; date above and, for material changes,
          provide reasonable notice. Continued use of the Services after changes
          take effect constitutes acceptance.
        </p>
        <p>
          We may suspend or terminate your access if you breach these Terms or use
          the Services unlawfully. You may stop using the Services at any time.
          Sections that by their nature should survive termination — including
          fees owed, intellectual property, disclaimers, limitation of liability,
          and indemnification — will survive.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about these Terms can be sent to{" "}
        <a
          href={`mailto:${LEGAL_EMAIL}`}
          className="text-seal underline decoration-seal/30 underline-offset-2 transition-colors hover:decoration-seal"
        >
          {LEGAL_EMAIL}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <BackgroundFX />

      {/* top bar */}
      <header className="border-b border-line">
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" aria-label="Back to Aiivo home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="container-x py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          {/* document header */}
          <Eyebrow>Legal record</Eyebrow>
          <h1 className="mt-5 text-4xl leading-[1.05] tracking-[-0.01em] text-ink sm:text-5xl">
            Terms of <span className="italic seal-text">Service</span>
          </h1>

          {/* record metadata strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            <span>Effective {EFFECTIVE}</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span>Version {VERSION}</span>
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <span>NO. {RECORD_NO}</span>
          </div>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-soft">
            These Terms govern your use of Aiivo. Please read them carefully — in
            particular the section on what Aiivo is and is not.
          </p>

          {/* brand-critical callout */}
          <div className="mt-8 flex gap-3.5 rounded-xl border border-seal/25 bg-seal/[0.05] p-5">
            <Scale className="mt-0.5 h-5 w-5 shrink-0 text-seal" />
            <p className="text-sm leading-relaxed text-ink-soft">
              <strong className="text-ink">
                Aiivo is an informational research tool — not legal advice.
              </strong>{" "}
              We are not a law firm, and using Aiivo does not create an
              attorney-client relationship. Always confirm requirements with the
              relevant authority and consult a qualified professional for advice
              specific to your situation.
            </p>
          </div>

          {/* table of contents — docket style */}
          <nav
            aria-label="Table of contents"
            className="mt-10 overflow-hidden rounded-2xl border border-line bg-card"
          >
            <div className="border-b border-line px-5 py-3">
              <span className="label">Contents · {SECTIONS.length} articles</span>
            </div>
            <ol className="divide-y divide-line">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-paper-2/60"
                  >
                    <span className="font-mono text-[0.66rem] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm text-ink-soft transition-colors group-hover:text-ink">
                      {s.title}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 -rotate-90 text-faint transition-colors group-hover:text-seal" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* articles */}
          <article className="mt-14 space-y-12">
            {SECTIONS.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-seal">
                    § {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-sans text-lg font-semibold tracking-tight text-ink sm:text-xl">
                    {s.title}
                  </h2>
                </div>
                <div className="mt-3 space-y-3 border-l border-line pl-4 text-[0.95rem] leading-relaxed text-ink-soft sm:pl-5">
                  {s.body}
                </div>
              </section>
            ))}
          </article>

          {/* colophon */}
          <footer className="mt-20">
            <div className="border-t border-line pt-8">
              <div
                className="perforated-top -mt-8 mb-8 h-2 w-full"
                aria-hidden
              />
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faint">
                Aiivo · official compliance record · terms v{VERSION} · ©&nbsp;2026
              </p>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
                Aiivo is an informational research tool — not legal advice. By
                using the Services you agree to these Terms and to our Privacy
                Policy.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
