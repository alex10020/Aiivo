import { requireUser } from "@/lib/engine/auth";
import { getRecordOwned } from "@/lib/engine/store";
import { toHttp, NotFoundError } from "@/lib/engine/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(req);
    const { id } = await params;
    const record = await getRecordOwned(id, user.ownerId);
    if (!record) throw new NotFoundError("Record not found");
    return Response.json(record);
  } catch (err) {
    const { status, body } = toHttp(err);
    return Response.json(body, { status });
  }
}
