"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { products, type Product } from "../data";

export function CompareView() {
  const [items,setItems]=useState<Product[]>([]);
  useEffect(()=>{
    const ids=new URLSearchParams(window.location.search).get("ids")?.split(",")||[];
    setItems(ids.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[]);
  },[]);
  if(!items.length) return <div className="empty-state"><b>还没有选择产品</b><p>返回产品库选择最多三项进行比较。</p><Link href="/products">前往产品库 →</Link></div>;
  const rows:[string,(p:Product)=>string][]=[
    ["公司 / 团队",p=>p.company],["地区",p=>p.country],["接口方式",p=>p.modality],["应用类别",p=>p.category],["公开阶段",p=>p.status],["核心特征",p=>p.specs.join("；")],
  ];
  return <div className="compare-table"><div className="compare-grid compare-products"><span>比较维度</span>{items.map(p=><Link key={p.id} href={"/products/"+p.id}><b>{p.name}</b><small>{p.company}</small></Link>)}</div>
    {rows.map(([label,get])=><div className="compare-grid" key={label}><b>{label}</b>{items.map(p=><span key={p.id}>{get(p)}</span>)}</div>)}
  </div>;
}
