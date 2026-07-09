/* Authed record creation: run the grounded lookup, persist under the owner.
   In dev preview mode (no Supabase configured) the flow still works end to
   end — records persist to the in-memory preview store instead. */
import { requireUser } from "@/lib/engine/auth";
import { runLookup } from "@/lib/engine/interpret/orchestrate";
import { hasStore, persistRecord } from "@/lib/engine/store";
import { previewEnabled, previewPutRecord } from "@/lib/engine/preview";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import { toHttp, UpstreamError, ValidationError } from "@/lib/engine/errors";
import type { CreateRecordRequest } from "@/lib/engine/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const rl = rateLimit(`records:${clientKey(req)}`, 15);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many requests." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const user = await requireUser(req);
    const body = (await req.json()) as CreateRecordRequest;
    const businessType = (body.business_type ?? "").trim();
    const location = (body.location ?? "").trim();
    if (!businessType || !location) {
      throw new ValidationError("business_type and location are required.");
    }

    const input = { businessType, location, sells: body.sells };
    const record = await runLookup(
      input,
      Array.isArray(body.clarifications) ? body.clarifications : []
    );

    if (!hasStore()) {
      throw new UpstreamError(
        "Persistence is not configured — add Supabase keys to .env.local."
      );
    }
    const id = await persistRecord(input, record, user.ownerId);
    if (!id) throw new UpstreamError("Could not save the record.");

    return Response.json({ ...record, id });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
