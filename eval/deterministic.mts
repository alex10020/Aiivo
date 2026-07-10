/* Full deterministic pipeline — offline golden test.
   discovery answers → facts → evaluatePermits → assembleRecord. No AI, no
   network. Proves the wizard→facts→record path is correct AND produces content
   (descriptions, notes) deterministically. Run: npx tsx eval/deterministic.mts
*/
import { readFileSync } from "node:fs";
import { buildCatalog } from "../lib/engine/rules/catalog";
import { evaluatePermits } from "../lib/engine/rules/evaluator";
import { assembleRecord } from "../lib/engine/rules/assemble";
import {
  seedFactsFromText,
  factsFromAnswers,
  type Answers,
} from "../lib/engine/rules/discovery";
import {
  JURISDICTIONS,
  findCityByName,
  findJurisdiction,
  jurisdictionById,
} from "../lib/engine/data/seed";
import type { Jurisdiction } from "../lib/engine/types";

interface Case {
  name: string;
  input: { business_type: string; location: string; sells?: string };
  expect?: string[];
  forbid?: string[];
}
const cases: Case[] = JSON.parse(
  readFileSync(new URL("./cases.json", import.meta.url), "utf8")
);
const catalog = buildCatalog();
const FEDERAL = JURISDICTIONS.find((j) => j.id === "us")!;

function stackFor(location: string): Jurisdiction[] {
  const parts = location.split(",").map((s) => s.trim());
  const code = (parts.at(-1) ?? "").split(/\s+/)[0]?.toUpperCase() ?? "";
  const stack = [FEDERAL];
  const state = findJurisdiction({ level: "state", stateCode: code });
  if (!state) return stack;
  stack.push(state);
  const cityName = parts.length >= 2 ? parts.at(-2)! : "";
  const city = cityName ? findCityByName(code, cityName) : undefined;
  if (city) {
    const county = city.parentId ? jurisdictionById.get(city.parentId) : undefined;
    if (county) stack.push(county);
    stack.push(city);
  }
  return stack;
}

/** Simulate the wizard: keyword pre-fill + defaults (has employees, commercial). */
function factsForCase(bt: string, sells: string) {
  const seed = seedFactsFromText(bt, sells);
  const answers: Answers = { location_type: "commercial", employee_count: "1" };
  for (const [k, v] of Object.entries(seed)) if (v) answers[k] = "true";
  return factsFromAnswers(answers);
}

let pass = 0,
  totExp = 0,
  foundExp = 0,
  totForbid = 0,
  contentOk = true;
const rows: { name: string; recall: string; permits: number; missing: string[]; violated: string[]; ok: boolean }[] = [];

for (const c of cases) {
  const stack = stackFor(c.input.location);
  const facts = factsForCase(c.input.business_type, c.input.sells ?? "");
  const permits = evaluatePermits(facts, stack, catalog);
  const record = assembleRecord(
    { businessType: c.input.business_type, location: c.input.location, sells: c.input.sells },
    facts,
    stack,
    permits
  );
  const hay = record.items.map((it) => `${it.name} ${it.authority}`.toLowerCase());
  const expect = c.expect ?? [];
  const forbid = c.forbid ?? [];
  const missing = expect.filter((e) => !hay.some((h) => h.includes(e.toLowerCase())));
  const violated = forbid.filter((f) => hay.some((h) => h.includes(f.toLowerCase())));
  // content check: every item has a description
  if (record.items.some((it) => !it.description)) contentOk = false;
  totExp += expect.length;
  foundExp += expect.length - missing.length;
  totForbid += violated.length;
  const ok = missing.length === 0 && violated.length === 0;
  if (ok) pass++;
  rows.push({ name: c.name, recall: `${expect.length - missing.length}/${expect.length}`, permits: record.items.length, missing, violated, ok });
}

console.log("\nFULL DETERMINISTIC PIPELINE — offline golden test");
console.log("=".repeat(74));
for (const r of rows) {
  const extra =
    (r.missing.length ? `  MISSING: ${r.missing.join(", ")}` : "") +
    (r.violated.length ? `  FORBIDDEN: ${r.violated.join(", ")}` : "");
  console.log(`${r.ok ? "✓" : "✗"} ${r.name.padEnd(48)} recall ${r.recall} (${r.permits})${extra}`);
}
console.log("=".repeat(74));
console.log(`Cases passed: ${pass}/${cases.length}`);
console.log(`Expected-permit recall: ${foundExp}/${totExp}`);
console.log(`Forbidden-error violations: ${totForbid}`);
console.log(`Every permit has a description: ${contentOk ? "yes" : "NO"}`);
process.exit(totForbid > 0 || pass < cases.length || !contentOk ? 1 : 0);
