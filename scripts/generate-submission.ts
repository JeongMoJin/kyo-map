/**
 * 공가지도 — 공모전 제출용 별첨 자료 자동 생성
 *
 * 생성물:
 *   submission/demo.gif          (≤ 8MB 목표)
 *   submission/demo.mp4
 *   submission/ai_evidence.pdf   (A4 3장: 표지 + 파이프라인 + 증빙)
 *
 * 실행:  npx tsx scripts/generate-submission.ts
 *
 * AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT-4o(용도 추천)
 */

import { chromium, type Page } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------- configuration
const LIVE = process.env.LIVE_URL ?? "https://kyo-map.vercel.app";
const ROOT = process.cwd();
const OUT = path.join(ROOT, "submission");
const SHOTS = path.join(OUT, "shots");
const RAW = path.join(OUT, "raw");
const VIDEO_WEBM = path.join(RAW, "demo.webm");
const MP4 = path.join(OUT, "demo.mp4");
const GIF = path.join(OUT, "demo.gif");
const PDF = path.join(OUT, "ai_evidence.pdf");

for (const d of [OUT, SHOTS, RAW]) fs.mkdirSync(d, { recursive: true });

// ---------------------------------------------------------------- ffmpeg resolver
function resolveFfmpeg(): string {
  try {
    const mod = require("@ffmpeg-installer/ffmpeg") as { path: string };
    console.log(`[ffmpeg] using installer: ${mod.path}`);
    return mod.path;
  } catch {
    // fall through
  }
  const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (r.status === 0) {
    console.log("[ffmpeg] using system ffmpeg");
    return "ffmpeg";
  }
  console.warn("[ffmpeg] NOT FOUND — video conversion will be skipped");
  return "";
}

const FFMPEG = resolveFfmpeg();

// ---------------------------------------------------------------- visual cursor
const CURSOR_INIT = `
(() => {
  const attach = () => {
    if (document.getElementById('__demo_cursor')) return;
    const c = document.createElement('div');
    c.id = '__demo_cursor';
    Object.assign(c.style, {
      position: 'fixed', left: '80px', top: '80px',
      width: '22px', height: '22px',
      borderRadius: '50%',
      background: 'rgba(30, 64, 175, 0.82)',
      border: '3px solid white',
      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
      pointerEvents: 'none',
      zIndex: '2147483647',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.1s ease, height 0.1s ease, background 0.1s ease'
    });
    document.documentElement.appendChild(c);
    const mv = (e) => {
      c.style.left = e.clientX + 'px';
      c.style.top = e.clientY + 'px';
    };
    const dn = () => {
      c.style.width = '14px'; c.style.height = '14px';
      c.style.background = 'rgba(239, 68, 68, 0.92)';
    };
    const up = () => {
      c.style.width = '22px'; c.style.height = '22px';
      c.style.background = 'rgba(30, 64, 175, 0.82)';
    };
    window.addEventListener('mousemove', mv, true);
    window.addEventListener('pointermove', mv, true);
    window.addEventListener('mousedown', dn, true);
    window.addEventListener('pointerdown', dn, true);
    window.addEventListener('mouseup', up, true);
    window.addEventListener('pointerup', up, true);
  };
  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
`;

// ---------------------------------------------------------------- demo flow
const wait = (page: Page, ms: number) => page.waitForTimeout(ms);

const smoothScroll = (page: Page, y: number) =>
  page.evaluate(
    (target) => window.scrollTo({ top: target, behavior: "smooth" }),
    y,
  );

