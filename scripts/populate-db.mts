/* =============================================================================
   Populate every Supabase table for the Aiivo project.
   - Moat tables (jurisdictions, permit_types, sources, requirements): loaded
     from the real in-repo seed, string ids remapped to UUIDs with FKs kept.
   - Operational tables: representative rows tied to the existing demo account
     (filings, review_queue, subscriptions, api_keys, usage_events, monitors,
     renewals, jobs).
   Idempotent: clears the tables it owns, then re-inserts.

   Run:  SUPABASE_PAT="sbp_..." npx tsx scripts/populate-db.mts
   (Uses Supabase Management API — no service_role needed.)
   ========================================================================== */
import { randomUUID, createHash } from "node:crypto";
import {
  JURISDICTIONS,
  PERMIT_TYPES,
  SOURCES,
  REQUIREMENTS,
} from "../lib/engine/data/seed";

const PAT = process.env.SUPABASE_PAT;
const REF = "eznzjbsgtacnyshyvgua";
if (!PAT) throw new Error("SUPABASE_PAT env var required");

async function q(sql: string): Promise<any> {
  const r = await fetch(
    `https://api.supabase.com/v1/projects/${REF}/database/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${PAT}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (r.status >= 300) throw new Error(`${r.status}: ${(await r.text()).slice(0, 400)}`);
  return r.json();
}

const S = (s: unknown) =>
  s === null || s === undefined ? "null" : `'${String(s).replace(/'/g, "''")}'`;
