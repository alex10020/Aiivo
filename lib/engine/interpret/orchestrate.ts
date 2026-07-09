/* [C] The pipeline: input → resolve → classify → retrieve → interpret. */
import type {
  Clarification,
  ClarifyQuestion,
  ComplianceRecord,
  BusinessInput,
} from "../types";
import { geocoder } from "../resolve/geocoder";
import { classifier } from "../resolve/classifier";
import { retriever } from "../data/retriever";
import { engine } from "./engine";

export async function runLookup(
  input: BusinessInput,
  clarifications: Clarification[] = []
): Promise<ComplianceRecord> {
  const [resolution, classification] = await Promise.all([
    geocoder.resolve(input.location),
    classifier.classify(input),
  ]);
  const ctx = { resolution, classification, clarifications };
  const requirements = await retriever.retrieve(ctx);
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