async function runDemo(page: Page) {
  // -------- [0:00-0:15] main map
  console.log("[demo] main map");
  await page.goto(LIVE, { waitUntil: "networkidle", timeout: 45_000 });
  await page.waitForSelector(".leaflet-marker-icon", { timeout: 25_000 });
  await page.mouse.move(680, 420, { steps: 25 });
  await wait(page, 1800);

  // Glide over ticker
  await page.mouse.move(700, 90, { steps: 22 });
  await wait(page, 900);

  console.log("[demo] toggle 철거 filter");
  const chulgeo = page.locator("label", { hasText: "철거" }).first();
  await chulgeo.hover();
  await wait(page, 350);
  await chulgeo.click();
  await wait(page, 1000);
  await chulgeo.click();
  await wait(page, 800);

  console.log("[demo] zoom in (Leaflet control)");
  await page.mouse.move(1100, 650, { steps: 20 });
  await wait(page, 250);
  const zoomIn = page.locator(".leaflet-control-zoom-in");
  for (let i = 0; i < 2; i++) {
    await zoomIn.click();
    await wait(page, 650);
  }

  console.log("[demo] click first marker");
  const marker = page.locator(".leaflet-marker-icon").first();
  await marker.hover();
  await wait(page, 300);
  await marker.click();
  await wait(page, 2200);

  console.log("[demo] go to detail");
  const detailLink = page.locator(".leaflet-popup a", {
    hasText: "상세 보기",
  });
  await detailLink.click();
  await page.waitForLoadState("networkidle");

  // -------- [0:15-0:40] detail
  await wait(page, 2800); // gauge animation
  await smoothScroll(page, 360);
  await wait(page, 1600);

  console.log("[demo] 기본 정보 tab");
  const tabInfo = page.locator("button", { hasText: "기본 정보" });
  await tabInfo.hover();
  await wait(page, 250);
  await tabInfo.click();
  await wait(page, 1900);

  console.log("[demo] AI 분석 tab");
  const tabAi = page.locator("button", { hasText: "AI 분석" });
  await tabAi.hover();
  await wait(page, 250);
  await tabAi.click();
  await wait(page, 3600);

  console.log("[demo] 전력사용량 tab");
  const tabPower = page.locator("button", { hasText: "전력사용량" });
  await tabPower.hover();
  await wait(page, 250);
  await tabPower.click();
  await wait(page, 900);
  await smoothScroll(page, 780);
  await wait(page, 3400);

  // Scroll to CTA bottom
  await smoothScroll(page, 1500);
  await wait(page, 2000);

  // -------- [0:40-1:00] dashboard
  console.log("[demo] dashboard");
  await page.goto(`${LIVE}/dashboard`, { waitUntil: "networkidle" });
  await page.mouse.move(640, 280, { steps: 20 });
  await wait(page, 1800);

  await smoothScroll(page, 380);
  await wait(page, 2800);

  await smoothScroll(page, 800);
  await wait(page, 3400);

  await smoothScroll(page, 1280);
  await wait(page, 3400);

  await smoothScroll(page, 1860);
  await wait(page, 3400);
}

// ---------------------------------------------------------------- screenshots
interface Shots {
  pipeline: string;
  aiTab: string;
  dashKpi: string;
}

async function captureShots(): Promise<Shots> {
  console.log("[shot] launching screenshot browser");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Main pipeline overlay
  console.log("[shot] main pipeline overlay");
  await page.goto(LIVE, { waitUntil: "networkidle" });
  await page.waitForSelector(".leaflet-marker-icon", { timeout: 25_000 });
  await wait(page, 1400);
  const pipelineShot = path.join(SHOTS, "pipeline.png");
  await page.screenshot({
    path: pipelineShot,
    clip: { x: 330, y: 120, width: 420, height: 300 },
  });

  // 2. House detail — AI 분석 tab
  console.log("[shot] house detail AI tab");
  await page.goto(`${LIVE}/house/H00018`, { waitUntil: "networkidle" });
  await wait(page, 1500);
  const tabAi = page.locator("button", { hasText: "AI 분석" });
  await tabAi.click();
  await wait(page, 1800);
  await smoothScroll(page, 340);
  await wait(page, 800);
  const aiShot = path.join(SHOTS, "ai_tab.png");
  await page.screenshot({
    path: aiShot,
    clip: { x: 20, y: 200, width: 960, height: 720 },
  });

  // 3. Dashboard KPIs
  console.log("[shot] dashboard KPIs");
  await page.goto(`${LIVE}/dashboard`, { waitUntil: "networkidle" });
  await wait(page, 1500);
  const kpiShot = path.join(SHOTS, "dash_kpi.png");
  await page.screenshot({
    path: kpiShot,
    clip: { x: 20, y: 200, width: 1400, height: 430 },
  });

  await browser.close();
  return { pipeline: pipelineShot, aiTab: aiShot, dashKpi: kpiShot };
}

