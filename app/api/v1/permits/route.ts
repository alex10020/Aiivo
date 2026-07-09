import { runLookup } from "@/lib/engine/interpret/orchestrate";
import { persistRecord } from "@/lib/engine/store";
import { cacheGet, cacheKey, cacheSet } from "@/lib/engine/cache";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import { toHttp, ValidationError } from "@/lib/engine/errors";
import type {
  PermitLookupRequest,
  PermitLookupResponse,
} from "@/lib/engine/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req), 30);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many requests — slow down." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const body = (await req.json()) as PermitLookupRequest;
    const business_type = (body.business_type ?? "").trim();
    const location = (body.location ?? "").trim();
    if (!business_type || !location) {
      throw new ValidationError("business_type and location are required.");
    }
    const clarifications = Array.isArray(body.clarifications) ? body.clarifications : [];

    const key = cacheKey(
      "permits",
      business_type,
      location,
      body.sells,
      JSON.stringify(clarifications)
    );
    const cached = cacheGet<PermitLookupResponse>(key);
    if (cached) {
      return Response.json(cached, {
        headers: { "x-aiivo-cache": "hit", "x-aiivo-source": "engine" },
      });
    }

    const input = { businessType: business_type, location, sells: body.sells };
    const record = await runLookup(input, clarifications);
    const recordId = await persistRecord(input, record); // no-op until Supabase is set

    const response: PermitLookupResponse = {
      record_id: recordId ?? undefined,
      business_summary: record.summary,
      jurisdiction: record.jurisdictionLabel,
      total_permits: record.items.length,
      estimated_total_cost: record.estimatedCost,
      estimated_timeline: record.estimatedTimeline,
      notes: record.notes,
      permits: record.items.map((it) => ({
        name: it.name,
        issuing_authority: it.authority,
        level: it.level,
        estimated_cost: it.cost,
        processing_time: it.time,
        renewal: it.renewal,
        description: it.description,
        requirements: it.requirements,
        confidence: it.confidence,
        url: it.filingUrl ?? "",
        last_verified: it.lastVerifiedAt ?? undefined,
      })),
    };

    cacheSet(key, response);
    return Response.json(response, {
      headers: { "x-aiivo-cache": "miss", "x-aiivo-source": "engine" },
    });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
