import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><span className="brand-glyph">S</span><b>SYNAMATRIX</b></div>
      <p>面向中国 BCI 研究者与爱好者的开放知识平台</p>
      <div><Link href="/submit">提交资源</Link><Link href="/community">社区公约</Link></div>
    </footer>
  );
}
