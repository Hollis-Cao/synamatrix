"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function clerkMessage(error: unknown) {
  const detail = error as { longMessage?: string; message?: string; errors?: Array<{ longMessage?: string; message?: string }> };
  return detail.longMessage || detail.message || detail.errors?.[0]?.longMessage || detail.errors?.[0]?.message || "操作没有完成，请稍后重试。";
}

export function ForgotPasswordForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const rules = { length: password.length >= 9, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /\d/.test(password) };
  const passwordValid = Object.values(rules).every(Boolean);
  const busy = submitting || fetchStatus === "fetching";

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("请输入注册时使用的完整邮箱地址。");
      return;
    }
    if (!signIn) {
      setError("账户服务尚未准备好，请刷新页面后重试。");
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const createResult = await signIn.create({ identifier: email.trim() });
      if (createResult.error) {
        setError(clerkMessage(createResult.error));
        return;
      }
      const codeResult = await signIn.resetPasswordEmailCode.sendCode();
      if (codeResult.error) {
        setError(clerkMessage(codeResult.error));
        return;
      }
      setStep("reset");
      setNotice("重置验证码已发送，请查看收件箱或垃圾邮件。");
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("请输入邮件中的 6 位数字验证码。");
      return;
    }
    if (!passwordValid) {
      setError("新密码至少 9 位，并且必须同时包含大写字母、小写字母和数字。");
      return;
    }
    if (!signIn || busy) return;
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const verifyResult = await signIn.resetPasswordEmailCode.verifyCode({ code });
      if (verifyResult.error) {
        setError(clerkMessage(verifyResult.error));
        return;
      }
      const passwordResult = await signIn.resetPasswordEmailCode.submitPassword({ password });
      if (passwordResult.error) {
        setError(clerkMessage(passwordResult.error));
        return;
      }
      const finalizeResult = await signIn.finalize();
      if (finalizeResult.error) {
        setError(clerkMessage(finalizeResult.error));
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function resendCode() {
    if (!signIn || busy) return;
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const result = await signIn.resetPasswordEmailCode.sendCode();
      if (result.error) {
        setError(clerkMessage(result.error));
        return;
      }
      setNotice("新的重置验证码已发送，有效期为 10 分钟。");
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function editEmail() {
    if (signIn) await signIn.reset();
    setStep("email");
    setCode("");
    setPassword("");
    setError("");
    setNotice("");
  }

  if (step === "reset") {
    return (
      <form className="synamatrix-auth-form" onSubmit={resetPassword} noValidate>
        <div className="auth-step"><span>02</span><b>重设密码</b></div>
        <h2>验证码与新密码</h2>
        <p className="auth-help">重置验证码已发送至 <strong>{email}</strong></p>
        <label htmlFor="reset-code">邮箱验证码</label>
        <InputOTP id="reset-code" maxLength={6} value={code} onChange={(value) => setCode(value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" containerClassName="otp-input" autoFocus>
          <InputOTPGroup className="otp-group">{[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot className="otp-slot" index={index} key={index} />)}</InputOTPGroup>
        </InputOTP>
        <label htmlFor="reset-password">设置新密码</label>
        <div className="password-field">
          <input id="reset-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 9 位" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "隐藏密码" : "显示密码"}>{showPassword ? "隐藏" : "显示"}</button>
        </div>
        <ul className="password-rules" aria-label="密码要求">
          <li className={rules.length ? "passed" : ""}>至少 9 位字符</li>
          <li className={rules.uppercase ? "passed" : ""}>至少 1 个大写字母</li>
          <li className={rules.lowercase ? "passed" : ""}>至少 1 个小写字母</li>
          <li className={rules.number ? "passed" : ""}>至少 1 个数字</li>
        </ul>
        {notice && <p className="auth-success" role="status">{notice}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy || code.length !== 6 || !passwordValid}>{busy ? "正在重置…" : "验证并设置新密码"}</button>
        <div className="auth-form-footer"><button type="button" onClick={resendCode} disabled={busy}>重新发送验证码</button><button type="button" onClick={editEmail} disabled={busy}>修改邮箱</button></div>
      </form>
    );
  }

  return (
    <form className="synamatrix-auth-form" onSubmit={sendCode} noValidate>
      <div className="auth-step"><span>01</span><b>找回账户</b></div>
      <h2>找回密码</h2>
      <p className="auth-help">输入注册邮箱，我们会向该邮箱发送 6 位重置验证码。</p>
      <label htmlFor="forgot-email">注册邮箱</label>
      <input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? "正在发送…" : "发送重置验证码"}</button>
      <p className="auth-switch"><Link href="/sign-in">返回登录</Link></p>
    </form>
  );
}
