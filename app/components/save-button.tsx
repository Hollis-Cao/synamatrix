"use client";

import { useEffect, useState } from "react";

export function SaveButton({ id }: { id: string }) {
  const [saved,setSaved] = useState(false);
  const [authenticated,setAuthenticated] = useState(false);
  const [count,setCount] = useState(0);
  const [busy,setBusy] = useState(true);
  useEffect(() => {
    let active=true;
    fetch(`/api/bookmarks/${encodeURIComponent(id)}`).then(response=>response.json()).then(async(data:{saved?:boolean;authenticated?:boolean;count?:number})=>{
      if(!active)return;
      const legacy = JSON.parse(localStorage.getItem("synamatrix-saved") || "[]") as string[];
      if(data.authenticated&&!data.saved&&legacy.includes(id)){
        const migrated=await fetch(`/api/bookmarks/${encodeURIComponent(id)}`,{method:"POST"});
        if(migrated.ok){data=await migrated.json();localStorage.setItem("synamatrix-saved",JSON.stringify(legacy.filter(item=>item!==id)))}
      }
      setSaved(Boolean(data.saved));setAuthenticated(Boolean(data.authenticated));setCount(Number(data.count)||0);
    }).finally(()=>{if(active)setBusy(false)});
    return()=>{active=false};
  },[id]);
  async function toggle() {
    if(!authenticated){
      window.location.href=`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    setBusy(true);
    try{
      const response=await fetch(`/api/bookmarks/${encodeURIComponent(id)}`,{method:saved?"DELETE":"POST"});
      const data=await response.json() as {saved?:boolean;count?:number};
      if(response.ok){setSaved(Boolean(data.saved));setCount(Number(data.count)||0)}
    }finally{setBusy(false)}
  }
  const label=busy?"读取收藏…":authenticated?(saved?`★ 已收藏 · ${count}`:`☆ 收藏 · ${count}`):`☆ 登录后收藏 · ${count}`;
  return <button className={"save-button "+(saved?"saved":"")} disabled={busy} onClick={toggle}>{label}</button>;
}
