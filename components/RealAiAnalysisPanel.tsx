"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCcw, Sparkles } from "lucide-react";
import type { House } from "@/lib/types";

interface VacancyAiAnalysis {
  mode: "openai_responses" | "local_policy_scoring";
  configured: boolean;
  model: string;
  generatedAt: string;
  vacancyLikelihood: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedAction: string;
  policyUse: string;
  fieldInspectionChecklist: string[];
  evidenceSummary: string[];
  dataLimitations: string[];
  confidenceRationale: string;
  warning?: string;
}

const RISK_LABELS: Record<VacancyAiAnalysis["riskLevel"], string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
  critical: "긴급",
};

export function RealAiAnalysisPanel({ house }: { house: House }) {
  const [analysis, setAnalysis] = useState<VacancyAiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ house }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = (await response.json()) as VacancyAiAnalysis;
      setAnalysis(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "unknown error");
    } finally {
      setLoading(false);
    }
  }

  const isOpenAi = analysis?.mode === "openai_responses";

  return (
    <div className="rounded-xl border border-[color:var(--brand-100)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
            <Sparkles className="h-3.5 w-3.5" />
            Real AI analysis
          </div>
          <h3 className="mt-1 text-[16px] font-extrabold text-[color:var(--ink-strong)]">
            OpenAI 정책 분석 실행
          </h3>
          <p className="mt-1 text-[12.5px] font-medium leading-[1.6] text-[color:var(--ink-muted)]">
            서버 API가 후보 속성과 공공데이터 맥락을 OpenAI Responses API로 보내
            우선순위, 조치안, 한계를 구조화 JSON으로 받습니다.
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[color:var(--brand-800)] px-3.5 py-2 text-[12px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)] disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "분석 중" : analysis ? "다시 분석" : "AI 분석 실행"}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-800">
          AI 분석 요청 실패: {error}
        </div>
      )}

      {!analysis && !error && (
        <div className="mt-3 rounded-lg bg-[color:var(--surface-muted)] px-3 py-2 text-[12px] font-semibold leading-[1.6] text-[color:var(--ink-muted)]">
          발표 데모에서는 상세 후보 1건을 열고 이 버튼을 눌러 실제 AI 호출 여부를
          보여주면 됩니다. 키가 없으면 로컬 정책 산식 fallback을 명시합니다.
        </div>
      )}

      {analysis && (
        <div className="mt-4 space-y-3">
          <div
            className={`flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-extrabold ${
              isOpenAi
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            {isOpenAi ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            <span>{isOpenAi ? "OpenAI Responses API 실행" : "로컬 정책 산식 fallback"}</span>
            <span className="rounded-full bg-white/80 px-2 py-0.5 font-mono text-[10.5px]">
              {analysis.model}
            </span>
          </div>

          {analysis.warning && (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] font-semibold leading-[1.55] text-amber-800">
              {analysis.warning}
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-3">
            <MiniResult
              label="빈집 후보 가능성"
              value={`${analysis.vacancyLikelihood}%`}
            />
            <MiniResult label="위험도" value={RISK_LABELS[analysis.riskLevel]} />
            <MiniResult
              label="생성 시각"
              value={new Date(analysis.generatedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>

          <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
            <div className="text-[12px] font-extrabold text-[color:var(--ink-strong)]">
              권장 행정 조치
            </div>
            <p className="mt-1 text-[13px] font-semibold leading-[1.65] text-[color:var(--ink)]">
              {analysis.recommendedAction}
            </p>
            <p className="mt-2 text-[12px] font-medium leading-[1.6] text-[color:var(--ink-muted)]">
              {analysis.policyUse}
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <ListBlock title="현장점검 체크리스트" items={analysis.fieldInspectionChecklist} />
            <ListBlock title="AI 근거 요약" items={analysis.evidenceSummary} />
            <ListBlock title="데이터 한계" items={analysis.dataLimitations} />
          </div>

          <div className="rounded-lg bg-[color:var(--brand-50)] px-3 py-2 text-[12px] font-semibold leading-[1.6] text-[color:var(--brand-800)]">
            {analysis.confidenceRationale}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniResult({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-white px-3 py-2">
      <div className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
        {label}
      </div>
      <div className="tnum mt-1 text-[18px] font-extrabold text-[color:var(--ink-strong)]">
        {value}
      </div>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-white p-3">
      <div className="text-[12px] font-extrabold text-[color:var(--ink-strong)]">
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-[11.5px] font-medium leading-[1.55] text-[color:var(--ink-muted)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
