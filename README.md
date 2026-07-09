# Aiivo

**The compliance record for every new business.** Tell us what you do and where —
Aiivo maps every federal, state, county and city permit you need, then files and
renews them for you.

## What's here

- **Marketing site** — "Official Record" design system (warm paper, editorial serif,
  WebGL guilloché watermark, notary-seal brand mark). Home, how-it-works, why,
  pricing, blog, legal, contact.
- **Live permit engine** (`/demo`) — enter a business + location, answer 2–4
  clarifying questions, get a full permit map: costs, timelines, issuing
  authorities, confidence tags, filing links.
- **Grounded API** (`/api/v1/*`) — the productionized pipeline: geocode →
  classify (NAICS + triggers) → retrieve requirements from a verified seed
  dataset → AI enriches/prunes (never invents permits) → confidence scoring →
  human-review routing. Cached + rate-limited.
- **App shell** (`/app`) — Supabase-authenticated dashboard for saved compliance
  records and filings.

## Engine architecture

| Stage | File | Model config |
|---|---|---|
| Clarify questions | `app/api/permits/clarify` | Opus 4.8, effort `low` |
| Demo permit map | `app/api/permits` | Opus 4.8, adaptive thinking, effort `high`, streamed |
| Classifier | `lib/engine/resolve/classifier.ts` | Opus 4.8, effort `low` (keyword fallback) |
| Grounded enrichment | `lib/engine/interpret/engine.ts` | Opus 4.8, adaptive thinking, effort `high` |

Every AI call uses structured outputs (`output_config.format` JSON schema) and
degrades gracefully: no API key or an upstream failure serves curated sample
data (`x-aiivo-source` header reports `live` / `sample` / `fallback`).

## Run

```bash
npm install
npm run dev      # http://localhost:3000 (set PORT to change)
npm run build    # production build
npm start        # serve production build
```

> Don't run `npm run build` while `npm run dev` is serving — they share `.next/`
> and the build corrupts the dev server's chunks. Stop dev first (or delete
> `.next` and restart if you see "Cannot find module './vendor-chunks/...'").

### Environment (`.env.local`)

```
ANTHROPIC_API_KEY=...        # enables the live engine (sample data without it)
NEXT_PUBLIC_SUPABASE_URL=... # optional — enables auth + saved records
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Anthropic SDK (Claude Opus 4.8) · Supabase · React Three Fiber (WebGL guilloché) ·
Framer Motion · Instrument Serif / Inter / JetBrains Mono.
