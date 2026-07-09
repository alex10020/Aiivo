/* =============================================================================
   AIIVO ENGINE — ERRORS (frozen)
   Throw these in engine code; convert to an HTTP response at the route edge
   with `toHttp`. Keeps error shapes uniform across every workstream.
   ========================================================================== */

import type { ApiErrorBody } from "./contracts";

export class EngineError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 500
  ) {
    super(message);
    this.name = "EngineError";
  }
}

export class ValidationError extends EngineError {
  constructor(message: string) {
    super("invalid_request", message, 400);
  }
}
export class AuthError extends EngineError {
  constructor(message = "Unauthorized") {
    super("unauthorized", message, 401);
  }
}
export class ForbiddenError extends EngineError {
  constructor(message = "Forbidden") {
    super("forbidden", message, 403);
  }
}
export class NotFoundError extends EngineError {
  constructor(message = "Not found") {
    super("not_found", message, 404);
  }
}
export class RateLimitError extends EngineError {
  constructor(message = "Rate limit exceeded") {
    super("rate_limited", message, 429);
  }
}
export class UpstreamError extends EngineError {
  constructor(message = "Upstream service failed") {
    super("upstream_error", message, 502);
  }
}

/** Convert any thrown value into a uniform { status, body } pair for a Response. */
export function toHttp(err: unknown): { status: number; body: ApiErrorBody } {
  if (err instanceof EngineError) {
    return { status: err.status, body: { error: { code: err.code, message: err.message } } };
  }
  const message = err instanceof Error ? err.message : "Internal error";
  return { status: 500, body: { error: { code: "internal_error", message } } };
}
