import Link from "next/link";

const stages=[
 {n:"01",title:"读懂神经信号",time:"2–4 周",text:"建立 EEG、sEEG、ECoG、spikes 的采集原理、频段、伪迹与空间分辨率概念。",links:[["先看产品接口差异","/products"],["检索 EEG 论文","/papers"]]},
 {n:"02",title:"掌握解码基线",time:"4–8 周",text:"从特征工程、CNN、RNN 到 Transformer，理解数据划分、跨被试评估和常见泄漏。",links:[["论文数据库","/papers"],["核心创新：可复现","/innovations#reproducibility"]]},
 {n:"03",title:"进入神经基础模型",time:"4–8 周",text:"围绕 LaBraM、EEGPT 与跨数据集预训练，学习 tokenizer、自监督目标和迁移评估。",links:[["神经基础模型","/technologies#foundation-models"],["搜索 foundation model","/search"]]},
 {n:"04",title:"连接硬件与系统",time:"持续",text:"理解电极、模拟前端、无线链路、功耗、封装和手术路径如何共同约束解码。",links:[["柔性电极","/technologies#flexible-electrodes"],["产品对比","/products"]]},
 {n:"05",title:"面向临床与通用型 BCI",time:"长期",text:"把跨人泛化、在线适配、家庭稳定使用、安全性与用户价值放进同一评价框架。",links:[["核心创新点","/innovations"],["参与专题讨论","/community"]]},
];
export default function LearnPage(){return <main className="page-shell"><header className="page-intro"><p>LEARNING PATH</p><h1>从真实神经信号到通用型 BCI</h1><span>一条适合计算机与电子信息背景学习者的路线：先理解信号，再做模型，随后进入硬件和临床系统。</span></header><div className="learning-path">{stages.map(s=><article key={s.n}><span>{s.n}</span><div><small>{s.time}</small><h2>{s.title}</h2><p>{s.text}</p><div>{s.links.map(([label,href])=><Link key={href} href={href}>{label} →</Link>)}</div></div></article>)}</div></main>}
