"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ArrowDownNarrowWide,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { ClientOnlyChart } from "@/components/ClientOnlyChart";
import type { HouseSortKey } from "@/lib/house-service";
import type { House, RecommendedUse } from "@/lib/types";
import { USE_COLORS, USE_LABELS } from "@/lib/types";

export interface Filters {
  uses: Record<RecommendedUse, boolean>;
  search: string;
  sido: string;
  minConfidence: number;
  disasterOnly: boolean;
  sort: HouseSortKey;
}

export function FilterSidebar({
  filters,
  setFilters,
  onReset,
  sidoList,
  visible,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
  sidoList: string[];
  visible: House[];
}) {
  const pieData = useMemo(() => {
    const counts: Record<RecommendedUse, number> = {
      귀촌: 0,
      창업: 0,
      철거: 0,
    };
    visible.forEach((h) => (counts[h.recommendedUse] += 1));
    return (Object.keys(counts) as RecommendedUse[]).map((k) => ({
      name: USE_LABELS[k],
      key: k,
      value: counts[k],
      color: USE_COLORS[k],
    }));
  }, [visible]);

  const total = visible.length;

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-white/80 backdrop-blur-md">
      {/* Filter header */}
      <div className="sticky top-0 z-10 border-b border-[color:var(--line)] bg-white/90 px-5 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[color:var(--brand-700)]" />
          <h2 className="text-[15px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)]">탐지 필터</h2>
          <span className="ml-auto rounded-full bg-[color:var(--brand-50)] px-2.5 py-1 text-[11.5px] font-extrabold tnum text-[color:var(--brand-800)]">
            {total.toLocaleString()}건
          </span>
          <button
            type="button"
            onClick={onReset}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--ink-muted)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--ink-strong)]"
            aria-label="필터 초기화"
            title="필터 초기화"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <label
          htmlFor="candidate-search"
          className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]"
        >
          <Search className="h-3 w-3" /> 후보 검색
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--ink-muted)]" />
          <input
            id="candidate-search"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            placeholder="주소, ID, 분석 근거"
            className="w-full rounded-lg border border-[color:var(--line)] bg-white py-2 pl-9 pr-3 text-[13.5px] font-medium text-[color:var(--foreground)] transition-colors placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--brand-600)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-100)]"
          />
        </div>
      </section>

      {/* Sort */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <label
          htmlFor="candidate-sort"
          className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]"
        >
          <ArrowDownNarrowWide className="h-3 w-3" /> 정렬 기준
        </label>
        <select
          id="candidate-sort"
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value as HouseSortKey })
          }
          className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-[13.5px] font-medium text-[color:var(--foreground)] transition-colors focus:border-[color:var(--brand-600)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-100)]"
        >
          <option value="priority">우선순위 높은 순</option>
          <option value="confidence">AI 신뢰도 높은 순</option>
          <option value="safety">안전 위험 높은 순</option>
          <option value="power-low">전력 사용 낮은 순</option>
          <option value="age">준공 오래된 순</option>
          <option value="address">주소 가나다순</option>
        </select>
      </section>

      {/* Use type checkboxes */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          재생 용도
        </div>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(filters.uses) as RecommendedUse[]).map((k) => (
            <label
              key={k}
              className="group flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-[color:var(--surface-muted)]"
            >
              <input
                type="checkbox"
                checked={filters.uses[k]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    uses: { ...filters.uses, [k]: e.target.checked },
                  })
                }
                className="peer sr-only"
              />
              <span
                className="flex h-4 w-4 items-center justify-center rounded-[5px] border-2 transition-all peer-checked:border-transparent"
                style={
                  filters.uses[k]
                    ? {
                        borderColor: USE_COLORS[k],
                        background: USE_COLORS[k],
                      }
                    : { borderColor: "var(--line)" }
                }
              >
                {filters.uses[k] && (
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <path
                      d="M2.5 6.5l2.5 2.5L9.5 3.5"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: USE_COLORS[k] }}
              />
              <span className="text-[14px] font-bold text-[color:var(--ink-strong)]">{USE_LABELS[k]}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Sido dropdown */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          <MapPin className="h-3 w-3" /> 시도 지역
        </div>
        <select
          value={filters.sido}
          onChange={(e) => setFilters({ ...filters, sido: e.target.value })}
          className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-[13.5px] font-medium text-[color:var(--foreground)] transition-colors focus:border-[color:var(--brand-600)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-100)]"
        >
          <option value="">전체 지역</option>
          {sidoList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </section>

      {/* AI confidence slider */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          <Sparkles className="h-3 w-3" /> AI 신뢰도
        </div>
        <div className="mb-1 flex items-end justify-between">
          <span className="text-[12px] text-[color:var(--ink-muted)]">
            최소 기준
          </span>
          <span className="font-display tnum text-[22px] font-extrabold leading-none tracking-[-0.03em] text-[color:var(--brand-800)]">
            {(filters.minConfidence * 100).toFixed(0)}
            <span className="text-[13px] font-bold text-[color:var(--ink-muted)]">%</span>
          </span>
        </div>
        <input
          type="range"
          min={0.6}
          max={0.99}
          step={0.01}
          value={filters.minConfidence}
          onChange={(e) =>
            setFilters({
              ...filters,
              minConfidence: parseFloat(e.target.value),
            })
          }
          className="w-full accent-[color:var(--brand-700)]"
        />
        <div className="mt-1 flex justify-between text-[10.5px] text-[color:var(--ink-muted)] tnum">
          <span>60%</span>
          <span>99%</span>
        </div>
      </section>

      {/* Disaster zone toggle */}
      <section className="border-b border-[color:var(--line)] px-5 py-4">
        <label className="flex cursor-pointer items-center justify-between rounded-lg bg-red-50/60 px-3 py-2.5 transition-colors hover:bg-red-50">
          <div>
            <div className="text-[13px] font-bold text-red-800">
              붕괴위험 안심구역만
            </div>
            <div className="text-[11px] text-red-700/80">
              철거 우선 관리 대상
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.disasterOnly}
            onChange={(e) =>
              setFilters({ ...filters, disasterOnly: e.target.checked })
            }
            className="peer sr-only"
          />
          <span
            className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${
              filters.disasterOnly ? "bg-red-600" : "bg-neutral-300"
            }`}
          >
            <span
              className={`block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                filters.disasterOnly ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </span>
        </label>
      </section>

      {/* Stats pie */}
      <section className="px-5 py-4">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          현재 화면 용도별 분포
        </div>
        <div className="card -mx-1 p-3">
          <div className="h-36 sm:h-40">
            <ClientOnlyChart label="필터 분포 차트" minHeight={160}>
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                initialDimension={{ width: 260, height: 160 }}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {pieData.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      boxShadow: "0 10px 30px -14px rgba(13,24,58,0.2)",
                      fontSize: 12,
                    }}
                    formatter={(v) => [`${v}건`, "탐지"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ClientOnlyChart>
          </div>
          <div className="mt-2 space-y-1">
            {pieData.map((d) => {
              const pct = total ? Math.round((d.value / total) * 100) : 0;
              return (
                <div
                  key={d.key}
                  className="flex items-center gap-2 text-[12.5px]"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span className="text-[color:var(--foreground)]">
                    {d.name}
                  </span>
                  <span className="ml-auto tnum text-[color:var(--ink-muted)]">
                    {d.value}건 · {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-auto border-t border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-3 text-[10.5px] leading-relaxed text-[color:var(--ink-muted)]">
        <div className="font-bold text-[color:var(--foreground)]">데이터 출처</div>
        국토교통부 건축물대장 · 한국전력 가명정보 · 국토지리정보원 위성영상 ·
        안심구역 데이터
      </div>
    </aside>
  );
}
