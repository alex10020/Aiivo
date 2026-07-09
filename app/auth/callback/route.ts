/* Magic-link / OAuth code exchange → session cookies → dashboard. */
import { NextResponse } from "next/server";
import { sessionClient } from "@/lib/engine/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  if (code) {
    const db = await sessionClient();
    if (db) await db.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
