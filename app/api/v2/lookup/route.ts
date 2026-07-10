/* Deterministic lookup: discovery answers + location → grounded record.
   No AI on the critical path — fast, free, reproducible. */
import { runDeterministicLookup } from "@/lib/engine/rules/deterministic";
import { factsFromAnswers } from "@/lib/engine/rules/discovery";
import { cacheGet, cacheKey, cacheSet } from "@/lib/engine/cache";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import { toHttp, ValidationError } from "@/lib/engine/errors";
import type { PermitLookupResponse } from "@/lib/engine/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req), 60);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many requests." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const body = (await req.json()) as {
      business_type?: string;
      location?: string;
      sells?: string;
      answers?: Record<string, string>;
    };
    const business_type = (body.business_type ?? "").trim();
    const location = (body.location ?? "").trim();
    if (!business_type || !location) {
      throw new ValidationError("business_type and location are required.");
    }
    const answers = body.answers ?? {};

    const key = cacheKey("v2", business_type, location, body.sells, JSON.stringify(answers));
    const cached = cacheGet<PermitLookupResponse>(key);
    if (cached) {
      return Response.json(cached, { headers: { "x-aiivo-source": "engine", "x-aiivo-cache": "hit" } });
    }

    const facts = factsFromAnswers(answers);
    const record = await runDeterministicLookup(
      { businessType: business_type, location, sells: body.sells },
      facts
    );

    const response: PermitLookupResponse = {
      business_summary: record.summary,
      jurisdiction: record.jurisdictionLabel,
      total_permits: record.items.length,
      estimated_total_cost: record.estimatedCost,
      estimated_timeline: record.estimatedTimeline,
      notes: record.notes,
      permits: record.items.map((it) => ({
        name: it.name,
        issuing_authority: it.authority,
        level: it.level === "special" ? "city" : it.level,
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
    return Response.json(response, { headers: { "x-aiivo-source": "engine", "x-aiivo-cache": "miss" } });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
