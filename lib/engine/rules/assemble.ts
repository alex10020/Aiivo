/* =============================================================================
   Deterministic record assembly — facts + evaluated permits → ComplianceRecord.
   No AI: descriptions come from a catalog, notes are templated from facts,
   cost is summed. Same inputs ⇒ identical record, front to back.
   ========================================================================== */
import type {
  BusinessInput,
  ComplianceRecord,
  Jurisdiction,
  RecordItem,
} from "../types";
import type { FactSet, PermitRequirement } from "./types";

/** One-line plain description per permit type (deterministic, sourced content). */
const DESCRIPTIONS: Record<string, string> = {
  ein: "Your business's federal tax ID — required to hire, open a bank account, and file taxes.",
  "sales-use-tax": "Authorises you to collect and remit sales tax on taxable goods and services.",
  "employer-withholding": "Registers you to withhold and remit state income tax from employee pay.",
  "unemployment-insurance": "State unemployment-insurance tax registration for employers.",
  "workers-comp": "Coverage for workplace injuries — required in nearly every state once you have employees.",
  "certified-food-manager": "At least one certified food-protection manager must be on staff.",
  "food-handler": "Basic food-safety training for staff who handle food.",
  "retail-food-establishment": "Licenses the premises to prepare and serve food; includes a health inspection.",
  "assumed-name-dba": "Registers the trade name you operate under if it differs from your legal entity.",
  "certificate-of-occupancy": "Confirms the space is approved for your use; needed for a build-out or change of use.",
  "sign-permit": "Required before installing exterior signage; rules vary by zoning district.",
  "business-license": "The general operating license for doing business in this jurisdiction.",
};

/** Short requirements checklist per permit type. */
const CHECKLIST: Record<string, string[]> = {
  ein: ["Responsible party SSN/ITIN", "Legal entity formed"],
  "sales-use-tax": ["EIN", "Business address"],
  "retail-food-establishment": ["Floor plan", "Menu", "Pre-opening inspection"],
  "certified-food-manager": ["Accredited exam"],
  "workers-comp": ["Employee count", "Payroll estimate"],
  "assumed-name-dba": ["Owner ID", "Legal entity name"],
  "certificate-of-occupancy": ["Signed lease", "Final inspection"],
  "sign-permit": ["Sign dimensions", "Mounting details"],
};

function label(stack: Jurisdiction[]): string {
  const city = stack.find((j) => j.level === "city");
  const state = stack.find((j) => j.level === "state");
  const county = stack.find((j) => j.level === "county");
  if (!state) return "United States";
  const head = [city?.name, state.name].filter(Boolean).join(", ");
  return county ? `${head} (${county.name})` : head;
}

function sumCost(items: { cost: string }[]): string {
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

/** Templated, fact-driven compliance notes — no model. */
function notesFor(facts: FactSet, permits: PermitRequirement[]): string[] {
  const notes: string[] = [];
  if (facts.serves_alcohol) {
    notes.push(
      "Alcohol service requires a separate state license and typically adds 8–12 weeks — apply early."
    );
  }
  if (facts.serves_food) {
    notes.push(
      "Schedule your pre-opening health inspection as soon as the build-out is fixed — it gates the food license."
    );
  }
  if (permits.some((p) => p.permitSlug === "certificate-of-occupancy")) {
    notes.push(
      "A Certificate of Occupancy may already be in place if the space was previously the same use — confirm before re-applying."
    );
  }
  if (Number(facts.employee_count) > 0) {
    notes.push(
      "Register for withholding, unemployment and workers' comp before your first payroll run."
    );
  }
  return notes.slice(0, 4);
}

export function assembleRecord(
  input: BusinessInput,
  facts: FactSet,
  stack: Jurisdiction[],
  permits: PermitRequirement[]
): Omit<ComplianceRecord, "id" | "businessId" | "createdAt"> {
  const jurisdictionLabel = label(stack);
  const items: RecordItem[] = permits.map((p) => ({
    id: p.requirementId,
    recordId: "",
    permitTypeId: p.permitTypeId,
    requirementId: p.requirementId,
    jurisdictionId: p.jurisdiction.id,
    name: p.name,
    authority: p.authority,
    level: p.jurisdiction.level,
    cost: p.cost,
    time: p.time,
    renewal: p.renewal,
    description: DESCRIPTIONS[p.permitSlug] ?? "",
    requirements: CHECKLIST[p.permitSlug] ?? [],
    confidence: p.confidence,
    filingUrl: p.filingUrl,
    lastVerifiedAt: p.lastVerifiedAt,
    reviewStatus: p.confidence === "confirmed" ? "auto_approved" : "pending",
  }));

  const subject = [input.businessType, jurisdictionLabel].filter(Boolean).join(" — ");
  const status = items.some((i) => i.reviewStatus === "pending") ? "in_review" : "ready";

  return {
    status,
    tier: "discover",
    summary: `${subject}${input.sells ? ` (${input.sells})` : ""}`,
    jurisdictionLabel,
    estimatedCost: sumCost(items),
    estimatedTimeline: items.length > 6 ? "8–14 weeks" : "4–8 weeks",
    items,
    notes: notesFor(facts, permits),
    clarifications: [],
  };
}
