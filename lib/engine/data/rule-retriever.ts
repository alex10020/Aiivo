/* =============================================================================
   [A→C] Deterministic RequirementRetriever — the cutover target.
   Same interface as the fuzzy retriever, but decisions come from the boolean
   rule engine instead of naics/trigger string intersection. Returns the exact
   seed Requirement objects (in dependency order) so the rest of the pipeline
   (buildRecord) is unchanged.

   Selected in orchestrate via AIIVO_RULES=1. Default remains the legacy
   retriever until the shadow diff is clean on real traffic (see README/cutover).
   ========================================================================== */
import type {
  MatchContext,
  Requirement,
  RequirementRetriever,
} from "../types";
import { REQUIREMENTS } from "./seed";
import { buildCatalog } from "../rules/catalog";
import { evaluatePermits } from "../rules/evaluator";
import { factsFromClassification } from "../rules/facts";

const byId = new Map(REQUIREMENTS.map((r) => [r.id, r]));

export class RuleRetriever implements RequirementRetriever {
  async retrieve(ctx: MatchContext): Promise<Requirement[]> {
    // Facts today are bridged from the classifier; the wizard will set them
    // directly once the 50-state discovery tree lands (fully deterministic).
    const facts = factsFromClassification(ctx.classification);
    const permits = evaluatePermits(
      facts,
      ctx.resolution.jurisdictions,
      buildCatalog()
    );
    return permits
      .map((p) => byId.get(p.requirementId))
      .filter((r): r is Requirement => Boolean(r));
  }
}

export const ruleRetriever = new RuleRetriever();
