"use client";

import { useEffect, useState } from "react";
import { Cpu, Database, ExternalLink, ShieldCheck } from "lucide-react";

interface IntegrationStatus {
  key: string;
  label: string;
  configured: boolean;
  requiredForProduction: boolean;
}

interface VacancyCluster {
  id: string;
  areaName: string;
  total: number;
  riskScore: number;
  actionLabel: string;
}

interface YeongjuDatasetStatus {
  ok: boolean;
  fetchMode: string;
  fetchedAt: string;
  source: {
    name: string;
    provider: string;
    sourceUrl: string;
    fileUrl?: string;
    basisDate?: string;
    privacyNote: string;
  };
  integrations: IntegrationStatus[];
  summary: {
    totalRows: number;
    basisDate: string | null;
    missingAreaRows: number;
    avgKnownAreaM2: number | null;
  };
  clusters: VacancyCluster[];
  warnings: string[];
}

function modeLabel(mode: string) {
  if (mode === "data_go_kr_odcloud_api") return "ODCloud API";
  if (mode === "data_go_kr_file_download") return "공개 CSV 직접 수집";
  return "백업 샘플";
}

function configuredLabel(configured: boolean) {
  return configured ? "설정됨" : "키 필요";
}

export function ProductionStatusPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [data, setData] = useState<YeongjuDatasetStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/public-data/yeongju?limit=0", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload: YeongjuDatasetStatus) => {
        if (alive) setData(payload);
      })
      .catch((reason) => {
        if (alive) {
          setError(reason instanceof Error ? reason.message : "unknown error");
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  const openAi = data?.integrations.find((item) => item.key === "OPENAI_API_KEY");
  const dataGoKr = data?.integrations.find(
    (item) => item.key === "DATA_GO_KR_SERVICE_KEY",
  );
  const vworld = data?.integrations.find((item) => item.key === "VWORLD_API_KEY");

  if (error) {
    return (
      <section className="rounded-xl border border-red-100 bg-red-50 p-4 text-[12.5px] font-semibold text-red-800">
        실서비스 상태 API를 불러오지 못했습니다. {error}
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-xl border border-[color:var(--line)] bg-white/90 p-4 text-[12.5px] font-semibold text-[color:var(--ink-muted)] shadow-sm">
        공공데이터 연동 상태를 확인하는 중입니다...
      </section>
    );
  }

  const isLive = data.fetchMode !== "bundled_public_sample";
  const topClusters = data.clusters.slice(0, compact ? 3 : 5);

  return (
    <section
      className={`rounded-xl border border-[color:var(--line)] bg-white/95 shadow-[0_14px_40px_-28px_rgba(13,24,58,0.28)] ${
        compact ? "p-3.5" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
            <Database className="h-3.5 w-3.5" />
            Production data
          </div>
          <h2
            className={`mt-1 font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)] ${
              compact ? "text-[14.5px]" : "text-[18px] sm:text-[20px]"
            }`}
          >
            공공데이터 실서비스 연동
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
            isLive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {modeLabel(data.fetchMode)}
        </span>
      </div>

      <div className={`mt-3 grid gap-2 ${compact ? "" : "md:grid-cols-4"}`}>
        <Metric
          label="원천 데이터"
          value={`${data.summary.totalRows.toLocaleString("ko-KR")}건`}
          detail={data.source.provider}
        />
        <Metric
          label="데이터 기준일"
          value={data.summary.basisDate ?? data.source.basisDate ?? "확인 필요"}
          detail={data.source.name}
        />
        <Metric
          label="OpenAI"
          value={configuredLabel(Boolean(openAi?.configured))}
          detail={openAi?.configured ? "Responses API 분석 가능" : "로컬 산식 fallback"}
        />
        {!compact && (
          <Metric
            label="공간정보"
            value={configuredLabel(Boolean(vworld?.configured))}
            detail="VWorld/국토지리정보원 확장"
          />
        )}
      </div>

      <div className={`mt-3 grid gap-3 ${compact ? "" : "lg:grid-cols-[1fr_260px]"}`}>
        <div className="rounded-lg bg-[color:var(--surface-muted)] p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold text-[color:var(--ink-strong)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--brand-700)]" />
            우선 조사 후보군
          </div>
          <div className="grid gap-1.5">
            {topClusters.map((cluster) => (
              <div
                key={cluster.id}
                className="flex items-center justify-between gap-3 rounded-md bg-white px-2.5 py-2 text-[11.5px]"
              >
                <div className="min-w-0">
                  <div className="truncate font-extrabold text-[color:var(--ink-strong)]">
                    {cluster.areaName}
                  </div>
                  <div className="text-[10.5px] font-semibold text-[color:var(--ink-muted)]">
                    {cluster.total}건 · {cluster.actionLabel}
                  </div>
                </div>
                <span className="tnum rounded-full bg-[color:var(--brand-50)] px-2 py-0.5 text-[10.5px] font-extrabold text-[color:var(--brand-800)]">
                  {cluster.riskScore}
                </span>
              </div>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="rounded-lg border border-[color:var(--brand-100)] bg-[color:var(--brand-50)] p-3 text-[11.5px] leading-[1.55] text-[color:var(--ink)]">
            <div className="mb-1.5 flex items-center gap-1.5 font-extrabold text-[color:var(--brand-800)]">
              <Cpu className="h-3.5 w-3.5" />
              운영 키 상태
            </div>
            <StatusLine label="공공데이터 API" ok={Boolean(dataGoKr?.configured)} />
            <StatusLine label="OpenAI API" ok={Boolean(openAi?.configured)} />
            <StatusLine label="VWorld API" ok={Boolean(vworld?.configured)} />
            <p className="mt-2 font-medium text-[color:var(--ink-muted)]">
              {data.source.privacyNote}
            </p>
          </div>
        )}
      </div>

      {data.warnings.length > 0 && (
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] font-semibold leading-[1.55] text-amber-800">
          {data.warnings[0]}
        </div>
      )}

      <a
        href={data.source.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-extrabold text-[color:var(--brand-800)] hover:underline"
      >
        원천 데이터 확인
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-white px-3 py-2.5">
      <div className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
        {label}
      </div>
      <div className="tnum mt-1 text-[16px] font-extrabold text-[color:var(--ink-strong)]">
        {value}
      </div>
      <div className="mt-0.5 truncate text-[10.5px] font-semibold text-[color:var(--ink-muted)]">
        {detail}
      </div>
    </div>
  );
}

function StatusLine({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[color:var(--brand-100)] py-1.5 last:border-b-0">
      <span className="font-semibold">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
          ok ? "bg-emerald-50 text-emerald-700" : "bg-white text-amber-700"
        }`}
      >
        {ok ? "설정됨" : "키 필요"}
      </span>
    </div>
  );
}
