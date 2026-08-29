"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { products } from "../data";
import { ProductMedia } from "./product-media";

export function ProductExplorer() {
  const router = useRouter();
  const [query,setQuery] = useState("");
  const [region,setRegion] = useState("全部");
  const [modality,setModality] = useState("全部");
  const [compare,setCompare] = useState<string[]>([]);
  const list = useMemo(() => products.filter(p => {
    const hit = (p.name+p.company+p.summary+p.category).toLowerCase().includes(query.toLowerCase());
    return hit && (region==="全部"||p.country===region) && (modality==="全部"||p.modality.includes(modality));
  }),[query,region,modality]);
  function choose(id:string) {
    setCompare(v => v.includes(id) ? v.filter(x=>x!==id) : v.length<3 ? [...v,id] : v);
  }
  return (
    <>
      <div className="database-toolbar">
        <label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索产品、公司、应用…" /></label>
        <select value={region} onChange={e=>setRegion(e.target.value)} aria-label="地区"><option>全部</option><option>中国</option><option>海外</option></select>
        <select value={modality} onChange={e=>setModality(e.target.value)} aria-label="接口方式"><option>全部</option><option>非侵入</option><option>硬膜外</option><option>硬膜下</option><option>皮层内</option><option>血管内</option></select>
        <span className="result-count">{list.length} PRODUCTS</span>
      </div>
      {compare.length>0 && <div className="compare-dock"><span>已选择 {compare.length}/3 项</span><Link href={"/compare?ids="+compare.join(",")}>进入对比页 →</Link><button onClick={()=>setCompare([])}>清空</button></div>}
      <div className="product-catalog">
        {list.map(p => (
          <article className="product-card clickable-card" key={p.id} role="link" tabIndex={0} onClick={event=>{if(!(event.target as HTMLElement).closest("a,button,input,label"))router.push("/products/"+p.id)}} onKeyDown={event=>{if(event.key==="Enter"&&!(event.target as HTMLElement).closest("a,button,input,label"))router.push("/products/"+p.id)}}>
            <div className="product-visual">
              <ProductMedia product={p} />
              <span className="region-badge">{p.country}</span>
            </div>
            <div className="product-body">
              <p className="mono">{p.company}</p><h2>{p.name}</h2><p>{p.summary}</p>
              <div className="tag-row"><span>{p.modality}</span><span>{p.status}</span></div>
              <div className="product-actions">
                <label><input type="checkbox" checked={compare.includes(p.id)} onChange={()=>choose(p.id)} /> 对比</label>
              </div>
            </div>
          </article>
        ))}
      </div>
      {list.length===0 && <div className="empty-state"><b>没有找到匹配产品</b><p>尝试缩短关键词或清除筛选条件。</p></div>}
    </>
  );
}
