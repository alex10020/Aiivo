# Aiivo — Legal Review & E&O Procurement Brief

**Prepared:** July 2026 · **For:** founder + retained counsel + insurance broker
**Status:** internal working document — not itself legal advice.

> ⚠️ **What this is.** This brief packages everything a licensed attorney and an
> E&O broker need to review Aiivo before paid launch. It was prepared with AI
> assistance and **does not replace counsel**. Two things cannot be done by
> software or by any advisor other than the ones named: (1) a licensed attorney
> must review and sign off on the items in §4–§6; (2) an E&O policy must
> actually be bound (§7). Do not sell **File For Me** before both are done.

---

## 1. What the product does (for counsel's orientation)

Aiivo is an informational research tool. Given a business description and
address, it returns the permits/licenses that likely apply, each tagged
`Confirmed / Likely Required / Verify` with the issuing authority, fee range,
timeline, and a link to the government portal. Data pipeline: government-source
records → AI matching → confidence scoring → human review for items below
threshold. Paid tiers: Report ($99, a document), File For Me ($299, we submit
applications on the user's behalf), Monitor ($49/mo subscription), and a
partner API. Positioning follows the LegalZoom self-help model: **publisher of
legal information, not provider of legal advice.**

## 2. Current legal surfaces (already implemented)

| Surface | Where | State |
|---|---|---|
| Terms of Service | `/terms` | Comprehensive: not-legal-advice, AI-output, accuracy, warranties, liability cap (amount paid), indemnification, governing law, filing authorization |
| Privacy Policy | `/privacy` | CCPA/GDPR rights, subprocessors (Stripe, Supabase, Anthropic), AI-processing disclosure |
| Accuracy Policy | `/accuracy` | Sourcing, confidence scoring, human-review threshold, what "98%" means |
| In-report disclaimer | `ReportDisclaimer` on demo results, saved records, shared/printed reports, and report emails | "Informational research, not legal advice… confirm with the authority" |
| Per-item verify prompts | Permit cards & printed report | Non-confirmed items actively instruct the user to contact the authority |
| Footer fine print | Site-wide | Back-of-certificate disclaimer, liability limited to amount paid |

## 3. 🔴 Substantiation problems to fix before paid launch (FTC Act §5)

Advertising claims need a **reasonable basis in hand before the claim is made**.
Two current claims don't have one yet:

1. **"98% accurate."** Appears on the hero, CTA, demo band, about page, and
   `lib/data.ts`. The `/accuracy` page describes it as "a measured rate across a
   representative benchmark." The actual measurement today is the internal eval
   (`npm run eval`): 12 cases, 100% recall, **over the 17 seeded states only**.
   That is not yet "a representative benchmark of business types and
   jurisdictions."
   **Fix (pick one):** (a) grow the eval into a documented benchmark (≥100
   cases across states/industries, versioned results kept as substantiation) and
   publish the methodology on `/accuracy`; or (b) soften the claim sitewide to
   something owned by the eval (e.g. "validated against issuing-authority
   sources" / "100% on our published benchmark").
2. **"Scans 8,300 jurisdictions."** The database currently covers **52
   jurisdictions in 17 states**; elsewhere the engine degrades to federal/state
   coverage. "8,300" is the size of the U.S. jurisdiction universe, not current
   coverage.
   **Fix:** phrase as ambition/index ("indexing 8,300 U.S. jurisdictions") or
   state coverage honestly ("17 states and growing; federal + state coverage
   everywhere"), until coverage actually approaches the number.
3. **"Every filing is human-reviewed before submission."** True in the product
   design (review queue + FilingProvider flow) but only defensible once a human
   reviewer operationally exists. Do not sell File For Me before staffing it.

## 4. Unauthorized Practice of Law (UPL) — counsel review items

The product's stance (information, not advice) is the battle-tested self-help
position, but counsel should verify:

- **Individualization line.** Listing permits that "likely apply" with verify
  flags is publishing; telling a specific user "you don't need X" edges toward
  advice. The engine's clarification-driven pruning (e.g. dropping workers'
  comp when the user says "no employees") should be reviewed — current
  mitigation is that dropped/pruned logic is deterministic-rule-based and every
  non-confirmed item routes the user to the authority.
- **Per-state exposure.** UPL is state law; TX, NC, FL have been aggressive
  historically (Parsons Technology (TX 1999), NC State Bar actions, LegalZoom
  settlements e.g. NC 2015). If File For Me includes preparing application
  content (not just transmitting user-provided data), review against the
  strictest target states.
- **Filing authorization.** ToS already contains a filing-authorization
  section; counsel should confirm it constitutes adequate agency/authorization
  language per state, and whether any target filings legally require the
  applicant's own signature (many do — the flow's "guided filing" fallback
  exists for exactly these).

## 5. Consumer-protection review items

- **Auto-renewal (Monitor $49/mo):** ROSCA + state auto-renewal laws
  (California ARL is strictest): clear pre-purchase disclosure, affirmative
  consent, easy online cancellation, renewal reminders. Build requirements into
  the Stripe checkout when workstream G lands.
- **Refunds:** `/terms` has a refunds section — counsel to confirm it matches
  what Stripe flows will actually do, and state-law minimums.
- **Report as "deliverable":** the $99 report is delivered digitally
  (share-link + PDF + email). Confirm delivery/receipt language and refund
  trigger points.

## 6. Privacy / data review items

- Subprocessor list in `/privacy` (Stripe, Supabase, Anthropic, Resend once
  email ships, Vercel) — keep current.
- Filing data may include sensitive PII (SS-4 responsible-party SSN). Current
  design **deliberately does not collect SSN at discovery**; when File For Me
  collects it, counsel to review retention/encryption commitments and whether a
  written information-security program (e.g. MA 201 CMR 17) is triggered.
- If any marketing reaches EU users, confirm GDPR lawful-basis language.

## 7. E&O / insurance procurement (broker package)

**What to buy:** Technology E&O (professional liability for an information
service) with cyber liability; confirm the policy covers **AI-assisted output**
(ask explicitly — some carriers now exclude it, some endorse it) and
**negligent misstatement/erroneous information** claims. Media liability
endorsement covers the "publisher" posture.

**Suggested starting point:** $1M per-claim / $2M aggregate, raise before
enterprise/API deals. Startup-friendly carriers/brokers: Vouch, Embroker,
Hiscox, Chubb, Coalition (cyber).

**What underwriters will ask — answers already true:**
- Written disclaimers at every delivery surface (see §2) ✅
- Human-in-the-loop review before filings ✅ (design) — staff it before binding
- Documented accuracy testing ✅ (`eval/` — keep versioned results)
- Liability cap + arbitration in ToS ✅ (counsel to confirm enforceability)
- No legal-advice representations ✅ (subject to §3 claim fixes)

**Sequencing:** bind E&O **before** the first paid File For Me transaction;
Report-only sales carry lower exposure but earlier is cheaper than later.

## 8. Launch gates (do not pass without)

| Gate | Blocker for |
|---|---|
| Counsel sign-off on ToS/Privacy/Accuracy + UPL posture (§4–§6) | any paid tier |
| "98%" + "8,300" claims fixed or substantiated (§3) | marketing as-is |
| E&O policy bound (§7) | File For Me |
| Human reviewer staffed + review console live (workstream D) | File For Me |
| Stripe flows matching refund/auto-renewal language (§5) | Monitor tier |

## 9. Standing maintenance

- Re-run `npm run eval` on every data/prompt change; archive results (they are
  substantiation evidence).
- Keep `last verified` honest — the >90-day re-verification job (workstream
  A/F) is a legal freshness commitment, not just a feature.
- Log and review every user-reported inaccuracy; a correction workflow is both
  product QA and the best defense exhibit.
