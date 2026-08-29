"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { innovations, papers, products, technologies } from "../data";
import { innovationDetails } from "../innovation-details";
import { technologyDetails } from "../technology-details";

const aliases: Record<string, string[]> = {
  "大模型": ["神经基础模型", "预训练", "foundation model"],
  "脑电": ["eeg"],
  "无创": ["非侵入"],
  "侵入式": ["植入", "皮层内", "硬膜下", "硬膜外", "血管内"],
  "颅内": ["seeg", "ecog", "皮层内"],
  "说话": ["语音", "speech"],
  "泛化": ["跨被试", "跨会话", "迁移"],
  "芯片": ["无线", "低功耗", "植入"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s·—–_/，。、“”‘’：:；;（）()\-]+/g, "");
}

function matches(haystack: string, query: string) {
  const normalizedHaystack = normalize(haystack);
  const groups: string[][] = [];
  for (const rawPart of query.trim().split(/\s+/)) {
    let remainder = rawPart;
    for (const [alias, variants] of Object.entries(aliases)) {
      if (remainder.includes(alias)) {
        groups.push([normalize(alias), ...variants.map(normalize)]);
        remainder = remainder.replaceAll(alias, "");
      }
    }
    if (normalize(remainder)) groups.push([normalize(remainder)]);
  }
  return groups.every(group => group.some(value => normalizedHaystack.includes(value)));
}

export function GlobalSearch() {
  const [q,setQ]=useState("");
  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) setQ(initialQuery);
  }, []);
  const results=useMemo(()=>{
    if(!q.trim()) return [];
    return [
      ...products.map(x=>({kind:"产品",title:x.name,desc:x.summary,href:"/products/"+x.id,index:[x.name,x.company,x.country,x.modality,x.category,x.status,x.summary,...x.specs,"BCI 脑机接口 产品"].join(" ")})),
      ...papers.map(x=>({kind:"论文",title:x.title,desc:x.summary,href:"/papers/"+x.id,index:[x.title,x.titleEn,x.year,x.venue,x.type,x.signal,x.summary,x.innovation,x.limitation,"BCI 脑机接口 论文"].join(" ")})),
      ...technologies.map(x=>({kind:"新技术",title:x.title,desc:x.summary,href:"/technologies/"+x.id,index:[x.title,x.tag,x.maturity,x.summary,...x.points,technologyDetails[x.id]?.principle,...(technologyDetails[x.id]?.bottlenecks||[]),"BCI 脑机接口 技术"].join(" ")})),
      ...innovations.map(x=>({kind:"核心创新",title:x.title,desc:x.answer,href:"/innovations/"+x.id,index:[x.title,x.question,x.answer,x.metric,innovationDetails[x.id]?.whyItMatters,...(innovationDetails[x.id]?.mechanisms||[]),"BCI 脑机接口 创新"].join(" ")})),
    ].filter(x=>matches(x.index,q));
  },[q]);
  return <div className="global-search"><label className="giant-search"><span>⌕</span><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索产品、论文、技术或创新问题" /></label>
    {!q&&<><div className="search-index-summary"><b>当前索引</b><span>{products.length} 项产品</span><span>{papers.length} 篇论文</span><span>{technologies.length} 条技术路线</span><span>{innovations.length} 个创新问题</span></div><div className="search-suggestions"><span>试试搜索</span>{["脑电大模型","语音解码","硬膜外","柔性电极"].map(x=><button key={x} onClick={()=>setQ(x)}>{x}</button>)}</div></>}
    {q&&<p className="search-count">找到 {results.length} 条匹配内容</p>}
    <div className="search-results">{results.map((r,i)=><Link key={i} href={r.href}><span>{r.kind}</span><div><b>{r.title}</b><p>{r.desc}</p></div><i>→</i></Link>)}</div>
    {q&&results.length===0&&<div className="empty-state"><b>暂时没有匹配内容</b><p>你也可以把相关资源提交给编辑审核。</p><Link href="/submit">提交资源 →</Link></div>}
  </div>;
}
