"use client";

import { useEffect, useState } from "react";
import { Activity, TrendingUp, Satellite, Zap } from "lucide-react";

function formatK(n: number) {
  return n.toLocaleString("ko-KR");
}

export function LiveTicker({ total }: { total: number }) {
  const [today, setToday] = useState(14);
  const [cumulative, setCumulative] = useState(1_453_827);

  useEffect(() => {
    const id = setInterval(() => {
      setToday((v) => v + (Math.random() < 0.35 ? 1 : 0));
      setCumulative((v) => v + Math.floor(Math.random() * 3));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-[color:var(--line)] bg-[color:var(--brand-900)] text-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 overflow-x-auto px-4 py-2 text-[11.5px] font-semibold sm:gap-7 sm:px-6 sm:py-2.5 sm:text-[12.5px]">
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <Activity className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            오늘 새로 검토된 후보
          </span>
          <span className="font-medium text-white/75 sm:hidden">오늘</span>
          <span className="tnum text-[12.5px] font-extrabold text-emerald-300 sm:text-[13.5px]">
            {formatK(today)}건
          </span>
        </div>
        <div className="h-3.5 w-px shrink-0 bg-white/15" />
        <div className="flex shrink-0 items-center gap-1.5 text-white/95 sm:gap-2">
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="hidden font-medium text-white/75 sm:inline">
            누적 후보
          </span>
          <span className="font-medium text-white/75 sm:hidden">누적</span>
          <span className="tnum text-[12.5px] font-extrabold sm:text-[13.5px]">
            {formatK(cumulative)}건
          </span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 sm:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 sm:flex">
          <Satellite className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          <span className="font-medium text-white/75">위성 분석 커버리지</span>
          <span className="tnum text-[13.5px] font-extrabold">98.4%</span>
        </div>
        <div className="hidden h-3.5 w-px shrink-0 bg-white/15 md:block" />
        <div className="hidden shrink-0 items-center gap-2 text-white/95 md:flex">
          <Zap className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          <span className="font-medium text-white/75">전력 패턴 데이터</span>
          <span className="tnum text-[13.5px] font-extrabold">연동 준비</span>
        </div>
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold text-white/85 lg:flex">
          현재 화면:{" "}
          <span className="tnum font-extrabold text-white">{total}건</span>
        </div>
      </div>
    </div>
  );
}
