"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: form.get("industry"),
          vehicleCount: form.get("vehicleCount"),
          contactName: form.get("contactName"),
          phone: form.get("phone"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "提交失败，请稍后重试");
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="site-shell">
      <section className="hero">
        <div className="topbar">
          <div className="brand"><span className="brand-mark">ETC</span><span>鑫出行</span></div>
          <span className="topbar-tag">企业货车服务</span>
        </div>

        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />企业货车ETC需求咨询</div>
          <h1>让每一辆货车<br /><em>通行更高效</em></h1>
          <p className="hero-lead">物流、冷链、配送、制造业运输车辆，<br />可先在线了解货车ETC办理与车辆管理服务。</p>
          <button className="primary-btn hero-btn" onClick={() => setShowForm(true)}>我有货车ETC需求 <span>→</span></button>
          <p className="microcopy">提交需求后，将由客户经理与您联系</p>
        </div>

        <div className="road-art" aria-hidden="true">
          <div className="sun-glow" />
          <div className="road-line road-line-one" />
          <div className="road-line road-line-two" />
          <div className="truck"><div className="truck-cab" /><div className="truck-body" /><i /><i /></div>
        </div>
        <div className="hero-fade" />
      </section>

      <section className="content-section">
        <div className="section-kicker">为企业运输场景而来</div>
        <h2>一次咨询，先把需求理清</h2>
        <p className="section-intro">根据企业车辆数量和使用情况，提供更合适的办理建议与后续服务。</p>
        <div className="benefit-grid">
          <article><span className="icon-box">↗</span><h3>批量办理咨询</h3><p>适合物流、货运、冷链及配送企业。</p></article>
          <article><span className="icon-box">▦</span><h3>车辆统一管理</h3><p>支持新办、新增、变更等需求了解。</p></article>
          <article><span className="icon-box">◷</span><h3>专人跟进服务</h3><p>留下需求后，客户经理及时联系您。</p></article>
        </div>
      </section>

      <section className="process-section">
        <div><div className="section-kicker">咨询流程</div><h2>三步，开始了解</h2></div>
        <div className="steps">
          <div className="step"><b>01</b><span>填写需求</span></div><div className="step-arrow">→</div>
          <div className="step"><b>02</b><span>专人联系</span></div><div className="step-arrow">→</div>
          <div className="step"><b>03</b><span>了解办理</span></div>
        </div>
      </section>

      <section className="note-section"><div className="note-icon">i</div><p>首次咨询只需填写基本需求。具体办理流程、材料和网点信息，将由客户经理结合您的实际情况进一步说明。</p></section>

      <footer><span>鑫出行（ETC）</span><span>企业货车服务咨询</span><a href="/admin">后台管理</a></footer>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}>
        <div className="form-card" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setShowForm(false)} aria-label="关闭">×</button>
          {!submitted ? <>
            <div className="section-kicker">在线咨询</div><h2>留下基本需求</h2><p className="form-hint">信息仅用于客户经理联系您，不需要上传证件材料。</p>
            <form onSubmit={handleSubmit}>
              <label>企业所属行业<select name="industry" required defaultValue=""><option value="" disabled>请选择行业</option><option>物流/货运</option><option>冷链运输</option><option>制造业配送</option><option>危化品运输</option><option>其他</option></select></label>
              <label>货车数量<select name="vehicleCount" required defaultValue=""><option value="" disabled>请选择车辆数量</option><option>1—5辆</option><option>6—20辆</option><option>21—50辆</option><option>50辆以上</option></select></label>
              <label>您的称呼<input name="contactName" required placeholder="请输入联系人姓名" /></label>
              <label>联系电话<input name="phone" required type="tel" inputMode="numeric" pattern="1[0-9]{10}" placeholder="请输入手机号码" /></label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="primary-btn submit-btn" type="submit" disabled={submitting}>{submitting ? "正在提交…" : "提交需求"} <span>→</span></button>
            </form>
          </> : <div className="success-state"><div className="success-icon">✓</div><h2>需求已提交</h2><p>您的货车ETC咨询已登记成功，客户经理会在工作时间内与您联系。</p><button className="secondary-btn" onClick={() => { setShowForm(false); setSubmitted(false); }}>返回H5</button></div>}
        </div>
      </div>}
    </main>
  );
}
