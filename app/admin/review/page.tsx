import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";
import { requireSynamatrixUser } from "../../clerk-auth";
import { ReviewDesk } from "../../components/review-desk";
import { isAdminEmail } from "../../lib/admin";
import { SignOutButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await requireSynamatrixUser("/admin/review");
  if (!isAdminEmail(user.email)) {
    return <main className="page-shell"><div className="empty-state"><b>此账号没有审核权限</b><p>请使用 Synamatrix 所有者邮箱登录。</p><SignOutButton redirectUrl="/sign-in"><button className="auth-action" type="button">退出当前账号</button></SignOutButton></div></main>;
  }
  const rows = await getDb().select().from(submissions).orderBy(desc(submissions.createdAt));
  return <main className="page-shell"><header className="page-intro compact"><p>EDITOR REVIEW</p><h1>投稿审核台</h1><span>通过后立即出现在公开投稿页；驳回内容不会公开。投稿人的邮箱只在这里用于核实。</span></header><ReviewDesk initialItems={rows}/></main>;
}
