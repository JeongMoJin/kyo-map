import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Landmark,
  MapPinned,
  Route,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { HOUSES } from "@/lib/houses";

const problemCards = [
  {
    title: "지역 안전",
    body: "장기 방치된 주택은 붕괴위험, 화재, 생활안전 민원과 연결될 수 있습니다.",
  },
  {
    title: "도시 미관",
    body: "관리되지 않는 건축물은 골목 환경과 생활 만족도를 함께 낮춥니다.",
  },
  {
    title: "조사비용",
    body: "전체 지역을 같은 강도로 확인하기보다 우선조사 순서가 필요합니다.",
  },
] as const;

const solutionSteps = [
  "공공데이터 수집",
  "AI 후보 탐지",
  "지도 시각화",
  "우선조사 추천",
  "정책 활용",
] as const;

const dataInputs = [
  "건축물대장",
  "에너지 사용량",
  "위성영상",
  "인구·상권·교통 데이터",
  "정책·정비 데이터",
] as const;

const dataOutputs = [
  "빈집 후보 점수",
  "위험도",
  "활용 가능성",
  "우선조사 추천",
  "정책 활용 추천",
] as const;

const roadmap = [
  "프로토타입 구현",
  "공공데이터 추가 연동",
  "지역 단위 실증",
  "지자체 SaaS",
  "유휴공간 확장",
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--background)] text-[color:var(--ink)] [word-break:keep-all]">
      <SiteHeader active="home" />

      <main>
        <section className="border-b border-[color:var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)]">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-white px-3 py-2 text-[12px] font-extrabold text-[color:var(--primary-navy)]">
                <Landmark className="h-4 w-4 text-[color:var(--primary-blue)]" />
                공공데이터 기반 후보 탐지
              </div>
              <h1 className="mt-6 max-w-[720px] text-[34px] font-extrabold leading-[1.16] text-[color:var(--primary-navy)] sm:text-[44px] lg:text-[54px]">
                공공데이터와 AI로 미등록 빈집 후보를 찾아냅니다
              </h1>
              <p className="mt-5 max-w-[680px] text-[16px] font-medium leading-[1.8] text-[color:var(--body-text)] sm:text-[18px]">
                공가지도는 현장조사 전 사전 스크리닝으로 지자체의 우선조사
                추천과 정책 의사결정을 돕는 도시 데이터 플랫폼입니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/map"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--primary-blue)] px-5 py-3 text-[14px] font-extrabold text-white transition-colors hover:bg-[color:var(--primary-navy)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-blue)] focus:ring-offset-2"
                >
                  서비스 데모 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#service"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white px-5 py-3 text-[14px] font-extrabold text-[color:var(--primary-navy)] transition-colors hover:border-[color:var(--primary-blue)] hover:text-[color:var(--primary-blue)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-blue)] focus:ring-offset-2"
                >
                  프로젝트 소개 보기
                </a>
              </div>
            </div>

            <MapPreview />
          </div>
        </section>

        <section id="problem" className="border-b border-[color:var(--line)] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Problem"
              title="빈집 문제는 늘어나지만, 발견과 대응은 늦습니다"
              body="공식 통계와 행정 관리 대상 사이의 간극을 줄이려면, 현장조사 전에 후보를 좁히는 과정이 필요합니다."
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                <EvidenceCard
                  label="국가 통계"
                  value="160만 호"
                  title="2024년 미거주 주택"
                  body="전체 주택의 8.0%로 집계되었습니다."
                  source="대한민국 정책브리핑"
                  href="https://www.korea.kr/briefing/policyBriefingView.do?newsId=156721680"
                />
                <EvidenceCard
                  label="행정 기준"
                  value="약 13만 호"
                  title="법적 빈집 관리 대상"
                  body="전국 주택 수 대비 약 0.69%로 확인되었습니다."
                  source="국토연구원"
                  href="https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=398058&seq=1"
                />
              </div>
              <div className="grid gap-3">
                {problemCards.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4"
                  >
                    <h3 className="text-[16px] font-extrabold text-[color:var(--primary-navy)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--body-text)]">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-[color:var(--background)]">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Solution"
              title="공가지도는 빈집 후보를 먼저 찾아냅니다"
              body="공공데이터 기반 후보 탐지 결과를 지도와 대시보드로 연결해 우선조사 추천까지 이어갑니다."
            />
            <div className="mt-9 grid gap-3 md:grid-cols-5">
              {solutionSteps.map((step, index) => (
                <div
                  key={step}
                  className="relative rounded-lg border border-[color:var(--border)] bg-white p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--soft-blue)] text-[13px] font-extrabold text-[color:var(--primary-blue)]">
                    {index + 1}
                  </div>
                  <div className="mt-4 text-[15px] font-extrabold text-[color:var(--primary-navy)]">
                    {step}
                  </div>
                  {index < solutionSteps.length - 1 && (
                    <ArrowRight className="absolute right-4 top-5 hidden h-4 w-4 text-[color:var(--muted-text)] md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="service" className="border-b border-[color:var(--line)] bg-white">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Product"
                title="지도에서 후보와 판단 근거를 확인합니다"
                body="지도, 후보 상세, 지자체 대시보드가 하나의 사전 스크리닝 흐름으로 연결됩니다."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/map"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--primary-blue)] px-5 py-3 text-[14px] font-extrabold text-white transition-colors hover:bg-[color:var(--primary-navy)]"
                >
                  지도 데모 열기
                  <MapPinned className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-white px-5 py-3 text-[14px] font-extrabold text-[color:var(--primary-navy)] transition-colors hover:border-[color:var(--primary-blue)] hover:text-[color:var(--primary-blue)]"
                >
                  대시보드 보기
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<MapPinned className="h-5 w-5" />}
                title="위치 확인"
                body="후보 위치와 지역 분포를 지도에서 빠르게 확인합니다."
              />
              <FeatureCard
                icon={<Target className="h-5 w-5" />}
                title="판단 근거"
                body="AI 추정 근거와 공공데이터 단서를 함께 봅니다."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="우선조사 추천"
                body="위험도와 활용 가능성을 바탕으로 조사 순서를 검토합니다."
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-[color:var(--background)]">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Data Architecture"
              title="여러 공공데이터를 교차 분석합니다"
              body="입력 데이터와 행정 활용 결과를 분리해, 어떤 근거가 어떤 판단으로 이어지는지 투명하게 보여줍니다."
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <DataList title="입력 데이터" items={dataInputs} tone="blue" />
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--primary-navy)] text-white">
                  <Workflow className="h-6 w-6" />
                </div>
              </div>
              <DataList title="행정 활용 출력" items={dataOutputs} tone="green" />
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Difference"
              title="기존 플랫폼과 공가지도는 역할이 다릅니다"
              body="기존 플랫폼은 등록된 빈집 조회에 강점이 있고, 공가지도는 미등록 빈집 후보 탐지와 우선조사 추천에 집중합니다."
            />
            <div className="mt-8 overflow-hidden rounded-xl border border-[color:var(--border)] bg-white">
              <div className="grid grid-cols-[0.7fr_1fr_1fr] bg-[color:var(--primary-navy)] text-[13px] font-extrabold text-white">
                <div className="p-4">구분</div>
                <div className="p-4">기존 빈집 플랫폼</div>
                <div className="p-4">공가지도</div>
              </div>
              {[
                ["핵심 역할", "등록 빈집 조회", "미등록 빈집 후보 탐지"],
                ["데이터 활용", "확인된 정보 중심", "공공데이터 + AI 분석"],
                ["행정 활용", "현황 확인", "조사 우선순위 추천"],
                ["정책 연결", "조회 이후 개별 검토", "정비·매입·청년주거 연계 검토"],
              ].map(([label, current, kyo]) => (
                <div
                  key={label}
                  className="grid grid-cols-[0.7fr_1fr_1fr] border-t border-[color:var(--border)] text-[13.5px] leading-[1.6]"
                >
                  <div className="bg-[color:var(--background)] p-4 font-extrabold text-[color:var(--primary-navy)]">
                    {label}
                  </div>
                  <div className="p-4 text-[color:var(--body-text)]">{current}</div>
                  <div className="bg-[color:var(--soft-blue)]/60 p-4 font-bold text-[color:var(--primary-navy)]">
                    {kyo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-[color:var(--background)]">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Policy Use Case"
              title="지자체는 조사 전 우선순위를 판단할 수 있습니다"
              body="공가지도는 현장조사를 대체하지 않고, 조사 전 준비와 정책 검토를 돕는 의사결정 보조 도구입니다."
            />
            <div className="mt-8 grid gap-3 md:grid-cols-5">
              {["후보 탐지", "우선조사 대상 선정", "현장 확인", "정비·매입 검토", "활용 연계"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="rounded-lg border border-[color:var(--border)] bg-white p-4"
                  >
                    <Route className="h-5 w-5 text-[color:var(--primary-blue)]" />
                    <div className="mt-4 text-[14px] font-extrabold text-[color:var(--primary-navy)]">
                      {item}
                    </div>
                    <div className="mt-2 text-[12px] font-bold text-[color:var(--muted-text)]">
                      Step {index + 1}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-[color:var(--line)] bg-white">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-6 sm:py-20">
            <SectionHeader
              eyebrow="Roadmap"
              title="프로토타입에서 실증 단계로 이동합니다"
              body="현재는 구현된 MVP를 기반으로, 지자체 실증과 데이터 연동을 통해 검증 가능한 서비스로 발전시키는 단계입니다."
            />
            <ol className="mt-8 grid gap-3 md:grid-cols-5">
              {roadmap.map((item, index) => (
                <li
                  key={item}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-4"
                >
                  <div
                    className={`inline-flex rounded-md px-2 py-1 text-[11px] font-extrabold ${
                      index === 0
                        ? "bg-[color:var(--soft-blue)] text-[color:var(--primary-blue)]"
                        : "bg-white text-[color:var(--muted-text)]"
                    }`}
                  >
                    {index === 0 ? "현재" : `다음 ${index}`}
                  </div>
                  <div className="mt-4 text-[14px] font-extrabold text-[color:var(--primary-navy)]">
                    {item}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[color:var(--primary-navy)] text-white">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-[12px] font-extrabold text-[color:var(--soft-green)]">
                Closing
              </div>
              <h2 className="mt-3 max-w-[760px] text-[30px] font-extrabold leading-[1.22] sm:text-[40px]">
                방치되는 공간을 다시 도시의 가능성으로 연결하겠습니다
              </h2>
              <p className="mt-4 max-w-[700px] text-[15px] leading-[1.8] text-white/78">
                공가지도는 빈집을 나중에 확인하는 지도가 아니라, 먼저 발견하고
                다시 연결하는 AI 도시 데이터 플랫폼입니다.
              </p>
            </div>
            <Link
              href="/map"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-[14px] font-extrabold text-[color:var(--primary-navy)] transition-colors hover:bg-[color:var(--soft-blue)]"
            >
              서비스 데모 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-[760px]">
      <div className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--primary-blue)]">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-[28px] font-extrabold leading-[1.25] text-[color:var(--primary-navy)] sm:text-[36px]">
        {title}
      </h2>
      <p className="mt-3 text-[15px] font-medium leading-[1.8] text-[color:var(--body-text)] sm:text-[16px]">
        {body}
      </p>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-3 shadow-[0_22px_70px_-45px_rgba(9,35,59,0.45)]">
      <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--green-accent)]" />
            <span className="text-[12px] font-extrabold text-[color:var(--primary-navy)]">
              공가지도 데모 데이터
            </span>
          </div>
          <span className="text-[12px] font-bold text-[color:var(--muted-text)]">
            빈집 후보 {HOUSES.length}건
          </span>
        </div>
        <div className="grid min-h-[360px] bg-[color:var(--soft-blue)]/45 md:grid-cols-[1fr_250px]">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,42,68,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,42,68,0.08)_1px,transparent_1px)] bg-[length:44px_44px]" />
            {[
              ["18%", "28%", "var(--green-accent)"],
              ["36%", "58%", "var(--primary-blue)"],
              ["58%", "34%", "var(--danger-red)"],
              ["74%", "66%", "var(--warning-orange)"],
              ["48%", "78%", "var(--green-accent)"],
            ].map(([left, top, color]) => (
              <span
                key={`${left}-${top}`}
                className="absolute h-4 w-4 rounded-full border-[3px] border-white shadow-[0_8px_18px_-8px_rgba(9,35,59,0.7)]"
                style={{ left, top, backgroundColor: color }}
              />
            ))}
            <div className="absolute left-5 top-5 max-w-[260px] rounded-lg border border-[color:var(--border)] bg-white/95 p-4">
              <div className="text-[11px] font-extrabold text-[color:var(--primary-blue)]">
                AI 추정
              </div>
              <div className="mt-1 text-[20px] font-extrabold text-[color:var(--primary-navy)]">
                우선조사 추천
              </div>
              <p className="mt-2 text-[12px] leading-[1.65] text-[color:var(--body-text)]">
                전력 사용 패턴과 건축물 정보를 교차 검토한 후보입니다.
              </p>
            </div>
          </div>
          <aside className="border-t border-[color:var(--border)] bg-white p-4 md:border-l md:border-t-0">
            <div className="text-[12px] font-extrabold text-[color:var(--primary-navy)]">
              후보 상세
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["후보 점수", "상"],
                ["현장조사", "우선 확인"],
                ["정책 연결", "정비·활용 검토"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-[color:var(--background)] px-3 py-2"
                >
                  <span className="text-[12px] font-bold text-[color:var(--muted-text)]">
                    {label}
                  </span>
                  <span className="text-[12px] font-extrabold text-[color:var(--primary-navy)]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-[color:var(--soft-green)] p-3 text-[12px] font-bold leading-[1.6] text-[color:var(--primary-navy)]">
              현장조사 전 사전 스크리닝 결과로만 활용합니다.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({
  label,
  value,
  title,
  body,
  source,
  href,
}: {
  label: string;
  value: string;
  title: string;
  body: string;
  source: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border border-[color:var(--border)] bg-white p-5 transition-colors hover:border-[color:var(--primary-blue)]"
    >
      <div className="text-[12px] font-extrabold text-[color:var(--primary-blue)]">
        {label}
      </div>
      <div className="mt-3 text-[34px] font-extrabold leading-none text-[color:var(--primary-navy)]">
        {value}
      </div>
      <h3 className="mt-3 text-[16px] font-extrabold text-[color:var(--primary-navy)]">
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-[1.65] text-[color:var(--body-text)]">
        {body}
      </p>
      <div className="mt-3 text-[11px] font-bold text-[color:var(--muted-text)]">
        출처: {source}
      </div>
    </a>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--soft-blue)] text-[color:var(--primary-blue)]">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-extrabold text-[color:var(--primary-navy)]">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-[1.7] text-[color:var(--body-text)]">
        {body}
      </p>
    </article>
  );
}

function DataList({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "blue" | "green";
}) {
  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-white p-5">
      <div className="flex items-center gap-2 text-[15px] font-extrabold text-[color:var(--primary-navy)]">
        {tone === "blue" ? (
          <Database className="h-5 w-5 text-[color:var(--primary-blue)]" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-[color:var(--green-accent)]" />
        )}
        {title}
      </div>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-lg bg-[color:var(--background)] px-3 py-2 text-[13.5px] font-bold text-[color:var(--body-text)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
