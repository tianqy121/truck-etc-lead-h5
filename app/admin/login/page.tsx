"use client";

import { type FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, returnTo: new URLSearchParams(window.location.search).get("return_to") ?? "/admin" }),
    });
    if (response.ok) {
      const data = await response.json();
      window.location.href = data.returnTo || "/admin";
    } else {
      setError((await response.json()).error || "登录失败");
      setLoading(false);
    }
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f4f2", padding: 20 }}>
    <form onSubmit={submit} style={{ width: "min(100%, 390px)", background: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 12px 40px #47131c18" }}>
      <div style={{ color: "#8d1727", fontWeight: 800, letterSpacing: ".08em", fontSize: 13 }}>鑫出行（ETC）</div>
      <h1 style={{ margin: "12px 0 8px", color: "#2b1d1b", fontSize: 28 }}>后台管理登录</h1>
      <p style={{ color: "#8a7973", fontSize: 13, marginBottom: 24 }}>请输入管理员密码查看线索台账</p>
      <input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="管理员密码" style={{ width: "100%", boxSizing: "border-box", padding: 13, border: "1px solid #e4d6cf", borderRadius: 9, marginBottom: 14 }} />
      {error && <p style={{ color: "#a32929", fontSize: 12 }}>{error}</p>}
      <button disabled={loading} style={{ width: "100%", border: 0, borderRadius: 9, padding: 13, background: "#8d1727", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{loading ? "登录中…" : "登录后台"}</button>
    </form>
  </main>;
}
