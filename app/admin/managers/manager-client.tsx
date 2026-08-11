"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Manager = { id:string; managerName:string; managerCode:string; active:boolean };

export default function ManagerClient() {
  const [managers, setManagers] = useState<Manager[]>([]), [name, setName] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  async function load() { const response = await fetch("/api/managers", { cache:"no-store" }); const data = await response.json() as { managers?:Manager[]; error?:string }; if (response.ok) setManagers(data.managers ?? []); else setMessage(data.error ?? "客户经理列表加载失败"); }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  async function create(event:FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return; setBusy(true); setMessage(""); const response = await fetch("/api/managers", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ managerName:name }) }); const data = await response.json() as { manager?:Manager; error?:string }; if (response.ok && data.manager) { setManagers((items) => [data.manager!, ...items]); setName(""); setMessage("已创建专属链接，可复制后由客户经理通过个人微信发送给客户。"); } else setMessage(data.error ?? "创建失败"); setBusy(false); }
  async function copy(url:string) { await navigator.clipboard.writeText(url); setMessage("链接已复制。"); }
  return <main className="admin-shell"><header className="admin-header"><div><Link className="admin-back" href="/admin">← 返回线索台账</Link><div className="admin-brand"><span className="brand-mark">ETC</span><span>客户经理专属链接</span></div><p>个人微信发送给客户，客户提交后自动归属到对应客户经理。</p></div></header><section className="admin-content"><section className="lead-panel"><div className="section-kicker">创建链接</div><h1>新增客户经理</h1><form className="manager-form" onSubmit={create}><input value={name} onChange={(event) => setName(event.target.value)} maxLength={30} placeholder="请输入客户经理姓名" /><button className="export-btn" disabled={busy}>{busy ? "创建中…" : "创建专属链接"}</button></form>{message && <p className="manager-message">{message}</p>}</section><section className="lead-panel manager-results"><div className="section-kicker">已创建链接</div><h1>复制后发给对应客户经理</h1>{managers.length === 0 ? <p className="empty-cell">暂无客户经理专属链接</p> : <div className="manager-cards">{managers.map((manager) => { const url = `${origin}/?ref=${manager.managerCode}`; return <article key={manager.id}><b>{manager.managerName}</b><span>个人微信专属链接</span><code>{url}</code><button className="detail-btn" onClick={() => void copy(url)}>复制链接</button></article>; })}</div>}</section><p className="manager-tip">系统使用随机专属码识别来源；表单提交时会在数据库中固化归属人。</p></section></main>;
}
