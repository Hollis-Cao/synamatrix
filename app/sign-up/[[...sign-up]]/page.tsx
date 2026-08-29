import { EmailSignUp } from "../../components/email-sign-up";

export default function SignUpPage() {
  return (
    <main className="auth-shell"><section className="auth-panel"><div className="auth-copy"><p>JOIN SYNAMATRIX</p><h1>建立你的研究账户</h1><span>注册后即可跨设备保存论文、维护学习清单，并向社区投稿值得关注的研究资源。</span></div><div className="auth-widget"><EmailSignUp /></div></section></main>
  );
}
