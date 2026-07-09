/* [A] RequirementRetriever over the seed. Swap for a Postgres query later. */
import type { MatchContext, Requirement, RequirementRetriever } from "../types";
import { REQUIREMENTS } from "./seed";

function intersects(a: string[] = [], b: string[] = []): boolean {
  return a.some((x) => b.some((y) => x.startsWith(y) || y.startsWith(x)));
}

function applies(req: Requirement, ctx: MatchContext): boolean {
  const { naics, triggers } = req.appliesTo;
  const hasNaics = (naics?.length ?? 0) > 0;
  const hasTriggers = (triggers?.length ?? 0) > 0;
  if (!hasNaics && !hasTriggers) return true; // broad — applies at its level
  if (hasNaics && intersects(naics, ctx.classification.naics)) return true;
  if (hasTriggers && intersects(triggers, ctx.classification.triggers)) return true;
  return false;
}

export class SeedRetriever implements RequirementRetriever {
  async retrieve(ctx: MatchContext): Promise<Requirement[]> {
    const stack = new Set(ctx.resolution.jurisdictions.map((j) => j.id));
    return REQUIREMENTS.filter(
      (r) => r.active && stack.has(r.jurisdictionId) && applies(r, ctx)
    );
  }
}

export const retriever = new SeedRetriever();
