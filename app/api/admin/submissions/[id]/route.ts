import { eq } from "drizzle-orm";
import { getSynamatrixUser } from "../../../../clerk-auth";
import { isAdminEmail } from "../../../../lib/admin";
import { getDb } from "../../../../../db";
import { submissions } from "../../../../../db/schema";

const statuses = ["pending", "approved", "rejected"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSynamatrixUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  if (!isAdminEmail(user.email)) return Response.json({ error: "没有审核权限" }, { status: 403 });

  const { id: rawId } = await params;
  const id = Number(rawId);
  const body = await request.json() as { status?: string };
  if (!Number.isInteger(id) || id <= 0 || !statuses.includes(body.status as typeof statuses[number])) {
    return Response.json({ error: "无效的审核操作" }, { status: 400 });
  }

  await getDb().update(submissions)
    .set({ status: body.status as typeof statuses[number] })
    .where(eq(submissions.id, id));
  return Response.json({ ok: true });
}
