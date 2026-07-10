/* [C] The pipeline: input → resolve → classify → retrieve → interpret. */
import type {
  Clarification,
  ClarifyQuestion,
  ComplianceRecord,
  BusinessInput,
  Requirement,
} from "../types";
import { geocoder } from "../resolve/geocoder";
import { classifier } from "../resolve/classifier";
import { retriever } from "../data/retriever";
import { ruleRetriever } from "../data/rule-retriever";
import { engine } from "./engine";
import { buildCatalog } from "../rules/catalog";
import { evaluatePermits } from "../rules/evaluator";
import { factsFromClassification } from "../rules/facts";
import type { MatchContext } from "../types";

export async function runLookup(
  input: BusinessInput,
  clarifications: Clarification[] = []
): Promise<ComplianceRecord> {
  const [resolution, classification] = await Promise.all([
    geocoder.resolve(input.location),
    classifier.classify(input),
  ]);
  const ctx = { resolution, classification, clarifications };
  // AIIVO_RULES=1 serves from the deterministic engine; default = legacy retriever.
  const active = process.env.AIIVO_RULES === "1" ? ruleRetriever : retriever;
  const requirements = await active.retrieve(ctx);
  // Shadow diff is meaningful while legacy is active (compares it to the engine).
  if (process.env.AIIVO_SHADOW) shadowDiff(ctx, requirements);
  const draft = await engine.buildRecord(input, ctx, requirements);
  return {
    id: "",
    businessId: "",
    createdAt: new Date().toISOString(),
    ...draft,
  };
}

export function clarifyFor(input: BusinessInput): Promise<ClarifyQuestion[]> {
  return engine.clarify(input);
}

/* Shadow mode (AIIVO_SHADOW=1): run the deterministic engine beside the fuzzy
   retriever and log a structured diff. Never affects the response; never throws. */
function shadowDiff(ctx: MatchContext, retrieved: Requirement[]): void {
  try {
    const facts = factsFromClassification(ctx.classification);
    const det = evaluatePermits(facts, ctx.resolution.jurisdictions, buildCatalog());
    const key = (permitTypeId: string, jurisdictionId: string) =>
      `${permitTypeId}@${jurisdictionId}`;
    const a = new Set(retrieved.map((r) => key(r.permitTypeId, r.jurisdictionId)));
    const b = new Set(det.map((r) => key(r.permitTypeId, r.jurisdiction.id)));
    const onlyRetriever = [...a].filter((k) => !b.has(k));
    const onlyEngine = [...b].filter((k) => !a.has(k));
    console.log(
      JSON.stringify({
        aiivo_shadow: true,
        location: ctx.resolution.input,
        match: onlyRetriever.length === 0 && onlyEngine.length === 0,
        retriever_count: a.size,
        engine_count: b.size,
        only_retriever: onlyRetriever,
        only_engine: onlyEngine,
      })
    );
  } catch (e) {
    console.warn("[aiivo] shadow diff failed:", (e as Error).message);
  }
}
