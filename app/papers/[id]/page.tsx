import Link from "next/link";
import { notFound } from "next/navigation";
import { papers } from "../../data";
import { SaveButton } from "../../components/save-button";

export function generateStaticParams(){return papers.map(p=>({id:p.id}))}
export default async function PaperDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;const p=papers.find(x=>x.id===id);if(!p)notFound();
  return <main className="detail-page paper-detail"><Link className="back-link" href="/papers">← 返回论文库</Link>
    <header><div className="paper-meta"><span>{p.type}</span><span>{p.signal}</span><span>{p.year} · {p.venue}</span></div><h1>{p.title}</h1><p className="paper-en">{p.titleEn}</p><div className="detail-actions"><SaveButton id={"paper:"+p.id}/><a href={p.url} target="_blank" rel="noreferrer">阅读原文 ↗</a></div></header>
    <section className="reading-notes"><article><span>01</span><h2>这篇做了什么</h2><p>{p.summary}</p></article><article><span>02</span><h2>核心创新</h2><p>{p.innovation}</p></article><article><span>03</span><h2>证据边界</h2><p>{p.limitation}</p></article></section>
    <section className="read-first"><p>READ FIRST</p><h2>建议先读：摘要 → 方法总图 → 主结果 → 局限讨论</h2><p>先确认研究对象、信号来源和评价设置，再看模型指标；不要把单被试或离线结果直接外推为可用系统。</p></section>
  </main>
}
