import Link from "next/link";
import { notFound } from "next/navigation";
import { InnovationChecklist } from "../../components/innovation-checklist";
import { innovations } from "../../data";
import { innovationDetails } from "../../innovation-details";

export function generateStaticParams(){return innovations.map(item=>({id:item.id}))}

export default async function InnovationDetailPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const index=innovations.findIndex(item=>item.id===id);
  const item=innovations[index];
  const detail=innovationDetails[id];
  if(!item||!detail) notFound();
  return <main className="detail-page innovation-detail"><Link className="back-link" href="/innovations">← 返回核心创新</Link>
    <header><p className="eyebrow">CORE INNOVATION · {String(index+1).padStart(2,"0")}</p><h1>{item.title}</h1><h2>{item.question}</h2><p>{item.answer}</p></header>
    <section className="innovation-detail-grid"><article className="wide"><p>WHY IT MATTERS</p><h2>为什么它决定 BCI 能否通用</h2><p>{detail.whyItMatters}</p></article><article><p>TECHNICAL PATHS</p><h2>可行的技术路线</h2><ul>{detail.mechanisms.map(value=><li key={value}>{value}</li>)}</ul></article><article><p>THOUGHT EXPERIMENT</p><h2>用一个问题检验它</h2><blockquote>{detail.thoughtExperiment}</blockquote></article></section>
    <section className="evidence-section"><div><p>READING CHECKLIST</p><h2>读论文或产品材料时，逐项检查</h2><InnovationChecklist items={detail.evidence}/></div><aside><p>RED FLAGS</p><h2>这些表述值得警惕</h2><ul>{detail.redFlags.map(value=><li key={value}>{value}</li>)}</ul></aside></section>
    <div className="read-first"><p>OBSERVATION METRICS</p><h2>{item.metric}</h2><p>不要只寻找一个更高的单项数字；要看这些指标是否在同一受试者、同一任务和同一时间尺度上共同成立。</p></div>
  </main>;
}