// ---------------------------------------------------------------- comment extraction
interface CodeExcerpt {
  path: string;
  lineStart: number;
  code: string;
}

function extractComments(): CodeExcerpt[] {
  const candidates = [
    "lib/types.ts",
    "scripts/generate-houses.mjs",
    "app/page.tsx",
    "app/dashboard/page.tsx",
    "components/HouseDetailView.tsx",
  ];
  const kwRe = /(ViT|LSTM|GPT-4o)/;
  const commentRe = /^\s*(\/\/|\/\*|\*|#)/;
  const results: CodeExcerpt[] = [];

  for (const rel of candidates) {
    if (results.length >= 3) break;
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, "utf8");
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (kwRe.test(lines[i]) && commentRe.test(lines[i])) {
        const start = i;
        let end = i;
        while (
          end + 1 < lines.length &&
          end - start < 4 &&
          commentRe.test(lines[end + 1])
        ) {
          end++;
        }
        results.push({
          path: rel,
          lineStart: start + 1,
          code: lines.slice(start, end + 1).join("\n"),
        });
        break; // one per file
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------- PDF html
function imgToDataUrl(filepath: string): string {
  const buf = fs.readFileSync(filepath);
  const ext = path.extname(filepath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(code: string): string {
  let out = escapeHtml(code);
  out = out.replace(
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
    (m) =>
      `<span class="hl-comment">${m.replace(
        /(\b(?:ViT|LSTM|GPT-4o)\b)/g,
        '<span class="hl-kw">$1</span>',
      )}</span>`,
  );
  return out;
}

function buildPdfHtml(shots: Shots, excerpts: CodeExcerpt[]): string {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pipelineImg = imgToDataUrl(shots.pipeline);
  const aiImg = imgToDataUrl(shots.aiTab);
  const kpiImg = imgToDataUrl(shots.dashKpi);

  const codeCards = excerpts
    .map(
      (e) => `
    <div class="code-card">
      <div class="code-path">
        <span class="code-path-icon">▸</span>
        <span>${escapeHtml(e.path)}:${e.lineStart}</span>
      </div>
      <pre class="code">${highlightCode(e.code)}</pre>
    </div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>AI 도구 활용 증빙 자료 — 공가지도</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Serif+KR:wght@700;900&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: "Pretendard Variable", "Pretendard", system-ui, sans-serif;
    color: #0a1324;
    line-height: 1.65;
    font-size: 11pt;
    font-feature-settings: "ss06", "kern";
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page { size: A4; margin: 0; }
  .page {
    width: 210mm;
    height: 297mm;
    padding: 20mm 18mm 16mm;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }

  /* ==== Cover ==== */
  .cover {
    background:
      radial-gradient(700px 420px at 90% -10%, rgba(37,99,235,0.08), transparent 60%),
      radial-gradient(500px 360px at -5% 110%, rgba(16,185,129,0.08), transparent 65%),
      linear-gradient(180deg, #ffffff 0%, #f5f8fc 100%);
    display: flex;
    flex-direction: column;
  }
  .cover-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28mm;
  }
  .cover-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 999px;
    background: #1e40af;
    color: white;
    font-weight: 800;
    font-size: 9pt;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .cover-badge::before {
    content: "";
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #34d399;
  }
  .cover-org {
    font-family: "Noto Serif KR", serif;
    font-weight: 900;
    font-size: 14pt;
    color: #1e40af;
  }
  .cover-kicker {
    font-size: 11pt;
    color: #475a7a;
    font-weight: 600;
    letter-spacing: 0.005em;
  }
  .cover-title {
    font-size: 48pt;
    font-weight: 900;
    letter-spacing: -0.04em;
    margin: 6mm 0 10mm;
    color: #0a1324;
    line-height: 1.02;
  }
  .cover-sub {
    font-size: 16pt;
    font-weight: 700;
    color: #1f2a44;
    margin: 0;
    line-height: 1.45;
    letter-spacing: -0.02em;
  }
  .cover-sub .hanja {
    font-family: "Noto Serif KR", serif;
    color: #1e40af;
    font-weight: 900;
    margin-left: 4px;
  }
  .cover-meta {
    margin-top: auto;
    padding-top: 10mm;
    border-top: 2px solid #1e40af;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8mm;
  }
  .cover-meta-item .label {
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #6a7a96;
    font-weight: 800;
    margin-bottom: 2.5mm;
  }
  .cover-meta-item .value {
    font-size: 12pt;
    font-weight: 800;
    color: #0a1324;
    letter-spacing: -0.01em;
  }
  .cover-meta-item .value.mono {
    font-family: "JetBrains Mono", monospace;
    font-size: 11pt;
    font-weight: 700;
  }
  .cover-hanja-bg {
    position: absolute;
    right: -40mm;
    bottom: -50mm;
    font-family: "Noto Serif KR", serif;
    font-size: 260pt;
    font-weight: 900;
    color: rgba(30, 64, 175, 0.045);
    line-height: 1;
    pointer-events: none;
    letter-spacing: -0.05em;
  }

  /* ==== Section pages ==== */
  .section-header {
    display: flex;
    align-items: baseline;
    gap: 10mm;
    margin-bottom: 6mm;
    padding-bottom: 3mm;
    border-bottom: 1px solid #e2e8f1;
  }
  .section-num {
    font-family: "JetBrains Mono", monospace;
    font-size: 10pt;
    color: #1e40af;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  .section-title {
    font-size: 20pt;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.028em;
    color: #0a1324;
  }
  .lede {
    font-size: 10.5pt;
    color: #1f2a44;
    line-height: 1.88;
    margin: 0 0 7mm 0;
  }
  .lede strong {
    color: #1e40af;
    font-weight: 800;
    background: linear-gradient(to top, rgba(30,64,175,0.09) 35%, transparent 35%);
    padding: 0 2px;
  }

  /* Pipeline diagram */
  .diagram {
    margin: 4mm 0 6mm;
    padding: 7mm 5mm 8mm;
    border-radius: 3mm;
    background: linear-gradient(180deg, #fafbfd 0%, #f5f8fc 100%);
    border: 1px solid #e2e8f1;
  }
  .pipeline {
    display: flex;
    align-items: stretch;
    gap: 2mm;
  }
  .node {
    flex: 1 1 0;
    padding: 4mm 3mm;
    border-radius: 2.5mm;
    background: white;
    border: 1px solid #dbeafe;
    box-shadow: 0 2px 6px rgba(13, 24, 58, 0.04);
    text-align: center;
    min-width: 0;
  }
  .node.key {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    border-color: #1e3a8a;
    color: white;
  }
  .node-badge {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 1.5mm;
    color: #1e40af;
  }
  .node.key .node-badge { color: #bfdbfe; }
  .node-title {
    font-size: 11pt;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
  }
  .node-sub {
    font-size: 7.8pt;
    font-weight: 500;
    color: #475a7a;
    margin-top: 1.2mm;
    line-height: 1.4;
  }
  .node.key .node-sub { color: rgba(255,255,255,0.82); }
  .arrow {
    align-self: center;
    color: #1e40af;
    font-size: 12pt;
    font-weight: 700;
    flex-shrink: 0;
    padding: 0 0.5mm;
  }

  .stack {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5mm;
    margin-top: 4mm;
  }
  .stack-item {
    padding: 5mm;
    border-radius: 2.5mm;
    background: #f7f9fc;
    border: 1px solid #e2e8f1;
  }
  .stack-label {
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #1e40af;
    font-weight: 800;
    margin-bottom: 2mm;
  }
  .stack-body {
    font-size: 9.8pt;
    line-height: 1.75;
    color: #1f2a44;
  }

  /* Evidence grid */
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6mm;
    margin-top: 3mm;
  }
  .col-header {
    font-size: 9pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #1e40af;
    margin: 0 0 3mm 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .col-header::before {
    content: "";
    width: 10px;
    height: 2px;
    background: #1e40af;
    border-radius: 2px;
  }
  .col > * + * { margin-top: 4mm; }

  .code-card {
    border: 1px solid #e2e8f1;
    border-radius: 2.5mm;
    overflow: hidden;
    background: #fafbfd;
  }
  .code-path {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2mm 3mm;
    background: #0a1324;
    color: #bfdbfe;
    font-family: "JetBrains Mono", monospace;
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .code-path-icon { color: #60a5fa; }
  pre.code {
    margin: 0;
    padding: 3mm 3.5mm;
    font-family: "JetBrains Mono", monospace;
    font-size: 7.5pt;
    line-height: 1.55;
    color: #0a1324;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .hl-kw {
    color: #1d4ed8;
    font-weight: 800;
    background: #dbeafe;
    padding: 0 2px;
    border-radius: 2px;
  }
  .hl-comment { color: #5b6b85; }

  .shot-card {
    border: 1px solid #e2e8f1;
    border-radius: 2.5mm;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 10px rgba(13, 24, 58, 0.06);
  }
  .shot-caption {
    padding: 2.3mm 3mm;
    font-size: 8.5pt;
    font-weight: 800;
    color: #1e40af;
    background: #eff6ff;
    letter-spacing: -0.005em;
    border-bottom: 1px solid #dbeafe;
  }
  .shot-caption .idx {
    font-family: "JetBrains Mono", monospace;
    color: #1e3a8a;
    margin-right: 4px;
  }
  .shot img {
    width: 100%;
    display: block;
  }

  .footer {
    position: absolute;
    left: 18mm;
    right: 18mm;
    bottom: 8mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8pt;
    color: #6a7a96;
    border-top: 1px solid #e2e8f1;
    padding-top: 3mm;
  }
  .footer-left { font-weight: 700; color: #1e40af; letter-spacing: 0.01em; }
  .footer-right {
    font-family: "JetBrains Mono", monospace;
    font-size: 7.5pt;
    font-weight: 600;
  }
</style>
</head>
<body>

<!-- ========== COVER ========== -->
<section class="page cover">
  <div class="cover-head">
    <div class="cover-badge">AI Evidence · 2026</div>
    <div class="cover-org">空家地圖</div>
  </div>

  <p class="cover-kicker">2026 국토교통 데이터활용 경진대회 · 제출 별첨 자료</p>
  <h1 class="cover-title">
    AI 도구 활용<br/>증빙 자료
  </h1>
  <p class="cover-sub">
    공가지도<span class="hanja">(空家地圖)</span><br/>
    AI가 찾아주는 전국 빈집 재생 플랫폼
  </p>

  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="label">AI Pipeline</div>
      <div class="value">ViT · LSTM · GPT-4o</div>
    </div>
    <div class="cover-meta-item">
      <div class="label">Live URL</div>
      <div class="value mono">kyo-map.vercel.app</div>
    </div>
    <div class="cover-meta-item">
      <div class="label">Date</div>
      <div class="value">${today}</div>
    </div>
  </div>
  <div class="cover-hanja-bg">空</div>
</section>

<!-- ========== PIPELINE OVERVIEW ========== -->
<section class="page">
  <div class="section-header">
    <div class="section-num">01 / PIPELINE</div>
    <h2 class="section-title">AI 파이프라인 개요</h2>
  </div>
  <p class="lede">
    본 프로젝트는 <strong>3단계 AI 파이프라인</strong>으로 구성됩니다.
    <strong>① ViT(Vision Transformer)</strong>로 위성·항공영상에서 빈집 외관을 분류하고,
    <strong>② LSTM</strong>으로 월별 전력사용 시계열을 학습하여 실거주 부재 패턴을 탐지하며,
    <strong>③ GPT-4o</strong>로 각 빈집의 주변 맥락을 종합 분석해 재생 용도(귀촌 / 창업 / 철거)를 추천합니다.
  </p>

  <div class="diagram">
    <div class="pipeline">
      <div class="node">
        <div class="node-badge">DATA</div>
        <div class="node-title">위성영상</div>
        <div class="node-sub">국토지리정보원<br/>0.5 m/px</div>
      </div>
      <div class="arrow">→</div>
      <div class="node key">
        <div class="node-badge">MODEL</div>
        <div class="node-title">ViT 분류</div>
        <div class="node-sub">지붕·식생·<br/>인프라 패턴</div>
      </div>
      <div class="arrow">→</div>
      <div class="node key">
        <div class="node-badge">MODEL</div>
        <div class="node-title">LSTM 시계열</div>
        <div class="node-sub">월별 전력 12M<br/>임계치 2 kWh</div>
      </div>
      <div class="arrow">→</div>
      <div class="node key">
        <div class="node-badge">REASON</div>
        <div class="node-title">GPT-4o 추천</div>
        <div class="node-sub">귀촌 · 창업<br/>철거 매핑</div>
      </div>
      <div class="arrow">→</div>
      <div class="node">
        <div class="node-badge">UI</div>
        <div class="node-title">지도 마커</div>
        <div class="node-sub">색상 · 팝업<br/>재생 시나리오</div>
      </div>
    </div>
  </div>

  <div class="stack">
    <div class="stack-item">
      <div class="stack-label">입력 데이터</div>
      <div class="stack-body">
        · 국토교통부 건축물대장<br/>
        · 한국전력 가명정보 (월별 전력)<br/>
        · 국토지리정보원 위성영상<br/>
        · 안심구역(붕괴위험) API
      </div>
    </div>
    <div class="stack-item">
      <div class="stack-label">출력 결과</div>
      <div class="stack-body">
        · 빈집 확률 (0.60 ~ 0.99)<br/>
        · 재생 용도 추천 (귀촌 · 창업 · 철거)<br/>
        · 근거 텍스트 및 전력패턴 임계 시그널<br/>
        · 지자체 관리 우선순위 스코어
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-left">AI 도구 활용 증빙 · 공가지도 (空家地圖)</div>
    <div class="footer-right">02 / 03</div>
  </div>
</section>

<!-- ========== EVIDENCE ========== -->
<section class="page">
  <div class="section-header">
    <div class="section-num">02 / EVIDENCE</div>
    <h2 class="section-title">코드 주석 · 라이브 동작 화면</h2>
  </div>
  <p class="lede">
    실제 레포지토리에서 <strong>ViT · LSTM · GPT-4o</strong> 키워드를 포함한 주석을 자동 추출하고,
    해당 개념이 반영된 라이브 사이트의 UI 스크린샷을 함께 제시합니다.
  </p>

  <div class="grid">
    <div class="col">
      <div class="col-header">코드 주석 (실파일 발췌)</div>
      ${codeCards}
    </div>
    <div class="col">
      <div class="col-header">라이브 동작 화면</div>
      <div class="shot-card shot">
        <div class="shot-caption"><span class="idx">01</span>메인 지도 · AI 파이프라인 오버레이</div>
        <img src="${pipelineImg}" alt="pipeline overlay" />
      </div>
      <div class="shot-card shot">
        <div class="shot-caption"><span class="idx">02</span>빈집 상세 · "AI 분석" 탭 (H00018)</div>
        <img src="${aiImg}" alt="ai analysis tab" />
      </div>
      <div class="shot-card shot">
        <div class="shot-caption"><span class="idx">03</span>대시보드 · 평균 AI 신뢰도 KPI</div>
        <img src="${kpiImg}" alt="dashboard kpi" />
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-left">AI 도구 활용 증빙 · 공가지도 (空家地圖)</div>
    <div class="footer-right">03 / 03</div>
  </div>
</section>

</body>
</html>`;
}

async function renderPdf(html: string) {
  console.log("[pdf] rendering");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(700);
  await page.pdf({
    path: PDF,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`[pdf] saved -> ${PDF}`);
}

// ---------------------------------------------------------------- ffmpeg
function runFfmpeg(args: string[]): void {
  const r = spawnSync(FFMPEG, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

async function convertVideo(): Promise<void> {
  if (!FFMPEG) return;

  console.log("[ffmpeg] webm -> mp4 (H.264)");
  runFfmpeg([
    "-y",
    "-i",
    VIDEO_WEBM,
    "-c:v",
    "libx264",
    "-crf",
    "23",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    MP4,
  ]);

  const attempts: Array<{ fps: number; scale: number; colors: number }> = [
    { fps: 15, scale: 960, colors: 160 },
    { fps: 12, scale: 800, colors: 128 },
    { fps: 10, scale: 720, colors: 96 },
    { fps: 8, scale: 640, colors: 64 },
  ];

  for (const a of attempts) {
    console.log(
      `[ffmpeg] webm -> gif (fps=${a.fps}, scale=${a.scale}, colors=${a.colors})`,
    );
    runFfmpeg([
      "-y",
      "-i",
      VIDEO_WEBM,
      "-vf",
      `fps=${a.fps},scale=${a.scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${a.colors}[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`,
      GIF,
    ]);
    const size = fs.statSync(GIF).size;
    const mb = size / 1024 / 1024;
    console.log(`[ffmpeg] gif size: ${mb.toFixed(2)} MB`);
    if (size <= 8 * 1024 * 1024) break;
  }
}

// ---------------------------------------------------------------- main
async function main() {
  console.log("==============================================");
  console.log("  공가지도 — 공모전 별첨 자료 생성");
  console.log(`  LIVE: ${LIVE}`);
  console.log("==============================================\n");

  // 1. Video recording
  console.log("[1/4] demo video recording");
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: RAW, size: { width: 1280, height: 800 } },
  });
  await context.addInitScript(CURSOR_INIT);
  const page = await context.newPage();

  const start = Date.now();
  try {
    await runDemo(page);
  } catch (err) {
    console.error("[demo] error:", err);
  }
  const durationS = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`[demo] duration: ${durationS}s`);

  const video = page.video();
  await context.close();
  if (video) {
    await video.saveAs(VIDEO_WEBM);
    console.log(`[video] saved -> ${VIDEO_WEBM}`);
  }
  await browser.close();

  // 2. ffmpeg conversion
  console.log("\n[2/4] ffmpeg video conversion");
  await convertVideo();

  // 3. Screenshots
  console.log("\n[3/4] screenshots for PDF");
  const shots = await captureShots();

  // 4. PDF
  console.log("\n[4/4] rendering PDF");
  const excerpts = extractComments();
  console.log(
    `[pdf] extracted ${excerpts.length} comment block(s) from source`,
  );
  const html = buildPdfHtml(shots, excerpts);
  fs.writeFileSync(path.join(OUT, "ai_evidence.html"), html, "utf8");
  await renderPdf(html);

  // Summary
  console.log("\n==============================================");
  console.log("  DONE");
  console.log("==============================================");
  const sizeOf = (p: string) =>
    fs.existsSync(p)
      ? `${(fs.statSync(p).size / 1024 / 1024).toFixed(2)} MB`
      : "n/a";
  console.log(`  GIF : ${GIF}  (${sizeOf(GIF)})`);
  console.log(`  MP4 : ${MP4}  (${sizeOf(MP4)})`);
  console.log(`  PDF : ${PDF}  (${sizeOf(PDF)})`);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
