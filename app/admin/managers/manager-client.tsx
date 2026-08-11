"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import QRCode from "qrcode";

type Manager = { id:string; managerName:string; managerCode:string; active:boolean };

export default function ManagerClient() {
  const [managers, setManagers] = useState<Manager[]>([]), [name, setName] = useState(""), [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  async function load() { const response = await fetch("/api/managers", { cache:"no-store" }); const data = await response.json() as { managers?:Manager[]; error?:string }; if (response.ok) setManagers(data.managers ?? []); else setMessage(data.error ?? "客户经理列表加载失败"); }
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  useEffect(() => {
    let active = true;
    void Promise.all(managers.map(async (manager) => [manager.managerCode, await QRCode.toDataURL(`${origin}/?ref=${manager.managerCode}`, { width: 240, margin: 1, errorCorrectionLevel: "M", color: { dark: "#39131a", light: "#fffdf8" } })] as const)).then((entries) => { if (active) setQrCodes(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [managers, origin]);
  async function create(event:FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return; setBusy(true); setMessage(""); const response = await fetch("/api/managers", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ managerName:name }) }); const data = await response.json() as { manager?:Manager; error?:string }; if (response.ok && data.manager) { setManagers((items) => [data.manager!, ...items]); setName(""); setMessage("已创建专属链接，可复制后由客户经理通过个人微信发送给客户。"); } else setMessage(data.error ?? "创建失败"); setBusy(false); }
  async function copy(url:string) { await navigator.clipboard.writeText(url); setMessage("链接已复制。"); }
  function downloadPoster(manager: Manager) {
    const qr = qrCodes[manager.managerCode];
    if (!qr) { setMessage("海报正在生成，请稍后再试。"); return; }
    const canvas = document.createElement("canvas"); canvas.width = 750; canvas.height = 1200;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const gradient = ctx.createLinearGradient(0, 0, 750, 1200); gradient.addColorStop(0, "#4d0e18"); gradient.addColorStop(.52, "#8d1727"); gradient.addColorStop(1, "#c94745"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 750, 1200);
    ctx.fillStyle = "#f0b46c"; ctx.globalAlpha = .2; ctx.beginPath(); ctx.arc(630, 170, 235, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = "#f6c984"; ctx.globalAlpha = .5; ctx.lineWidth = 3; [[-90, 620, 820, 360], [-80, 725, 820, 430], [-120, 850, 820, 510]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }); ctx.globalAlpha = 1;
    ctx.fillStyle = "#f8d8ad"; ctx.font = "600 24px Arial, Microsoft YaHei"; ctx.fillText("鑫出行（ETC）", 62, 80);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 56px Arial, Microsoft YaHei"; ctx.fillText("企业货车 ETC", 60, 184); ctx.fillText("办理咨询", 60, 252);
    ctx.fillStyle = "#f8d8ad"; ctx.font = "28px Arial, Microsoft YaHei"; ctx.fillText("线上绑车 · 账户批扣 · 对账方便", 62, 315);
    ctx.fillStyle = "#e9ae63"; ctx.fillRect(63, 382, 180, 12); ctx.fillStyle = "#fff5eb"; ctx.font = "28px Arial, Microsoft YaHei"; ctx.fillText("专人跟进服务", 62, 440);
    ctx.fillStyle = "#e8b06d"; ctx.fillRect(400, 570, 230, 90); ctx.fillStyle = "#f6c984"; ctx.fillRect(610, 600, 100, 60); ctx.fillStyle = "#4b151a"; ctx.fillRect(630, 615, 50, 22); ctx.fillStyle = "#321116"; [440, 645].forEach((x) => { ctx.beginPath(); ctx.arc(x, 680, 28, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "#fffdf8"; roundRect(ctx, 60, 760, 630, 355, 28); ctx.fill();
    const image = new Image(); image.onload = () => { ctx.drawImage(image, 455, 795, 190, 190); ctx.fillStyle = "#6a4b46"; ctx.font = "24px Arial, Microsoft YaHei"; ctx.fillText("扫码提交需求", 94, 830); ctx.fillStyle = "#311b1c"; ctx.font = "bold 36px Arial, Microsoft YaHei"; ctx.fillText(manager.managerName, 94, 885); ctx.font = "24px Arial, Microsoft YaHei"; ctx.fillText("为您提供专属服务", 94, 928); ctx.fillStyle = "#9c8379"; ctx.font = "20px Arial, Microsoft YaHei"; ctx.fillText("长按识别二维码，提交企业货车 ETC 办理需求", 94, 1045); const link = document.createElement("a"); link.download = `鑫出行ETC-${manager.managerName}-专属推广海报.png`; link.href = canvas.toDataURL("image/png"); link.click(); setMessage(`${manager.managerName} 的专属推广海报已下载。`); }; image.src = qr;
  }
  return <main className="admin-shell"><header className="admin-header"><div><Link className="admin-back" href="/admin">← 返回线索台账</Link><div className="admin-brand"><span className="brand-mark">ETC</span><span>客户经理专属推广海报</span></div><p>下载图片后由客户经理用个人微信发送；客户长按识别二维码即可提交需求。</p></div></header><section className="admin-content"><section className="lead-panel"><div className="section-kicker">创建专属海报</div><h1>新增客户经理</h1><form className="manager-form" onSubmit={create}><input value={name} onChange={(event) => setName(event.target.value)} maxLength={30} placeholder="请输入客户经理姓名" /><button className="export-btn" disabled={busy}>{busy ? "创建中…" : "创建专属链接"}</button></form>{message && <p className="manager-message">{message}</p>}</section><section className="lead-panel manager-results"><div className="section-kicker">专属推广海报</div><h1>下载图片，发给对应客户经理</h1>{managers.length === 0 ? <p className="empty-cell">暂无客户经理专属链接</p> : <div className="manager-cards">{managers.map((manager) => { const url = `${origin}/?ref=${manager.managerCode}`; return <article key={manager.id}><b>{manager.managerName}</b><span>个人微信专属推广海报</span>{qrCodes[manager.managerCode] ? <img className="poster-qr" src={qrCodes[manager.managerCode]} alt={`${manager.managerName} 的专属二维码`} /> : <span>二维码生成中…</span>}<div className="manager-actions"><button className="detail-btn" onClick={() => void copy(url)}>复制链接</button><button className="poster-btn" onClick={() => downloadPoster(manager)}>下载海报图片</button></div></article>; })}</div>}</section><p className="manager-tip">海报二维码对应不可猜测的专属码。客户扫码提交后，线索会自动固化归属客户经理。</p></section></main>;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.closePath();
}
