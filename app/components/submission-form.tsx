"use client";

import { useState, type FormEvent } from "react";

export function SubmissionForm() {
  const [state,setState]=useState<"idle"|"sending"|"done"|"error">("idle");
  const [message,setMessage]=useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending"); setMessage("");
    const form=new FormData(e.currentTarget);
    const payload=Object.fromEntries(form.entries());
    try {
      const res=await fetch("/api/submissions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json() as {error?:string};
      if(!res.ok) throw new Error(data.error||"提交失败");
      setState("done"); e.currentTarget.reset();
    } catch(err) { setState("error"); setMessage(err instanceof Error?err.message:"提交失败"); }
  }
  if(state==="done") return <div className="submit-success"><span>✓</span><h2>已进入审核队列</h2><p>感谢你帮助完善 Synamatrix。编辑核实来源和技术表述后再决定是否公开。</p><button onClick={()=>setState("idle")}>继续提交</button></div>;
  return <form className="submission-form" onSubmit={submit}>
    <label>内容类型<select name="type" required><option value="resource">产品 / 论文 / 技术资源</option><option value="discussion">专题讨论建议</option><option value="correction">纠错与更新</option></select></label>
    <label>标题<input name="title" required maxLength={120} placeholder="简洁描述你提交的内容" /></label>
    <label>原始链接<input name="url" type="url" maxLength={2048} placeholder="https://…" /></label>
    <label>推荐理由或讨论内容<textarea name="summary" required maxLength={1200} rows={7} placeholder="它为什么值得收录？请尽量指出具体技术价值和证据来源。" /></label>
    <div className="form-pair"><label>称呼（可选）<input name="submitterName" maxLength={50}/></label><label>邮箱（可选）<input name="submitterEmail" type="email" maxLength={120}/></label></div>
    <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" />
    <p className="form-note">提交内容默认不公开；邮箱仅用于必要的来源核实，不显示在网站上。</p>
    <button className="primary-button" disabled={state==="sending"}>{state==="sending"?"正在提交…":"提交审核 →"}</button>
    {state==="error"&&<p className="form-error">{message}</p>}
  </form>;
}
