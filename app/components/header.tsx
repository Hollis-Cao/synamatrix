import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

const nav = [
  ["/","首页"],
  ["/products","产品"],
  ["/papers","论文"],
  ["/technologies","新技术"],
  ["/innovations","核心创新"],
  ["/learn","学习路线"],
  ["/community","社区"],
];

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-glyph">S</span>
        <span><b>SYNAMATRIX</b><small>BCI KNOWLEDGE COMMONS</small></span>
      </Link>
      <nav aria-label="主导航">{nav.map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <Link className="search-link" href="/search" aria-label="全站搜索">⌕ <span>搜索</span></Link>
        <Show when="signed-out">
          <div className="auth-actions">
            <Link className="auth-action" href="/sign-in">登录</Link>
            <Link className="auth-action primary" href="/sign-up">注册</Link>
          </div>
        </Show>
        <Show when="signed-in">
          <div className="user-control"><Link className="account-link" href="/account">我的收藏</Link><UserButton /></div>
        </Show>
      </div>
    </header>
  );
}
