/* =============================================================================
   AIIVO ENGINE — SHARED CONTRACT (frozen)
   Every workstream codes against these types and the service interfaces at the
   bottom. Do not change shapes without bumping the contract and telling owners.
   Mirrors supabase/migrations/0001_engine_init.sql.
   ========================================================================== */

/* ----------------------------------- enums -------------------------------- */
export type JurisdictionLevel =
  | "federal"
  | "state"
  | "county"
  | "city"
  | "special";

/** Confidence per the design contract: confirmed=seal, likely=gold, verify=stamp. */
export type Confidence = "confirmed" | "likely_required" | "verify";

export type RecordStatus =
  | "draft"
  | "scanning"
  | "in_review"
  | "ready"
  | "failed";

export type ReviewStatus =
  | "auto_approved"
  | "pending"
  | "approved"
  | "edited"
  | "rejected";

export type FilingStatus =
  | "queued"
  | "prefilled"
  | "needs_info"
  | "submitted"
  | "approved"
  | "rejected";

export type Tier = "discover" | "report" | "file" | "monitor";

export type MonitorType = "requirement_change" | "renewal";

export type SourceKind =
  | "statute"
  | "agency_page"
  | "form"
  | "fee_schedule"
  | "dataset";

/* --------------------------------- entities ------------------------------- */
/** ISO-8601 timestamp string. */
export type Timestamp = string;
export type UUID = string;

