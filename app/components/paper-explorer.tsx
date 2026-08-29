"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { papers } from "../data";
import { SaveButton } from "./save-button";

export function PaperExplorer() {
  const router = useRouter();
  const [query,setQuery] = useState("");
  const [type,setType] = useState("全部");
  const list = useMemo(() => papers.filter(p => {
    const hit=(p.title+p.titleEn+p.summary+p.innovation).toLowerCase().includes(query.toLowerCase());
    return hit&&(type==="全部"||p.type===type);
  }),[query,type]);
  const types=["全部",...Array.from(new Set(papers.map(p=>p.type)))];
  return (
    <>
      <div className="database-toolbar">
        <label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索标题、方法、创新点…" /></label>
        <select value={type} onChange={e=>setType(e.target.value)} aria-label="论文类别">{types.map(t=><option key={t}>{t}</option>)}</select>
        <span className="result-count">{list.length} PAPERS</span>
      </div>
      <div className="paper-list">
        {list.map((p,i)=>(
          <article className="paper-row clickable-row" key={p.id} role="link" tabIndex={0} onClick={event=>{if(!(event.target as HTMLElement).closest("a,button,input,label"))router.push("/papers/"+p.id)}} onKeyDown={event=>{if(event.key==="Enter"&&!(event.target as HTMLElement).closest("a,button,input,label"))router.push("/papers/"+p.id)}}>
            <span className="paper-index">{String(i+1).padStart(2,"0")}</span>
            <div><div className="paper-meta"><span>{p.type}</span><span>{p.signal}</span><span>{p.year} · {p.venue}</span></div><h2>{p.title}</h2><p className="paper-en">{p.titleEn}</p><p>{p.summary}</p></div>
            <div className="paper-actions"><SaveButton id={"paper:"+p.id}/><a href={p.url} target="_blank" rel="noreferrer">原文 ↗</a></div>
          </article>
        ))}
      </div>
    </>
  );
}
