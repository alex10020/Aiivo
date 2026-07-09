# Aiivo Engine — parallel build briefs

Nine workstreams, run as many agents at once. **Phase 0 (the foundation) is
built and frozen** — it's the shared contract every workstream codes against,
exactly like Section 1 froze the design system for the site.

The product: take a business + address (+ what they sell, + clarifying answers),
return a **grounded** compliance record (real requirements from a real database,
not model memory), let ops review it, file it, monitor it, bill for it, and
expose it as an API. The moat is the **data layer**, not the AI.

---

## Golden rules (this is what keeps the agents from colliding)

1. **Code against the interfaces in `lib/engine/types.ts`, never another
   workstream's implementation.** Each seam (`Geocoder`, `BusinessClassifier`,
   `RequirementRetriever`, `InterpretationEngine`, `ConfidenceScorer`,
   `FilingProvider`, `BillingService`) is implemented by exactly one workstream;
   everyone else imports the interface and stubs it until it lands.
2. **Never edit the frozen contract files** (below). If something is genuinely
   missing, leave a `// TODO(contract): …` and flag it — don't fork the shape.
3. **Only create/edit files your workstream owns** (table below).
4. **Database changes are additive migrations** — add `supabase/migrations/0002_*`,
   `0003_*`, … Never edit `0001_engine_init.sql`.
5. **Stub external services** (Stripe, geocoder, portals) behind the interface so
   other workstreams aren't blocked on your credentials.
6. **Confidence colors are fixed:** `confirmed`=seal, `likely_required`=gold,
   `verify`=stamp. Reuse the demo UI (`components/demo/PermitCard.tsx`) for the
   record view.

### Frozen contract files (do not edit)
`lib/engine/types.ts` · `lib/engine/contracts.ts` · `lib/engine/jobs.ts` ·
`lib/engine/errors.ts` · `lib/engine/supabase.ts` · `lib/engine/auth.ts`
(shapes) · `supabase/migrations/0001_engine_init.sql` · `.env.example`

---

## Architecture (the parts)

```
address ─▶ [B] Geocoder ───────────┐
                                    ├─▶ MatchContext ─▶ [A] RequirementRetriever ─▶ requirements
business ─▶ [B] BusinessClassifier ─┘                                                    │
                                                                                          ▼
                              [C] InterpretationEngine (grounded Claude) ─▶ ComplianceRecord
                                                                                          │
                                          [C] ConfidenceScorer ── <0.9 ──▶ [D] Review queue
                                                                                          │
                                                              ready ─▶ [E] Filing ─▶ [F] Monitor/renew
   accounts & money:  [G] Billing/entitlements   ·   [H] Public API (keys, metering, webhooks)
   surface:           [I] Authenticated product UI (dashboard, record, filings, account)
```

---

## Ownership table

| WS | Name | Owns (dirs) | Implements | Depends on | Endpoints |
|----|------|-------------|------------|------------|-----------|
| **A** | Data / moat | `lib/engine/data/**`, `scripts/scrapers/**`, `supabase/migrations/0002+` (seed) | `RequirementRetriever` + scrape/reverify jobs | schema | — |
| **B** | Resolution | `lib/engine/resolve/**` | `Geocoder`, `BusinessClassifier` | types | `POST /api/resolve`, `/api/classify` |
| **C** | Interpretation | `lib/engine/interpret/**`, `app/api/v1/**`, `app/api/records/**` | `InterpretationEngine`, `ConfidenceScorer` | A, B (stub) | `POST /v1/permits`, `/v1/clarify`, records |
| **D** | Review console | `app/(ops)/**`, `app/api/review/**` | — | C | `GET/POST /api/review` |
| **E** | Filing | `lib/engine/filing/**`, `app/api/filings/**` | `FilingProvider` (per portal) | records, jobs | `POST/GET /api/filings` |
| **F** | Monitoring | `lib/engine/monitor/**`, `app/api/monitors/**` | change/renewal jobs | A, records | `POST /api/monitors` |
| **G** | Billing | `lib/engine/billing/**`, `app/api/checkout`, `app/api/stripe/**` | `BillingService` | auth | `POST /api/checkout`, webhook |
| **H** | API platform | `lib/engine/api/**`, `app/api/keys/**`, `app/api/usage/**` | key/rate-limit/metering middleware | C, G | `POST /api/keys`, `GET /api/usage` |
| **I** | Product UI | `app/(app)/**`, `components/app/**` | `@supabase/ssr` auth, `requireUser` | types | — |

> The current demo (`app/api/permits`, `app/api/permits/clarify`,
> `components/demo/**`, `lib/permits.ts`) stays as-is until **C** ships the
> grounded `/v1/permits`; then C migrates the demo onto the engine and retires
> `lib/permits.ts`.

---

## Per-workstream briefs

Each section is a paste-into-an-agent prompt. Prepend all of them with:

> You're in the Next.js 15 + Tailwind v4 + Supabase + Anthropic repo at
> `c:\Users\alexx\aiiro`. Read `ENGINE-BRIEFS.md` in full. Build **Workstream X**
> only. Obey the Golden Rules: code against `lib/engine/types.ts`, never edit the
> frozen contract, own only your files, additive migrations only. Typecheck must
> pass (`npx tsc --noEmit`).

