/* [E] Filing API: create a filing for a record item, list a record's filings. */
import { requireUser } from "@/lib/engine/auth";
import { providerFor } from "@/lib/engine/filing/providers";
import {
  createFiling,
  getBusiness,
  getRecordOwned,
  listFilingsForItems,
} from "@/lib/engine/store";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import {
  NotFoundError,
  UpstreamError,
  ValidationError,
  toHttp,
} from "@/lib/engine/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rl = rateLimit(`filings:${clientKey(req)}`, 20);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many requests." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const user = await requireUser(req);
    const body = (await req.json()) as {
      record_id?: string;
      record_item_id?: string;
    };
    if (!body.record_id || !body.record_item_id) {
      throw new ValidationError("record_id and record_item_id are required.");
    }

    const record = await getRecordOwned(body.record_id, user.ownerId);
    if (!record) throw new NotFoundError("Record not found");
    const item = record.items.find((i) => i.id === body.record_item_id);
    if (!item) throw new NotFoundError("Record item not found");

    const business = await getBusiness(record.businessId);
    if (!business) throw new NotFoundError("Business not found");

    const provider = providerFor(item);
    const filing = await provider.submit(item, business);
    const id = await createFiling(filing);
    if (!id) throw new UpstreamError("Could not create the filing.");

    return Response.json({ ...filing, id }, { status: 201 });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireUser(req);
    const recordId = new URL(req.url).searchParams.get("record");
    if (!recordId) throw new ValidationError("record query param is required.");

    const record = await getRecordOwned(recordId, user.ownerId);
    if (!record) throw new NotFoundError("Record not found");

    const filings = await listFilingsForItems(record.items.map((i) => i.id));
    return Response.json({ filings });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
