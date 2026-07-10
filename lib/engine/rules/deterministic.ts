/* =============================================================================
   Fully deterministic lookup: facts + location → ComplianceRecord.
   No classifier, no clarify, no interpretation model. The only network call is
   the geocoder (a data lookup, not a probabilistic step). Same facts + address
   ⇒ byte-identical record.
   ========================================================================== */
import type { BusinessInput, ComplianceRecord } from "../types";
import { geocoder } from "../resolve/geocoder";
import { buildCatalog } from "./catalog";
import { evaluatePermits } from "./evaluator";
import { assembleRecord } from "./assemble";
import type { FactSet } from "./types";

export async function runDeterministicLookup(
  input: BusinessInput,
  facts: FactSet
): Promise<ComplianceRecord> {
  const resolution = await geocoder.resolve(input.location);
  const permits = evaluatePermits(facts, resolution.jurisdictions, buildCatalog());
  const draft = assembleRecord(input, facts, resolution.jurisdictions, permits);
  return { id: "", businessId: "", createdAt: new Date().toISOString(), ...draft };
}
