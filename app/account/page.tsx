import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { bookmarks } from "../../db/schema";
import { requireSynamatrixUser } from "../clerk-auth";
import { papers } from "../data";
import { SignOutButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireSynamatrixUser("/account");
  const rows = await getDb().select().from(bookmarks)
    .where(eq(bookmarks.userEmail, user.identityKey))
    .orderBy(desc(bookmarks.createdAt));
  const savedPapers = rows.flatMap(row => {
    const paper = papers.find(item => `paper:${item.id}` === row.itemKey);
    return paper ? [paper] : [];
  });
  return <main className="page-shell">
    <header className="page-intro compact"><p>MY SYNAMATRIX</p><h1>我的收藏</h1><span>收藏与当前登录账号绑定，可在不同设备继续阅读；你的邮箱和收藏清单不会公开。</span></header>
    <section className="account-summary"><div><b>{user.displayName}</b><p className="account-identity">{user.email || user.phone || "Clerk 账户"}</p><p>已收藏 {savedPapers.length} 篇论文</p></div><div className="account-actions"><Link className="auth-action primary" href="/account/settings/security">修改密码</Link><SignOutButton redirectUrl="/"><button className="auth-action" type="button">退出登录</button></SignOutButton></div></section>
    {savedPapers.length ? <div className="saved-list">{savedPapers.map(p=><Link href={`/papers/${p.id}`} key={p.id}><span>{p.type}</span><div><h2>{p.title}</h2><p>{p.year} · {p.venue} · {p.signal}</p></div><i>继续阅读 →</i></Link>)}</div> : <div className="empty-state"><b>还没有收藏论文</b><p>进入论文库，点击“收藏”即可建立你的学习清单。</p><Link href="/papers">浏览论文库 →</Link></div>}
  </main>;
}
