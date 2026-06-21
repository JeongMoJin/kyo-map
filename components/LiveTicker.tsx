"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Satellite, Zap } from "lucide-react";

function formatK(n: number) {
  return n.toLocaleString("ko-KR");
}

interface PublicDataTickerState {
  totalRows: number;
  basisDate: string | null;
  fetchMode: string;
  openAiConfigured: boolean;
}

function fetchModeLabel(mode: string) {
  if (mode === "data_go_kr_odcloud_api") return "ODCloud API";
  if (mode === "data_go_kr_file_download") return "공개 CSV";
  return "백업 샘플";
}

export function LiveTicker({ total }: { total: number }) {
  const [publicData, setPublicData] = useState<PublicDataTickerState | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    fetch("/api/public-data/yeongju?limit=0", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!alive) return;
        setPublicData({
          totalRows: payload.summary?.totalRows ?? 0,
          basisDate: payload.summary?.basisDate ?? null,
          fetchMode: payload.fetchMode ?? "unknown",
          openAiConfigured: Boolean(
            payload.integrations?.find(
              (item: { key: string }) => item.key === "OPENAI_API_KEY",
            )?.configured,
          ),
        });
      })
      .catch(() => {
        if (alive) setPublicData(null);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="border-b border-[color:var(--line)] bg-[color:var(--brand-900)] text-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-x-auto px-4 py-2 text-[11.5px] font-semibold sm:gap-7 sm:px-6 sm:py-2.5 sm:text-[12.5px]">
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <Activity className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            영주시 공개 빈집현황
          </span>
          <span className="font-medium text-white/75 sm:hidden">공공</span>
          <span className="tnum text-[12.5px] font-extrabold text-emerald-300 sm:text-[13.5px]">
            {publicData ? formatK(publicData.totalRows) : "..."}건
          </span>
        </div>
        <div className="h-3.5 w-px shrink-0 bg-white/15" />
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <Database className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            데이터 기준일
          </span>
          <span className="font-medium text-white/75 sm:hidden">기준</span>
          <span className="tnum text-[12.5px] font-extrabold sm:text-[13.5px]">
            {publicData?.basisDate ?? "확인 중"}
          </span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 sm:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 sm:flex">
          <Satellite className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="font-medium text-white/75">원천 수집 방식</span>
          <span className="tnum text-[13.5px] font-extrabold">
            {publicData ? fetchModeLabel(publicData.fetchMode) : "확인 중"}
          </span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 md:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 md:flex">
          <Zap className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <span className="font-medium text-white/75">OpenAI 분석</span>
          <span className="tnum text-[13.5px] font-extrabold">
            {publicData?.openAiConfigured ? "연동 가능" : "키 필요"}
          </span>
        </div>
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold text-white/85 lg:flex">
          현재 화면:{" "}
          <span className="tnum font-extrabold text-white">{total}건</span>
        </div>
      </div>
    </div>
  );
}
