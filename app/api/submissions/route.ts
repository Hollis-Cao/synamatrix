import { getDb } from "../../../db";
import { submissions } from "../../../db/schema";

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 12_000) return Response.json({error:"提交内容过长"},{status:413});
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.website === "string" && body.website) return Response.json({ok:true},{status:201});
    const type=typeof body.type==="string"?body.type.trim():"";
    const title=typeof body.title==="string"?body.title.trim():"";
    const summary=typeof body.summary==="string"?body.summary.trim():"";
    const rawUrl=typeof body.url==="string"?body.url.trim():"";
    const submitterName=typeof body.submitterName==="string"?body.submitterName.trim():"";
    const submitterEmail=typeof body.submitterEmail==="string"?body.submitterEmail.trim():"";
    if(!["resource","discussion","correction"].includes(type)) return Response.json({error:"请选择有效的内容类型"},{status:400});
    if(!title||title.length>120) return Response.json({error:"标题不能为空且不超过 120 字"},{status:400});
    if(!summary||summary.length>1200) return Response.json({error:"内容不能为空且不超过 1200 字"},{status:400});
    if(rawUrl.length>2048) return Response.json({error:"原始链接过长"},{status:400});
    if(submitterName.length>50) return Response.json({error:"称呼不能超过 50 字"},{status:400});
    if(submitterEmail.length>120) return Response.json({error:"邮箱不能超过 120 字"},{status:400});
    if(submitterEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) return Response.json({error:"请输入有效的邮箱"},{status:400});
    if(rawUrl){try{const u=new URL(rawUrl);if(!["http:","https:"].includes(u.protocol))throw new Error()}catch{return Response.json({error:"请输入有效的原始链接"},{status:400})}}
    const db=getDb();
    await db.insert(submissions).values({type,title,url:rawUrl||null,summary,submitterName:submitterName||null,submitterEmail:submitterEmail||null,status:"pending"});
    return Response.json({ok:true},{status:201});
  } catch {
    return Response.json({error:"暂时无法保存投稿，请稍后再试"},{status:500});
  }
}
