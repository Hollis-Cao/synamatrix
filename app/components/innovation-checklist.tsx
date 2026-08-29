"use client";

import { useState } from "react";

export function InnovationChecklist({ items, label = "证据检查进度" }: { items: string[]; label?: string }) {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const completed = checked.filter(Boolean).length;
  return <div className="innovation-checklist"><div><b>{label}</b><span>{completed} / {items.length}</span></div>{items.map((item,index)=><label key={item}><input type="checkbox" checked={checked[index]} onChange={()=>setChecked(current=>current.map((value,i)=>i===index?!value:value))}/><span>{item}</span></label>)}</div>;
}
