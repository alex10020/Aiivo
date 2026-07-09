/* Fixed-window per-key rate limiter (in-process). Protects the Anthropic bill
   and basic abuse. Swap for a Redis/Upstash limiter across instances. */
const windows = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const w = windows.get(key);
  if (!w || w.reset < now) {
    windows.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (w.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((w.reset - now) / 1000) };
  }
  w.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Best-effort client identity from proxy headers. */
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (
    xff?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}
