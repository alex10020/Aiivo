# Aiivo — Landing Page

The compliance API for every new business. A premium marketing landing page with a
custom WebGL hero (the "compliance-network globe") and animated, scroll-revealed
content sections.

## Stack

- **Next.js 15** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens in `app/globals.css`)
- **React Three Fiber + three.js** — custom GLSL shaders for the hero
- **Framer Motion** — entrance + scroll-reveal animations
- **lucide-react** — icons
- Fonts: **Sora** (display) + **Inter** (body) via `next/font`

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (set PORT to change)
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx        # fonts, metadata, <html> shell
  page.tsx          # section composition
  globals.css       # design tokens (@theme) + utilities
components/
  three/            # WebGL hero
    NetworkGlobe.tsx   # point cloud + arcs + fresnel core (custom shaders)
    HeroCanvas.tsx     # <Canvas> wrapper
    HeroBackground.tsx # dynamic, client-only loader + ambient glow
  sections/         # Nav, Hero, Problem, HowItWorks, Demo, Advantages,
                    # Pipeline, Pricing, Competitive, Trust, CTA, Footer
  ui/               # Logo, Eyebrow, Reveal/Stagger, CountUp, BackgroundFX
lib/
  data.ts           # all copy/data (permits, pricing, advantages, …)
```

## Design system

Defined as CSS custom properties under `@theme` in `app/globals.css`:

- **Surfaces** — `night` / `night-2` / `surface` (near-black blues)
- **Accents** — `signal` (compliant green) → `cyan` (data), `amber` (verify)
- **Ink** — `ink` / `ink-soft` / `muted` / `faint`, `ink-on` for text on accents

Edit copy in `lib/data.ts`; adjust the palette in the `@theme` block.

The hero respects `prefers-reduced-motion` and degrades gracefully (WebGL is
client-only and lazy-loaded behind a CSS gradient).
