/* Email the signed-in owner their report's share link. */
import { requireUser } from "@/lib/engine/auth";
import { getRecordOwned } from "@/lib/engine/store";
import { hasEmail, sendReportEmail } from "@/lib/engine/email";
import { clientKey, rateLimit } from "@/lib/engine/ratelimit";
import { NotFoundError, UpstreamError, toHttp } from "@/lib/engine/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = rateLimit(`email:${clientKey(req)}`, 5);
  if (!rl.ok) {
    return Response.json(
      { error: { code: "rate_limited", message: "Too many emails — try again shortly." } },
      { status: 429, headers: { "retry-after": String(rl.retryAfter) } }
    );
  }

  try {
    const user = await requireUser(req);
    const { id } = await params;
    const record = await getRecordOwned(id, user.ownerId);
    if (!record) throw new NotFoundError("Record not found");
    if (!record.shareToken) {
      throw new UpstreamError("This record has no share link yet — run migration 0003.");
    }
    if (!hasEmail()) {
      throw new UpstreamError("Email is not configured yet (RESEND_API_KEY missing).");
    }

    const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    await sendReportEmail(user.email, record, `${base}/r/${record.shareToken}`);
    return Response.json({ sent: true, to: user.email });
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
