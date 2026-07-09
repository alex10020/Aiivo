/* [B] BusinessClassifier — free-text business → NAICS prefixes + trigger flags.
   Claude when available, keyword heuristic as a keyless fallback. */
import type {
  BusinessClassifier,
  BusinessInput,
  Classification,
} from "../types";
import { hasAI, jsonComplete } from "../ai";

const TRIGGERS = [
  "food",
  "alcohol",
  "employees",
  "seating",
  "signage",
  "retail",
  "outdoor",
];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    naics: { type: "array", items: { type: "string" } },
    triggers: { type: "array", items: { type: "string", enum: TRIGGERS } },
    confidence: { type: "number" },
  },
  required: ["naics", "triggers", "confidence"],
} as const;

function heuristic(input: BusinessInput): Classification {
  const text = `${input.businessType} ${input.sells ?? ""}`.toLowerCase();
  const triggers = new Set<string>();
  const has = (...w: string[]) => w.some((x) => text.includes(x));
  if (has("coffee", "cafe", "restaurant", "food", "bakery", "pastr", "kitchen", "truck", "bar", "deli", "ice cream", "sandwich"))
    triggers.add("food");
  if (has("alcohol", "beer", "wine", "liquor", "spirits", "brewery", "taproom"))
    triggers.add("alcohol");
  if (has("salon", "shop", "store", "retail", "boutique", "market")) triggers.add("retail");
  if (has("sign", "signage")) triggers.add("signage");
  const naics: string[] = [];
  if (triggers.has("food")) naics.push("722");
  if (triggers.has("retail")) naics.push("44", "45");
  // assume staffing unless clearly owner-only
  if (!has("owner-operated", "solo", "no employees")) triggers.add("employees");
  return { naics, triggers: [...triggers], confidence: 0.5 };
}

export class ClaudeClassifier implements BusinessClassifier {
  async classify(input: BusinessInput): Promise<Classification> {
    if (!hasAI()) return heuristic(input);
    try {
      const out = await jsonComplete<Classification>({
        maxTokens: 800,
        effort: "low",
        system:
          "You classify a US small business for permit matching. Return NAICS code prefixes (2–4 digit, e.g. \"722\" food services, \"44\"/\"45\" retail) and applicable trigger flags. 'employees' = will likely hire staff. Only use the allowed trigger values.",
        user: `Business type: ${input.businessType}\nSells/serves: ${input.sells ?? "Not specified"}`,
        schema: SCHEMA,
      });
      const triggers = (out.triggers ?? []).filter((t) => TRIGGERS.includes(t));
      return {
        naics: out.naics ?? [],
        triggers,
        confidence: typeof out.confidence === "number" ? out.confidence : 0.7,
      };
    } catch {
      return heuristic(input);
    }
  }
}

export const classifier = new ClaudeClassifier();
