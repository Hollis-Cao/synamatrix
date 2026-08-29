import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../data";
import { ProductMedia } from "../../components/product-media";

export function generateStaticParams(){return products.map(p=>({id:p.id}))}
export default async function ProductDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const p=products.find(x=>x.id===id); if(!p) notFound();
  return <main className="detail-page"><Link className="back-link" href="/products">← 返回产品库</Link>
    <section className="product-detail-hero"><div><p className="eyebrow">{p.country} · {p.category}</p><h1>{p.name}</h1><h2>{p.company}</h2><p>{p.summary}</p><div className="tag-row"><span>{p.modality}</span><span>{p.status}</span></div></div>
      <div className="detail-visual"><ProductMedia product={p} /></div>
    </section>
    <section className="detail-grid"><article><p>PRODUCT POSITION</p><h2>它解决什么问题</h2><p>{p.summary}</p></article><article><p>TECHNICAL PROFILE</p><h2>公开技术特征</h2><ul>{p.specs.map(x=><li key={x}>{x}</li>)}</ul></article><article><p>EVIDENCE STATUS</p><h2>{p.status}</h2><p>本页只陈述已公开的研发、临床或监管阶段，不将研究演示等同于成熟商品。</p></article></section>
    <div className="source-cta"><div><p>PRIMARY SOURCE</p><h2>查看原始产品或监管资料</h2></div><a href={p.sourceUrl} target="_blank" rel="noreferrer">打开一手来源 ↗</a></div>
  </main>
}
