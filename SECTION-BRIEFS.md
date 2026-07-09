# Aiivo landing page — parallel build briefs

Five sections, five Claude sessions, working at the same time without stepping on
each other. **Section 1 (Foundation + Nav + Hero) is already built** — it defines
the visual language every other section must match. Open
[components/sections/Hero.tsx](components/sections/Hero.tsx) and
[app/globals.css](app/globals.css) as your reference.

The look is **"Official Record"**: warm document paper, an editorial serif, monospace
record data, hairline ledger rules, a live security-print guilloché, and a
notary-green seal. Think *beautifully engineered government certificate* — never a
dark, neon, glassmorphism SaaS template.

---

## Golden rules (read first — this is what keeps 5 sessions from colliding)

1. **Only edit the files your section owns** (table below). Nothing else.
2. **Never edit the shared contract files:** `app/globals.css`, `app/layout.tsx`,
   `app/page.tsx`, `lib/data.ts`, anything in `components/ui/**`, anything in
   `components/three/**`. They are frozen by Section 1.
3. **Keep the exported component name and file path exactly as they are** —
   `app/page.tsx` already imports every section. Don't add imports there.
4. **Need extra copy/data?** Declare it as a local `const` at the top of your own
   section file. Do **not** touch `lib/data.ts` (you may *read* from it).
5. **Need a new color, font, or shared component?** You can't add one — compose
   from the existing tokens/primitives below. If something is genuinely missing,
   leave a `// TODO(section-1): …` note and move on.
6. **Keep these section `id`s** (the nav scrolls to them): `#how`, `#demo`,
   `#why`, `#pricing`.

### File ownership

| Section | Owns | Page `id`s |
|---|---|---|
| **1 — Foundation + Nav + Hero** ✅ done | `globals.css`, `layout.tsx`, `page.tsx`, `components/ui/**`, `components/three/**`, `sections/Nav.tsx`, `sections/Hero.tsx` | `#top` |
| **2 — Problem + How It Works** | `sections/Problem.tsx`, `sections/HowItWorks.tsx` | `#how` (on HowItWorks) |
| **3 — Proof: Demo + Competitive** | `sections/Demo.tsx`, `sections/Competitive.tsx` | `#demo` (on Demo) |
| **4 — Moat: Advantages + Pipeline + Trust** | `sections/Advantages.tsx`, `sections/Pipeline.tsx`, `sections/Trust.tsx` | `#why` (on Advantages) |
| **5 — Convert: Pricing + CTA + Footer** | `sections/Pricing.tsx`, `sections/CTA.tsx`, `sections/Footer.tsx` | `#pricing` (on Pricing) |

---

## The design contract (shared by all sections)

### Color tokens (use as Tailwind classes, e.g. `bg-card`, `text-seal`, `border-line`)

| Token | Use |
|---|---|
| `paper` / `paper-2` / `paper-3` | page bg / panels / deeper panels |
| `card` | raised sheets (lightest, near-white cream) |
| `ink` / `ink-soft` / `muted` / `faint` | text, in descending strength |
| `line` / `line-soft` / `line-strong` | hairlines & borders |
| `seal` / `seal-bright` / `seal-deep` | **primary accent** (notary green); buttons = `bg-seal text-on-seal hover:bg-seal-bright` |
| `on-seal` | text/icons on a green surface |
| `stamp` | vermilion — **sparingly**, only for penalty/tension ("$10k fine", "NON-COMPLIANT") |
| `gold` | seal/embossing detail; "Likely Required" status |

### Type

- `font-display` → **Instrument Serif (400, italic available).** Headlines **only**,
  large sizes. Lean on the italic for one emphasised word, in `seal-text` green —
  e.g. `<span className="italic seal-text">officially</span>`. Don't use it below ~24px.
- `font-sans` → Inter. All body copy.
- `font-mono` → JetBrains Mono. Labels, record numbers, codes, stats, statuses.
  Use the `label` utility for the recurring "FORM FIELD" caption
  (`<span className="label">Estimated cost</span>`).

### Utilities already defined for you

`container-x` (max-width wrapper) · `label` (mono uppercase caption) ·
`seal-text` · `sheet` (raised paper card w/ shadow) · `ledger` (ruled-paper bg) ·
`security-grid` (form grid bg) · `perforated-top` (ticket edge) ·
`paper-grain` (tactile grain ::after) · `animate-seal` · `animate-marquee` ·
`animate-blink`.

