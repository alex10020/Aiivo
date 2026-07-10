/* =============================================================================
   Facts — the controlled discovery vocabulary the engine consumes.
   In production the wizard sets these directly (typed, no guessing). The
   `factsFromClassification` bridge only exists for shadow mode, so the
   deterministic engine can be diffed against the current fuzzy retriever on the
   exact same inputs.
   ========================================================================== */
import type { Classification } from "../types";
import type { FactSet } from "./types";

export interface CanonicalFacts {
  // corporate / federal
  entity_type:
    | "sole_prop"
    | "partnership"
    | "llc"
    | "s_corp"
    | "c_corp"
    | "nonprofit"
    | "not_formed";
  is_employer: boolean;
  // location / zoning
  location_type: "commercial" | "home_based" | "mobile" | "online_only";
  new_buildout: boolean;
  installs_signage: boolean;
  // operations / industry
  serves_food: boolean;
  food_service_type: "full_service" | "limited" | "prepackaged" | "mobile_food" | "none";
  serves_alcohol: boolean;
  alcohol_type: "beer_wine" | "spirits" | "off_premise" | "none";
  sells_taxable_goods: boolean;
  seating: number;
  outdoor_seating: boolean;
  // employment
  employee_count: number;
}

/** SHADOW-ONLY bridge: derive facts from the current classifier output. */
export function factsFromClassification(c: Classification): FactSet {
  const tr = new Set(c.triggers);
  const naics = c.naics ?? [];
  return {
    serves_food: tr.has("food") || naics.some((n) => n.startsWith("722")),
    sells_taxable_goods: tr.has("retail") || naics.some((n) => n === "44" || n === "45"),
    serves_alcohol: tr.has("alcohol"),
    installs_signage: tr.has("signage"),
    employee_count: tr.has("employees") ? 1 : 0,
    seating: 0,
    outdoor_seating: false,
  };
}
