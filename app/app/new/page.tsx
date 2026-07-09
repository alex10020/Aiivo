"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, MapPin, Store, Tags } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ClarifyStep } from "@/components/demo/ClarifyStep";
import { LoadingSequence } from "@/components/demo/LoadingSequence";
import type { Clarification, ClarifyQuestion } from "@/lib/permits";

type Step = "form" | "clarifying" | "questions" | "running" | "error";
type Vals = { businessType: string; location: string; sells: string };

export default function NewLookupPage() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [sells, setSells] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [questions, setQuestions] = useState<ClarifyQuestion[]>([]);
  const [submitted, setSubmitted] = useState<Vals>({ businessType: "", location: "", sells: "" });
  const [error, setError] = useState("");

  async function begin(e: React.FormEvent) {
    e.preventDefault();
    const vals = { businessType, location, sells };
    setSubmitted(vals);
    setStep("clarifying");
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
      const qs: ClarifyQuestion[] = Array.isArray(data.questions) ? data.questions : [];
      if (qs.length) {
        setQuestions(qs);
        setStep("questions");
      } else {
        run(vals, []);
      }
    } catch {
      run(vals, []);
    }
  }

  async function run(vals: Vals, clarifications: Clarification[]) {
    setStep("running");
    setError("");
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          business_type: vals.businessType,
          location: vals.location,
          sells: vals.sells,
          clarifications,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Lookup failed.");
      router.push(`/app/records/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Eyebrow>New lookup</Eyebrow>
      <h1 className="mt-4 text-3xl leading-[1.08] tracking-tight text-ink sm:text-4xl">
        Issue a new <span className="italic seal-text">record</span>.
      </h1>

      {(step === "form" || step === "error") && (
        <form onSubmit={begin} className="mt-8">
          <div className="sheet paper-grain relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-3 rounded-xl border border-line-strong/50"
              aria-hidden
            />
            <div className="relative space-y-6">
              <Field icon={Store} label="Business type" value={businessType} onChange={setBusinessType} placeholder="e.g. Coffee shop, Hair salon, Food truck" required />
              <Field icon={MapPin} label="Location" value={location} onChange={setLocation} placeholder="e.g. Austin, TX or a full street address" required />
              <Field icon={Tags} label="What do you sell or serve?" hint="Optional" value={sells} onChange={setSells} placeholder="e.g. Coffee, pastries, beer & wine" />
              <button
                type="submit"
                disabled={!businessType.trim() || !location.trim()}
                className="group inline-flex items-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright disabled:opacity-50"
              >
                Start my record
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
          {step === "error" && (
            <p className="mt-4 flex items-center gap-2 font-mono text-xs text-stamp">
              <AlertTriangle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </form>
      )}

      {step === "clarifying" && (
        <div className="sheet paper-grain mt-8 rounded-2xl p-10 text-center">
          <p className="label">Reading your business…</p>
        </div>
      )}

      {step === "questions" && (
        <div className="mt-8">
          <p className="mb-5 text-sm leading-relaxed text-ink-soft">
            A few details that change your record — answer what you can, or skip.
          </p>
          <ClarifyStep
            questions={questions}
            onSubmit={(c) => run(submitted, c)}
            onSkip={() => run(submitted, [])}
          />
        </div>
      )}

      {step === "running" && (
        <div className="mt-8">
          <LoadingSequence />
        </div>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  hint,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ComponentType<{ className?: string }>;
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
        <span className="label">{label}</span>
        {hint && <span className="label text-faint">{hint}</span>}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-card p-2 pl-3.5 transition-colors focus-within:border-seal/55 focus-within:shadow-[0_0_0_3px_rgba(21,98,61,0.1)]">
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
