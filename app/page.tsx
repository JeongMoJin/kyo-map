"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/SiteHeader";
import { LiveTicker } from "@/components/LiveTicker";
import { FilterSidebar, type Filters } from "@/components/FilterSidebar";
import { MobileFilterSheet } from "@/components/MobileFilterSheet";
import { getSidoList } from "@/lib/houses";
import { queryHouses } from "@/lib/house-service";
import type { RecommendedUse } from "@/lib/types";
import { USE_LABELS } from "@/lib/types";
import { Cpu, Info, RotateCcw, SearchX, Sparkles } from "lucide-react";

// AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT(용도 추천)
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
  search: "",
  sido: "",
  minConfidence: 0.6,
  disasterOnly: false,
  sort: "priority",
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const sidoList = useMemo(() => getSidoList(), []);

  const queryResult = useMemo(() => {
    const uses = (Object.keys(filters.uses) as RecommendedUse[]).filter(
      (key) => filters.uses[key],
    );

    return queryHouses({
      search: filters.search,
      sido: filters.sido,
      uses,
      minConfidence: filters.minConfidence,
      disasterOnly: filters.disasterOnly,
      sort: filters.sort,
    });
  }, [filters]);

  const filtered = useMemo(() => {
    return queryResult.items.map((item) => item.house);
  }, [queryResult]);

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader active="map" />
      <LiveTicker total={filtered.length} />

      <main className="relative flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden w-[320px] shrink-0 border-r border-[color:var(--line)] lg:flex">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            sidoList={sidoList}
            visible={filtered}
          />
        </div>

        {/* Map */}
        <div className="relative flex-1">
          <MapView houses={filtered} />

          {filtered.length === 0 && (
            <div className="pointer-events-none absolute inset-0 z-[350] flex items-center justify-center px-4">
              <div className="card pointer-events-auto max-w-[360px] p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--surface-muted)] text-[color:var(--ink-muted)]">
                  <SearchX className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-[17px] font-extrabold text-[color:var(--ink-strong)]">
                  조건에 맞는 후보가 없습니다
                </h2>
                <p className="mt-1.5 text-[12.5px] font-medium leading-[1.6] text-[color:var(--ink-muted)]">
                  검색어, 지역, AI 신뢰도 기준을 낮추면 더 많은 후보를 확인할 수
                  있습니다.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-800)] px-4 py-2 text-[12.5px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  조건 초기화
                </button>
              </div>
            </div>
          )}

          {/* Top-left headline overlay */}
          <div className="pointer-events-none absolute left-3 top-3 z-[400] max-w-[calc(100vw-1.5rem)] sm:left-4 sm:top-4 sm:max-w-[380px]">
            <div className="card pointer-events-auto fade-in-up p-3.5 sm:p-5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--brand-800)] sm:text-[10.5px]">
                <Sparkles className="h-3 w-3" />
                운영 화면 · 후보 탐지 결과
              </div>
              <div className="font-display mt-1.5 text-[20px] font-extrabold leading-[1.15] text-[color:var(--ink-strong)] sm:mt-2 sm:text-[26px]">
                전국 공가
                <span className="font-hanja mx-1 text-[15px] font-bold text-[color:var(--brand-800)] sm:text-[20px]">
                  (空家)
                </span>
                <span className="tnum text-[color:var(--brand-800)]">
                  {filtered.length.toLocaleString()}
                </span>
                <span className="text-[17px] sm:text-[22px]">건</span>
              </div>
              <div className="mt-1.5 hidden text-[12.5px] leading-[1.6] text-[color:var(--ink-muted)] sm:mt-2 sm:block">
                AI가 재생 용도를 자동 추천합니다. 마커를 클릭하면 상세 분석으로
                이동합니다.
              </div>
              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
                {(Object.keys(USE_LABELS) as RecommendedUse[]).map((k) => {
                  const count = filtered.filter(
                    (h) => h.recommendedUse === k,
                  ).length;
                  return (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--surface-muted)] px-2 py-0.5 text-[10.5px] font-bold text-[color:var(--ink)] sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11.5px]"
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

            <div className="card pointer-events-auto mt-2 hidden items-start gap-2.5 p-3.5 text-[12px] leading-[1.6] text-[color:var(--ink-muted)] sm:mt-3 sm:flex">
              <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" />
              <div>
                <span className="font-bold text-[color:var(--ink-strong)]">
                  AI 파이프라인
                </span>{" "}
                · ViT로 위성영상 분류 → LSTM으로 월별 전력패턴 학습 → GPT가
                용도 추천
              </div>
            </div>
          </div>

          {/* Top-right legend — 모바일은 컴팩트 한 줄, 데스크톱은 풀 텍스트 */}
          <div className="pointer-events-none absolute right-3 top-3 z-[400] flex flex-col items-end gap-2 sm:right-4 sm:top-4">
            <div className="card pointer-events-auto flex items-center gap-2 px-2.5 py-1.5 text-[10.5px] sm:gap-3 sm:px-4 sm:py-2.5 sm:text-[11.5px]">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold">귀촌</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="font-bold">창업</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="font-bold">철거</span>
              </div>
              <div className="ml-1 hidden items-center gap-1 border-l border-[color:var(--line)] pl-3 font-medium text-[color:var(--ink-muted)] md:flex">
                <Info className="h-3 w-3" />
                <span>외곽 펄스 링 = 안심구역</span>
              </div>
            </div>
            <div className="pointer-events-none hidden rounded-full bg-black/55 px-3 py-1 text-[10.5px] font-medium text-white/90 backdrop-blur-sm sm:block">
              지도 확대·축소는{" "}
              <kbd className="mx-0.5 rounded bg-white/20 px-1 py-0.5 font-mono text-[10px] font-bold">
                Ctrl
              </kbd>
              +휠 또는 우측 하단 <span className="font-bold">+ / −</span> 버튼
            </div>
          </div>

          {/* Mobile filter FAB + bottom sheet */}
          <MobileFilterSheet
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            sidoList={sidoList}
            visible={filtered}
          />
        </div>
      </main>
    </div>
  );
}
