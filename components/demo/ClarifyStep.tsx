"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ClarifyQuestion, Clarification } from "@/lib/permits";

export function ClarifyStep({
  questions,
  onSubmit,
  onSkip,
}: {
  questions: ClarifyQuestion[];
  onSubmit: (clarifications: Clarification[]) => void;
  onSkip: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  function toggle(q: ClarifyQuestion, opt: string) {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.multiple) {
        return {
          ...prev,
          [q.id]: cur.includes(opt)
            ? cur.filter((o) => o !== opt)
            : [...cur, opt],
        };
      }
      return { ...prev, [q.id]: cur.includes(opt) ? [] : [opt] };
    });
  }

  function submit() {
    const clarifications = questions
      .filter((q) => (answers[q.id]?.length ?? 0) > 0)
      .map((q) => ({ question: q.question, answer: answers[q.id].join(", ") }));
    onSubmit(clarifications);
  }

  const answered = questions.filter((q) => answers[q.id]?.length).length;

  return (
    <div className="sheet paper-grain relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div
        className="pointer-events-none absolute inset-3 rounded-xl border border-line-strong/50 sm:inset-3.5"
        aria-hidden
      />
      <div className="relative space-y-7">
        {questions.map((q, i) => (
          <div key={q.id} className="flex items-start gap-3.5">
            <span className="label mt-1 shrink-0 text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base text-ink">{q.question}</p>
              {q.help && <p className="mt-1 text-sm text-muted">{q.help}</p>}
              <div className="mt-3.5 flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const sel = answers[q.id]?.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggle(q, opt)}
                      aria-pressed={sel}
                      className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.72rem] transition-colors ${
                        sel
                          ? "border-seal bg-seal/10 text-seal"
                          : "border-line bg-card text-ink-soft hover:border-seal/40 hover:text-ink"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <button
          onClick={submit}
          className="group inline-flex items-center gap-2 rounded-lg bg-seal px-5 py-3 text-sm font-medium text-on-seal transition-colors hover:bg-seal-bright"
        >
          Generate my record
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Skip — use what I&apos;ve entered
        </button>
        <span className="ml-auto font-mono text-[0.66rem] uppercase tracking-wider text-faint">
          {answered}/{questions.length} answered
        </span>
      </div>
    </div>
  );
}
