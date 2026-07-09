/* Tiny in-process TTL cache — cuts repeat AI cost/latency on identical lookups.
   Per server instance; swap for Redis when you run multiple instances. */
type Entry = { value: unknown; exp: number };
const store = new Map<string, Entry>();
const MAX = 500;

export function cacheKey(...parts: (string | undefined)[]): string {
  return parts.map((p) => (p ?? "").trim().toLowerCase()).join("|");
}

export function cacheGet<T>(key: string): T | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (e.exp < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return e.value as T;
}

export function cacheSet(key: string, value: unknown, ttlMs = 3_600_000): void {
  if (store.size >= MAX) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key, { value, exp: Date.now() + ttlMs });
}
