/* [C] Interpretation + confidence. The permit SET is grounded in the retrieved
   requirements (DB) — Claude only writes descriptions, prunes by clarifications,
   and summarises. It never invents a permit that wasn't retrieved. */
import type {
  ComplianceRecord,
  Confidence,
  ConfidenceScorer,
  BusinessInput,
  ClarifyQuestion,
  InterpretationEngine,
  MatchContext,
  RecordItem,
  Requirement,
} from "../types";
import { engineEffort, hasAI, jsonComplete } from "../ai";
import { jurisdictionById, permitTypeById, sourceById } from "../data/seed";

const ORDER: Confidence[] = ["confirmed", "likely_required", "verify"];
const DAY = 86_400_000;

export const scorer: ConfidenceScorer = {
  score(item, req) {
    let conf: Confidence = req?.baseConfidence ?? item.confidence;
    const stamp = req?.lastVerifiedAt ?? item.lastVerifiedAt;
    if (stamp && Date.parse(stamp) < Date.now() - 90 * DAY) {
      conf = ORDER[Math.min(ORDER.indexOf(conf) + 1, 2)]; // stale → downgrade
    }
    return {
      confidence: conf,
      needsReview: conf !== "confirmed",
      reason: conf !== "confirmed" ? "below_confirmed" : undefined,
    };
  },
};

function draftItem(req: Requirement): RecordItem {
  const pt = permitTypeById.get(req.permitTypeId);
  const jur = jurisdictionById.get(req.jurisdictionId);
  const src = req.sourceId ? sourceById.get(req.sourceId) : undefined;
  return {
    id: req.id,
    recordId: "",
    permitTypeId: req.permitTypeId,
    requirementId: req.id,
    jurisdictionId: req.jurisdictionId,
    name: pt?.name ?? req.permitTypeId,
    authority: src?.title ?? jur?.name ?? "—",
    level: jur?.level ?? pt?.defaultLevel ?? "city",
    cost: req.typicalCost,
    time: req.typicalTime,
    renewal: req.renewal,
    description: pt?.description ?? "",
    requirements: [],
    confidence: req.baseConfidence,
    filingUrl: req.filingUrl,
    lastVerifiedAt: req.lastVerifiedAt,
    reviewStatus: "auto_approved",
  };
}

function label(ctx: MatchContext): string {
  const js = ctx.resolution.jurisdictions;
  const city = js.find((j) => j.level === "city");
  const state = js.find((j) => j.level === "state");
  const county = js.find((j) => j.level === "county");
  if (!state) return "United States";
  const head = [city?.name, state.name].filter(Boolean).join(", ");
  return county ? `${head} (${county.name})` : head;
}

function sumCost(items: RecordItem[]): string {
  let min = 0;
  let max = 0;
  for (const it of items) {
    const m = it.cost.match(/\$\s?[\d,]+(?:\.\d+)?/g);
    if (!m) continue;
    const n = m.map((x) => parseFloat(x.replace(/[^0-9.]/g, "")));
    min += Math.min(...n);
    max += Math.max(...n);
  }
  if (max === 0) return "$0";
  return min === max
    ? `$${min.toLocaleString()}`
    : `$${min.toLocaleString()}–$${max.toLocaleString()}`;
}

const ENRICH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          description: { type: "string" },
          requirements: { type: "array", items: { type: "string" } },
        },
        required: ["id", "description", "requirements"],
      },
    },
    drop: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    estimated_timeline: { type: "string" },
    notes: { type: "array", items: { type: "string" } },
  },
  required: ["items", "drop", "summary", "estimated_timeline", "notes"],
} as const;

interface Enrich {
  items: { id: string; description: string; requirements: string[] }[];
  drop: string[];
  summary: string;
  estimated_timeline: string;
  notes: string[];
}

const CLARIFY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          help: { type: "string" },
          multiple: { type: "boolean" },
          options: { type: "array", items: { type: "string" } },
        },
        required: ["id", "question", "help", "multiple", "options"],
      },
    },
  },
  required: ["questions"],
} as const;

