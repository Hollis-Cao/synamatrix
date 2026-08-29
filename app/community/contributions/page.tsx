import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";

const labels: Record<string, string> = { resource: "资源推荐", discussion: "专题讨论", correction: "纠错更新" };

export const dynamic = "force-dynamic";

export default async function ContributionsPage() {
  const rows = await getDb().select({
    id: submissions.id,
    type: submissions.type,
    title: submissions.title,
    url: submissions.url,
    summary: submissions.summary,
    createdAt: submissions.createdAt,
  }).from(submissions).where(eq(submissions.status, "approved")).orderBy(desc(submissions.createdAt));

  return <main className="page-shell"><header className="page-intro compact"><p>COMMUNITY PICKS</p><h1>经审核的社区投稿</h1><span>这里只展示经过来源核实和编辑审核的条目。投稿人的联系方式永不公开。</span></header>
    <div className="contribution-list">{rows.map(item => <article key={item.id}><div><span>{labels[item.type] || item.type}</span><time>{item.createdAt.slice(0,10)}</time></div><h2>{item.title}</h2><p>{item.summary}</p>{item.url && <a href={item.url} target="_blank" rel="noreferrer">阅读原始来源 ↗</a>}</article>)}</div>
    {rows.length === 0 && <div className="empty-state"><b>还没有已公开的投稿</b><p>你可以推荐值得收录的产品、论文或技术资料。</p><Link href="/submit">提交第一条资源 →</Link></div>}
  </main>;
}
