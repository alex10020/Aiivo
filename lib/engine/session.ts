/* =============================================================================
   [I] AUTH SESSIONS — cookie-based Supabase sessions for the app (server side).
   Uses @supabase/ssr + next/headers. Safe without Supabase env: helpers return
   null/false instead of throwing, so pages can degrade to a "connect Supabase"
   notice.
   ========================================================================== */

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export function hasAuth(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Server component / route-handler client bound to the request cookies. */
export async function sessionClient(): Promise<SupabaseClient | null> {
  if (!hasAuth()) return null;
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(all: { name: string; value: string; options: CookieOptions }[]) {
          try {
            for (const { name, value, options } of all) {
              store.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — middleware refreshes instead.
          }
        },
      },
    }
  );
}

/** The signed-in user, or null (no env, no session, or expired). */
export async function currentUser(): Promise<User | null> {
  const db = await sessionClient();
  if (!db) return null;
  const { data } = await db.auth.getUser();
  return data.user ?? null;
}