### Primitives you can import (do not modify them)

- `Eyebrow` from `@/components/ui/Eyebrow` — the section kicker (mono + green dot).
- `Reveal`, `Stagger`, `StaggerItem` from `@/components/ui/Reveal` — scroll-in animation.
- `CountUp` from `@/components/ui/CountUp` — animated numbers.
- `Seal` from `@/components/ui/Seal` — the SVG notary seal.
- Icons: `lucide-react` (no emojis).

### Motion & a11y

- Entrance via `Reveal`/`Stagger`; transitions 150–300ms; ease `[0.16,1,0.3,1]`.
- WCAG AA contrast; visible focus states; `prefers-reduced-motion` is already
  globally respected — don't fight it.

### Section rhythm (match Section 1)

- Vertical padding: `py-24 sm:py-32`. Wrap content in `container-x`.
- Section header pattern: `<Eyebrow>…</Eyebrow>` → serif `h2`
  (`text-3xl sm:text-[2.6rem] leading-[1.1]`) → `text-ink-soft` lede.
- Separate sections with hairlines (`border-t border-line`) or alternate
  `bg-paper` / `bg-paper-2` — **no dark sections, no glow, no glass.**

### Anti-patterns (auto-fail)

❌ Dark backgrounds, neon, glassmorphism, blurred color blobs, AI purple/blue
gradients · ❌ Emoji icons · ❌ Instrument Serif at small sizes · ❌ stamp-red as a
general accent · ❌ editing any shared/contract file · ❌ inventing new colors.

---

## Section 1 — Foundation + Nav + Hero ✅ (already built)

Reference only. Establishes paper system, fonts, Nav, and the hero: editorial
headline ("Make your business *officially* legal."), a product search field, the
monospace **Compliance Record** card (count-ups, scan bar, permit rows, barcode),
the live **guilloché** WebGL watermark, and the stamped notary **Seal**.

---

## Section 2 — The Problem + How It Works

**Owns:** `sections/Problem.tsx`, `sections/HowItWorks.tsx` · **`HowItWorks` keeps `id="how"`.**

**Goal:** make the pain visceral, then show the 3-step relief.

**Problem block**
- Lede: nobody tells a new business which permits it needs — 300+ license types ×
  110+ industries × 8,300 jurisdictions, no single source of truth.
- Stat trio (read from `STATS` or inline): `51%` say licensing hurts growth · `33%`
  blocked from new opportunities · `$10k+` fines. Render the fine figure in
  `stamp` (the one place tension-red belongs).
- "Today's options are broken" — Google / lawyer ($1.5–3k) / county clerk hold
  music / LegalZoom stops at the LLC. Treat each as a **struck-through, rejected
  form field** (line-through, a small `stamp` "REJECTED"/✕ mark).
- **Signature move:** a rotated rubber-stamp `NON-COMPLIANT` in `stamp` red as the
  emotional anchor.

**How It Works block** (`id="how"`)
- 3 steps from `STEPS`: Tell us your business → Get your permit map → We file & renew.
- **Signature move:** render it as an **application tracker / progress ledger** —
  numbered `01 / 02 / 03`, a connecting hairline, mono status chips
  (e.g. `RECEIVED` → `REVIEWED` → `FILED`), like tracking a government filing.

**Done when:** reads on a paper bg, mono labels + serif headers, stamp-red used
only for penalty, `#how` present, looks like one document with Section 1.

---

## Section 3 — Proof: Live Demo + Competitive

**Owns:** `sections/Demo.tsx`, `sections/Competitive.tsx` · **`Demo` keeps `id="demo"`.**

**Goal:** prove it works, and that nobody else does this.

**Demo block** (`id="demo"`) — the deep version of the hero's record card.
- Use `DEMO` from `lib/data.ts` (query, 7 permits, `$1,340`, `4–6 weeks`, the
  `items[]` with `authority`, `cost`, `time`, `confidence`, `renews`).
- Left: summary (count-ups for permits/`$1,340`, confidence legend, CTAs to
  `#pricing`). Right: the **full compliance report** as an official document —
  hairline rows, mono codes, confidence tags color-coded:
  `Confirmed`=`seal`, `Likely Required`=`gold`, `Verify`=`stamp`. Each row links to a
  filing portal (`ExternalLink` icon).
- **Signature move:** style the report like a printed certificate page — header with
  a record no., a `Seal` watermark behind it, a "last verified" date per row.