const FALLBACK_QS: ClarifyQuestion[] = [
  { id: "employees", question: "Will you have employees?", help: "Triggers workers' comp, withholding and unemployment registration.", multiple: false, options: ["Yes", "No", "Not yet"] },
  { id: "space", question: "Is this a new build-out or an existing space?", help: "Decides whether a Certificate of Occupancy applies.", multiple: false, options: ["New build-out", "Existing same-use space", "Not sure"] },
  { id: "alcohol", question: "Will you sell or serve alcohol?", help: "Adds a separate state license with a longer lead time.", multiple: false, options: ["Yes", "No"] },
];

export class ClaudeInterpretationEngine implements InterpretationEngine {
  async clarify(input: BusinessInput): Promise<ClarifyQuestion[]> {
    if (!hasAI()) return FALLBACK_QS;
    try {
      const out = await jsonComplete<{ questions: ClarifyQuestion[] }>({
        maxTokens: 1500,
        effort: "low",
        system:
          "You are Aiivo's intake assistant. Produce 2–4 clarifying questions whose answers change which permits apply (employees, alcohol/regulated products, new build-out vs existing space, seating/size). 2–5 short options each, including a neutral option where useful. Do not ask anything already implied.",
        user: `Business type: ${input.businessType}\nLocation: ${input.location}\nSells: ${input.sells ?? "Not specified"}`,
        schema: CLARIFY_SCHEMA,
      });
      const qs = (out.questions ?? []).filter((q) => q.options?.length >= 2).slice(0, 4);
      return qs.length ? qs : FALLBACK_QS;
    } catch {
      return FALLBACK_QS;
    }
  }

  async buildRecord(
    input: BusinessInput,
    ctx: MatchContext,
    requirements: Requirement[]
  ): Promise<Omit<ComplianceRecord, "id" | "businessId" | "createdAt">> {
    const reqById = new Map(requirements.map((r) => [r.id, r]));
    let items = requirements.map(draftItem);
    const jurisdictionLabel = label(ctx);
    let summary = `${input.businessType} — ${jurisdictionLabel}`;
    let timeline = "4–8 weeks";
    let notes: string[] = [];

    if (hasAI() && items.length) {
      try {
        const clar = ctx.clarifications.length
          ? `\nOwner answered:\n${ctx.clarifications.map((c) => `- ${c.question} → ${c.answer}`).join("\n")}`
          : "";
        const list = items
          .map((it) => `- id=${it.id} | ${it.name} | ${it.authority} | ${it.level} | ${it.cost} | ${it.time}`)
          .join("\n");
        const out = await jsonComplete<Enrich>({
          maxTokens: 12000,
          effort: engineEffort("high"),
          thinking: true,
          system:
            "You finalise a compliance record. You are given the EXACT permit set already matched from a verified database — do NOT add or rename permits. For each item write a one-sentence plain description and a short requirements checklist. In 'drop', list item ids that the owner's answers make inapplicable (e.g. employee-related filings if there are no employees; a Certificate of Occupancy for an existing same-use space). Write a one-line business summary, a short overall timeline range, and 2–4 concrete location-specific notes.",
          user: `Business: ${input.businessType} in ${jurisdictionLabel}. Sells: ${input.sells ?? "n/a"}.${clar}\n\nPermit set:\n${list}`,
          schema: ENRICH_SCHEMA,
        });
        const drop = new Set(out.drop ?? []);
        const enrichById = new Map(out.items.map((i) => [i.id, i]));
        items = items
          .filter((it) => !drop.has(it.id))
          .map((it) => {
            const e = enrichById.get(it.id);
            return e ? { ...it, description: e.description, requirements: e.requirements } : it;
          });
        if (out.summary) summary = out.summary;
        if (out.estimated_timeline) timeline = out.estimated_timeline;
        notes = out.notes ?? [];
      } catch {
        /* keep deterministic draft */
      }
    }

    // score confidence + review routing
    items = items.map((it) => {
      const { confidence, needsReview } = scorer.score(it, reqById.get(it.id) ?? null);
      return {
        ...it,
        confidence,
        reviewStatus: needsReview ? "pending" : "auto_approved",
      };
    });

    const status = items.some((i) => i.reviewStatus === "pending")
      ? "in_review"
      : "ready";

    return {
      status,
      tier: "discover",
      summary,
      jurisdictionLabel,
      estimatedCost: sumCost(items),
      estimatedTimeline: timeline,
      items,
      notes,
      clarifications: ctx.clarifications,
    };
  }
}

export const engine = new ClaudeInterpretationEngine();
