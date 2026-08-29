import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="auth-shell"><section className="auth-panel"><div className="auth-copy"><p>WELCOME BACK</p><h1>登录你的知识矩阵</h1><span>使用邮箱和密码安全登录。收藏、学习清单与投稿记录会绑定到你的账户，并可在不同设备继续使用。</span></div><div className="auth-widget auth-widget-stack"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/" /><Link className="forgot-password-link" href="/forgot-password">忘记密码？通过邮箱找回 →</Link></div></section></main>
  );
}
