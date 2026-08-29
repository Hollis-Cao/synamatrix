"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ReviewItem = {
  id: number;
  type: string;
  title: string;
  url: string | null;
  summary: string;
  submitterName: string | null;
  submitterEmail: string | null;
  status: string;
  createdAt: string;
};

const labels: Record<string, string> = {
  resource: "资源",
  discussion: "讨论",
  correction: "纠错",
  pending: "待审核",
  approved: "已公开",
  rejected: "已驳回",
};

export function ReviewDesk({ initialItems }: { initialItems: ReviewItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("pending");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const shown = useMemo(() => items.filter(item => filter === "all" || item.status === filter), [items, filter]);

  async function updateStatus(id: number, status: "pending" | "approved" | "rejected") {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "审核操作失败");
      setItems(current => current.map(item => item.id === id ? { ...item, status } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "审核操作失败");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="review-toolbar">
        {["pending", "approved", "rejected", "all"].map(status => (
          <button className={filter === status ? "active" : ""} key={status} onClick={() => setFilter(status)}>
            {status === "all" ? "全部" : labels[status]} ({status === "all" ? items.length : items.filter(item => item.status === status).length})
          </button>
        ))}
        <Link href="/community/contributions" target="_blank">查看公开投稿 ↗</Link>
      </div>
      {error && <p className="form-error">{error}</p>}
      <div className="review-list">
        {shown.map(item => (
          <article key={item.id}>
            <header><span>{labels[item.type] || item.type}</span><time>{new Date(item.createdAt + "Z").toLocaleString("zh-CN")}</time><b>{labels[item.status] || item.status}</b></header>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            {item.url && <a href={item.url} target="_blank" rel="noreferrer">核对原始链接 ↗</a>}
            <details><summary>投稿人信息</summary><p>{item.submitterName || "未填写称呼"} · {item.submitterEmail || "未填写邮箱"}</p></details>
            <footer>
              <button disabled={busyId === item.id || item.status === "approved"} onClick={() => updateStatus(item.id, "approved")}>通过并公开</button>
              <button disabled={busyId === item.id || item.status === "rejected"} onClick={() => updateStatus(item.id, "rejected")}>驳回</button>
              {item.status !== "pending" && <button disabled={busyId === item.id} onClick={() => updateStatus(item.id, "pending")}>退回待审核</button>}
            </footer>
          </article>
        ))}
      </div>
      {shown.length === 0 && <div className="empty-state"><b>这一栏暂时为空</b><p>新的投稿会自动出现在待审核列表中。</p></div>}
    </>
  );
}
