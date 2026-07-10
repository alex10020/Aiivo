/* =============================================================================
   The evaluator — pure, deterministic, no I/O, no regex.
   ========================================================================== */
import type { Jurisdiction, JurisdictionLevel } from "../types";
import type {
  FactSet,
  RuleNode,
  RequirementRow,
  DependencyEdge,
  RuleCatalog,
  PermitRequirement,
} from "./types";

const LEVEL_RANK: Record<JurisdictionLevel, number> = {
  federal: 0,
  state: 1,
  county: 2,
  city: 3,
  special: 4,
};

/** Evaluate one rule against the fact set. Missing/mistyped fact ⇒ false. */
export function evaluateRule(node: RuleNode, f: FactSet): boolean {
  switch (node.op) {
    case "always":
      return true;
    case "fact":
      return f[node.key] === true;
    case "eq":
      return f[node.key] === node.value;
    case "neq":
      return f[node.key] !== node.value;
    case "in":
      return node.values.includes(f[node.key]);
    case "gte":
      return typeof f[node.key] === "number" && (f[node.key] as number) >= node.value;
    case "lte":
      return typeof f[node.key] === "number" && (f[node.key] as number) <= node.value;
    case "and":
      return node.nodes.every((n) => evaluateRule(n, f));
    case "or":
      return node.nodes.some((n) => evaluateRule(n, f));
    case "not":
      return !evaluateRule(node.node, f);
  }
}

/** facts + resolved jurisdiction stack → exact, ordered, conflict-free permits. */
export function evaluatePermits(
  facts: FactSet,
  stack: Jurisdiction[],
  catalog: RuleCatalog
): PermitRequirement[] {
  const inStack = new Set(stack.map((j) => j.id));
  const jById = new Map(stack.map((j) => [j.id, j]));

  // 1) candidates = requirements attached to a jurisdiction in this stack
  const candidates = catalog.requirements.filter(
    (r) => r.active && inStack.has(r.jurisdictionId)
  );

  // 2) deterministic boolean match
  const matched = new Map(
    candidates.filter((r) => evaluateRule(r.condition, facts)).map((r) => [r.id, r])
  );

  // 3) supersession — a matched rule can void a specific other matched rule
  for (const r of matched.values()) {
    if (r.supersedesRequirementId) matched.delete(r.supersedesRequirementId);
  }

  // 4) prerequisite ordering (stable ⇒ identical output every run)
  return topoSort([...matched.values()], catalog.dependencies).map((r) => ({
    requirementId: r.id,
    permitTypeId: r.permitTypeId,
    permitSlug: r.permitSlug,
    name: r.permitName,
    authority: r.authority,
    jurisdiction: jById.get(r.jurisdictionId)!,
    cost: r.typicalCost,
    time: r.typicalTime,
    renewal: r.renewal,
    filingUrl: r.filingUrl,
    confidence: r.baseConfidence,
    lastVerifiedAt: r.lastVerifiedAt,
    dependsOn: catalog.dependencies
      .filter((e) => e.requirementId === r.id && matched.has(e.dependsOnRequirementId))
      .map((e) => e.dependsOnRequirementId),
  }));
}

function topoSort(reqs: RequirementRow[], edges: DependencyEdge[]): RequirementRow[] {
  const present = new Set(reqs.map((r) => r.id));
  const indeg = new Map(reqs.map((r) => [r.id, 0]));
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    if (!present.has(e.requirementId) || !present.has(e.dependsOnRequirementId)) continue;
    adj.set(e.dependsOnRequirementId, [
      ...(adj.get(e.dependsOnRequirementId) ?? []),
      e.requirementId,
    ]);
    indeg.set(e.requirementId, (indeg.get(e.requirementId) ?? 0) + 1);
  }

  // stable tie-break: jurisdiction level, then permit slug — fully deterministic
  const cmp = (a: RequirementRow, b: RequirementRow) =>
    LEVEL_RANK[a.jurisdictionLevel] - LEVEL_RANK[b.jurisdictionLevel] ||
    a.permitSlug.localeCompare(b.permitSlug);

  const byId = new Map(reqs.map((r) => [r.id, r]));
  const ready = reqs.filter((r) => indeg.get(r.id) === 0).sort(cmp);
  const out: RequirementRow[] = [];
  while (ready.length) {
    const r = ready.shift()!;
    out.push(r);
    for (const n of adj.get(r.id) ?? []) {
      indeg.set(n, (indeg.get(n) ?? 0) - 1);
      if (indeg.get(n) === 0) {
        const node = byId.get(n)!;
        const i = ready.findIndex((x) => cmp(node, x) < 0);
        if (i === -1) ready.push(node);
        else ready.splice(i, 0, node);
      }
    }
  }

  // cycle guard: append leftovers deterministically (surfaces a data bug loudly)
  if (out.length === reqs.length) return out;
  const seen = new Set(out.map((r) => r.id));
  return [...out, ...reqs.filter((r) => !seen.has(r.id)).sort(cmp)];
}
