/* =============================================================================
   AIIVO ENGINE — BACKGROUND JOB CONTRACT (frozen)
   The infra workstream wires a runner (Supabase cron + a `jobs` table, or
   Inngest/Trigger.dev). Producers enqueue typed jobs; consumers register
   handlers. Everyone depends on JobRunner, never the concrete backend.
   ========================================================================== */

import type { UUID } from "./types";

export type JobType =
  | "scrape_source" // [A] fetch + hash a government source
  | "reverify_requirement" // [A] re-verify a requirement >90 days old
  | "detect_changes" // [F] diff a source hash, flag changed requirements
  | "renewal_reminder" // [F] send a renewal reminder / queue auto-renew
  | "submit_filing" // [E] run a filing connector
  | "poll_filing_status" // [E] poll a portal for filing status
  | "meter_flush"; // [H] flush buffered API usage to billing

export interface JobPayloads {
  scrape_source: { sourceId: UUID };
  reverify_requirement: { requirementId: UUID };
  detect_changes: { sourceId: UUID };
  renewal_reminder: { renewalId: UUID };
  submit_filing: { filingId: UUID };
  poll_filing_status: { filingId: UUID };
  meter_flush: { apiKeyId: UUID };
}

export interface Job<T extends JobType = JobType> {
  id: UUID;
  type: T;
  payload: JobPayloads[T];
  status: "pending" | "running" | "done" | "failed";
  runAt: string;
  attempts: number;
  lastError: string | null;
}

export interface EnqueueOptions {
  runAt?: Date; // delay/schedule
  maxAttempts?: number; // default 3
}

export interface JobRunner {
  enqueue<T extends JobType>(
    type: T,
    payload: JobPayloads[T],
    opts?: EnqueueOptions
  ): Promise<UUID>;
}

export type JobHandler<T extends JobType> = (job: Job<T>) => Promise<void>;
