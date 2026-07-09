"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Store,
  Tags,
  RotateCcw,
  AlertTriangle,
  FileCheck2,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react";
import GuillocheField from "@/components/three/GuillocheField";
import { Logo } from "@/components/ui/Logo";
import { Seal } from "@/components/ui/Seal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  type Clarification,
  type ClarifyQuestion,
  type PermitResult,
} from "@/lib/permits";
import { LoadingSequence } from "@/components/demo/LoadingSequence";
import { ResultsSummary } from "@/components/demo/ResultsSummary";
import { PermitCard } from "@/components/demo/PermitCard";
import { ClarifyStep } from "@/components/demo/ClarifyStep";

type Status =
  | "idle"
  | "clarifying"
  | "questions"
  | "loading"
  | "done"
  | "error";
type Vals = { businessType: string; location: string; sells: string };

const ease = [0.16, 1, 0.3, 1] as const;
const EMPTY: Vals = { businessType: "", location: "", sells: "" };

const PRESETS: Vals[] = [
  { businessType: "Coffee shop", location: "Austin, TX", sells: "Coffee, pastries, beer & wine" },
  { businessType: "Food truck", location: "Denver, CO", sells: "Tacos and aguas frescas" },
  { businessType: "Hair salon", location: "Nashville, TN", sells: "Cuts, color, retail products" },
  { businessType: "Brewery taproom", location: "Portland, OR", sells: "Beer brewed & served on-site" },
];

