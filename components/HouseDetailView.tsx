"use client";

import { useState } from "react";
import Link from "next/link";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
  AreaChart,
} from "recharts";
import {
  ArrowLeft,
  Home,
  Sparkles,
  Zap,
  AlertTriangle,
  MapPin,
  Calendar,
  Ruler,
  User,
  Route,
  TrainFront,
  ShieldCheck,
  MessageCircle,
  Mail,
} from "lucide-react";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";
import { ClientOnlyChart } from "@/components/ClientOnlyChart";
import { RealAiAnalysisPanel } from "@/components/RealAiAnalysisPanel";
import { useToast } from "@/components/Toast";
import { getPriorityProfile } from "@/lib/priority";
import type { House } from "@/lib/types";
import { USE_COLORS, USE_LABELS } from "@/lib/types";

type Tab = "info" | "ai" | "power";

const MONTH_LABELS = [
  "13개월 전",
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "지난달",
];

export function HouseDetailView({ house }: { house: House }) {
  const [tab, setTab] = useState<Tab>("ai");
  const toast = useToast();

  const color = USE_COLORS[house.recommendedUse];

  const powerData = house.powerUsage.map((v, i) => ({
    month: MONTH_LABELS[i],
    value: v,
    idx: i,
  }));
  const avgRecent6 =
    house.powerUsage.slice(6).reduce((a, b) => a + b, 0) / 6;
  const avgPrev6 = house.powerUsage.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  const priority = getPriorityProfile(house);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Hero */}
      <div className="relative h-[280px] w-full overflow-hidden bg-black sm:h-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${house.id}/1600/520`}
          alt={`${house.address} 현장 참고 이미지`}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Satellite overlay UI */}
        <div className="pointer-events-none absolute right-3 top-[70px] z-10 hidden flex-col items-end gap-1.5 text-[10.5px] font-mono text-white/80 sm:right-5 sm:top-[72px] sm:flex">
          <span className="rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
            Public-data candidate · exact parcel hidden
          </span>
          <span className="rounded-md bg-black/40 px-2 py-0.5 backdrop-blur-sm">
            {house.lat.toFixed(4)}°N · {house.lng.toFixed(4)}°E
          </span>
        </div>

        <div className="absolute inset-x-0 top-3 z-10 sm:top-5">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-3 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-[color:var(--foreground)] backdrop-blur-md transition-colors hover:bg-white sm:px-3.5 sm:py-2 sm:text-[12.5px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">지도로 돌아가기</span>
              <span className="xs:hidden">지도</span>
            </Link>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-lg sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11.5px]"
                style={{ background: color }}
              >
                <Sparkles className="h-3 w-3" />
                {USE_LABELS[house.recommendedUse]} 추천
              </span>
              {house.isDisasterZone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11.5px]">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="hidden xs:inline">붕괴위험 </span>안심구역
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 z-10 sm:bottom-5">
          <div className="mx-auto max-w-[1200px] px-3 text-white sm:px-6">
            <div className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/75 sm:text-[11px] sm:tracking-[0.2em]">
              공가 ID · {house.id}
            </div>
            <h1 className="font-display mt-1.5 max-w-[820px] text-[22px] font-extrabold leading-[1.2] text-white sm:mt-2 sm:text-[34px] sm:leading-[1.15]">
              {house.address}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-medium text-white/85 sm:mt-3 sm:gap-x-5 sm:gap-y-1.5 sm:text-[13px]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {house.buildYear}년 준공
              </span>
              <span className="inline-flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" />
                연면적 {house.area}㎡
              </span>
              <span className="inline-flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                {house.usageType}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                소유 {house.ownerType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[1200px] px-3 py-5 sm:px-6 sm:py-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Tabs */}
              <div className="card overflow-hidden">
                <div className="flex border-b border-[color:var(--line)] bg-[color:var(--surface-muted)]/60">
                  <TabButton
                    active={tab === "info"}
                    onClick={() => setTab("info")}
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">기본 정보</span>
                    <span className="xs:hidden">정보</span>
                  </TabButton>
                  <TabButton
                    active={tab === "ai"}
                    onClick={() => setTab("ai")}
                  >
                    <Sparkles className="h-3.5 w-3.5" /> AI 분석
                  </TabButton>
                  <TabButton
                    active={tab === "power"}
                    onClick={() => setTab("power")}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">전력사용량</span>
                    <span className="xs:hidden">전력</span>
                  </TabButton>
                </div>

                <div className="p-4 sm:p-6">
                  {tab === "info" && (
                    <div className="fade-in-up grid gap-4 md:grid-cols-2">
                      <InfoRow
                        icon={<MapPin className="h-3.5 w-3.5" />}
                        label="소재지"
                        value={house.address}
                      />
                      <InfoRow
                        icon={<Calendar className="h-3.5 w-3.5" />}
                        label="준공연도"
                        value={`${house.buildYear}년`}
                      />
                      <InfoRow
                        icon={<Ruler className="h-3.5 w-3.5" />}
                        label="연면적"
                        value={`${house.area} ㎡ (약 ${Math.round(
                          house.area * 0.3025,
                        )}평)`}
                      />
                      <InfoRow
                        icon={<Home className="h-3.5 w-3.5" />}
                        label="대장상 용도"
                        value={house.usageType}
                      />
                      <InfoRow
                        icon={<User className="h-3.5 w-3.5" />}
                        label="소유구분"
                        value={house.ownerType}
                      />
                      <InfoRow
                        icon={<Route className="h-3.5 w-3.5" />}
                        label="최근접 IC"
                        value={`${house.nearestIC} km`}
                      />
                      <InfoRow
                        icon={<TrainFront className="h-3.5 w-3.5" />}
                        label="최근접 역/터미널"
                        value={`${house.nearestStation} km`}
                      />
                      <InfoRow
                        icon={<ShieldCheck className="h-3.5 w-3.5" />}
                        label="안심구역 여부"
                        value={
                          house.isDisasterZone ? (
                            <span className="font-bold text-red-600">
                              지정
                            </span>
                          ) : (
                            <span className="text-[color:var(--ink-muted)]">
                              미지정
                            </span>
                          )
                        }
                      />
                    </div>
                  )}

                  {tab === "ai" && (
                    <div className="fade-in-up space-y-5">
                      <div className="flex items-start gap-3 rounded-xl bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-100)]">
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-md"
                          style={{ background: color }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
                            AI 정책 분석
                          </div>
                          <div className="mt-0.5 text-[15px] font-bold text-[color:var(--foreground)]">
                            {USE_LABELS[house.recommendedUse]} 조치안 초안
                          </div>
                        </div>
                      </div>

                      <p className="text-[15.5px] font-medium leading-[1.78] tracking-[-0.002em] text-[color:var(--ink-strong)]">
                        {house.reason}
                      </p>

                      <div className="grid gap-3 md:grid-cols-3">
                        <PipelineCard
                          model="공공데이터"
                          label="후보 스코어링"
                          value={`${Math.round(house.aiConfidence * 100)}%`}
                          hint="건축·행정·공간 속성 기반 초기 후보 점수"
                        />
                        <PipelineCard
                          model="전력패턴"
                          label="저사용 신호"
                          value={`${avgRecent6.toFixed(1)} kWh`}
                          hint={`최근 6개월 평균 (이전: ${avgPrev6.toFixed(1)})`}
                        />
                        <PipelineCard
                          model="AI 분석"
                          label="정책 조치안"
                          value={USE_LABELS[house.recommendedUse]}
                          hint="공공데이터 기반 조치안 구조화"
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-4">
                        <PriorityMetric
                          label="행정 우선순위"
                          value={priority.priorityScore}
                          tone="brand"
                        />
                        <PriorityMetric
                          label="안전 위험"
                          value={priority.safetyRisk}
                          tone="danger"
                        />
                        <PriorityMetric
                          label="현장확인 필요"
                          value={priority.fieldCheckNeed}
                          tone="warn"
                        />
                        <PriorityMetric
                          label="재생 적합도"
                          value={priority.regenerationFit}
                          tone="success"
                        />
                      </div>

                      <div className="rounded-xl bg-[color:var(--surface-muted)] p-4 text-[13px] leading-[1.75] text-[color:var(--ink-muted)]">
                        <div className="mb-1.5 text-[12.5px] font-bold text-[color:var(--ink-strong)]">
                          분석 근거
                        </div>
                        • 건축물대장 · 한전 가명정보(월별 전력) · 국토지리정보원
                        위성영상 교차검증 <br />• 안심구역 API와 결합해 붕괴위험
                        지역 가중치 적용 <br />• 추천 용도는 인접 관광자원/교통
                        접근성 기반 후보지 스코어링 결과
                      </div>

                      <RealAiAnalysisPanel house={house} />

                      <div className="rounded-xl border border-[color:var(--brand-100)] bg-[color:var(--brand-50)] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
                              Administrative action
                            </div>
                            <div className="mt-1 text-[15px] font-extrabold text-[color:var(--ink-strong)]">
                              {priority.department} · {priority.actionLabel}
                            </div>
                            <p className="mt-1 text-[12.5px] font-medium leading-[1.65] text-[color:var(--ink-muted)]">
                              조치 기한은 {priority.urgencyLabel}이며, 현장 확인 전까지
                              AI 판단과 공공데이터 근거를 함께 보관합니다.
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold text-[color:var(--brand-800)] ring-1 ring-[color:var(--brand-100)]">
                            점수 {priority.priorityScore}/100
                          </span>
                        </div>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {priority.evidence.map((item) => (
                            <li
                              key={item}
                              className="rounded-lg bg-white/75 px-3 py-2 text-[12px] font-bold text-[color:var(--ink)] ring-1 ring-[color:var(--brand-100)]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {tab === "power" && (
                    <div className="fade-in-up space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                            한국전력 가명정보
                          </div>
                          <div className="text-[14.5px] font-bold sm:text-[15px]">
                            최근 12개월 월별 전력사용량
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] sm:gap-4">
                          <div>
                            <div className="text-[10.5px] text-[color:var(--ink-muted)]">
                              평균 (이전 6M)
                            </div>
                            <div className="tnum text-[15px] font-bold text-[color:var(--foreground)] sm:text-[16px]">
                              {avgPrev6.toFixed(1)}
                              <span className="text-[11px] text-[color:var(--ink-muted)]">
                                {" "}
                                kWh
                              </span>
                            </div>
                          </div>
                          <div className="h-8 w-px bg-[color:var(--line)]" />
                          <div>
                            <div className="text-[10.5px] text-[color:var(--ink-muted)]">
                              평균 (최근 6M)
                            </div>
                            <div className="tnum text-[15px] font-bold text-red-600 sm:text-[16px]">
                              {avgRecent6.toFixed(1)}
                              <span className="text-[11px] text-red-500">
                                {" "}
                                kWh
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-[240px] sm:h-[280px]">
                        <ClientOnlyChart label="전력사용량 차트" minHeight={280}>
                          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <AreaChart
                              data={powerData}
                              margin={{
                                top: 10,
                                right: 10,
                                left: -10,
                                bottom: 0,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="pwr-grad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#1E40AF"
                                    stopOpacity={0.45}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#1E40AF"
                                    stopOpacity={0.02}
                                  />
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
                                tick={{ fontSize: 11, fill: "#5b6b85" }}
                                axisLine={false}
                                tickLine={false}
                                width={40}
                                unit=""
                              />
                              <Tooltip
                                contentStyle={{
                                  borderRadius: 10,
                                  border: "1px solid var(--line)",
                                  fontSize: 12,
                                }}
                                formatter={(v) => [`${v} kWh`, "사용량"]}
                              />
                              <ReferenceLine
                                y={2}
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                label={{
                                  value: "빈집 임계치 2kWh",
                                  fill: "#ef4444",
                                  fontSize: 10,
                                  position: "insideTopRight",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#1E40AF"
                                strokeWidth={2.5}
                                fill="url(#pwr-grad)"
                                dot={{ r: 3, fill: "#1E40AF" }}
                                activeDot={{ r: 5 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ClientOnlyChart>
                      </div>

                      <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 text-[13px] leading-[1.7] text-red-900">
                        <div className="mb-1 flex items-center gap-1.5 text-[12.5px] font-extrabold">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          전력 저사용 시그널
                        </div>
                        최근 6개월 평균 전력사용량이 임계치(2kWh) 이하로 지속되고
                        있습니다. 실거주 없이 계량기만 연결된 상태일 가능성이
                        높습니다.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA row */}
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() =>
                    toast({
                      title: "귀촌 문의가 접수되었습니다",
                      description: `지자체 담당자가 ${house.id} 물건에 대한 상담을 준비합니다.`,
                    })
                  }
                  className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                      관심 시민
                    </div>
                    <div className="mt-1 text-[16px] font-bold text-[color:var(--foreground)]">
                      귀촌 문의하기
                    </div>
                    <div className="mt-0.5 text-[12px] text-[color:var(--ink-muted)]">
                      지자체와 바로 연결되는 리모델링 상담
                    </div>
                  </div>
                  <MessageCircle className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" />
                </button>

                <button
                  onClick={() =>
                    toast({
                      title: "지자체로 제보를 전송했습니다",
                      description: `${house.address.split(" ").slice(0, 2).join(" ")} 담당 부서가 확인 후 처리합니다.`,
                    })
                  }
                  className="group flex items-center justify-between rounded-2xl border border-[color:var(--brand-100)] bg-gradient-to-br from-[color:var(--brand-50)] to-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-500)] hover:shadow-lg"
                >
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
                      행정 제보
                    </div>
                    <div className="mt-1 text-[16px] font-bold text-[color:var(--foreground)]">
                      지자체에 제보하기
                    </div>
                    <div className="mt-0.5 text-[12px] text-[color:var(--ink-muted)]">
                      붕괴·안전 이슈 및 현장 확인 요청
                    </div>
                  </div>
                  <Mail className="h-8 w-8 text-[color:var(--brand-700)] transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Right column */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="card flex flex-col items-center p-6">
                <ConfidenceGauge
                  value={house.aiConfidence}
                  label="AI 빈집 확률"
                  color={color}
                />
                <div className="mt-3 text-center text-[12.5px] leading-relaxed text-[color:var(--ink-muted)]">
                  공공데이터 기반 정책 산식과 AI 분석 결과로 보정되는
                  후보 확률입니다.
                </div>
                <div className="mt-4 grid w-full grid-cols-3 gap-2">
                  <MiniStat label="최근 전력" value={`${avgRecent6.toFixed(1)}kWh`} />
                  <MiniStat
                    label="안심구역"
                    value={house.isDisasterZone ? "지정" : "미지정"}
                  />
                  <MiniStat label="조치" value={priority.urgencyLabel} />
                </div>
              </div>

              <div className="card p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  추천 재생 시나리오
                </div>
                <div
                  className="mt-1 text-[18px] font-bold tracking-[-0.01em]"
                  style={{ color }}
                >
                  {USE_LABELS[house.recommendedUse]}
                </div>
                <ul className="mt-3 space-y-2 text-[13px] text-[color:var(--foreground)]">
                  <ScenarioLine
                    active
                    label="담당부서 배정"
                    status={priority.department}
                  />
                  <ScenarioLine
                    active
                    label="AI 용도 추천"
                    status={`${priority.priorityScore}점`}
                  />
                  <ScenarioLine label="현장 확인" status={priority.urgencyLabel} />
                  <ScenarioLine label="리모델링·착공" status="대기" />
                </ul>
              </div>

              <div className="card p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                  행정 처리 요약
                </div>
                <div className="mt-3 grid gap-2">
                  <AdminSummary label="권장 조치" value={priority.actionLabel} />
                  <AdminSummary label="담당 부서" value={priority.department} />
                  <AdminSummary label="조치 기한" value={priority.urgencyLabel} />
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)]/70 p-4 text-[11.5px] leading-relaxed text-[color:var(--ink-muted)]">
                공개 화면에는 개인정보와 정확 지번을 노출하지 않습니다. 실제
                행정 운영에서는 공공데이터 원본, 건축물대장, 가명/집계 전력
                데이터, 현장조사 결과를 감사 로그와 함께 보관합니다.
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 items-center justify-center gap-1.5 px-2 py-3 text-[12.5px] font-bold transition-colors sm:gap-2 sm:px-4 sm:py-3.5 sm:text-[13px] ${
        active
          ? "text-[color:var(--brand-800)]"
          : "text-[color:var(--ink-muted)] hover:text-[color:var(--foreground)]"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-[color:var(--brand-700)] sm:inset-x-4" />
      )}
    </button>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-50)] text-[color:var(--brand-700)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          {label}
        </div>
        <div className="mt-1 text-[14.5px] font-bold text-[color:var(--ink-strong)]">
          {value}
        </div>
      </div>
    </div>
  );
}

function PipelineCard({
  model,
  label,
  value,
  hint,
}: {
  model: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-white p-4">
      <div className="flex items-center gap-1.5">
        <span className="rounded bg-black/90 px-1.5 py-0.5 font-mono text-[9.5px] font-extrabold tracking-wide text-white">
          {model}
        </span>
        <span className="text-[11px] font-bold text-[color:var(--ink-muted)]">
          {label}
        </span>
      </div>
      <div className="font-display mt-2 text-[19px] font-extrabold tracking-[-0.02em] text-[color:var(--ink-strong)]">
        {value}
      </div>
      <div className="mt-1 text-[11.5px] font-medium leading-[1.5] text-[color:var(--ink-muted)]">
        {hint}
      </div>
    </div>
  );
}

function PriorityMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "brand" | "danger" | "warn" | "success";
}) {
  const toneClass =
    tone === "brand"
      ? "text-[color:var(--brand-800)] bg-[color:var(--brand-50)]"
      : tone === "danger"
        ? "text-red-700 bg-red-50"
        : tone === "warn"
          ? "text-amber-700 bg-amber-50"
          : "text-emerald-700 bg-emerald-50";

  return (
    <div className={`rounded-xl p-3 ring-1 ring-inset ring-black/5 ${toneClass}`}>
      <div className="text-[10.5px] font-extrabold uppercase tracking-[0.13em] opacity-75">
        {label}
      </div>
      <div className="tnum mt-1 text-[24px] font-extrabold leading-none">
        {value}
        <span className="ml-0.5 text-[12px] font-bold opacity-70">점</span>
      </div>
    </div>
  );
}

function AdminSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[color:var(--surface-muted)] px-3 py-2.5">
      <span className="text-[11.5px] font-bold text-[color:var(--ink-muted)]">
        {label}
      </span>
      <span className="text-right text-[12.5px] font-extrabold text-[color:var(--ink-strong)]">
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[color:var(--surface-muted)] p-2 text-center">
      <div className="text-[10px] font-semibold text-[color:var(--ink-muted)]">
        {label}
      </div>
      <div className="tnum mt-0.5 text-[13px] font-bold text-[color:var(--foreground)]">
        {value}
      </div>
    </div>
  );
}

function ScenarioLine({
  label,
  status,
  active = false,
}: {
  label: string;
  status: string;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          active
            ? "bg-[color:var(--brand-700)]"
            : "bg-[color:var(--line)]"
        }`}
      />
      <span
        className={
          active
            ? "font-semibold text-[color:var(--foreground)]"
            : "text-[color:var(--ink-muted)]"
        }
      >
        {label}
      </span>
      <span
        className={`ml-auto rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[color:var(--surface-muted)] text-[color:var(--ink-muted)]"
        }`}
      >
        {status}
      </span>
    </li>
  );
}
