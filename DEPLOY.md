# Deploying Aiivo (Vercel)

Prepped and shelved until the plan upgrade. Everything is one `vercel --prod`
away; the only decision is the plan tier, which sets the engine's depth.

## One-time setup

```bash
npm i -g vercel
vercel login
vercel link          # run in the project root, creates .vercel/
```

Set the environment variables (Production + Preview):

```bash
vercel env add ANTHROPIC_API_KEY            # required — the engine
vercel env add NEXT_PUBLIC_SUPABASE_URL     # optional — auth + saved records
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Plan tiers

The engine's quality/latency dial is `AIIVO_ENGINE_EFFORT` (env var, no code
change). Route budgets are declared as `maxDuration` in the two API routes.

### Paid plan (recommended — full depth)

- Leave `AIIVO_ENGINE_EFFORT` unset (defaults to `high` + adaptive thinking;
  the Austin-level jurisdictional accuracy).
- `maxDuration = 300` is already set in
  [app/api/permits/route.ts](app/api/permits/route.ts) and
  [app/api/v1/permits/route.ts](app/api/v1/permits/route.ts) — Pro allows it.
- Deploy: `vercel --prod`

### Hobby plan (60-second function cap)

Two changes, then deploy:

1. `vercel env add AIIVO_ENGINE_EFFORT` → `medium` (~2× faster, still strong)
2. In both routes above, change `export const maxDuration = 300;` → `60;`
   (Hobby rejects values above its cap at build time.)

## Pre-warming the pitch demo

The `v1` API caches identical lookups in-memory per instance. Right before a
live pitch, run the exact demo query once so the audience sees an instant
result:

```bash
curl -s -X POST https://<your-domain>/api/v1/permits \
  -H "content-type: application/json" \
  -d '{"business_type":"Coffee shop","location":"Austin, TX","sells":"coffee and pastries"}'
```

(Serverless instances recycle, so warm within ~15 minutes of the demo. The
`/demo` page's own route is uncached by design — it always generates fresh.)

## Post-deploy checklist

- [ ] `https://<domain>/` renders (guilloché hero, logo, no console errors)
- [ ] `/demo` full flow: query → clarify questions → permit map with
      `x-aiivo-source: live` (check the response header in devtools)
- [ ] `/api/v1/permits` returns 200 with `x-aiivo-source: engine`
- [ ] All blog posts render
- [ ] `metadataBase` in [app/layout.tsx](app/layout.tsx) matches the real domain
