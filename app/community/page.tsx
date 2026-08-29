import Link from "next/link";

const prompts=[
 ["跨被试泛化","EEG 基础模型的提升，究竟来自大规模预训练还是更充分的优化？"],
 ["国产植入式 BCI","NEO、北脑一号和脑虎“三全”系统代表了哪些不同的风险—分辨率权衡？"],
 ["评价标准","一个 BCI 产品走出实验室前，最应该公开哪些长期使用指标？"],
];
export default function CommunityPage(){return <main className="page-shell"><header className="page-intro community-intro"><p>KNOWLEDGE COMMUNITY</p><h1>共同建设可验证的<br/>中文 BCI 知识库</h1><span>无需注册即可浏览和提交资源。所有投稿先进入审核队列，只有站主审核账号可以通过或驳回；核实来源、技术表述与利益冲突后才会公开。</span><div className="community-actions"><Link className="primary-button" href="/submit">提交资源或讨论 →</Link><Link href="/community/contributions">查看已审核投稿 →</Link></div></header>
  <section className="community-grid"><article><p>HOW IT WORKS</p><h2>社区不是资讯搬运站</h2><ol><li><b>提交</b><span>论文、产品、技术资料、纠错或专题问题</span></li><li><b>核实</b><span>优先检查论文、监管、实验室和厂商一手来源</span></li><li><b>编辑</b><span>补足核心创新、证据边界和适合的阅读入口</span></li><li><b>发布</b><span>进入对应数据库或每周专题，不自动混发</span></li></ol></article>
  <article><p>DISCUSSION PROMPTS</p><h2>当前专题讨论</h2>{prompts.map(([tag,q])=><Link className="discussion-row" href={"/submit?type=discussion&topic="+encodeURIComponent(q)} key={tag}><span>{tag}</span><b>{q}</b><i>参与 →</i></Link>)}</article></section>
  <section className="community-rules"><div><p>COMMUNITY STANDARD</p><h2>我们优先奖励什么</h2></div><ul><li>能回到原始材料的判断</li><li>明确区分事实、推测与宣传</li><li>指出失败条件和证据边界</li><li>对初学者友好但不牺牲准确性</li></ul></section>
  </main>}
