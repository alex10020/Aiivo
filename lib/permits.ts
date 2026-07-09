// Shared types + display metadata for the live permit demo.
// NOTE: this is a NEW file — lib/data.ts (the frozen contract) is untouched.

export type Level = "federal" | "state" | "county" | "city";
export type PermitConfidence = "confirmed" | "likely_required" | "verify";

export interface Permit {
  name: string;
  issuing_authority: string;
  level: Level;
  estimated_cost: string;
  processing_time: string;
  renewal: string;
  description: string;
  requirements: string[];
  confidence: PermitConfidence;
  url: string;
  last_verified?: string;
}

export interface PermitResult {
  business_summary: string;
  jurisdiction: string;
  total_permits: number;
  estimated_total_cost: string;
  estimated_timeline: string;
  permits: Permit[];
  notes: string[];
}

/* Jurisdiction levels mapped onto the Official Record palette (no neon).
   Class strings are written literally so Tailwind's scanner keeps them. */
export const LEVELS: Record<
  Level,
  { label: string; abbr: string; text: string; ring: string; dot: string }
> = {
  federal: {
    label: "Federal",
    abbr: "FED",
    text: "text-seal-deep",
    ring: "border-seal-deep/30 bg-seal-deep/[0.06]",
    dot: "bg-seal-deep",
  },
  state: {
    label: "State",
    abbr: "ST",
    text: "text-seal",
    ring: "border-seal/30 bg-seal/[0.06]",
    dot: "bg-seal",
  },
  county: {
    label: "County",
    abbr: "CO",
    text: "text-gold",
    ring: "border-gold/40 bg-gold/[0.08]",
    dot: "bg-gold",
  },
  city: {
    label: "City",
    abbr: "CITY",
    text: "text-muted",
    ring: "border-line bg-paper",
    dot: "bg-muted",
  },
};

/* Confidence colours per the design contract:
   Confirmed = seal · Likely Required = gold · Verify = stamp. */
export const CONFIDENCE: Record<
  PermitConfidence,
  { label: string; cls: string; dot: string }
> = {
  confirmed: {
    label: "Confirmed",
    cls: "border-seal/30 bg-seal/[0.06] text-seal",
    dot: "bg-seal",
  },
  likely_required: {
    label: "Likely Required",
    cls: "border-gold/40 bg-gold/[0.08] text-gold",
    dot: "bg-gold",
  },
  verify: {
    label: "Verify with jurisdiction",
    cls: "border-stamp/40 bg-stamp/[0.07] text-stamp",
    dot: "bg-stamp",
  },
};

const LEVEL_VALUES: Level[] = ["federal", "state", "county", "city"];
const CONF_VALUES: PermitConfidence[] = ["confirmed", "likely_required", "verify"];

/** Tolerant validator/normaliser for whatever the model (or fallback) returns. */
export function coerceResult(raw: unknown): PermitResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.permits)) return null;

  const permits: Permit[] = (r.permits as unknown[])
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const o = p as Record<string, unknown>;
      const level = LEVEL_VALUES.includes(o.level as Level)
        ? (o.level as Level)
        : "city";
      const confidence = CONF_VALUES.includes(o.confidence as PermitConfidence)
        ? (o.confidence as PermitConfidence)
        : "verify";
      return {
        name: String(o.name ?? "Permit"),
        issuing_authority: String(o.issuing_authority ?? "—"),
        level,
        estimated_cost: String(o.estimated_cost ?? "—"),
        processing_time: String(o.processing_time ?? "—"),
        renewal: String(o.renewal ?? "—"),
        description: String(o.description ?? ""),
        requirements: Array.isArray(o.requirements)
          ? (o.requirements as unknown[]).map(String)
          : [],
        confidence,
        url: String(o.url ?? ""),
      } satisfies Permit;
    })
    .filter((p): p is Permit => p !== null);

  if (permits.length === 0) return null;

  return {
    business_summary: String(r.business_summary ?? ""),
    jurisdiction: String(r.jurisdiction ?? ""),
    total_permits: permits.length,
    estimated_total_cost: String(r.estimated_total_cost ?? "—"),
    estimated_timeline: String(r.estimated_timeline ?? "—"),
    permits,
    notes: Array.isArray(r.notes) ? (r.notes as unknown[]).map(String) : [],
  };
}

/** Sum the dollar amounts across line items into a [min, max] range.
   Only counts $-prefixed figures, so percentages ("0.85%"), seat counts
   ("100 seats") and durations ("5 years") never pollute the total. */
export function sumCosts(permits: Permit[]): { min: number; max: number } {
  let min = 0;
  let max = 0;
  for (const p of permits) {
    const nums = (p.estimated_cost.match(/\$\s?[\d,]+(?:\.\d+)?/g) ?? [])
      .map((s) => parseFloat(s.replace(/[^0-9.]/g, "")))
      .filter((n) => Number.isFinite(n));
    if (nums.length === 0) continue; // free / no fee / varies → $0
    min += Math.min(...nums);
    max += Math.max(...nums);
  }
  return { min: Math.round(min), max: Math.round(max) };
}

export interface ClarifyQuestion {
  id: string;
  question: string;
  help: string;
  multiple: boolean;
  options: string[];
}

export interface Clarification {
  question: string;
  answer: string;
}
