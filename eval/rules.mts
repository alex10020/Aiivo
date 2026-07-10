/* Deterministic rule engine — offline golden test.
   Runs evaluatePermits() over the same golden cases as the live eval, but with
   ZERO network/AI: jurisdiction stack + facts are derived locally. Proves the
   new engine is correct and reproduces the retriever's decisions before cutover.
   Run:  npx tsx eval/rules.mts
*/
import { readFileSync } from "node:fs";
import { buildCatalog } from "../lib/engine/rules/catalog";
import { evaluatePermits } from "../lib/engine/rules/evaluator";
import type { FactSet } from "../lib/engine/rules/types";
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

/** "City, ST" → federal + state + county + city (from the seed, deterministic). */
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

/** Deterministic fact derivation (mirrors the heuristic classifier — no AI). */
function factsFor(businessType: string, sells: string): FactSet {
  const t = `${businessType} ${sells ?? ""}`.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  const food = has("coffee","cafe","café","restaurant","food","bakery","pastr","kitchen","truck","bar","deli","ice cream","sandwich","taco","brewery","taproom","bodega","grocery","cheesesteak");
  const retail = has("salon","shop","store","retail","boutique","market","clothing","apparel");
  return {
    serves_food: food,
    sells_taxable_goods: retail,
    serves_alcohol: has("alcohol","beer","wine","liquor","spirits","brewery","taproom"),
    installs_signage: false,
    employee_count: has("owner-operated","solo","no employees") ? 0 : 1,
    seating: 0,
    outdoor_seating: false,
  };
}

let pass = 0,
  totExp = 0,
  foundExp = 0,
  totForbid = 0;
const rows: { name: string; recall: string; permits: number; missing: string[]; violated: string[]; ok: boolean }[] = [];

for (const c of cases) {
  const stack = stackFor(c.input.location);
  const facts = factsFor(c.input.business_type, c.input.sells ?? "");
  const permits = evaluatePermits(facts, stack, catalog);
  const hay = permits.map((p) => `${p.name} ${p.authority} ${p.jurisdiction.name}`.toLowerCase());
  const expect = c.expect ?? [];
  const forbid = c.forbid ?? [];
  const missing = expect.filter((e) => !hay.some((h) => h.includes(e.toLowerCase())));
  const violated = forbid.filter((f) => hay.some((h) => h.includes(f.toLowerCase())));
  totExp += expect.length;
  foundExp += expect.length - missing.length;
  totForbid += violated.length;
  const ok = missing.length === 0 && violated.length === 0;
  if (ok) pass++;
  rows.push({ name: c.name, recall: `${expect.length - missing.length}/${expect.length}`, permits: permits.length, missing, violated, ok });
}

console.log("\nDETERMINISTIC RULE ENGINE — offline golden test");
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
process.exit(totForbid > 0 || pass < cases.length ? 1 : 0);
