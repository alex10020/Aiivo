/* =============================================================================
   DETERMINISTIC RULE ENGINE — contract.
   Every requirement's applicability is a boolean AST over a controlled fact
   vocabulary. No regex, no string intersection, no model. Same facts + same
   location ⇒ identical output.
   ========================================================================== */
import type { Confidence, Jurisdiction, JurisdictionLevel } from "../types";

export type FactValue = boolean | string | number;
export type FactSet = Record<string, FactValue>;

/** Closed operator set. Adding an op is a deliberate, reviewable change. */
export type RuleNode =
  | { op: "always" }
  | { op: "fact"; key: string } // boolean fact === true
  | { op: "eq" | "neq"; key: string; value: FactValue }
  | { op: "in"; key: string; values: FactValue[] }
  | { op: "gte" | "lte"; key: string; value: number }
  | { op: "and" | "or"; nodes: RuleNode[] }
  | { op: "not"; node: RuleNode };

/** A requirement hydrated with the fields the evaluator + ordering need. */
export interface RequirementRow {
  id: string;
  permitTypeId: string;
  permitSlug: string;
  permitName: string;
  authority: string;
  jurisdictionId: string;
  jurisdictionLevel: JurisdictionLevel;
  condition: RuleNode;
  supersedesRequirementId: string | null;
  typicalCost: string;
  typicalTime: string;
  renewal: string;
  filingUrl: string | null;
  baseConfidence: Confidence;
  active: boolean;
}

export interface DependencyEdge {
  requirementId: string;
  dependsOnRequirementId: string;
}

export interface RuleCatalog {
  requirements: RequirementRow[];
  dependencies: DependencyEdge[];
}

/** The engine's output: an exact, ordered, conflict-free set. */
export interface PermitRequirement {
  requirementId: string;
  permitTypeId: string;
  name: string;
  authority: string;
  jurisdiction: Jurisdiction;
  cost: string;
  time: string;
  renewal: string;
  filingUrl: string | null;
  confidence: Confidence;
  dependsOn: string[];
}
