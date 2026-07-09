/* =============================================================================
   AIIVO ENGINE — SUPABASE CLIENTS (frozen surface)
   Env is read lazily so the module imports cleanly without secrets present.
   - serverClient(): service-role, SERVER ONLY. Bypasses RLS — never import in
     a client component.
   - anonClient(): anon key, safe for RLS-scoped reads.
   The Product-UI workstream adds cookie-based user sessions via @supabase/ssr.
   ========================================================================== */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

let _server: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

/** Service-role client. SERVER ONLY — bypasses row-level security. */
export function serverClient(): SupabaseClient {
  if (_server) return _server;
  _server = createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return _server;
}

/** Anon client — respects RLS. Safe for public, scoped reads. */
export function anonClient(): SupabaseClient {
  if (_anon) return _anon;
  _anon = createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } }
  );
  return _anon;
}
