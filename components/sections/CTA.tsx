"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Stamp } from "lucide-react";
import { Eyebrow } from "../ui/Eyebrow";
import { Seal } from "../ui/Seal";

const ease = [0.16, 1, 0.3, 1] as const;

export function CTA() {
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <section className="relative scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="sheet paper-grain perforated-top relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          {/* faint security-print guilloché rings (CSS — no WebGL touched) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 50% 46%, rgba(21,98,61,0.05) 0 1px, transparent 1px 12px)",
              maskImage:
                "radial-gradient(circle at 50% 46%, #000 0%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 46%, #000 0%, transparent 72%)",
            }}
          />
          {/* notary seal watermark behind the type */}
          <Seal className="pointer-events-none absolute left-1/2 top-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />

          <div className="relative">
            <Eyebrow className="justify-center">File for the record</Eyebrow>

            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-[2.4rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-[3.4rem]">
              Make your business{" "}
              <span className="italic seal-text">officially</span> legal.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-ink-soft sm:text-lg">
              5.4 million businesses open in America every year. Every one needs
              permits — now there&apos;s one office that knows exactly which, and
              files them for you.
            </p>

            {/* the final form field — echoes the hero */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/demo?q=${encodeURIComponent(q)}`);
              }}
              className="mx-auto mt-9 max-w-xl text-left"
            >
              <span className="label mb-2 block text-faint">Your business</span>
              <div className="group flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
                <MapPin className="h-5 w-5 shrink-0 text-seal" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. Food truck, Denver CO"
                  aria-label="Your business type and location"
                  className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
                />
                <button
                  type="submit"
                  className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-seal px-4 py-2.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                >
                  <Stamp className="h-4 w-4" />
                  File my record
                </button>
              </div>
            </form>

            <p className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faint">
              No account needed
              <span className="mx-2 inline-block h-1 w-1 -translate-y-0.5 rounded-full bg-line-strong align-middle" />
              Indexing 8,300 jurisdictions
              <span className="mx-2 inline-block h-1 w-1 -translate-y-0.5 rounded-full bg-line-strong align-middle" />
              Source-verified data
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