**Competitive block**
- Use `COMPETITORS` (4 adjacent categories, each "Overlap: none").
- The ChatGPT objection: a side-by-side **audit** — Raw ChatGPT (~60%, 404s,
  different every time) vs Aiivo (98%, validated, monitored). Build it as a clean
  comparison **ledger/table**, not cards-with-glow.
- Thesis line: a16z put $55M into SMB compliance (Town) → pivoted away → wedge open.
  (Validation only — never imply a16z backs Aiivo.)
- **Signature move:** present the competitors as **filed-and-dismissed case entries**
  (mono docket-style: `CASE · ENTERPRISE LICENSE MGMT · OVERLAP: NONE`).

**Done when:** `#demo` present, confidence colors per the contract, no dark cards.

---

## Section 4 — The Moat: Advantages + Pipeline + Trust

**Owns:** `sections/Advantages.tsx`, `sections/Pipeline.tsx`, `sections/Trust.tsx`
· **`Advantages` keeps `id="why"`.**

**Goal:** why Aiivo wins and why you can trust the output.

**Advantages block** (`id="why"`)
- Use `ADVANTAGES` (5 items + tags). Bento grid, first card featured/larger.
- **Signature move:** label them as a **dossier of exhibits** — `EXHIBIT A … E` in
  mono; the featured card holds the data-moat math
  (`8,300 × 300+ = millions of combinations`).

**Pipeline block**
- Use `PIPELINE` (4 layers: structured data → AI interpretation → confidence
  scoring → human review).
- **Signature move:** a **stamped processing chain** — a document passing through 4
  stamps, each layer a numbered row with a hairline connector and a mono
  `LAYER 0X` tag. Add the "data >90 days = auto re-verify" note and a quiet stack
  strip (Next.js · Supabase · Anthropic SDK).

**Trust block**
- 5 protection layers (inline data ok): legal disclaimers · E&O insurance ·
  confidence scoring · human-in-the-loop · source attribution. Positioning:
  informational tool, same stance LegalZoom has held 25 years.
- **Signature move:** render each as a small **seal/credential badge** (reuse the
  `Seal` or a seal-green ring) in a row of five.

**Done when:** `#why` present, three blocks read as one credibility dossier.

---

## Section 5 — Convert: Pricing + CTA + Footer

**Owns:** `sections/Pricing.tsx`, `sections/CTA.tsx`, `sections/Footer.tsx`
· **`Pricing` keeps `id="pricing"`.**

**Goal:** turn the visitor into a filing.

**Pricing block** (`id="pricing"`)
- Use `PRICING` (Discover free · Report `$99` *featured* · File For Me `$299` ·
  Monitor `$49/mo`) + the API band (`$2–5` per lookup; Stripe Atlas/LegalZoom/
  Gusto/Deel).
- **Signature move:** style tiers as **official service forms / a price ledger** —
  the featured tier gets a seal-green ring + a mono `MOST FILED` tab; CTAs are
  `bg-seal text-on-seal`. Keep one number per row, mono.

**CTA block**
- Big closing: "Make your business officially legal." restated, a final search
  field → `#demo`, mono trust line. **Signature move:** echo the hero — a faint
  `Seal`/guilloché motif and a single green "File my record" button. (You may
  reuse `Seal`; do not touch the WebGL files.)

**Footer block**
- `Logo`, short blurb, link columns (Product / Company / Legal),
  `alexander@aiivo.ai`, and the legal one-liner ("informational research tool — not
  legal advice"). **Signature move:** a **document colophon** — mono record line
  like `AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026`, a hairline, a perforated edge.

**Done when:** `#pricing` present, featured tier obvious, footer reads like a
document colophon.

---

## Paste-into-each-session prompt template

> You're working in the existing Next.js + Tailwind v4 repo at `c:\Users\alexx\aiiro`
> (dev server runs on **http://localhost:9001**). Read `SECTION-BRIEFS.md` in full,
> then build **Section N** only. Obey the Golden Rules and the design contract —
> the "Official Record" look is already set by Section 1
> (`components/sections/Hero.tsx`, `app/globals.css`). Edit only your owned files,
> match the paper/serif/mono system exactly, keep your section `id`, and make it
> genuinely distinctive (use the signature move). When done, verify it renders at
> localhost:9001 and looks like one continuous document with the hero.

Replace **Section N** per session. Run all five at once — they never touch the same file.
