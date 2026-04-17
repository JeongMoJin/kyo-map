/**
 * 2026 국토교통 데이터활용 경진대회 — 최종 제출 패키지 생성
 *
 * 산출물: FINAL_SUBMIT/ 디렉토리에 5개 파일 (01~05 프리픽스, 네이밍 표준화)
 *
 * 실행:
 *   npx tsx scripts/finalize-submission.ts
 *   npx tsx scripts/finalize-submission.ts \
 *     --신청서 "C:/path/to/신청서.pdf" \
 *     --서약서 "C:/path/to/서약서.pdf" \
 *     --기획서 "C:/path/to/기획서.pdf"
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------- paths
const ROOT = process.cwd();
const FINAL = path.join(ROOT, "FINAL_SUBMIT");
const SUBMISSION = path.join(ROOT, "submission");

// 사용자가 지정한 윈도우 경로 (기본값). bash에서 접근 가능하도록 POSIX 변환.
const DEFAULT_EXT = "C:\\Users\\FLAG\\Desktop\\FLAG_Jin\\Document\\project\\kyo";
const DEFAULTS = {
  신청서: path.join(DEFAULT_EXT, "2026경진대회_참가신청서(최종).pdf"),
  서약서: path.join(DEFAULT_EXT, "2026경진대회_서약서(최종).pdf"),
  기획서: path.join(DEFAULT_EXT, "공가지도_기획서_초안.pdf"),
};

// ---------------------------------------------------------------- args
function parseArgs(): Record<string, string> {
  const out: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1];
      if (val && !val.startsWith("--")) {
        out[key] = val;
        i++;
      }
    }
  }
  return out;
}
const args = parseArgs();

const SRC = {
  신청서: args["신청서"] ?? DEFAULTS.신청서,
  서약서: args["서약서"] ?? DEFAULTS.서약서,
  기획서: args["기획서"] ?? DEFAULTS.기획서,
  증빙: path.join(SUBMISSION, "ai_evidence.pdf"),
  영상: path.join(SUBMISSION, "demo.mp4"),
};

// ---------------------------------------------------------------- target filenames
const TARGETS: Array<{
  idx: string;
  src: string;
  name: string;
  label: string;
  kind: "pdf" | "mp4";
}> = [
  {
    idx: "01",
    src: SRC.신청서,
    name: "01_참가신청서_공가지도_진정모.pdf",
    label: "참가 기본 정보",
    kind: "pdf",
  },
  {
    idx: "02",
    src: SRC.서약서,
    name: "02_서약서_공가지도_진정모.pdf",
    label: "공모전 서약",
    kind: "pdf",
  },
  {
    idx: "03",
    src: SRC.기획서,
    name: "03_기획서_공가지도_진정모.pdf",
    label: "본 기획서",
    kind: "pdf",
  },
  {
    idx: "04",
    src: SRC.증빙,
    name: "04_AI활용증빙_공가지도_진정모.pdf",
    label: "ViT/LSTM/GPT-4o 활용 증빙",
    kind: "pdf",
  },
  {
    idx: "05",
    src: SRC.영상,
    name: "05_시연영상_공가지도_진정모.mp4",
    label: "46초 웹 시연 영상",
    kind: "mp4",
  },
];

// ---------------------------------------------------------------- validation helpers
function resolveFfmpeg(): string {
  try {
    const mod = require("@ffmpeg-installer/ffmpeg") as { path: string };
    return mod.path;
  } catch {
    const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
    if (r.status === 0) return "ffmpeg";
    return "";
  }
}
const FFMPEG = resolveFfmpeg();

function assertPdf(filePath: string): { ok: boolean; note: string } {
  try {
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    const header = buf.toString("ascii", 0, 5);
    if (header === "%PDF-") return { ok: true, note: "PDF" };
    return { ok: false, note: `invalid header: ${header}` };
  } catch (e) {
    return { ok: false, note: `read error: ${(e as Error).message}` };
  }
}

function getMp4Duration(filePath: string): number {
  if (!FFMPEG) return -1;
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", filePath], {
    encoding: "utf8",
  });
  // ffmpeg prints info to stderr and exits non-zero (no output file) — both fine
  const out = (r.stderr ?? "") + (r.stdout ?? "");
  const m = out.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!m) return 0;
  const [, h, mm, ss] = m;
  return parseInt(h, 10) * 3600 + parseInt(mm, 10) * 60 + parseFloat(ss);
}

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

function pad(s: string, w: number): string {
  // 한글 2칸 너비 고려한 간단한 패딩
  let width = 0;
  for (const ch of s) {
    width += /[\u3131-\uD79D]/.test(ch) ? 2 : 1;
  }
  return s + " ".repeat(Math.max(0, w - width));
}

// ---------------------------------------------------------------- main
function main() {
  console.log("==========================================");
  console.log("  2026 국토교통 경진대회 — 최종 제출 패키지");
  console.log("==========================================\n");

  // 0. source existence check
  const missing: string[] = [];
  for (const t of TARGETS) {
    if (!fs.existsSync(t.src)) missing.push(`${t.idx} → ${t.src}`);
  }
  if (missing.length > 0) {
    console.error("❌ 누락된 원본 파일:");
    for (const m of missing) console.error(`   - ${m}`);
    console.error("\n해결: 경로를 확인하거나 아래 플래그로 지정하세요.");
    console.error(
      "   npx tsx scripts/finalize-submission.ts --신청서 <경로> --서약서 <경로> --기획서 <경로>",
    );
    process.exit(1);
  }

  // 1. prepare FINAL_SUBMIT
  if (fs.existsSync(FINAL)) fs.rmSync(FINAL, { recursive: true, force: true });
  fs.mkdirSync(FINAL, { recursive: true });
  console.log(`📁 ${FINAL}\n`);

  // 2. copy each
  interface Row {
    idx: string;
    name: string;
    size: number;
    sizeLabel: string;
    ok: boolean;
    note: string;
  }
  const rows: Row[] = [];
  let total = 0;

  for (const t of TARGETS) {
    const dst = path.join(FINAL, t.name);
    fs.copyFileSync(t.src, dst);
    const size = fs.statSync(dst).size;
    total += size;

    let ok = false;
    let note = "";
    if (size === 0) {
      ok = false;
      note = "empty file";
    } else if (t.kind === "pdf") {
      const r = assertPdf(dst);
      ok = r.ok;
      note = r.ok ? "✅ PDF" : `❌ ${r.note}`;
    } else if (t.kind === "mp4") {
      const dur = getMp4Duration(dst);
      if (dur > 0) {
        ok = true;
        note = `✅ ${Math.round(dur)}초`;
      } else if (dur === -1) {
        ok = true;
        note = "✅ MP4 (ffmpeg 없음)";
      } else {
        ok = false;
        note = "❌ duration unreadable";
      }
    }
    rows.push({
      idx: t.idx,
      name: t.name,
      size,
      sizeLabel: formatBytes(size),
      ok,
      note,
    });
    console.log(
      `  ${t.idx}  ${t.name.padEnd(45, " ")}  ${formatBytes(size).padStart(8, " ")}  ${note}`,
    );
  }

  // 3. README.txt bonus
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const readme = [
    "2026 국토교통 데이터활용 경진대회 제출 자료",
    "=================================================",
    "",
    "참가자명  : 진정모",
    "아이템명  : 공가지도(空家地圖)",
    "응모분야  : 제품/서비스 개발",
    `제출일    : ${today}`,
    "",
    "[파일 목록]",
    ...TARGETS.map((t) => `${t.name} — ${t.label}`),
    "",
    "[라이브 URL]",
    "https://kyo-map.vercel.app",
    "",
    "[재생 안내]",
    "· PDF 4종은 일반 PDF 뷰어에서 바로 확인 가능합니다.",
    "· MP4 시연영상은 H.264 코덱으로 인코딩되어 있어 Windows Media Player,",
    "  macOS QuickTime, 모든 주요 브라우저에서 재생됩니다.",
    "",
  ].join("\r\n"); // Windows 호환
  fs.writeFileSync(path.join(FINAL, "README.txt"), readme, "utf8");

  // 4. summary report
  console.log("\n");
  const allOk = rows.every((r) => r.ok);
  const totalMB = total / 1024 / 1024;

  const line = "─".repeat(78);
  console.log("📦 FINAL_SUBMIT/ 최종 패키지 (5개 파일)\n");
  console.log("┌" + line + "┐");
  console.log(
    "│ " +
      pad("번호", 6) +
      "│ " +
      pad("파일명", 50) +
      "│ " +
      pad("크기", 10) +
      "│ " +
      pad("검증", 14) +
      "│",
  );
  console.log("├" + line + "┤");
  for (const r of rows) {
    console.log(
      "│ " +
        pad(r.idx, 6) +
        "│ " +
        pad(r.name, 50) +
        "│ " +
        pad(r.sizeLabel, 10) +
        "│ " +
        pad(r.note, 14) +
        "│",
    );
  }
  console.log("└" + line + "┘");

  console.log("");
  console.log(
    `총 용량  : ${totalMB.toFixed(2)} MB ${totalMB <= 100 ? "✓" : "⚠ 100MB 초과"} (제한 100MB)`,
  );
  console.log(
    `파일 개수: ${rows.length}개 ${rows.length === 5 ? "✓" : "⚠"} (제한 5개)`,
  );
  console.log(
    `전체 검증: ${allOk ? "✅ 모든 파일 유효" : "❌ 검증 실패 파일 존재 (위 표 확인)"}`,
  );

  console.log("");
  console.log("📤 업로드 방법");
  console.log(
    "   국가교통 데이터 오픈마켓(bigdata-transportation.kr) 제출 폼에서",
  );
  console.log("   FINAL_SUBMIT/ 안의 5개 파일을 순서대로 업로드하세요.");
  console.log("   (README.txt는 참고용 — 업로드 대상 아님)");
  console.log("");

  if (!allOk) process.exit(1);
}

main();
