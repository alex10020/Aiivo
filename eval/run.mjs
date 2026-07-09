/* AIIVO ENGINE — accuracy eval.
   Runs golden cases against the live /api/v1/permits engine and reports
   expected-permit recall + forbidden-error violations (the load-bearing
   accuracy metrics). Forbidden errors are wrong-jurisdiction / over-listing
   mistakes that erode trust. Run the dev server, then: npm run eval
   (override host with AIIVO_URL=...). */
import { readFileSync } from "node:fs";

const BASE = process.env.AIIVO_URL || "http://localhost:9001";
const cases = JSON.parse(readFileSync(new URL("./cases.json", import.meta.url)));

const hay = (permits) =>
  (permits || []).map((p) => `${p.name} ${p.issuing_authority}`.toLowerCase());

const rows = [];
let totExp = 0;
let foundExp = 0;
let totForbid = 0;
let passed = 0;
let errored = 0;

for (const c of cases) {
  let d;
  try {
    const res = await fetch(`${BASE}/api/v1/permits`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(c.input),
    });
    d = await res.json();
  } catch (e) {
    rows.push({ name: c.name, error: String(e) });
    errored++;
    continue;
  }
  if (d.error) {
    rows.push({ name: c.name, error: JSON.stringify(d.error) });
    errored++;
    continue;
  }

  const h = hay(d.permits);
  const expects = c.expect || [];
  const forbids = c.forbid || [];
  const missing = expects.filter((e) => !h.some((x) => x.includes(e.toLowerCase())));
  const violated = forbids.filter((f) => h.some((x) => x.includes(f.toLowerCase())));

  totExp += expects.length;
  foundExp += expects.length - missing.length;
  totForbid += violated.length;
  const ok = missing.length === 0 && violated.length === 0;
  if (ok) passed++;

  rows.push({
    name: c.name,
    recall: `${expects.length - missing.length}/${expects.length}`,
    permits: (d.permits || []).length,
    missing,
    violated,
    ok,
  });
}

console.log("\nAIIVO ENGINE — accuracy eval");
console.log("=".repeat(72));
for (const r of rows) {
  if (r.error) {
    console.log(`✗ ${r.name}  —  ERROR ${r.error}`);
    continue;
  }
  const extra =
    (r.missing.length ? `  MISSING: ${r.missing.join(", ")}` : "") +
    (r.violated.length ? `  FORBIDDEN: ${r.violated.join(", ")}` : "");
  console.log(`${r.ok ? "✓" : "✗"} ${r.name.padEnd(44)} recall ${r.recall}  (${r.permits} permits)${extra}`);
}
console.log("=".repeat(72));
const recallPct = totExp ? Math.round((1000 * foundExp) / totExp) / 10 : 0;
console.log(`Cases passed:               ${passed}/${cases.length}` + (errored ? `  (${errored} errored)` : ""));
console.log(`Expected-permit recall:     ${foundExp}/${totExp} = ${recallPct}%`);
console.log(`Forbidden-error violations: ${totForbid}  (wrong-jurisdiction / over-listing)`);
console.log("");

process.exit(totForbid > 0 || passed < cases.length ? 1 : 0);
