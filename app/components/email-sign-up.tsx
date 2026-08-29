"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function clerkMessage(error: unknown) {
  const detail = error as {
    longMessage?: string;
    message?: string;
    errors?: Array<{ longMessage?: string; message?: string }>;
  };
  return detail.longMessage || detail.message || detail.errors?.[0]?.longMessage || detail.errors?.[0]?.message || "操作没有完成，请稍后重试。";
}

export function EmailSignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<"account" | "verify">("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const rules = {
    length: password.length >= 9,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const passwordValid = Object.values(rules).every(Boolean);
  const busy = submitting || fetchStatus === "fetching";

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("请输入完整、有效的邮箱地址，例如 name@example.com。");
      return;
    }
    if (!passwordValid) {
      setError("密码至少 9 位，并且必须同时包含大写字母、小写字母和数字。");
      return;
    }
    if (!signUp) {
      setError("账户服务尚未准备好，请刷新页面后重试。");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const passwordResult = await signUp.password({ emailAddress: email.trim(), password });
      if (passwordResult.error) {
        setError(clerkMessage(passwordResult.error));
        return;
      }
      const codeResult = await signUp.verifications.sendEmailCode();
      if (codeResult.error) {
        setError(clerkMessage(codeResult.error));
        return;
      }
      setStep("verify");
      setNotice("验证码已发送，请查看收件箱或垃圾邮件。");
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !signUp) return;
    if (!/^\d{6}$/.test(code)) {
      setError("请输入邮件中的 6 位数字验证码。");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const verifyResult = await signUp.verifications.verifyEmailCode({ code });
      if (verifyResult.error) {
        setError(clerkMessage(verifyResult.error));
        return;
      }
      const finalizeResult = await signUp.finalize();
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
    if (busy || !signUp) return;
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const result = await signUp.verifications.sendEmailCode();
      if (result.error) {
        setError(clerkMessage(result.error));
        return;
      }
      setNotice("新的验证码已发送，有效期为 10 分钟。");
    } catch (err) {
      setError(clerkMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function editEmail() {
    if (signUp) await signUp.reset();
    setStep("account");
    setCode("");
    setError("");
    setNotice("");
  }

  if (step === "verify") {
    return (
      <form className="synamatrix-auth-form" onSubmit={verifyCode} noValidate>
        <div className="auth-step"><span>02</span><b>验证邮箱</b></div>
        <h2>输入验证码</h2>
        <p className="auth-help">6 位验证码已经发送至 <strong>{email}</strong></p>
        <label htmlFor="verification-code">邮箱验证码</label>
        <InputOTP id="verification-code" maxLength={6} value={code} onChange={(value) => setCode(value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" containerClassName="otp-input" autoFocus>
          <InputOTPGroup className="otp-group">{[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot className="otp-slot" index={index} key={index} />)}</InputOTPGroup>
        </InputOTP>
        <p className="otp-caption">输入邮件中的 6 位数字，填满后即可完成注册。</p>
        {notice && <p className="auth-success" role="status">{notice}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy || code.length !== 6}>{busy ? "正在验证…" : "验证并完成注册"}</button>
        <div className="auth-form-footer">
          <button type="button" onClick={resendCode} disabled={busy}>重新发送验证码</button>
          <button type="button" onClick={editEmail} disabled={busy}>修改邮箱</button>
        </div>
      </form>
    );
  }

  return (
    <form className="synamatrix-auth-form" onSubmit={createAccount} noValidate>
      <div className="auth-step"><span>01</span><b>创建账户</b></div>
      <h2>邮箱注册</h2>
      <label htmlFor="sign-up-email">邮箱</label>
      <input id="sign-up-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required />
      <label htmlFor="sign-up-password">设置密码</label>
      <div className="password-field">
        <input id="sign-up-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 9 位" required />
        <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "隐藏密码" : "显示密码"}>{showPassword ? "隐藏" : "显示"}</button>
      </div>
      <ul className="password-rules" aria-label="密码要求">
        <li className={rules.length ? "passed" : ""}>至少 9 位字符</li>
        <li className={rules.uppercase ? "passed" : ""}>至少 1 个大写字母</li>
        <li className={rules.lowercase ? "passed" : ""}>至少 1 个小写字母</li>
        <li className={rules.number ? "passed" : ""}>至少 1 个数字</li>
      </ul>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" type="submit" disabled={busy || !passwordValid}>{busy ? "正在发送验证码…" : "发送邮箱验证码"}</button>
      <p className="auth-switch">已有账户？<Link href="/sign-in">前往登录</Link></p>
    </form>
  );
}
