"use client";

import { Activity, Database, Satellite, ShieldCheck } from "lucide-react";

function formatK(n: number) {
  return n.toLocaleString("ko-KR");
}

export function LiveTicker({ total }: { total: number }) {
  return (
    <div className="border-b border-[color:var(--line)] bg-[color:var(--brand-900)] text-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-x-auto px-4 py-2 text-[11.5px] font-semibold sm:gap-7 sm:px-6 sm:py-2.5 sm:text-[12.5px]">
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <Activity className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            현재 화면 빈집 후보
          </span>
          <span className="font-medium text-white/75 sm:hidden">후보</span>
          <span className="tnum text-[12.5px] font-extrabold text-emerald-300 sm:text-[13.5px]">
            {formatK(total)}건
          </span>
        </div>
        <div className="h-3.5 w-px shrink-0 bg-white/15" />
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <Database className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            데이터 성격
          </span>
          <span className="font-medium text-white/75 sm:hidden">데이터</span>
          <span className="tnum text-[12.5px] font-extrabold sm:text-[13.5px]">
            데모 샘플
          </span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 sm:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 sm:flex">
          <Satellite className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="font-medium text-white/75">AI 추정</span>
          <span className="tnum text-[13.5px] font-extrabold">
            현장조사 전 사전 스크리닝
          </span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 md:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 md:flex">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <span className="font-medium text-white/75">활용 원칙</span>
          <span className="tnum text-[13.5px] font-extrabold">
            정책 의사결정 보조
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
