"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Seal } from "@/components/ui/Seal";

const ease = [0.16, 1, 0.3, 1] as const;
const TARGET = 8300;

const STEPS = [
  "Identifying your jurisdiction",
  "Scanning federal requirements",
  "Checking state licensing database",
  "Searching county regulations",
  "Reviewing city permit codes",
  "Cross-referencing industry requirements",
  "Compiling your permit map",
];

// streaming log lines — plausible record-office chatter
const FEED = [
  "FED · IRS — business tax registry",
  "FED · SBA — licensing index",
  "STATE · Dept. of Revenue — sales & use tax",
  "STATE · Secretary of State — entity registry",
  "STATE · Dept. of Health — food protection",
  "COUNTY · Clerk — assumed-name index",
  "COUNTY · Health Dept. — establishment permits",
  "CITY · Business Affairs — operating licenses",
  "CITY · Buildings — occupancy & signage",
  "CITY · Public Health — inspection schedule",
  "CITY · Zoning — use classification",
  "STATE · Labor — employer obligations",
  "FED · EPA — discharge & waste codes",
  "STATE · Workers' Comp — coverage rules",
  "CITY · Streets & Sanitation — service permits",
  "STATE · Employment Security — UI registration",
];

export function LoadingSequence() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const feedIdx = useRef(0);

  // count toward TARGET, easing and holding just short of completion
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const dur = 9000;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(TARGET * eased * 0.999));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // advance the status step
  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => (s < STEPS.length - 1 ? s + 1 : s)),
      1600
    );
    return () => clearInterval(id);
  }, []);

  // stream the log
  useEffect(() => {
    const id = setInterval(() => {
      const line = FEED[feedIdx.current % FEED.length];
      feedIdx.current += 1;
      setLines((prev) => [...prev.slice(-7), line]);
    }, 480);
    return () => clearInterval(id);
  }, []);

  const progress = Math.min((count / TARGET) * 100, 99);

  return (
    <div className="relative">
      <div className="sheet paper-grain relative overflow-hidden rounded-2xl">
        {/* sweeping scan beam */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-gradient-to-b from-transparent via-seal/10 to-transparent"
          initial={{ top: "-20%" }}
          animate={{ top: "120%" }}
          transition={{ duration: 2.2, ease: "linear", repeat: Infinity }}
          aria-hidden
        />

        <div className="relative p-7 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            {/* big counter */}
            <div>
              <p className="label">Scanning jurisdictions</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-5xl tracking-tight text-ink tabular-nums sm:text-6xl">
                  {count.toLocaleString()}
                </span>
                <span className="font-mono text-lg text-faint">
                  / {TARGET.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-2 font-mono text-sm text-seal">
                {STEPS[step]}
                <span className="inline-block w-2 animate-blink">_</span>
              </p>
            </div>

            {/* inking seal */}
            <motion.div
              initial={{ opacity: 0.15, scale: 0.96 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ duration: 3, ease }}
              className="hidden shrink-0 sm:block"
              aria-hidden
            >
              <Seal className="h-24 w-24" />
            </motion.div>
          </div>

          {/* progress */}
          <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-paper-3">
            <motion.div
              className="h-full rounded-full bg-seal"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease }}
            />
          </div>

          {/* streaming feed */}
          <div className="mt-6 h-40 overflow-hidden rounded-xl border border-line bg-paper/60 p-4">
            <div className="flex flex-col justify-end gap-2">
              {lines.map((line, i) => (
                <motion.div
                  key={`${line}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="flex items-center gap-2.5 font-mono text-[0.72rem] text-ink-soft"
                >
                  <Check className="h-3 w-3 shrink-0 text-seal" strokeWidth={3} />
                  <span className="truncate">{line}</span>
                  <span className="ml-auto text-faint">indexed</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
