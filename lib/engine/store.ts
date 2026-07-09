/* =============================================================================
   PERSISTENCE — record/business store.
   Activates automatically once Supabase env is present and the migration has
   run; until then every call is a safe no-op so the engine works key-only.
   Uses the service-role client (server only). The Data/Auth workstreams add
   owner-scoping + RLS; this is the canonical read/write path for records.
   ========================================================================== */

import { serverClient } from "./supabase";
import type {
  Business,
  BusinessInput,
  ComplianceRecord,
  Filing,
  RecordItem,
} from "./types";

export function hasStore(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/** Persist a business + record + items. Returns the record id, or null if the
    store is off or the write fails (never throws — a lookup must still return). */
export async function persistRecord(
  input: BusinessInput,
  record: ComplianceRecord,
  ownerId: string | null = null
): Promise<string | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();

    const { data: biz, error: be } = await db
      .from("businesses")
      .insert({
        owner_id: ownerId,
        business_type: input.businessType,
        sells: input.sells ?? null,
        naics: [],
        address: input.location,
        resolution: {},
        triggers: {},
      })
      .select("id")
      .single();
    if (be || !biz) throw be ?? new Error("business insert failed");

    const { data: rec, error: re } = await db
      .from("records")
      .insert({
        business_id: biz.id,
        status: record.status,
        tier: record.tier,
        summary: record.summary,
        jurisdiction_label: record.jurisdictionLabel,
        estimated_cost: record.estimatedCost,
        estimated_timeline: record.estimatedTimeline,
        notes: record.notes,
        clarifications: record.clarifications,
      })
      .select("id")
      .single();
    if (re || !rec) throw re ?? new Error("record insert failed");

    const rows = record.items.map((it) => ({
      record_id: rec.id,
      // seed ids aren't DB UUIDs yet — denormalised fields carry the data;
      // the Data workstream backfills these FKs once the catalog is in Postgres.
      permit_type_id: null,
      requirement_id: null,
      jurisdiction_id: null,
      name: it.name,
      authority: it.authority,
      level: it.level,
      cost: it.cost,
      time: it.time,
      renewal: it.renewal,
      description: it.description,
      requirements: it.requirements,
      confidence: it.confidence,
      filing_url: it.filingUrl,
      last_verified_at: it.lastVerifiedAt,
      review_status: it.reviewStatus,
    }));
    const { error: ie } = await db.from("record_items").insert(rows);
    if (ie) throw ie;

    return rec.id as string;
  } catch (err) {
    console.error("[aiivo] persistRecord failed:", err);
    return null;
  }
}

export interface RecordSummary {
  id: string;
  summary: string;
  jurisdictionLabel: string;
  status: string;
  estimatedCost: string;
  itemCount: number;
  createdAt: string;
}

/** Dashboard list: the owner's records, newest first. */
export async function listRecordsForOwner(
  ownerId: string
): Promise<RecordSummary[]> {
  if (!hasStore()) return [];
  try {
    const db = serverClient();
    const { data, error } = await db
      .from("records")
      .select(
        "id, summary, jurisdiction_label, status, estimated_cost, created_at, businesses!inner(owner_id), record_items(id)"
      )
      .eq("businesses.owner_id", ownerId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      summary: r.summary,
      jurisdictionLabel: r.jurisdiction_label,
      status: r.status,
      estimatedCost: r.estimated_cost,
      itemCount: (r.record_items ?? []).length,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("[aiivo] listRecordsForOwner failed:", err);
    return [];
  }
}

/** Fetch a record only if it belongs to this owner (anti-IDOR). */
export async function getRecordOwned(
  id: string,
  ownerId: string
): Promise<ComplianceRecord | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();
    const { data: rec } = await db
      .from("records")
      .select("*, businesses!inner(owner_id)")
      .eq("id", id)
      .eq("businesses.owner_id", ownerId)
      .maybeSingle();
    if (!rec) return null;
    const { data: items } = await db
      .from("record_items")
      .select("*")
      .eq("record_id", id);
    return mapRecord(rec, items ?? []);
  } catch (err) {
    console.error("[aiivo] getRecordOwned failed:", err);
    return null;
  }
}