const JB = (o: unknown) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`;
const ARR = (a: string[]) =>
  a.length ? `ARRAY[${a.map(S).join(",")}]::text[]` : `'{}'::text[]`;
const TS = (s: string | null) => (s ? S(s) : "now()");

// ---- id remaps: seed string id -> uuid ------------------------------------
const jid = new Map(JURISDICTIONS.map((j) => [j.id, randomUUID()]));
const pid = new Map(PERMIT_TYPES.map((p) => [p.id, randomUUID()]));
const sid = new Map(SOURCES.map((s) => [s.id, randomUUID()]));
const rid = new Map(REQUIREMENTS.map((r) => [r.id, randomUUID()]));
const LEVEL_RANK: Record<string, number> = { federal: 0, state: 1, county: 2, city: 3, special: 4 };

async function main() {
  console.log("clearing tables…");
  // operational (FK-safe order)
  for (const t of ["usage_events", "api_keys", "renewals", "review_queue", "filings", "monitors", "subscriptions", "jobs"])
    await q(`delete from ${t}`);
  // moat (children first)
  for (const t of ["requirements", "sources", "permit_types", "jurisdictions"])
    await q(`delete from ${t}`);

  // ---- jurisdictions (parents before children) ----------------------------
  const jr = [...JURISDICTIONS].sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]);
  await q(
    `insert into jurisdictions (id, level, name, parent_id, state_code, county_fips, place_fips, official_url) values ` +
      jr
        .map(
          (j) =>
            `(${S(jid.get(j.id))},${S(j.level)},${S(j.name)},${j.parentId ? S(jid.get(j.parentId)) : "null"},${S(j.stateCode)},${S(j.countyFips)},${S(j.placeFips)},${S(j.officialUrl)})`
        )
        .join(",")
  );
  console.log("  jurisdictions:", JURISDICTIONS.length);

  // ---- permit_types -------------------------------------------------------
  await q(
    `insert into permit_types (id, slug, name, description, default_level, naics, tags) values ` +
      PERMIT_TYPES.map(
        (p) =>
          `(${S(pid.get(p.id))},${S(p.slug)},${S(p.name)},${S(p.description)},${S(p.defaultLevel)},${ARR(p.naics)},${ARR(p.tags)})`
      ).join(",")
  );
  console.log("  permit_types:", PERMIT_TYPES.length);

  // ---- sources ------------------------------------------------------------
  await q(
    `insert into sources (id, jurisdiction_id, url, title, kind, hash, fetched_at, verified_at, content_ref) values ` +
      SOURCES.map(
        (s) =>
          `(${S(sid.get(s.id))},${S(jid.get(s.jurisdictionId))},${S(s.url)},${S(s.title)},${S(s.kind)},${S(s.hash)},${TS(s.fetchedAt)},${TS(s.verifiedAt)},${S(s.contentRef)})`
      ).join(",")
  );
  console.log("  sources:", SOURCES.length);

  // ---- requirements -------------------------------------------------------
  await q(
    `insert into requirements (id, permit_type_id, jurisdiction_id, applies_to, typical_cost, typical_time, renewal, filing_url, base_confidence, source_id, last_verified_at, active) values ` +
      REQUIREMENTS.map(
        (r) =>
          `(${S(rid.get(r.id))},${S(pid.get(r.permitTypeId))},${S(jid.get(r.jurisdictionId))},${JB(r.appliesTo)},${S(r.typicalCost)},${S(r.typicalTime)},${S(r.renewal)},${S(r.filingUrl)},${S(r.baseConfidence)},${r.sourceId ? S(sid.get(r.sourceId)) : "null"},${TS(r.lastVerifiedAt)},${r.active})`
      ).join(",")
  );
  console.log("  requirements:", REQUIREMENTS.length);

  // ---- operational rows tied to the demo account --------------------------
  const [owner] = await q(`select id from profiles order by created_at limit 1`);
  const [biz] = await q(`select id from businesses order by created_at limit 1`);
  const [rec] = await q(`select id, business_id from records order by created_at limit 1`);
  const items: any[] = await q(
    `select id, name, level, renewal, review_status, confidence from record_items where record_id = ${S(rec.id)} order by name`
  );
  if (!owner || !rec || items.length === 0) throw new Error("demo account/record not found — create it first");

  // review_queue: every non-confirmed item awaiting a reviewer
  const pending = items.filter((i) => i.review_status === "pending");
  if (pending.length) {
    await q(
      `insert into review_queue (record_item_id, reason, status) values ` +
        pending
          .map((i) => `(${S(i.id)},${S(`confidence "${i.confidence}" — below auto-approve threshold`)},'pending')`)
          .join(",")
    );
  }

  // filings: two representative filings on the record
  const ein = items.find((i) => /employer identification/i.test(i.name)) ?? items[0];
  const food = items.find((i) => /retail food/i.test(i.name)) ?? items[1] ?? items[0];
  const now = new Date().toISOString();
  const audit = (evts: string[]) =>
    evts.map((e, k) => ({ at: new Date(Date.now() - (evts.length - k) * 3600e3).toISOString(), actor: "engine", event: e }));
  await q(
    `insert into filings (record_item_id, business_id, status, portal, submitted_at, last_status_at, payload, audit) values ` +
      `(${S(ein.id)},${S(rec.business_id)},'submitted','https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',${S(now)},${S(now)},${JB({ form: "SS-4" })},${JB(audit(["prefilled from record", "customer intake completed", "submitted to IRS"]))}),` +
      `(${S(food.id)},${S(rec.business_id)},'prefilled',null,null,${S(now)},${JB({ note: "awaiting floor plan upload" })},${JB(audit(["prefilled from record"]))})`
  );

  // subscriptions: a Monitor plan
  const periodEnd = new Date(Date.now() + 30 * 864e5).toISOString();
  await q(
    `insert into subscriptions (owner_id, stripe_customer_id, stripe_sub_id, tier, status, current_period_end) values ` +
      `(${S(owner.id)},'cus_demo_aiivo','sub_demo_monitor','monitor','active',${S(periodEnd)})`
  );

  // api_keys + usage_events
  const rawKey = "aiv_live_" + randomUUID().replace(/-/g, "").slice(0, 24);
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const [apiKey] = await q(
    `insert into api_keys (owner_id, name, prefix, key_hash, scopes, rate_limit_per_min, last_used_at) values ` +
      `(${S(owner.id)},'Production key','${rawKey.slice(0, 13)}',${S(keyHash)},ARRAY['permits:read','permits:write']::text[],120,${S(now)}) returning id`
  );
  await q(
    `insert into usage_events (api_key_id, endpoint, units, cost_cents, created_at) values ` +
      Array.from({ length: 5 }, (_, k) =>
        `(${S(apiKey.id)},'/v1/permits',1,${350 + k * 25},${S(new Date(Date.now() - k * 6 * 36e5).toISOString())})`
      ).join(",")
  );

  // monitors: change-watch + renewal-watch on the record
  const next90 = new Date(Date.now() + 90 * 864e5).toISOString();
  await q(
    `insert into monitors (business_id, record_id, type, next_check_at, active) values ` +
      `(${S(rec.business_id)},${S(rec.id)},'requirement_change',${S(next90)},true),` +
      `(${S(rec.business_id)},${S(rec.id)},'renewal',${S(next90)},true)`
  );

  // renewals: for the annually-renewing items
  const annual = items.filter((i) => /annual/i.test(i.renewal));
  if (annual.length) {
    const due = new Date(Date.now() + 330 * 864e5).toISOString();
    await q(
      `insert into renewals (record_item_id, due_at, auto, status) values ` +
        annual.map((i) => `(${S(i.id)},${S(due)},false,'upcoming')`).join(",")
    );
  }

  // jobs: a couple of background jobs on real seed rows
  const someSource = [...sid.values()][0];
  const someReq = [...rid.values()][0];
  await q(
    `insert into jobs (type, payload, status, run_at) values ` +
      `('scrape_source',${JB({ sourceId: someSource })},'pending',now()),` +
      `('reverify_requirement',${JB({ requirementId: someReq })},'done',now()),` +
      `('renewal_reminder',${JB({ renewalId: randomUUID() })},'pending',${S(next90)})`
  );

  console.log("operational tables populated ✓");
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
