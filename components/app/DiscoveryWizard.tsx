"use client";

/* Deterministic discovery wizard: structured questions set facts directly,
   then /api/v2/lookup returns a record with no AI on the path — instant. */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  RotateCcw,
  Store,
  Tags,
  Zap,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ResultsSummary } from "@/components/demo/ResultsSummary";
import { PermitCard } from "@/components/demo/PermitCard";
import {
  DISCOVERY,
  seedFactsFromText,
  visibleQuestions,
  type Answers,
  type DiscoveryQuestion,
} from "@/lib/engine/rules/discovery";
import type { PermitResult } from "@/lib/permits";

const ease = [0.16, 1, 0.3, 1] as const;
const STAGES: { id: DiscoveryQuestion["stage"]; label: string }[] = [
  { id: "corporate", label: "Business structure" },
  { id: "location", label: "Location" },
  { id: "operations", label: "Operations" },
  { id: "employment", label: "Employees" },
];

type Step = "intake" | "questions" | "result";

export function DiscoveryWizard() {
  const [step, setStep] = useState<Step>("intake");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [sells, setSells] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<PermitResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const visible = useMemo(() => visibleQuestions(answers), [answers]);

  function start(e: React.FormEvent) {
    e.preventDefault();
    if (!businessType.trim() || !location.trim()) return;
    const seed = seedFactsFromText(businessType, sells);
    setAnswers((prev) => {
      const next: Answers = { location_type: "commercial", employee_count: "0", ...prev };
      for (const [k, v] of Object.entries(seed)) if (v && next[k] === undefined) next[k] = "true";
      return next;
    });
    setStep("questions");
  }

  async function run() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/v2/lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ business_type: businessType, location, sells, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Lookup failed.");
      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStep("intake");
    setResult(null);
    setAnswers({});
    setError("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-2">
        <Eyebrow>Deterministic engine</Eyebrow>
        <span className="inline-flex items-center gap-1 rounded-full border border-seal/30 bg-seal/5 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider text-seal">
          <Zap className="h-3 w-3" /> no AI · instant
        </span>
      </div>
      <h1 className="mt-4 text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
        Answer a few facts, get your <span className="italic seal-text">record</span>.
      </h1>

      <AnimatePresence mode="wait">
        {step === "intake" && (
          <motion.form
            key="intake"
            onSubmit={start}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
            className="mt-8"
          >
            <div className="sheet paper-grain relative overflow-hidden rounded-2xl p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-3 rounded-xl border border-line-strong/50" aria-hidden />
              <div className="relative space-y-6">
                <IntakeField icon={Store} label="Business type" value={businessType} onChange={setBusinessType} placeholder="e.g. Coffee shop, Hair salon, Food truck" />
                <IntakeField icon={MapPin} label="Location" value={location} onChange={setLocation} placeholder="e.g. Austin, TX or a full street address" />
                <IntakeField icon={Tags} label="What do you sell or serve?" hint="Optional" value={sells} onChange={setSells} placeholder="e.g. Coffee, pastries, beer & wine" />
                <button
                  type="submit"
                  disabled={!businessType.trim() || !location.trim()}
                  className="group inline-flex items-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright disabled:opacity-50"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {step === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
            className="mt-8"
          >
            <p className="text-sm leading-relaxed text-ink-soft">
              We pre-filled what we could from your description — check it, then
              generate. Every answer is a fact the engine reads directly.
            </p>
            <div className="mt-6 space-y-8">
              {STAGES.map((stage) => {
                const qs = visible.filter((q) => q.stage === stage.id);
                if (!qs.length) return null;
                return (
                  <div key={stage.id}>
                    <div className="flex items-center gap-3">
                      <span className="label whitespace-nowrap">{stage.label}</span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    <div className="mt-4 space-y-5">
                      {qs.map((q) => (
                        <Question
                          key={q.fact}
                          q={q}
                          value={answers[q.fact]}
                          onChange={(v) => setAnswers((p) => ({ ...p, [q.fact]: v }))}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {error && (
              <p className="mt-4 font-mono text-xs text-stamp">{error}</p>
            )}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep("intake")}
                className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                onClick={run}
                disabled={busy}
                className="group inline-flex items-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Generate my record
              </button>
            </div>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={reset}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" /> New lookup
              </button>
            </div>
            <ResultsSummary result={result} />
            <div className="space-y-2.5">
              {result.permits.map((p, i) => (
                <PermitCard key={`${p.name}-${i}`} permit={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Question({
  q,
  value,
  onChange,
}: {
  q: DiscoveryQuestion;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[0.95rem] text-ink">{q.label}</p>
      {q.help && <p className="mt-0.5 text-xs text-muted">{q.help}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {q.type === "boolean" ? (
          [
            { v: "true", l: "Yes" },
            { v: "false", l: "No" },
          ].map((o) => (
            <Chip key={o.v} on={value === o.v} onClick={() => onChange(o.v)}>
              {o.l}
            </Chip>
          ))
        ) : (
          q.options?.map((o) => (
            <Chip key={o.value} on={value === o.value} onClick={() => onChange(o.value)}>
              {o.label}
            </Chip>
          ))
        )}
      </div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.72rem] transition-colors ${
        on ? "border-seal bg-seal/10 text-seal" : "border-line bg-card text-ink-soft hover:border-seal/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function IntakeField({
  icon: Icon,
  label,
  hint,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label">{label}</span>
        {hint && <span className="label text-faint">{hint}</span>}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
        <Icon className="h-5 w-5 shrink-0 text-seal" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
        />
      </div>
    </div>
  );
}