/** Read a persisted record back into the domain shape. */
export async function getRecord(id: string): Promise<ComplianceRecord | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();
    const { data: rec } = await db.from("records").select("*").eq("id", id).maybeSingle();
    if (!rec) return null;
    const { data: items } = await db.from("record_items").select("*").eq("record_id", id);
    return mapRecord(rec, items ?? []);
  } catch (err) {
    console.error("[aiivo] getRecord failed:", err);
    return null;
  }
}

/** Business row → domain shape (for filing prefill). */
export async function getBusiness(id: string): Promise<Business | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();
    const { data } = await db.from("businesses").select("*").eq("id", id).maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      ownerId: data.owner_id,
      name: data.name,
      businessType: data.business_type,
      sells: data.sells,
      naics: data.naics ?? [],
      address: data.address,
      resolution: data.resolution ?? { input: data.address, jurisdictions: [] },
      triggers: data.triggers ?? {},
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("[aiivo] getBusiness failed:", err);
    return null;
  }
}

/** Persist a filing created by a FilingProvider. Returns its id. */
export async function createFiling(filing: Filing): Promise<string | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();
    const { data, error } = await db
      .from("filings")
      .insert({
        record_item_id: filing.recordItemId,
        business_id: filing.businessId,
        status: filing.status,
        portal: filing.portal,
        external_ref: filing.externalRef,
        submitted_at: filing.submittedAt,
        last_status_at: filing.lastStatusAt,
        payload: filing.payload,
        audit: filing.audit,
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("filing insert failed");
    return data.id as string;
  } catch (err) {
    console.error("[aiivo] createFiling failed:", err);
    return null;
  }
}

/** Filings for a set of record items (already ownership-checked by caller). */
export async function listFilingsForItems(itemIds: string[]): Promise<Filing[]> {
  if (!hasStore() || itemIds.length === 0) return [];
  try {
    const db = serverClient();
    const { data, error } = await db
      .from("filings")
      .select("*")
      .in("record_item_id", itemIds)
      .order("last_status_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(
      (f: any): Filing => ({
        id: f.id,
        recordItemId: f.record_item_id,
        businessId: f.business_id,
        status: f.status,
        portal: f.portal,
        externalRef: f.external_ref,
        submittedAt: f.submitted_at,
        lastStatusAt: f.last_status_at,
        payload: f.payload ?? {},
        audit: f.audit ?? [],
      })
    );
  } catch (err) {
    console.error("[aiivo] listFilingsForItems failed:", err);
    return [];
  }
}

/** Public read: fetch a record by its share token (capability URL). */
export async function getRecordByShareToken(
  token: string
): Promise<ComplianceRecord | null> {
  if (!hasStore()) return null;
  try {
    const db = serverClient();
    const { data: rec } = await db
      .from("records")
      .select("*")
      .eq("share_token", token)
      .maybeSingle();
    if (!rec) return null;
    const { data: items } = await db
      .from("record_items")
      .select("*")
      .eq("record_id", rec.id);
    return mapRecord(rec, items ?? []);
  } catch (err) {
    console.error("[aiivo] getRecordByShareToken failed:", err);
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRecord(r: any, items: any[]): ComplianceRecord {
  return {
    id: r.id,
    businessId: r.business_id,
    shareToken: r.share_token ?? null,
    status: r.status,
    tier: r.tier,
    summary: r.summary,
    jurisdictionLabel: r.jurisdiction_label,
    estimatedCost: r.estimated_cost,
    estimatedTimeline: r.estimated_timeline,
    notes: r.notes ?? [],
    clarifications: r.clarifications ?? [],
    createdAt: r.created_at,
    items: items.map(mapItem),
  };
}

function mapItem(i: any): RecordItem {
  return {
    id: i.id,
    recordId: i.record_id,
    permitTypeId: i.permit_type_id,
    requirementId: i.requirement_id,
    jurisdictionId: i.jurisdiction_id,
    name: i.name,
    authority: i.authority,
    level: i.level,
    cost: i.cost,
    time: i.time,
    renewal: i.renewal,
    description: i.description,
    requirements: i.requirements ?? [],
    confidence: i.confidence,
    filingUrl: i.filing_url,
    lastVerifiedAt: i.last_verified_at,
    reviewStatus: i.review_status,
  };
}
