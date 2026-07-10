/* =============================================================================
   DISCOVERY TREE — the deterministic front-end.
   Structured questions that set CanonicalFacts directly. Replaces the Claude
   classifier + clarify step: no probabilistic inference feeds the engine.
   Keyword pre-fill only *suggests* defaults the user confirms; nothing is
   inferred silently.
   ========================================================================== */
import type { FactSet } from "./types";

export type QuestionType = "boolean" | "single" | "number-select";

export interface DiscoveryOption {
  value: string; // stored as-is; numbers coerced in factsFromAnswers
  label: string;
}

export interface DiscoveryQuestion {
  fact: string; // the CanonicalFacts key it sets
  stage: "corporate" | "location" | "operations" | "employment";
  label: string;
  help?: string;
  type: QuestionType;
  options?: DiscoveryOption[];
  /** Only shown when this predicate over the current answers is true. */
  showIf?: (a: Answers) => boolean;
}

export type Answers = Record<string, string>;

const yes = (a: Answers, k: string) => a[k] === "true";

export const DISCOVERY: DiscoveryQuestion[] = [
  // ---- corporate ----
  {
    fact: "entity_type",
    stage: "corporate",
    label: "How is the business structured?",
    type: "single",
    options: [
      { value: "llc", label: "LLC" },
      { value: "c_corp", label: "Corporation" },
      { value: "s_corp", label: "S-Corp" },
      { value: "sole_prop", label: "Sole proprietorship" },
      { value: "partnership", label: "Partnership" },
      { value: "nonprofit", label: "Nonprofit" },
      { value: "not_formed", label: "Not formed yet" },
    ],
  },
  // ---- location ----
  {
    fact: "location_type",
    stage: "location",
    label: "Where will you operate?",
    type: "single",
    options: [
      { value: "commercial", label: "A commercial space" },
      { value: "home_based", label: "From home" },
      { value: "mobile", label: "Mobile / no fixed location" },
      { value: "online_only", label: "Online only" },
    ],
  },
  {
    fact: "new_buildout",
    stage: "location",
    label: "Is this a new build-out or a change of use?",
    help: "Determines whether a Certificate of Occupancy applies.",
    type: "boolean",
    showIf: (a) => a.location_type === "commercial",
  },
  {
    fact: "installs_signage",
    stage: "location",
    label: "Will you install exterior signage?",
    type: "boolean",
    showIf: (a) => a.location_type === "commercial",
  },
  // ---- operations ----
  {
    fact: "serves_food",
    stage: "operations",
    label: "Do you prepare or serve food?",
    type: "boolean",
  },
  {
    fact: "food_service_type",
    stage: "operations",
    label: "What kind of food service?",
    type: "single",
    showIf: (a) => yes(a, "serves_food"),
    options: [
      { value: "full_service", label: "Full-service kitchen" },
      { value: "limited", label: "Limited prep / counter" },
      { value: "prepackaged", label: "Prepackaged only" },
      { value: "mobile_food", label: "Mobile / truck" },
    ],
  },
  {
    fact: "seating",
    stage: "operations",
    label: "How many seats?",
    type: "number-select",
    showIf: (a) => yes(a, "serves_food"),
    options: [
      { value: "0", label: "No seating (to-go)" },
      { value: "1", label: "1–49" },
      { value: "50", label: "50–99" },
      { value: "100", label: "100+" },
    ],
  },
  {
    fact: "outdoor_seating",
    stage: "operations",
    label: "Outdoor / sidewalk seating?",
    type: "boolean",
    showIf: (a) => yes(a, "serves_food"),
  },
  {
    fact: "serves_alcohol",
    stage: "operations",
    label: "Will you sell or serve alcohol?",
    type: "boolean",
  },
  {
    fact: "alcohol_type",
    stage: "operations",
    label: "What will you serve?",
    type: "single",
    showIf: (a) => yes(a, "serves_alcohol"),
    options: [
      { value: "beer_wine", label: "Beer & wine" },
      { value: "spirits", label: "Full spirits" },
      { value: "off_premise", label: "To-go / off-premise" },
    ],
  },
  {
    fact: "sells_taxable_goods",
    stage: "operations",
    label: "Will you sell taxable goods (retail)?",
    type: "boolean",
  },
  // ---- employment ----
  {
    fact: "employee_count",
    stage: "employment",
    label: "How many employees?",
    help: "Drives workers' comp, unemployment and withholding.",
    type: "number-select",
    options: [
      { value: "0", label: "None — owner-operated" },
      { value: "1", label: "1–4" },
      { value: "5", label: "5–19" },
      { value: "20", label: "20–49" },
      { value: "50", label: "50+" },
    ],
  },
];

/** Deterministic keyword pre-fill — SUGGESTS booleans from the free-text intake.
    Never the final word: the wizard shows these pre-checked and editable. */
export function seedFactsFromText(
  businessType: string,
  sells: string
): Partial<Record<string, boolean>> {
  const t = `${businessType} ${sells ?? ""}`.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  return {
    serves_food: has("coffee","cafe","café","restaurant","food","bakery","pastr","kitchen","truck","bar","deli","ice cream","sandwich","taco","brewery","taproom","bodega","grocery","cheesesteak","pizza","catering"),
    serves_alcohol: has("alcohol","beer","wine","liquor","spirits","brewery","taproom","cocktail","pub"),
    sells_taxable_goods: has("salon","shop","store","retail","boutique","market","clothing","apparel","goods","merch"),
    installs_signage: has("storefront","sign"),
  };
}

/** Normalise the wizard's string answers into a complete, typed FactSet. */
export function factsFromAnswers(a: Answers): FactSet {
  const bool = (k: string) => a[k] === "true";
  const num = (k: string) => (a[k] ? Number(a[k]) : 0);
  const employee_count = num("employee_count");
  return {
    entity_type: a.entity_type ?? "not_formed",
    is_employer: employee_count > 0,
    location_type: a.location_type ?? "commercial",
    new_buildout: bool("new_buildout"),
    installs_signage: bool("installs_signage"),
    serves_food: bool("serves_food"),
    food_service_type: a.food_service_type ?? "none",
    serves_alcohol: bool("serves_alcohol"),
    alcohol_type: a.alcohol_type ?? "none",
    sells_taxable_goods: bool("sells_taxable_goods"),
    seating: num("seating"),
    outdoor_seating: bool("outdoor_seating"),
    employee_count,
  };
}

/** Questions to render given the answers so far (applies showIf branching). */
export function visibleQuestions(a: Answers): DiscoveryQuestion[] {
  return DISCOVERY.filter((q) => !q.showIf || q.showIf(a));
}
