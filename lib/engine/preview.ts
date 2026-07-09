/* =============================================================================
   DASHBOARD PREVIEW MODE — dev only.
   Lets the owner see /app with realistic sample data BEFORE Supabase exists.
   Hard-gated: active only when running `next dev` AND no Supabase env is
   configured. In production builds (NODE_ENV=production) or once real auth
   keys exist, this is dead code — /app goes back to the auth guard.
   ========================================================================== */

import type { ComplianceRecord } from "./types";
import type { RecordSummary } from "./store";

export function previewEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

export const PREVIEW_USER = {
  email: "preview@aiivo.ai",
  memberSince: "July 2026",
};

const V = "2026-06-01T00:00:00Z";

export const PREVIEW_RECORD: ComplianceRecord = {
  id: "preview-austin-coffee",
  businessId: "preview-biz",
  status: "ready",
  tier: "discover",
  summary: "Coffee shop — Austin, TX (coffee, pastries, beer & wine)",
  jurisdictionLabel: "Austin, Texas (Travis County)",
  estimatedCost: "$1,240–$1,355",
  estimatedTimeline: "6–10 weeks",
  createdAt: "2026-07-06T15:30:00Z",
  clarifications: [
    { question: "Will you have employees?", answer: "Yes" },
    { question: "Is this a new build-out or an existing space?", answer: "Existing same-use space" },
  ],
  notes: [
    "Beer & wine service adds a TABC license with an 8–12 week lead time — apply early.",
    "The Certificate of Occupancy may already be in place for an existing café space; confirm the current CO covers your use before re-applying.",
    "Austin Public Health requires a pre-opening inspection — schedule it as soon as your build-out is fixed.",
  ],
  items: [
    { id: "pv-1", recordId: "preview-austin-coffee", permitTypeId: "ein", requirementId: "req-ein", jurisdictionId: "us", name: "Employer Identification Number (EIN)", authority: "Internal Revenue Service", level: "federal", cost: "$0", time: "Immediate (online)", renewal: "One-time", description: "Your business's federal tax ID — needed to hire, bank, and file taxes.", requirements: ["Responsible party SSN/ITIN"], confidence: "confirmed", filingUrl: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online", lastVerifiedAt: V, reviewStatus: "auto_approved" },
    { id: "pv-2", recordId: "preview-austin-coffee", permitTypeId: "sales-tax", requirementId: "req-tx-salestax", jurisdictionId: "tx", name: "Sales & Use Tax Permit", authority: "Texas Comptroller of Public Accounts", level: "state", cost: "$0", time: "2–3 weeks", renewal: "Ongoing", description: "Authorises collecting and remitting Texas sales tax.", requirements: ["EIN", "Business address"], confidence: "confirmed", filingUrl: "https://comptroller.texas.gov/taxes/permit/", lastVerifiedAt: V, reviewStatus: "auto_approved" },
    { id: "pv-3", recordId: "preview-austin-coffee", permitTypeId: "retail-food", requirementId: "req-austin-food", jurisdictionId: "tx-austin", name: "Retail Food Establishment License", authority: "Austin Public Health", level: "city", cost: "$450", time: "2–3 weeks", renewal: "Annual", description: "Required to prepare and serve food; includes the pre-opening health inspection.", requirements: ["Floor plan", "Menu", "Inspection"], confidence: "confirmed", filingUrl: "https://www.austintexas.gov/department/food-establishments", lastVerifiedAt: V, reviewStatus: "auto_approved" },
    { id: "pv-4", recordId: "preview-austin-coffee", permitTypeId: "food-manager", requirementId: "req-tx-foodmgr", jurisdictionId: "tx", name: "Certified Food Protection Manager", authority: "Texas DSHS", level: "state", cost: "$115", time: "5 days", renewal: "5 years", description: "At least one certified food manager must be on staff.", requirements: ["Accredited exam"], confidence: "confirmed", filingUrl: "https://www.dshs.texas.gov/food-handlers", lastVerifiedAt: V, reviewStatus: "auto_approved" },
    { id: "pv-5", recordId: "preview-austin-coffee", permitTypeId: "workers-comp", requirementId: "req-tx-wc", jurisdictionId: "tx", name: "Workers' Compensation Insurance", authority: "Texas Dept. of Insurance (Workers' Comp)", level: "state", cost: "Varies (private policy)", time: "1–2 weeks", renewal: "Annual", description: "Coverage for your employees — obtained through a licensed insurer.", requirements: ["Employee count", "Payroll estimate"], confidence: "likely_required", filingUrl: "https://www.tdi.texas.gov/wc/employer/index.html", lastVerifiedAt: V, reviewStatus: "pending" },
    { id: "pv-6", recordId: "preview-austin-coffee", permitTypeId: "dba", requirementId: "req-travis-dba", jurisdictionId: "tx-travis", name: "Assumed Name (DBA)", authority: "Travis County Clerk", level: "county", cost: "$24", time: "3 days", renewal: "10 years", description: "Registers your trade name with the county.", requirements: ["Owner ID"], confidence: "likely_required", filingUrl: "https://countyclerk.traviscountytx.gov/", lastVerifiedAt: V, reviewStatus: "pending" },
    { id: "pv-7", recordId: "preview-austin-coffee", permitTypeId: "cert-occ", requirementId: "req-austin-co", jurisdictionId: "tx-austin", name: "Certificate of Occupancy", authority: "Austin Development Services", level: "city", cost: "$462", time: "3–6 weeks", renewal: "One-time", description: "Needed for a new build-out or change of use — may already exist for a prior café space.", requirements: ["Lease", "Final inspection"], confidence: "verify", filingUrl: "https://www.austintexas.gov/department/development-services", lastVerifiedAt: V, reviewStatus: "pending" },
    { id: "pv-8", recordId: "preview-austin-coffee", permitTypeId: "sign", requirementId: "req-austin-sign", jurisdictionId: "tx-austin", name: "Sign Permit", authority: "Austin Development Services", level: "city", cost: "$189", time: "2 weeks", renewal: "One-time", description: "Required before installing exterior signage.", requirements: ["Sign dimensions"], confidence: "likely_required", filingUrl: "https://www.austintexas.gov/department/development-services", lastVerifiedAt: V, reviewStatus: "pending" },
  ],
};

export const PREVIEW_SUMMARIES: RecordSummary[] = [
  {
    id: PREVIEW_RECORD.id,
    summary: PREVIEW_RECORD.summary,
    jurisdictionLabel: PREVIEW_RECORD.jurisdictionLabel,
    status: PREVIEW_RECORD.status,
    estimatedCost: PREVIEW_RECORD.estimatedCost,
    itemCount: PREVIEW_RECORD.items.length,
    createdAt: PREVIEW_RECORD.createdAt,
  },
];

/* ----------------------------------------------------------------------------
   In-memory record store so the FULL lookup flow works in preview mode —
   New lookup → engine → saved record → record page — without Supabase.
   Module-level state: survives requests within one dev-server process; a
   restart clears it (fine for preview). `globalThis` guard survives HMR.
---------------------------------------------------------------------------- */
type MemStore = Map<string, ComplianceRecord>;
const g = globalThis as unknown as { __aiivoPreviewStore?: MemStore };
const mem: MemStore = (g.__aiivoPreviewStore ??= new Map());

export function previewPutRecord(
  record: Omit<ComplianceRecord, "id">
): string {
  const id = `pv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const items = record.items.map((it) => ({ ...it, recordId: id }));
  mem.set(id, { ...record, id, items });
  return id;
}

export function previewGetRecord(id: string): ComplianceRecord | null {
  if (id === PREVIEW_RECORD.id) return PREVIEW_RECORD;
  return mem.get(id) ?? null;
}

export function previewSummaries(): RecordSummary[] {
  const created = [...mem.values()]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((r) => ({
      id: r.id,
      summary: r.summary,
      jurisdictionLabel: r.jurisdictionLabel,
      status: r.status,
      estimatedCost: r.estimatedCost,
      itemCount: r.items.length,
      createdAt: r.createdAt,
    }));
  return [...created, ...PREVIEW_SUMMARIES];
}