export default function DemoPage() {
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [sells, setSells] = useState("");
  const [submitted, setSubmitted] = useState<Vals>(EMPTY);
  const [questions, setQuestions] = useState<ClarifyQuestion[]>([]);
  const [appliedClar, setAppliedClar] = useState<Clarification[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PermitResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setBusinessType(q);
  }, []);

  // step 1 — fetch tailored follow-up questions
  async function submitIntake(vals: Vals) {
    if (!vals.businessType.trim() || !vals.location.trim()) return;
    setSubmitted(vals);
    setStatus("clarifying");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const res = await fetch("/api/v1/clarify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          business_type: vals.businessType,
          location: vals.location,
          sells: vals.sells,
        }),
      });
      const data = await res.json();
      const qs: ClarifyQuestion[] = Array.isArray(data.questions)
        ? data.questions.slice(0, 4)
        : [];
      if (qs.length) {
        setQuestions(qs);
        setStatus("questions");
      } else {
        runMap(vals, []);
      }
    } catch {
      // a clarify failure must never block the demo
      runMap(vals, []);
    }
  }

  // step 2 — generate the refined permit map
  async function runMap(vals: Vals, clarifications: Clarification[]) {
    setAppliedClar(clarifications);
    setStatus("loading");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const res = await fetch("/api/v1/permits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          business_type: vals.businessType,
          location: vals.location,
          sells: vals.sells,
          clarifications,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Request failed.");
      const data: PermitResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function applyPreset(p: Vals) {
    setBusinessType(p.businessType);
    setLocation(p.location);
    setSells(p.sells);
    submitIntake(p);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setQuestions([]);
    setAppliedClar([]);
  }

  const act =
    status === "clarifying"
      ? "clarifying"
      : status === "questions"
        ? "questions"
        : status === "loading"
          ? "scan"
          : status === "done"
            ? "record"
            : "intake";

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen">
        {/* living security watermark */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <GuillocheField className="opacity-80" />
        </div>

        {/* top bar */}
        <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
          <div className="container-x flex h-16 items-center justify-between">
            <Link href="/" aria-label="Aiivo home">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              {status === "done" && (
                <button
                  onClick={reset}
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New search
                </button>
              )}
              <Link
                href="/"
                className="label hidden items-center gap-2 transition-colors hover:text-ink sm:flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
            </div>
          </div>
        </header>

        <main className="container-x">
          <AnimatePresence mode="wait">
            {/* ============================ INTAKE ============================ */}
            {act === "intake" && (
              <motion.section
                key="intake"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center py-12"
              >
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -right-4 -top-10 hidden opacity-[0.07] lg:block"
                    aria-hidden
                  >
                    <Seal className="h-52 w-52" />
                  </div>
                  <Eyebrow>Live demo · Office of Record</Eyebrow>
                  <h1 className="mt-5 text-balance text-4xl leading-[1.04] tracking-tight text-ink sm:text-6xl">
                    Issue your business its{" "}
                    <span className="italic seal-text">compliance record</span>.
                  </h1>
                  <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">
                    Enter your business and address. Aiivo asks a couple of smart
                    follow-ups, then scans federal, state, county and city
                    databases for every license you need — with costs, timelines
                    and filing links.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitIntake({ businessType, location, sells });
                  }}
                  className="mt-9"
                >
                  <div className="sheet paper-grain relative overflow-hidden rounded-2xl p-6 sm:p-8">
                    <div
                      className="pointer-events-none absolute inset-3 rounded-xl border border-line-strong/50 sm:inset-3.5"
                      aria-hidden
                    />
                    <div className="relative space-y-6">
                      <Field
                        icon={Store}
                        n="01"
                        label="Business type"
                        placeholder="e.g. Coffee shop, Hair salon, Food truck, SaaS company"
                        value={businessType}
                        onChange={setBusinessType}
                        required
                      />
                      <Field
                        icon={MapPin}
                        n="02"
                        label="Location"
                        placeholder="e.g. Austin, TX or 742 Evergreen Terrace, Springfield, IL"
                        value={location}
                        onChange={setLocation}
                        required
                      />
                      <Field
                        icon={Tags}
                        n="03"
                        label="What do you sell or serve?"
                        hint="Optional"
                        placeholder="e.g. Coffee, pastries, and alcohol on weekends"
                        value={sells}
                        onChange={setSells}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!businessType.trim() || !location.trim()}
                      className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-seal px-5 py-3.5 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Start my record
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </form>

                {/* sample presets */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="label mr-1 inline-flex items-center gap-1.5 text-faint">
                    <Sparkles className="h-3.5 w-3.5" />
                    Try a sample
                  </span>
                  {PRESETS.map((p) => (
                    <button
                      key={p.businessType}
                      onClick={() => applyPreset(p)}
                      className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[0.72rem] text-ink-soft transition-colors hover:border-seal/40 hover:text-seal"
                    >
                      {p.businessType} · {p.location}
                    </button>
                  ))}
                </div>

                {status === "error" && (
                  <p className="mt-4 flex items-center gap-2 font-mono text-xs text-stamp">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errorMsg} — please try again.
                  </p>
                )}
              </motion.section>
            )}

            {/* ========================== CLARIFYING ========================= */}
            {act === "clarifying" && (
              <motion.section
                key="clarifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center py-12"
              >
                <div className="sheet paper-grain rounded-2xl p-10 text-center sm:p-14">
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-seal" />
                  <p className="label mt-5 justify-center">Reading your business</p>
                  <h2 className="mt-3 text-balance text-xl text-ink sm:text-2xl">
                    Tailoring a few questions for{" "}
                    <span className="italic seal-text">
                      {submitted.businessType || "your business"}
                    </span>
                    …
                  </h2>
                </div>
              </motion.section>
            )}

            {/* =========================== QUESTIONS ========================= */}
            {act === "questions" && (
              <motion.section
                key="questions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto min-h-[calc(100vh-4rem)] max-w-3xl py-16"
              >
                <div className="mb-7">
                  <Eyebrow>A few quick questions</Eyebrow>
                  <h2 className="mt-4 text-balance text-3xl leading-[1.1] tracking-tight text-ink sm:text-[2.4rem]">
                    Details that <span className="italic seal-text">change</span>{" "}
                    your record.
                  </h2>
                  <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-soft">
                    Answer what you can — each one moves a permit from
                    &ldquo;verify&rdquo; to &ldquo;confirmed&rdquo; and prunes the
                    ones that don&apos;t apply to you. Skip anytime.
                  </p>
                </div>
                <ClarifyStep
                  questions={questions}
                  onSubmit={(c) => runMap(submitted, c)}
                  onSkip={() => runMap(submitted, [])}
                />
              </motion.section>
            )}

            {/* ============================= SCAN ============================= */}
            {act === "scan" && (
              <motion.section
                key="scan"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center py-12"
              >
                <div className="mb-7 text-center">
                  <Eyebrow className="justify-center">Compiling your record</Eyebrow>
                  <h2 className="mt-4 text-balance text-2xl tracking-tight text-ink sm:text-3xl">
                    Reading every requirement for{" "}
                    <span className="italic seal-text">
                      {submitted.businessType || "your business"}
                    </span>
                    .
                  </h2>
                </div>
                <LoadingSequence />
              </motion.section>
            )}

            {/* ============================ RECORD ============================ */}
            {act === "record" && result && (
              <motion.section
                key="record"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease }}
                className="mx-auto max-w-3xl space-y-6 py-12"
              >
                <ResultsSummary result={result} />

                {/* tailored-to chips */}
                {appliedClar.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 px-1">
                    <span className="label text-faint">Tailored to</span>
                    {appliedClar.map((c) => (
                      <span
                        key={c.question}
                        title={c.question}
                        className="rounded-full border border-seal/30 bg-seal/[0.06] px-2.5 py-1 font-mono text-[0.66rem] text-seal"
                      >
                        {c.answer}
                      </span>
                    ))}
                  </div>
                )}

                {/* confidence legend */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
                  <span className="label text-faint">Confidence</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                    <span className="h-2 w-2 rounded-full bg-seal" /> Confirmed
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                    <span className="h-2 w-2 rounded-full bg-gold" /> Likely
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                    <span className="h-2 w-2 rounded-full bg-stamp" /> Verify
                  </span>
                </div>

                {/* permit line items */}
                <div className="space-y-2.5">
                  {result.permits.map((p, i) => (
                    <motion.div
                      key={`${p.name}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.05 }}
                    >
                      <PermitCard permit={p} index={i} />
                    </motion.div>
                  ))}
                </div>

                {/* important notes */}
                {result.notes.length > 0 && (
                  <div className="rounded-2xl border border-gold/35 bg-gold/[0.06] p-6">
                    <p className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold">
                      <AlertTriangle className="h-4 w-4" />
                      Important notes
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {result.notes.map((note) => (
                        <li
                          key={note}
                          className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* conversion CTA */}
                <div className="sheet perforated-top relative overflow-hidden rounded-2xl">
                  <div className="paper-grain p-7 text-center sm:p-9">
                    <h2 className="text-balance text-2xl leading-snug tracking-tight text-ink sm:text-[1.7rem]">
                      Ready to get{" "}
                      <span className="italic seal-text">compliant</span>?
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                      We&apos;ll file every permit on this list for you — and keep
                      you renewed as the rules change.
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        href="/#pricing"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
                      >
                        <FileCheck2 className="h-4 w-4" />
                        File all permits — $299
                      </Link>
                      <Link
                        href="/#pricing"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
                      >
                        <Download className="h-4 w-4" />
                        Download report — $99
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={reset}
                    className="group inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Run another business
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* colophon */}
        <footer className="relative border-t border-line bg-paper-2/80 backdrop-blur-sm">
          <div className="container-x py-10">
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                AIIVO · OFFICIAL COMPLIANCE RECORD · © 2026
              </p>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
                Informational tool · not legal advice
              </p>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}

function Field({
  icon: Icon,
  n,
  label,
  hint,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ComponentType<{ className?: string }>;
  n: string;
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label inline-flex items-center gap-2">
          <span className="text-faint">{n}</span>
          {label}
        </span>
        {hint && <span className="label text-faint">{hint}</span>}
      </div>
      <div className="group flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
        <Icon className="h-5 w-5 shrink-0 text-seal" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-label={label}
          className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
        />
      </div>
    </div>
  );
}
