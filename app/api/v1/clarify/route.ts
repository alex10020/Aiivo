import { clarifyFor } from "@/lib/engine/interpret/orchestrate";
import { cacheGet, cacheKey, cacheSet } from "@/lib/engine/cache";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import { toHttp, ValidationError } from "@/lib/engine/errors";
import type { ClarifyRequest, ClarifyResponse } from "@/lib/engine/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req), 30);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many requests — slow down." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const body = (await req.json()) as ClarifyRequest;
    const business_type = (body.business_type ?? "").trim();
    const location = (body.location ?? "").trim();
    if (!business_type || !location) {
      throw new ValidationError("business_type and location are required.");
    }

    const key = cacheKey("clarify", business_type, location, body.sells);
    const cached = cacheGet<ClarifyResponse>(key);
    if (cached) {
      return Response.json(cached, { headers: { "x-aiivo-cache": "hit" } });
    }

    const questions = await clarifyFor({
      businessType: business_type,
      location,
      sells: body.sells,
    });
    const response: ClarifyResponse = { questions };
    cacheSet(key, response);
    return Response.json(response, { headers: { "x-aiivo-cache": "miss" } });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
