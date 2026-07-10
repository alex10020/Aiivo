/* =============================================================================
   Rule catalog — adapts the in-repo seed into deterministic rule rows so the
   evaluator can run in shadow mode today (no DB dependency). At cutover this is
   replaced by a Postgres query over requirements/requirement_dependencies.
   ========================================================================== */
import {
  REQUIREMENTS,
  jurisdictionById,
  permitTypeById,
  sourceById,
} from "../data/seed";
import type { AppliesTo } from "../types";
import type {
  RuleNode,
  RequirementRow,
  DependencyEdge,
  RuleCatalog,
} from "./types";

/** Map a legacy trigger token onto a canonical-fact rule node. */
const TRIGGER_FACT: Record<string, RuleNode> = {
  food: { op: "fact", key: "serves_food" },
  retail: { op: "fact", key: "sells_taxable_goods" },
  employees: { op: "gte", key: "employee_count", value: 1 },
  signage: { op: "fact", key: "installs_signage" },
  alcohol: { op: "fact", key: "serves_alcohol" },
  seating: { op: "gte", key: "seating", value: 1 },
  outdoor: { op: "fact", key: "outdoor_seating" },
};

/** Convert a fuzzy applies_to into a deterministic condition (OR = any-of,
    matching the retriever's intersect semantics). */
export function appliesToCondition(a: AppliesTo): RuleNode {
  const parts: RuleNode[] = [];
  if (a.naics?.length) {
    const nn: RuleNode[] = [];
    if (a.naics.some((n) => n.startsWith("722"))) nn.push({ op: "fact", key: "serves_food" });
    if (a.naics.some((n) => n === "44" || n === "45"))
      nn.push({ op: "fact", key: "sells_taxable_goods" });
    if (nn.length) parts.push(nn.length === 1 ? nn[0] : { op: "or", nodes: nn });
  }
  for (const t of a.triggers ?? []) if (TRIGGER_FACT[t]) parts.push(TRIGGER_FACT[t]);
  if (parts.length === 0) return { op: "always" };
  if (parts.length === 1) return parts[0];
  return { op: "or", nodes: parts };
}

let cache: RuleCatalog | null = null;

export function buildCatalog(): RuleCatalog {
  if (cache) return cache;

  const requirements: RequirementRow[] = REQUIREMENTS.map((r) => {
    const pt = permitTypeById.get(r.permitTypeId);
    const j = jurisdictionById.get(r.jurisdictionId);
    const src = r.sourceId ? sourceById.get(r.sourceId) : undefined;
    return {
      id: r.id,
      permitTypeId: r.permitTypeId,
      permitSlug: pt?.slug ?? r.permitTypeId,
      permitName: pt?.name ?? r.permitTypeId,
      authority: src?.title ?? j?.name ?? "",
      jurisdictionId: r.jurisdictionId,
      jurisdictionLevel: j?.level ?? pt?.defaultLevel ?? "city",
      condition: appliesToCondition(r.appliesTo),
      supersedesRequirementId: null,
      typicalCost: r.typicalCost,
      typicalTime: r.typicalTime,
      renewal: r.renewal,
      filingUrl: r.filingUrl,
      baseConfidence: r.baseConfidence,
      lastVerifiedAt: r.lastVerifiedAt,
      active: r.active,
    };
  });

  // Dependency edges: tax/employer registrations depend on the federal EIN.
  const ein = requirements.find((r) => r.permitSlug === "ein");
  const dependencies: DependencyEdge[] = [];
  if (ein) {
    const needsEin = new Set([
      "sales-use-tax",
      "employer-withholding",
      "unemployment-insurance",
    ]);
    for (const r of requirements) {
      if (needsEin.has(r.permitSlug)) {
        dependencies.push({ requirementId: r.id, dependsOnRequirementId: ein.id });
      }
    }
  }

  cache = { requirements, dependencies };
  return cache;
}
