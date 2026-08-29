import Link from "next/link";
import { innovations, papers, products, technologies } from "./data";

const portals=[
  {n:"01",title:"产品数据库",text:"国内外 BCI 产品、临床阶段、接口路线与官方来源。",href:"/products",count:products.length+" 项"},
  {n:"02",title:"论文精读",text:"不止摘要：解释改变、创新、局限与优先阅读部分。",href:"/papers",count:papers.length+" 篇"},
  {n:"03",title:"新技术",text:"模型、硬件、无线系统与闭环转化的技术雷达。",href:"/technologies",count:technologies.length+" 条路线"},
  {n:"04",title:"核心创新",text:"围绕真正决定 BCI 能否通用和临床落地的问题学习。",href:"/innovations",count:innovations.length+" 个问题"},
];

const weeklyWatch = [
  { label: "硬膜外 BCI 获批上市", href: "https://www.nmpa.gov.cn/zhuanti/cxylqx/cxylqxlm/20260313134742156.html" },
  { label: "流式语音神经假体", href: "https://pubmed.ncbi.nlm.nih.gov/40164740/" },
  { label: "跨被试神经基础模型", href: "https://www.nature.com/articles/s41467-025-63825-0" },
  { label: "柔性高密度电极", href: "https://www.precisionneuro.io/our-technology" },
];

export default function Home(){
  return <main>
    <section className="home-hero">
      <div><p className="eyebrow">SYNAMATRIX · BCI KNOWLEDGE COMMONS</p><h1>连接中国与世界的<br/><span>脑机接口知识矩阵</span></h1><p>为研究者与爱好者整理产品、论文、新技术和核心创新。每条信息回到一手来源，每个概念都能继续深入。</p><div className="hero-links"><Link href="/search">开始全站探索 →</Link><Link href="/learn">沿学习路线进入</Link></div></div>
      <div className="matrix-art" aria-hidden="true"><span className="mx m1">产品</span><span className="mx m2">论文</span><span className="mx m3">技术</span><span className="mx m4">创新</span><div className="matrix-core">S</div></div>
    </section>
    <section className="ticker"><span>本周观察</span>{weeklyWatch.map((item,index)=><span className="ticker-item" key={item.label}>{index>0&&<i/>}<a href={item.href} target="_blank" rel="noreferrer">{item.label}<b> ↗</b></a></span>)}</section>
    <section className="home-portals">
      <div className="section-title"><p>EXPLORE THE MATRIX</p><h2>四个独立知识入口</h2></div>
      <div className="portal-grid">{portals.map(x=><Link href={x.href} className="portal-card" key={x.n}><span>{x.n}</span><div><small>{x.count}</small><h3>{x.title}</h3><p>{x.text}</p></div><i>↗</i></Link>)}</div>
    </section>
    <section className="featured-split">
      <div><div className="section-title"><p>CHINA WATCH</p><h2>中国 BCI 产品进展</h2></div>{products.filter(x=>x.country==="中国").slice(0,4).map(p=><Link className="mini-row" href={"/products/"+p.id} key={p.id}><span>{p.modality}</span><div><b>{p.name}</b><small>{p.company}</small></div><i>{p.status} →</i></Link>)}<Link className="text-link" href="/products">进入完整产品库 →</Link></div>
      <div className="weekly-panel"><p>WEEKLY · EVERY FRIDAY</p><h2>每周把真正的变化<br/>送进知识库。</h2><p>新增论文、产品、新技术与关键判断会分别归入对应栏目，并持续沉淀为可检索、可回溯的知识记录。</p><Link href="/community">查看社区与投稿方式 →</Link></div>
    </section>
  </main>;
}
