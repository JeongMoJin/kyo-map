"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/SiteHeader";
import { LiveTicker } from "@/components/LiveTicker";
import { FilterSidebar, type Filters } from "@/components/FilterSidebar";
import { HOUSES, getSidoList } from "@/lib/houses";
import type { RecommendedUse } from "@/lib/types";
import { USE_LABELS } from "@/lib/types";
import { Sparkles, Cpu, Info } from "lucide-react";

// AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT-4o(용도 추천)
const MapView = dynamic(() => import("@/components/HouseMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--surface-muted)]">
      <div className="flex flex-col items-center gap-3 text-[color:var(--ink-muted)]">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-[color:var(--brand-500)] opacity-40" />
          <div className="relative h-8 w-8 rounded-full border-2 border-[color:var(--brand-600)] border-t-transparent animate-spin" />
        </div>
        <div className="text-[12.5px] font-semibold">위성 타일 불러오는 중…</div>
      </div>
    </div>
  ),
});

const INITIAL_FILTERS: Filters = {
  uses: { 귀촌: true, 창업: true, 철거: true },
  sido: "",
  minConfidence: 0.6,
  disasterOnly: false,
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const sidoList = useMemo(() => getSidoList(), []);

  const filtered = useMemo(() => {
    return HOUSES.filter((h) => {
      if (!filters.uses[h.recommendedUse]) return false;
      if (filters.sido && !h.address.startsWith(filters.sido)) return false;
      if (h.aiConfidence < filters.minConfidence) return false;
      if (filters.disasterOnly && !h.isDisasterZone) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader active="map" />
      <LiveTicker total={filtered.length} />

      <main className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden w-[320px] shrink-0 border-r border-[color:var(--line)] lg:flex">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            sidoList={sidoList}
            visible={filtered}
          />
        </div>

        {/* Map */}
        <div className="relative flex-1">
          <MapView houses={filtered} />

          {/* Top-left headline overlay */}
          <div className="pointer-events-none absolute left-4 top-4 z-[400] max-w-[380px]">
            <div className="card pointer-events-auto fade-in-up p-5">
              <div className="flex items-center gap-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand-800)]">
                <Sparkles className="h-3 w-3" />
                LIVE · 실시간 탐지 결과
              </div>
              <div className="font-display mt-2 text-[26px] font-extrabold leading-[1.15] text-[color:var(--ink-strong)]">
                전국 공가
                <span className="font-hanja mx-1 text-[20px] font-bold text-[color:var(--brand-800)]">
                  (空家)
                </span>
                <span className="tnum text-[color:var(--brand-800)]">
                  {filtered.length.toLocaleString()}
                </span>
                <span className="text-[22px]">건</span>
              </div>
              <div className="mt-2 text-[12.5px] leading-[1.6] text-[color:var(--ink-muted)]">
                AI가 재생 용도를 자동 추천합니다. 마커를 클릭하면 상세 분석으로
                이동합니다.
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(Object.keys(USE_LABELS) as RecommendedUse[]).map((k) => {
                  const count = filtered.filter(
                    (h) => h.recommendedUse === k,
                  ).length;
                  return (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-muted)] px-2.5 py-1 text-[11.5px] font-bold text-[color:var(--ink)]"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            k === "귀촌"
                              ? "#10b981"
                              : k === "창업"
                                ? "#2563eb"
                                : "#ef4444",
                        }}
                      />
                      {USE_LABELS[k]} <span className="tnum">{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="card pointer-events-auto mt-3 flex items-start gap-2.5 p-3.5 text-[12px] leading-[1.6] text-[color:var(--ink-muted)]">
              <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" />
              <div>
                <span className="font-bold text-[color:var(--ink-strong)]">
                  AI 파이프라인
                </span>{" "}
                · ViT로 위성영상 분류 → LSTM으로 월별 전력패턴 학습 → GPT-4o가
                용도 추천
              </div>
            </div>
          </div>

          {/* Top-right legend */}
          <div className="pointer-events-none absolute right-4 top-4 z-[400] flex flex-col items-end gap-2">
            <div className="card pointer-events-auto flex items-center gap-3 px-4 py-2.5 text-[11.5px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold">귀촌</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="font-bold">창업</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="font-bold">철거</span>
              </div>
              <div className="ml-2 flex items-center gap-1 border-l border-[color:var(--line)] pl-3 font-medium text-[color:var(--ink-muted)]">
                <Info className="h-3 w-3" />
                <span>외곽 펄스 링 = 안심구역</span>
              </div>
            </div>
            <div className="pointer-events-none rounded-full bg-black/55 px-3 py-1 text-[10.5px] font-medium text-white/90 backdrop-blur-sm">
              지도 확대·축소는 <kbd className="mx-0.5 rounded bg-white/20 px-1 py-0.5 font-mono text-[10px] font-bold">Ctrl</kbd>+휠 또는 우측 하단 <span className="font-bold">+ / −</span> 버튼
            </div>
          </div>

          {/* Mobile filter hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] flex justify-center border-t border-[color:var(--line)] bg-white/80 px-4 py-2 text-[11px] text-[color:var(--ink-muted)] backdrop-blur-md lg:hidden">
            데스크톱에서 필터·통계 사이드바가 제공됩니다.
          </div>
        </div>
      </main>
    </div>
  );
}
