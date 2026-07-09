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

/** Convert any thrown value into a uniform { status, body } pair for a Response.
    Also the central error-telemetry choke point: every server error is logged
    as one structured JSON line, which Vercel's log pipeline (and any future
    log drain / Sentry forwarder) can filter on `aiivo_error`. */
export function toHttp(err: unknown): { status: number; body: ApiErrorBody } {
  const out =
    err instanceof EngineError
      ? { status: err.status, body: { error: { code: err.code, message: err.message } } }
      : {
          status: 500,
          body: {
            error: {
              code: "internal_error",
              message: err instanceof Error ? err.message : "Internal error",
            },
          },
        };

  // 5xx = our fault → error; 4xx = caller's → warn (still visible, less noisy)
  const line = JSON.stringify({
    aiivo_error: true,
    code: out.body.error.code,
    status: out.status,
    message: out.body.error.message,
    stack: err instanceof Error && out.status >= 500 ? err.stack : undefined,
    at: new Date().toISOString(),
  });
  if (out.status >= 500) console.error(line);
  else console.warn(line);

  return out;
}
