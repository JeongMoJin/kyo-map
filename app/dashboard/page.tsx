"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  AlertTriangle,
  Building2,
  ArrowUpRight,
  Download,
  Printer,
  Filter,
  Landmark,
  TrendingUp,
  PieChart as PieIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ClientOnlyChart } from "@/components/ClientOnlyChart";
import { PublicEvidencePanel } from "@/components/PublicEvidencePanel";
import { useToast } from "@/components/Toast";
import { HOUSES } from "@/lib/houses";
import { getPriorityProfile, toCsvValue, type PriorityProfile } from "@/lib/priority";
import type { House, RecommendedUse } from "@/lib/types";
import { USE_COLORS, USE_LABELS } from "@/lib/types";

// AI 도구: ViT(위성영상 분류), LSTM(전력사용 학습), GPT-4o(용도 추천)
export default function DashboardPage() {
  const toast = useToast();
  const regionalChartRef = useRef<HTMLDivElement>(null);

  const top10 = useMemo(() => {
    return [...HOUSES]
      .map((house) => ({ house, profile: getPriorityProfile(house) }))
      .sort((a, b) => {
        return b.profile.priorityScore - a.profile.priorityScore;
      })
      .slice(0, 10);
  }, []);

  const sidoCounts = useMemo(() => {
    const map = new Map<string, number>();
    HOUSES.forEach((h) => {
      const sido = h.address.split(" ")[0].replace("특별자치도", "").replace("광역시", "").replace("특별시", "");
      map.set(sido, (map.get(sido) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const useDistribution = useMemo(() => {
    const counts: Record<RecommendedUse, number> = { 귀촌: 0, 창업: 0, 철거: 0 };
    HOUSES.forEach((h) => (counts[h.recommendedUse] += 1));
    return (Object.keys(counts) as RecommendedUse[]).map((k) => ({
      name: USE_LABELS[k],
      key: k,
      value: counts[k],
      color: USE_COLORS[k],
    }));
  }, []);

  // 데모 운영 흐름을 보여주는 확장 시나리오 예시
  const monthlyTrend = [
    { month: "2025-11", detected: 184_204, new: 2_840 },
    { month: "2025-12", detected: 192_481, new: 3_102 },
    { month: "2026-01", detected: 208_017, new: 4_012 },
    { month: "2026-02", detected: 229_755, new: 4_918 },
    { month: "2026-03", detected: 251_112, new: 5_441 },
    { month: "2026-04", detected: 278_603, new: 6_772 },
  ];

  const totalDetected = HOUSES.length;
  const disasterCount = HOUSES.filter((h) => h.isDisasterZone).length;
  const fieldCheckCount = HOUSES.filter(
    (h) => getPriorityProfile(h).fieldCheckNeed >= 80,
  ).length;
  const avgConfidence =
    HOUSES.reduce((a, h) => a + h.aiConfidence, 0) / HOUSES.length;

  function handleFocusRegions() {
    regionalChartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast({
      title: "시도별 탐지 분포로 이동했습니다",
      description: "지역별 후보 밀집도를 보고 현장 확인 순서를 검토할 수 있습니다.",
    });
  }

  function handlePrintReport() {
    toast({
      title: "월간 리포트 인쇄 모드",
      description: "브라우저 인쇄 창에서 PDF 저장도 가능합니다.",
    });
    window.setTimeout(() => window.print(), 180);
  }

  function handleDownloadCsv() {
    const headers = [
      "rank",
      "id",
      "address",
      "priorityScore",
      "safetyRisk",
      "fieldCheckNeed",
      "recommendedUse",
      "department",
      "action",
      "urgency",
    ];
    const rows = top10.map(({ house, profile }, index) => [
      index + 1,
      house.id,
      house.address,
      profile.priorityScore,
      profile.safetyRisk,
      profile.fieldCheckNeed,
      USE_LABELS[house.recommendedUse],
      profile.department,
      profile.actionLabel,
      profile.urgencyLabel,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(toCsvValue).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gonggajido-priority-top10.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "우선순위 CSV를 내보냈습니다",
      description: "Top 10 후보의 점수, 담당부서, 권장 조치가 포함됩니다.",
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader active="dashboard" />

      {/* Dashboard header band */}
      <section className="border-b border-[color:var(--line)] bg-gradient-to-br from-[color:var(--brand-900)] via-[color:var(--brand-800)] to-[color:var(--brand-700)] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4 shrink-0 text-sky-200" />
                <span className="truncate text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200 sm:text-[11.5px] sm:tracking-[0.18em]">
                  Gyeongsangbuk-do · 데모 운영 현황
                </span>
              </div>
              <h1 className="font-display mt-2 text-[26px] font-extrabold leading-[1.12] sm:mt-2.5 sm:text-[38px] sm:leading-[1.1]">
                경상북도 빈집 후보 관리 대시보드
              </h1>
              <p className="mt-2 max-w-[640px] text-[13px] font-medium leading-[1.6] text-white/80 sm:text-[14.5px] sm:leading-[1.65]">
                AI 추정 빈집 후보의 우선순위·활용 가능성·위험도를 한 화면에서
                확인하고 현장조사 순서를 검토합니다.
              </p>
            </div>
            <div className="no-print flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleFocusRegions}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-3.5 sm:py-2 sm:text-[12.5px]"
                aria-label="시군구 필터"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">시군구 필터</span>
                <span className="sm:hidden">필터</span>
              </button>
              <button
                onClick={handlePrintReport}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-3.5 sm:py-2 sm:text-[12.5px]"
                aria-label="월간 리포트"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">월간 리포트</span>
                <span className="sm:hidden">리포트</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11.5px] font-bold text-[color:var(--brand-800)] hover:bg-sky-50 sm:px-3.5 sm:py-2 sm:text-[12.5px]"
                aria-label="CSV 내보내기"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">CSV 내보내기</span>
                <span className="sm:hidden">CSV</span>
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3 md:grid-cols-4">
            <Kpi
              label="데모 빈집 후보"
              value={totalDetected.toLocaleString()}
              unit="건"
              trend="+12.4%"
              tone="positive"
            />
            <Kpi
              label="위험 검토 후보"
              value={disasterCount.toString()}
              unit="건"
              trend="즉시 조치"
              tone="warn"
            />
            <Kpi
              label="평균 AI 추정 점수"
              value={(avgConfidence * 100).toFixed(1)}
              unit="%"
              trend="개념 파이프라인"
              tone="info"
            />
            <Kpi
              label="현장확인 필요"
              value={fieldCheckCount.toString()}
              unit="건"
              trend="우선 방문"
              tone="warn"
            />
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-3 py-5 sm:px-6 sm:py-8">
          <PublicEvidencePanel />

          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            {/* Top 10 */}
            <div className="card flex flex-col overflow-hidden lg:row-span-2">
              <header className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3.5 sm:px-5 sm:py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <h2 className="text-[16px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)]">
                      관리 우선순위 Top 10
                    </h2>
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-[color:var(--ink-muted)]">
                    위험 검토 · 정비 추천 · AI 추정 점수 상위 순
                  </div>
                </div>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10.5px] font-bold text-red-700">
                  긴급 {top10.filter(({ profile }) => profile.priorityScore >= 82).length}건
                </span>
              </header>
              <ol className="flex flex-col divide-y divide-[color:var(--line)]">
                {top10.map(({ house, profile }, i) => (
                  <Top10Row
                    key={house.id}
                    rank={i + 1}
                    house={house}
                    profile={profile}
                  />
                ))}
              </ol>
            </div>

            {/* Sido bar chart */}
            <div ref={regionalChartRef} className="card scroll-mt-24 p-4 sm:p-5">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[color:var(--brand-700)]" />
                    <h2 className="text-[16px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)]">
                      시도별 빈집 후보 수
                    </h2>
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-[color:var(--ink-muted)]">
                    데모 샘플 기준 분포
                  </div>
                </div>
                <span className="rounded-full bg-[color:var(--surface-muted)] px-2.5 py-1 text-[10.5px] font-bold text-[color:var(--ink-muted)]">
                  {sidoCounts.length}개 시도
                </span>
              </header>
              <div className="h-[260px]">
                <ClientOnlyChart label="시도별 차트" minHeight={260}>
                  <ResponsiveContainer>
                    <BarChart
                      data={sidoCounts}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="#e6ebf3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10.5, fill: "#5b6b85" }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-18}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#5b6b85" }}
                        axisLine={false}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid var(--line)",
                          fontSize: 12,
                        }}
                        cursor={{ fill: "rgba(37,99,235,0.06)" }}
                        formatter={(v) => [`${v}건`, "후보"]}
                      />
                      <Bar
                        dataKey="value"
                        fill="#1E40AF"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ClientOnlyChart>
              </div>
            </div>

            {/* Use distribution donut */}
            <div className="card p-4 sm:p-5">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <PieIcon className="h-4 w-4 text-[color:var(--brand-700)]" />
                    <h2 className="text-[16px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)]">
                      용도별 분포
                    </h2>
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-[color:var(--ink-muted)]">
                    활용 검토 결과 집계
                  </div>
                </div>
              </header>
              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto] sm:gap-4">
                <div className="h-[220px]">
                  <ClientOnlyChart label="용도별 차트" minHeight={220}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={useDistribution}
                          innerRadius={52}
                          outerRadius={86}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="white"
                          strokeWidth={3}
                        >
                          {useDistribution.map((d) => (
                            <Cell key={d.key} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 10,
                            border: "1px solid var(--line)",
                            fontSize: 12,
                          }}
                          formatter={(v) => [`${v}건`, "후보"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnlyChart>
                </div>
                <ul className="flex flex-col gap-2 pr-3">
                  {useDistribution.map((d) => {
                    const pct = Math.round((d.value / HOUSES.length) * 100);
                    return (
                      <li key={d.key} className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: d.color }}
                        />
                        <div>
                          <div className="text-[12.5px] font-bold">
                            {d.name}
                          </div>
                          <div className="text-[11px] text-[color:var(--ink-muted)]">
                            {d.value}건 · {pct}%
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Monthly trend */}
            <div className="card p-5 lg:col-span-2">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[color:var(--brand-700)]" />
                    <h2 className="text-[16px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)]">
                      지역 확장 운영 시나리오 예시
                    </h2>
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium text-[color:var(--ink-muted)]">
                    데모 기준 누적 후보 · 신규 검토 흐름 예시
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[color:var(--brand-700)]" />
                    누적 후보
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    신규 검토
                  </span>
                </div>
              </header>
              <div className="h-[280px]">
                <ClientOnlyChart label="운영 시나리오 차트" minHeight={280}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={monthlyTrend}
                      margin={{ top: 10, right: 20, left: -5, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="total-grad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#1E40AF"
                            stopOpacity={0.3}
                          />
                          <stop offset="100%" stopColor="#1E40AF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient
                          id="new-grad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity={0.35}
                          />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="#e6ebf3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#5b6b85" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11, fill: "#5b6b85" }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 11, fill: "#10b981" }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid var(--line)",
                          fontSize: 12,
                        }}
                        formatter={(v, name) => [
                          `${Number(v).toLocaleString()}건`,
                          name === "detected" ? "누적 후보" : "신규 검토",
                        ]}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="detected"
                        stroke="#1E40AF"
                        strokeWidth={2.5}
                        fill="url(#total-grad)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="new"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#new-grad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ClientOnlyChart>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[color:var(--line)] bg-white p-4 text-center text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
            <span className="text-[13px]">🏛️</span>
            <span className="font-bold text-[color:var(--foreground)]">
              데모 데이터 구성
            </span>
            <span>·</span>
            <span>국토교통부 건축물대장</span>
            <span>·</span>
            <span>한국전력 가명정보</span>
            <span>·</span>
            <span>국토지리정보원 위성영상</span>
            <span>·</span>
            <span>안심구역 API</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({
  label,
  value,
  unit,
  trend,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  tone: "positive" | "warn" | "info";
}) {
  const trendClass =
    tone === "positive"
      ? "bg-emerald-500/20 text-emerald-100"
      : tone === "warn"
        ? "bg-red-500/25 text-red-100"
        : "bg-sky-500/20 text-sky-100";
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:rounded-2xl sm:p-4">
      <div className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-white/75 sm:text-[11.5px] sm:tracking-[0.18em]">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1 sm:mt-2">
        <span className="font-display tnum text-[24px] font-extrabold leading-none tracking-[-0.03em] sm:text-[30px]">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-bold text-white/70 sm:text-[13.5px]">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <span
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold sm:mt-2.5 sm:text-[10.5px] ${trendClass}`}
        >
          <ArrowUpRight className="h-3 w-3" />
          {trend}
        </span>
      )}
    </div>
  );
}

function Top10Row({
  rank,
  house,
  profile,
}: {
  rank: number;
  house: House;
  profile: PriorityProfile;
}) {
  const color = USE_COLORS[house.recommendedUse];
  return (
    <li className="group relative flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[color:var(--surface-muted)]/70 sm:gap-3 sm:px-5 sm:py-3">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold sm:h-8 sm:w-8 sm:rounded-xl sm:text-[13px] ${
          rank <= 3
            ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md"
            : "bg-[color:var(--surface-muted)] text-[color:var(--ink-muted)]"
        }`}
      >
        {rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {house.isDisasterZone && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[9.5px] font-bold text-red-700">
              <AlertTriangle className="h-2.5 w-2.5" />
              붕괴위험
            </span>
          )}
          <span
            className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold text-white"
            style={{ background: color }}
          >
            {USE_LABELS[house.recommendedUse]}
          </span>
          <span className="text-[10.5px] font-semibold text-[color:var(--ink-muted)]">
            · {house.id}
          </span>
          <span className="rounded-md bg-[color:var(--brand-50)] px-1.5 py-0.5 text-[9.5px] font-extrabold text-[color:var(--brand-800)]">
            우선순위 {profile.priorityScore}
          </span>
        </div>
        <div className="mt-1 truncate text-[13.5px] font-extrabold text-[color:var(--ink-strong)]">
          {house.address}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] font-medium text-[color:var(--ink-muted)]">
          <span>{house.buildYear}년 · {house.area}㎡</span>
          <span>AI{" "}
          <span className="tnum font-extrabold text-[color:var(--brand-800)]">
            {(house.aiConfidence * 100).toFixed(0)}%
          </span>
          </span>
          <span className="font-bold text-[color:var(--ink-strong)]">
            {profile.department}
          </span>
          <span>{profile.actionLabel}</span>
        </div>
      </div>
      <div className="hidden w-[78px] shrink-0 text-right sm:block">
        <div className="tnum text-[18px] font-extrabold leading-none text-[color:var(--ink-strong)]">
          {profile.priorityScore}
        </div>
        <div className="mt-1 text-[10px] font-bold text-red-600">
          {profile.urgencyLabel}
        </div>
      </div>
      <Link
        href={`/house/${house.id}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-muted)] text-[color:var(--ink-muted)] transition-colors group-hover:bg-[color:var(--brand-800)] group-hover:text-white"
        aria-label="상세 보기"
      >
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </li>
  );
}
