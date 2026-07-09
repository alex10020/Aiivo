import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Aiivo collects, uses, shares and protects your information when you use the Aiivo compliance research service.",
};

const EFFECTIVE = "June 27, 2026";

const META = [
  { k: "Record no.", v: "AIV-PRIV-2026" },
  { k: "Effective", v: EFFECTIVE },
  { k: "Last updated", v: EFFECTIVE },
  { k: "Jurisdiction", v: "Global" },
];

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-seal/70"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

function Term({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-ink">{children}</strong>;
}

const SECTIONS: { n: string; id: string; title: string; body: React.ReactNode }[] =
  [
    {
      n: "01",
      id: "collect",
      title: "Information we collect",
      body: (
        <ul className="space-y-2.5">
          <Item>
            <Term>Business &amp; compliance details you provide.</Term> Your
            business type, industry, physical address and jurisdiction, and what
            you sell or serve. We use these solely to determine which permits and
            licenses apply to you.
          </Item>
          <Item>
            <Term>Account &amp; contact information.</Term> Your name, email
            address, and — where applicable — business name and role.
          </Item>
          <Item>
            <Term>Payment information.</Term> Processed by our payment processor
            (Stripe). We do not store full card numbers on our servers.
          </Item>
          <Item>
            <Term>Filing information.</Term> For filings we submit on your behalf
            (File For Me), the additional details an agency requires — for
            example EIN, ownership and signatures.
          </Item>
          <Item>
            <Term>Information collected automatically.</Term> Device and browser
            type, IP address, pages viewed and similar usage data, gathered
            through cookies and analytics.
          </Item>
        </ul>
      ),
    },
    {
      n: "02",
      id: "use",
      title: "How we use your information",
      body: (
        <ul className="space-y-2.5">
          <Item>Generate your permit map and compliance report.</Item>
          <Item>
            Pre-fill, review and submit filings you ask us to make on your
            behalf.
          </Item>
          <Item>
            Monitor for requirement changes and send renewal reminders.
          </Item>
          <Item>Operate, secure, debug and improve the Service.</Item>
          <Item>
            Communicate with you about your account, reports and filings.
          </Item>
          <Item>
            Comply with our legal obligations and enforce our terms.
          </Item>
        </ul>
      ),
    },
    {
      n: "03",
      id: "share",
      title: "How we share your information",
      body: (
        <>
          <p>
            We share personal information only as described below.{" "}
            <Term>We do not sell your personal information.</Term>
          </p>
          <ul className="space-y-2.5">
            <Item>
              <Term>Service providers &amp; subprocessors.</Term> Vendors that
              host, process or support the Service under contract — including
              Stripe (payments), Supabase (database &amp; hosting), Anthropic (AI
              processing) and our analytics provider. They may use your
              information only to provide services to us.
            </Item>
            <Item>
              <Term>Government agencies.</Term> When you ask us to file on your
              behalf, we submit the information you provide to the relevant
              federal, state, county or city authority.
            </Item>
            <Item>
              <Term>Legal &amp; safety.</Term> To comply with law, respond to
              lawful requests, or protect the rights, property and safety of
              Aiivo, our users or the public.
            </Item>
            <Item>
              <Term>Business transfers.</Term> In connection with a merger,
              acquisition, financing or sale of assets, subject to this Policy.
            </Item>
          </ul>
        </>
      ),
    },
    {
      n: "04",
      id: "ai",
      title: "AI processing",
      body: (
        <p>
          To match your business to applicable permits, your business
          description is processed by large-language-model providers (including
          Anthropic) acting as our subprocessors. We send only the information
          needed to generate your results. Our providers do not use your inputs
          to train their models, and the model selects from a structured database
          of real requirements — it does not generate legal advice.
        </p>
      ),
    },
    {
      n: "05",
      id: "cookies",
      title: "Cookies & analytics",
      body: (
        <p>
          We use cookies and similar technologies to keep the Service working,
          remember preferences, and understand usage. You can control cookies
          through your browser settings; blocking some cookies may affect
          functionality.
        </p>
      ),
    },
    {
      n: "06",
      id: "retention",
      title: "Data retention",
      body: (
        <p>
          We keep personal information for as long as needed to provide the
          Service, maintain your records and reports, comply with legal and tax
          obligations, resolve disputes, and enforce our agreements. When
          information is no longer needed, we delete or de-identify it.
        </p>
      ),
    },
    {
      n: "07",
      id: "security",
      title: "Data security",
      body: (
        <p>
          We use administrative, technical and organizational safeguards —
          including encryption in transit, access controls and vendor due
          diligence — to protect your information, and we carry
          errors-and-omissions (E&amp;O) insurance covering our compliance
          research. No method of transmission or storage is completely secure,
          and we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      n: "08",
      id: "rights",
      title: "Your rights & choices",
      body: (
        <p>
          Depending on where you live, you may have the right to access, correct,
          delete or port your personal information, to opt out of certain
          processing, and to withdraw consent. Residents of California
          (CCPA/CPRA) and the EEA/UK (GDPR) have additional rights, including the
          right not to be treated differently for exercising them. To make a
          request, email{" "}
          <a
            href="mailto:alexander@aiivo.ai"
            className="text-seal underline decoration-seal/30 underline-offset-2 hover:decoration-seal"
          >
            alexander@aiivo.ai
          </a>
          . We will verify and respond as required by law.
        </p>
      ),
    },
    {
      n: "09",
      id: "international",
      title: "International users",
      body: (
        <p>
          We are based in the United States and process information there. If you
          use the Service from outside the United States, you understand your
          information will be transferred to and processed in the U.S., where
          data-protection laws may differ from those in your country.
        </p>
      ),
    },
    {
      n: "10",
      id: "children",
      title: "Children's privacy",
      body: (
        <p>
          The Service is intended for business owners and is not directed to
          children under 18. We do not knowingly collect personal information
          from children. If you believe a child has provided us information,
          contact us and we will delete it.
        </p>
      ),
    },
    {
      n: "11",
      id: "links",
      title: "Third-party links",
      body: (
        <p>
          The Service links to government portals and other third-party sites. We
          are not responsible for their content or privacy practices — review
          their policies before providing information.
        </p>
      ),
    },
    {
      n: "12",
      id: "changes",
      title: "Changes to this policy",
      body: (
        <p>
          We may update this Policy from time to time. When we do, we will revise
          the &ldquo;Last updated&rdquo; date above and, for material changes,
          provide additional notice. Your continued use of the Service after
          changes take effect constitutes acceptance.
        </p>
      ),
    },
    {
      n: "13",
      id: "contact",
      title: "Contact us",
      body: (
        <p>
          Questions or requests about this Policy or your information:{" "}
          <Term>Aiivo</Term> ·{" "}
          <a
            href="mailto:alexander@aiivo.ai"
            className="text-seal underline decoration-seal/30 underline-offset-2 hover:decoration-seal"
          >
            alexander@aiivo.ai
          </a>
          .
        </p>
      ),
    },
  ];

export default function PrivacyPage() {
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

      <main className="container-x">
        <div className="mx-auto max-w-3xl">
          {/* masthead */}
          <div className="relative py-16 sm:py-20">
            <div
              className="pointer-events-none absolute -right-2 -top-2 hidden opacity-[0.06] sm:block"
              aria-hidden
            >
              <Seal className="h-48 w-48" />
            </div>

            <Eyebrow>Legal record</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Privacy <span className="italic seal-text">Policy</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
              How Aiivo collects, uses, shares and protects your information when
              you use our compliance research service at aiivo.ai (the
              &ldquo;Service&rdquo;). By using the Service, you agree to this
              Policy.
            </p>

            {/* record metadata */}
            <dl className="mt-9 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-card sm:grid-cols-4">
              {META.map((m, i) => (
                <div
                  key={m.k}
                  className={`px-5 py-4 ${
                    i % 2 === 1 ? "border-l border-line" : ""
                  } ${i >= 2 ? "border-t border-line" : ""} sm:border-t-0 ${
                    i > 0 ? "sm:border-l sm:border-line" : ""
                  }`}
                >
                  <dt className="label text-faint">{m.k}</dt>
                  <dd className="mt-1.5 font-mono text-sm text-ink">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* document body */}
          <div className="pb-16">
            {SECTIONS.map((s) => (
              <section
                key={s.n}
                id={s.id}
                className="scroll-mt-24 border-t border-line py-10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <div className="shrink-0 sm:w-28">
                    <span className="label text-seal">§ {s.n}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-sans text-xl font-semibold tracking-normal text-ink">
                      {s.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
                      {s.body}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* document colophon */}
      <footer className="border-t border-line bg-paper-2">
        <div className="container-x py-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-muted">
              Aiivo is an informational research tool, not a law firm, and does
              not provide legal advice. Using the Service does not create an
              attorney–client relationship.
            </p>
            <div className="perforated-top mt-8 h-3" aria-hidden />
            <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
              </p>
              <Seal className="h-10 w-10 opacity-70" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
