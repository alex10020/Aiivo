/* =============================================================================
   AIIVO ENGINE — AUTH BOUNDARY (frozen surface)
   - requireApiKey: for the public /v1/* API (workstream H owns full impl).
   - requireUser:   for the authenticated app API (Product-UI/auth owns impl
     via @supabase/ssr cookie sessions).
   Implementations marked TODO so the security-sensitive bits get real review;
   the SHAPES are the contract and must not change.
   ========================================================================== */

import { createHash } from "node:crypto";
import { AuthError } from "./errors";
import { serverClient } from "./supabase";
import type { UUID } from "./types";

export interface ApiContext {
  ownerId: UUID;
  apiKeyId: UUID;
  scopes: string[];
}

export interface UserContext {
  ownerId: UUID;
  email: string;
}

/** Hash a raw API key for storage/comparison. Keys are stored hashed, never raw. */
export function hashApiKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Validate the `x-api-key` header against the api_keys table.
 * TODO(H): constant-time compare, rate-limit lookup, last_used_at touch,
 * and revoked_at / scope enforcement. Shape is final.
 */
export async function requireApiKey(req: Request): Promise<ApiContext> {
  const raw = req.headers.get("x-api-key") ?? bearer(req);
  if (!raw) throw new AuthError("Missing API key");

  const db = serverClient();
  const { data, error } = await db
    .from("api_keys")
    .select("id, owner_id, scopes, revoked_at")
    .eq("key_hash", hashApiKey(raw))
    .is("revoked_at", null)
    .maybeSingle();

  if (error || !data) throw new AuthError("Invalid API key");
  return { ownerId: data.owner_id, apiKeyId: data.id, scopes: data.scopes ?? [] };
}

/**
 * Resolve the signed-in user for the app API via the @supabase/ssr cookie
 * session. Throws AuthError when unauthenticated or auth is unconfigured.
 */
export async function requireUser(_req: Request): Promise<UserContext> {
  const { currentUser } = await import("./session");
  const user = await currentUser();
  if (!user) throw new AuthError("Sign in required");
  return { ownerId: user.id, email: user.email ?? "" };
}

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization");
  return h?.toLowerCase().startsWith("bearer ") ? h.slice(7) : null;
}
