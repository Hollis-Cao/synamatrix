import { ForgotPasswordForm } from "../components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-shell"><section className="auth-panel"><div className="auth-copy"><p>RECOVER ACCESS</p><h1>重新进入你的知识矩阵</h1><span>使用注册邮箱验证身份并设置新密码。重置成功后将自动登录你的账户。</span></div><div className="auth-widget"><ForgotPasswordForm /></div></section></main>
  );
}
