import Link from "next/link";
import { notFound } from "next/navigation";
import { technologies } from "../../data";
import { technologyDetails } from "../../technology-details";
import { InnovationChecklist } from "../../components/innovation-checklist";

export function generateStaticParams(){return technologies.map(item=>({id:item.id}))}

export default async function TechnologyDetailPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const index=technologies.findIndex(item=>item.id===id);
  const item=technologies[index];
  const detail=technologyDetails[id];
  if(!item||!detail) notFound();
  return <main className="detail-page technology-detail"><Link className="back-link" href="/technologies">← 返回新技术雷达</Link><header><p className="eyebrow">{item.tag} · TECHNOLOGY {String(index+1).padStart(2,"0")}</p><h1>{item.title}</h1><p>{item.summary}</p><div className="tag-row"><span>成熟度：{item.maturity}</span>{item.points.map(point=><span key={point}>{point}</span>)}</div></header>
    <section className="technology-detail-grid"><article className="wide"><p>HOW IT WORKS</p><h2>技术原理</h2><p>{detail.principle}</p></article><article><p>WHERE IT HELPS</p><h2>适用场景</h2><ul>{detail.useCases.map(value=><li key={value}>{value}</li>)}</ul></article><article><p>BOTTLENECKS</p><h2>关键瓶颈</h2><ul>{detail.bottlenecks.map(value=><li key={value}>{value}</li>)}</ul></article></section>
    <section className="research-questions"><p>READ WITH QUESTIONS</p><h2>检索和阅读时先问这三个问题</h2><InnovationChecklist items={detail.questions} label="阅读问题完成度"/></section>
    <Link className="next-matrix-link" href={"/search?q="+encodeURIComponent(item.title)}>在全站继续检索“{item.title}” →</Link>
  </main>;
}