### A — Data / the moat
Build the requirements database and the pipeline that fills it. Seed
`jurisdictions` (start: US federal + 2 states + their counties/major cities via
Census FIPS), `permit_types` (food/retail to start), and `requirements` (the
permit×jurisdiction rules with `applies_to`, cost, time, renewal, `filing_url`,
`source_id`). Write scrapers (`scripts/scrapers/**`) that capture government
sources into `sources` (url, hash, content_ref) and `scrape_source` /
`reverify_requirement` job handlers (re-verify anything `last_verified_at` > 90
days). **Implement `RequirementRetriever.retrieve(ctx)`** — given the
jurisdiction stack + NAICS + triggers, return the matching `Requirement[]`.
*Done when:* a seeded slice returns correct, sourced requirements for a coffee
shop and a hair salon in your two states, all dated and traceable to a source.

### B — Resolution
`lib/engine/resolve/geocoder.ts` implementing **`Geocoder`** (US Census Geocoder
— free, keyless — to FIPS → look up the `jurisdictions` stack; Mapbox fallback)
and `classifier.ts` implementing **`BusinessClassifier`** (Claude or a NAICS
lookup → `naics[]` + `triggers[]` like `alcohol`, `employees`, `food`,
`seating`, `signage`). Expose `POST /api/resolve` and `POST /api/classify`.
*Done when:* "346 N Clark St, Chicago, IL" → federal/IL/Cook/Chicago stack, and
"coffee shop, beer & wine" → `{naics:[722515,...], triggers:[food,alcohol]}`.

### C — Interpretation
The grounded brain. `lib/engine/interpret/**` implementing
**`InterpretationEngine`** (`clarify` + `buildRecord` over **retrieved**
requirements — Claude selects/explains/prices, never invents; carry the
demo's accuracy rules) and **`ConfidenceScorer`** (freshness + rule certainty +
source quality → `confidence` + `needsReview`). Wire `POST /v1/permits`,
`/v1/clarify`, `POST /api/records`, `GET /api/records/:id`; persist records +
items; push <0.9 items to `review_queue`. *Done when:* `/v1/permits` returns a
record assembled from DB requirements with per-item sources, and low-confidence
items land in review.

### D — Review console
Internal ops UI at `app/(ops)/review` + `app/api/review/**`: the queue of
flagged `record_items`, side-by-side with the `source`, approve/edit/reject with
notes, writing `review_status` + audit. Gate behind an ops role. *Done when:* a
reviewer can clear a flagged item and the record flips to `ready`.

### E — Filing
`lib/engine/filing/**`: a `FilingProvider` registry; implement 2–3 real ones
(EIN/IRS, one state sales-tax portal, one city license) + a `manual` fallback
that opens a tracked task. `submit_filing` / `poll_filing_status` job handlers;
`POST/GET /api/filings`; full `audit` trail. *Done when:* File-For-Me moves an
item queued→submitted with status polling, manual fallback otherwise.

### F — Monitoring & renewals
`detect_changes` (diff `sources.hash`, flag changed requirements → review) and
`renewal_reminder` (compute due dates from `renewal`, remind, optionally
auto-file) job handlers; `monitors` + `renewals` rows; `POST /api/monitors`.
*Done when:* a changed source re-flags affected records and a due renewal fires a
reminder.

### G — Billing & entitlements
`lib/engine/billing/**` implementing **`BillingService`** with Stripe: Checkout
for Report ($99) / File ($299) one-time and Monitor ($49/mo) sub; metered usage
for the API; `entitlements(ownerId)`; `POST /api/checkout` + `POST
/api/stripe/webhook` (signature-verified → `subscriptions`/`payments`). Gate paid
record views. *Done when:* paying unlocks the full report; webhook keeps
entitlements in sync.

### H — API platform
`lib/engine/api/**`: API-key issuance (hash via `hashApiKey`), per-key rate
limiting, and a metering middleware that wraps `/v1/*` (writes `usage_events`,
calls `BillingService.meter`). `POST /api/keys`, `GET /api/usage`. Finish
`requireApiKey` (constant-time, revoked/scope checks, `last_used_at`). *Done
when:* a partner key calls `/v1/permits`, is rate-limited and metered, and usage
shows in the dashboard.

### I — Product UI
Authenticated app under `app/(app)/**` with `@supabase/ssr` cookie sessions
(implement `requireUser`): dashboard (saved businesses/records), the paid record
view (reuse `components/demo/*`), filing status, monitoring, account + billing.
*Done when:* a signed-in user runs a lookup, saves it, pays, and sees the full
record + filing status.

---

## Recommended sequencing (don't build all 9 cold)

**MVP to a real paid Report:** A (seed slice) → B → C (grounded) → G + I (report
view) → H. Then layer D (review), E (filing), F (monitoring), and widen A's
coverage toward 8,300 jurisdictions. Phase-0 infra (job runner wiring, Supabase
project, RLS policies, CI) is the shared prerequisite — stand the Supabase
project up and run `0001_engine_init.sql` before dispatching agents.

## Stack
Next.js 15 (App Router) · Supabase (Postgres + PostGIS + Auth + Storage + cron) ·
Anthropic SDK (`claude-sonnet-4-6` interpretation; computer-use for hard filings) ·
Stripe (tiers + metered) · US Census Geocoder · a job runner (Supabase cron +
`jobs` table, or Inngest/Trigger.dev).
