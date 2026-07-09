/* =============================================================================
   AIIVO ENGINE — HTTP API CONTRACTS (frozen)
   Request/response DTOs for the internal app API and the public v1 API.
   Route handlers (owned by workstreams) must satisfy these shapes.
   ========================================================================== */

import type {
  ClarifyQuestion,
  Clarification,
  ComplianceRecord,
  Confidence,
  JurisdictionLevel,
  Tier,
} from "./types";

/* ------------------------- public API: POST /v1/permits ------------------- */
export interface PermitLookupRequest {
  business_type: string;
  location: string;
  sells?: string;
  clarifications?: Clarification[];
}

export interface PermitLookupResponse {
  business_summary: string;
  jurisdiction: string;
  total_permits: number;
  estimated_total_cost: string;
  estimated_timeline: string;
  permits: PermitDTO[];
  notes: string[];
  /** present when the record was persisted (authed/paid contexts) */
  record_id?: string;
}

export interface PermitDTO {
  name: string;
  issuing_authority: string;
  level: JurisdictionLevel;
  estimated_cost: string;
  processing_time: string;
  renewal: string;
  description: string;
  requirements: string[];
  confidence: Confidence;
  url: string;
  last_verified?: string;
}

/* ------------------------- public API: POST /v1/clarify ------------------- */
export interface ClarifyRequest {
  business_type: string;
  location: string;
  sells?: string;
}
export interface ClarifyResponse {
  questions: ClarifyQuestion[];
}

/* ------------------------------ internal app API -------------------------- */
export interface CreateRecordRequest {
  business_type: string;
  location: string;
  sells?: string;
  clarifications?: Clarification[];
  tier?: Tier;
}
export type RecordResponse = ComplianceRecord;

export interface CheckoutRequest {
  tier: Tier;
  record_id?: string;
}
export interface CheckoutResponse {
  url: string;
}

/* -------------------------------- error shape ----------------------------- */
export interface ApiErrorBody {
  error: { code: string; message: string };
}

/* ------------------------------ endpoint catalog -------------------------- */
/** Single source of truth for who owns which route. Stubs return 501. */
export const ENDPOINTS = {
  // [C] interpretation
  "POST /v1/permits": "C",
  "POST /v1/clarify": "C",
  "POST /api/records": "C",
  "GET /api/records/:id": "C",
  // [B] resolution (internal helpers, usually called by C)
  "POST /api/resolve": "B",
  "POST /api/classify": "B",
  // [D] review console
  "GET /api/review": "D",
  "POST /api/review/:id": "D",
  // [E] filing
  "POST /api/filings": "E",
  "GET /api/filings/:id": "E",
  // [F] monitoring
  "POST /api/monitors": "F",
  // [G] billing
  "POST /api/checkout": "G",
  "POST /api/stripe/webhook": "G",
  // [H] public API platform
  "POST /api/keys": "H",
  "GET /api/usage": "H",
} as const;

export type EndpointKey = keyof typeof ENDPOINTS;
