"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "@/components/Toast";
import type { House } from "@/lib/types";

interface Recommendation {
  source: "openai" | "local-fallback";
  model: string;
  summary: string;
  recommendedAction: string;
  checklist: string[];
  caveats: string[];
  generatedAt: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  warning?: string;
}

interface RecommendationResponse {
  ok: boolean;
  recommendation?: Recommendation;
  error?: {
    message?: string;
  };
}

function formatGeneratedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AiRecommendationPanel({ house }: { house: House }) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  async function handleGenerate() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/ai/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId: house.id }),
      });
      const data = (await response.json()) as RecommendationResponse;

      if (!response.ok || !data.ok || !data.recommendation) {
        throw new Error(data.error?.message || "GPT 분석을 생성하지 못했습니다.");
      }

      setRecommendation(data.recommendation);
      toast({
        title:
          data.recommendation.source === "openai"
            ? "GPT 분석을 생성했습니다"
            : "로컬 분석으로 대체했습니다",
        description:
          data.recommendation.source === "openai"
            ? `${data.recommendation.model} · ${house.id}`
            : "API 응답이 없을 때도 업무 흐름은 유지됩니다.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "GPT 분석을 생성하지 못했습니다.";
      setErrorMessage(message);
      toast({
        title: "GPT 분석 실패",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[color:var(--brand-100)] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
            <Sparkles className="h-3.5 w-3.5" />
            GPT 실시간 분석
          </div>
          <p className="mt-1 text-[12.5px] font-medium leading-[1.65] text-[color:var(--ink-muted)]">
            버튼을 누를 때만 OpenAI API를 호출합니다. 실패 시에는 같은 데이터로
            로컬 분석을 표시합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[color:var(--brand-800)] px-3.5 py-2 text-[12.5px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-65"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "생성 중" : "GPT 분석 생성"}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium leading-[1.55] text-red-800">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {errorMessage}
        </div>
      )}

      {recommendation ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                recommendation.source === "openai"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              {recommendation.source === "openai" ? "OpenAI 응답" : "로컬 fallback"}
            </span>
            <span className="font-mono text-[11px] font-bold text-[color:var(--ink-muted)]">
              {recommendation.model}
            </span>
            <span className="text-[11px] font-medium text-[color:var(--ink-muted)]">
              {formatGeneratedAt(recommendation.generatedAt)}
            </span>
            {recommendation.usage?.totalTokens ? (
              <span className="text-[11px] font-medium text-[color:var(--ink-muted)]">
                {recommendation.usage.totalTokens.toLocaleString("ko-KR")} tokens
              </span>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] font-extrabold text-[color:var(--ink-strong)]">
              요약
            </div>
            <p className="mt-1 text-[13px] font-medium leading-[1.7] text-[color:var(--ink)]">
              {recommendation.summary}
            </p>
          </div>

          <div className="rounded-lg bg-[color:var(--brand-50)] px-3 py-2.5 text-[12.5px] font-bold leading-[1.6] text-[color:var(--brand-900)]">
            {recommendation.recommendedAction}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1.5 text-[12px] font-extrabold text-[color:var(--ink-strong)]">
                확인 체크리스트
              </div>
              <ul className="space-y-1.5">
                {recommendation.checklist.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-[color:var(--surface-muted)] px-3 py-2 text-[12px] font-medium leading-[1.55] text-[color:var(--ink)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-1.5 text-[12px] font-extrabold text-[color:var(--ink-strong)]">
                유의사항
              </div>
              <ul className="space-y-1.5">
                {recommendation.caveats.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] font-medium leading-[1.55] text-amber-900"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {recommendation.warning ? (
            <div className="text-[11.5px] font-medium text-[color:var(--ink-muted)]">
              {recommendation.warning}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-[color:var(--surface-muted)] px-3 py-3 text-[12.5px] font-medium leading-[1.65] text-[color:var(--ink-muted)]">
          아직 GPT 분석을 생성하지 않았습니다. 기존 AI 추정 근거를 검토한 뒤
          필요한 후보에서만 생성하면 비용을 아낄 수 있습니다.
        </div>
      )}
    </div>
  );
}