export interface Jurisdiction {
  id: UUID;
  level: JurisdictionLevel;
  name: string;
  parentId: UUID | null;
  stateCode: string | null; // "TX"
  countyFips: string | null; // "48453"
  placeFips: string | null; // "4805000"
  officialUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** A license/permit kind in the catalog (300+ types). */
export interface PermitType {
  id: UUID;
  slug: string; // "retail-food-establishment"
  name: string;
  description: string;
  defaultLevel: JurisdictionLevel;
  naics: string[]; // industries this commonly applies to
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Provenance for a requirement — a real, dated government source. */
export interface Source {
  id: UUID;
  jurisdictionId: UUID;
  url: string;
  title: string;
  kind: SourceKind;
  hash: string; // content hash for change detection
  fetchedAt: Timestamp;
  verifiedAt: Timestamp | null;
  contentRef: string | null; // storage path to the captured document
}

/** The rule that links a permit type to a jurisdiction + matching conditions. */
export interface Requirement {
  id: UUID;
  permitTypeId: UUID;
  jurisdictionId: UUID;
  appliesTo: AppliesTo;
  typicalCost: string; // "$450" or "$275–$475"
  typicalTime: string; // "2–3 weeks"
  renewal: string; // "Annual"
  filingUrl: string | null;
  baseConfidence: Confidence;
  sourceId: UUID | null;
  lastVerifiedAt: Timestamp;
  active: boolean;
}

/** Matching predicate for a requirement. Empty = applies broadly at its level. */
export interface AppliesTo {
  naics?: string[]; // any-of industry codes
  triggers?: string[]; // any-of: "alcohol","employees","food","signage","seating"
  notes?: string;
}

/* ----------------------------- business + record -------------------------- */
export interface BusinessInput {
  businessType: string;
  location: string;
  sells?: string;
}

export interface JurisdictionResolution {
  input: string;
  formatted?: string;
  lat?: number;
  lng?: number;
  jurisdictions: Jurisdiction[]; // the federal→…→city stack
}

export interface Classification {
  naics: string[];
  triggers: string[];
  confidence: number; // 0..1
}

export interface Business {
  id: UUID;
  ownerId: UUID | null; // null for anonymous Discover lookups
  name: string | null;
  businessType: string;
  sells: string | null;
  naics: string[];
  address: string;
  resolution: JurisdictionResolution;
  triggers: Record<string, string | string[]>;
  createdAt: Timestamp;
}

export interface Clarification {
  question: string;
  answer: string;
}

export interface ClarifyQuestion {
  id: string;
  question: string;
  help: string;
  multiple: boolean;
  options: string[];
}

export interface RecordItem {
  id: UUID;
  recordId: UUID;
  permitTypeId: UUID | null;
  requirementId: UUID | null;
  jurisdictionId: UUID | null;
  name: string;
  authority: string;
  level: JurisdictionLevel;
  cost: string;
  time: string;
  renewal: string;
  description: string;
  requirements: string[];
  confidence: Confidence;
  filingUrl: string | null;
  lastVerifiedAt: Timestamp | null;
  reviewStatus: ReviewStatus;
}

export interface ComplianceRecord {
  id: UUID;
  businessId: UUID;
  status: RecordStatus;
  tier: Tier;
  summary: string;
  jurisdictionLabel: string;
  estimatedCost: string;
  estimatedTimeline: string;
  items: RecordItem[];
  notes: string[];
  clarifications: Clarification[];
  createdAt: Timestamp;
  /** Capability token for the read-only share/print report at /r/<token>.
      Optional: additive to the v1 contract (migration 0003). */
  shareToken?: string | null;
}

/* ------------------------------ ops + lifecycle --------------------------- */
export interface ReviewItem {
  id: UUID;
  recordItemId: UUID;
  reason: string; // "confidence<0.9" | "source>90d" | "filing_precheck"
  status: ReviewStatus;
  reviewerId: UUID | null;
  notes: string | null;
  createdAt: Timestamp;
  resolvedAt: Timestamp | null;
}

export interface Filing {
  id: UUID;
  recordItemId: UUID;
  businessId: UUID;
  status: FilingStatus;
  portal: string | null;
  externalRef: string | null;
  submittedAt: Timestamp | null;
  lastStatusAt: Timestamp;
  payload: Record<string, unknown>;
  audit: Array<{ at: Timestamp; actor: string; event: string }>;
}

export interface Monitor {
  id: UUID;
  businessId: UUID | null;
  recordId: UUID | null;
  type: MonitorType;
  requirementId: UUID | null;
  nextCheckAt: Timestamp;
  lastCheckedAt: Timestamp | null;
  active: boolean;
}

export interface Renewal {
  id: UUID;
  recordItemId: UUID | null;
  filingId: UUID | null;
  dueAt: Timestamp;
  remindedAt: Timestamp | null;
  auto: boolean;
  status: "upcoming" | "reminded" | "filed" | "lapsed";
}

/* ------------------------------ accounts + api ---------------------------- */
export interface Profile {
  id: UUID; // = auth.users.id
  email: string;
  name: string | null;
  createdAt: Timestamp;
}

export interface Subscription {
  id: UUID;
  ownerId: UUID;
  stripeCustomerId: string;
  stripeSubId: string | null;
  tier: Tier;
  status: "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd: Timestamp | null;
}

export interface ApiKey {
  id: UUID;
  ownerId: UUID;
  name: string;
  prefix: string; // public, shown in dashboard ("aiv_live_ab12")
  scopes: string[];
  rateLimitPerMin: number;
  createdAt: Timestamp;
  lastUsedAt: Timestamp | null;
  revokedAt: Timestamp | null;
}

export interface UsageEvent {
  id: UUID;
  apiKeyId: UUID;
  endpoint: string;
  units: number;
  costCents: number;
  createdAt: Timestamp;
}

/* =============================================================================
   SERVICE INTERFACES — the seams between workstreams.
   Each workstream implements one (or more) of these; everyone else depends on
   the interface, never the implementation. This is what makes the build
   parallelizable.
   ========================================================================== */

/** [B] address → the federal/state/county/city stack. */
export interface Geocoder {
  resolve(address: string): Promise<JurisdictionResolution>;
}

/** [B] free-text business → NAICS codes + trigger flags. */
export interface BusinessClassifier {
  classify(input: BusinessInput): Promise<Classification>;
}

export interface MatchContext {
  resolution: JurisdictionResolution;
  classification: Classification;
  clarifications: Clarification[];
}

/** [A→C] pull the applicable requirement rules from the data layer. */
export interface RequirementRetriever {
  retrieve(ctx: MatchContext): Promise<Requirement[]>;
}

/** [C] grounded AI: questions + record assembly over retrieved requirements. */
export interface InterpretationEngine {
  clarify(input: BusinessInput): Promise<ClarifyQuestion[]>;
  buildRecord(
    input: BusinessInput,
    ctx: MatchContext,
    requirements: Requirement[]
  ): Promise<Omit<ComplianceRecord, "id" | "businessId" | "createdAt">>;
}

/** [C] per-item confidence + whether it must go to human review. */
export interface ConfidenceScorer {
  score(
    item: RecordItem,
    requirement: Requirement | null
  ): { confidence: Confidence; needsReview: boolean; reason?: string };
}

/** [E] one filing connector per portal/jurisdiction family. */
export interface FilingProvider {
  readonly key: string;
  handles(item: RecordItem): boolean;
  prefill(item: RecordItem, business: Business): Promise<Record<string, unknown>>;
  submit(item: RecordItem, business: Business): Promise<Filing>;
  status(filing: Filing): Promise<FilingStatus>;
}

/** [G] Stripe-backed tiers + metered API. */
export interface BillingService {
  checkout(ownerId: UUID, tier: Tier, recordId?: UUID): Promise<{ url: string }>;
  entitlements(ownerId: UUID): Promise<Tier[]>;
  meter(apiKeyId: UUID, endpoint: string, units: number): Promise<void>;
}
