import { and, count, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { bookmarks } from "../../../../db/schema";
import { getSynamatrixUser } from "../../../clerk-auth";

async function state(itemKey: string, email?: string) {
  const db = getDb();
  const [totalRow] = await db.select({ value: count() }).from(bookmarks).where(eq(bookmarks.itemKey, itemKey));
  let saved = false;
  if (email) {
    const row = await db.select({ id: bookmarks.id }).from(bookmarks)
      .where(and(eq(bookmarks.itemKey, itemKey), eq(bookmarks.userEmail, email.toLowerCase())))
      .limit(1);
    saved = row.length > 0;
  }
  return { saved, count: Number(totalRow?.value || 0) };
}

function validItemKey(value: string) {
  return /^paper:[a-z0-9-]{1,100}$/.test(value);
}

export async function GET(_request: Request, { params }: { params: Promise<{ itemKey: string }> }) {
  const { itemKey } = await params;
  if (!validItemKey(itemKey)) return Response.json({ error: "无效的收藏对象" }, { status: 400 });
  const user = await getSynamatrixUser();
  return Response.json({ ...(await state(itemKey, user?.identityKey)), authenticated: Boolean(user) });
}

export async function POST(_request: Request, { params }: { params: Promise<{ itemKey: string }> }) {
  const { itemKey } = await params;
  if (!validItemKey(itemKey)) return Response.json({ error: "无效的收藏对象" }, { status: 400 });
  const user = await getSynamatrixUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  await getDb().insert(bookmarks).values({ userEmail: user.identityKey, itemKey }).onConflictDoNothing();
  return Response.json(await state(itemKey, user.identityKey));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemKey: string }> }) {
  const { itemKey } = await params;
  if (!validItemKey(itemKey)) return Response.json({ error: "无效的收藏对象" }, { status: 400 });
  const user = await getSynamatrixUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  await getDb().delete(bookmarks).where(and(eq(bookmarks.itemKey, itemKey), eq(bookmarks.userEmail, user.identityKey)));
  return Response.json(await state(itemKey, user.identityKey));
}
