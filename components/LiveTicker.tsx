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
      <div className="mx-auto flex max-w-[1440px] items-center gap-7 overflow-x-auto px-6 py-2.5 text-[12.5px] font-semibold">
        <div className="flex items-center gap-2 text-white/95">
          <Activity className="h-3.5 w-3.5 text-emerald-300" />
          <span className="font-medium text-white/75">오늘 새로 탐지된 빈집</span>
          <span className="tnum text-[13.5px] font-extrabold text-emerald-300">
            {formatK(today)}건
          </span>
        </div>
        <div className="h-3.5 w-px bg-white/15" />
        <div className="flex items-center gap-2 text-white/95">
          <TrendingUp className="h-3.5 w-3.5 text-sky-300" />
          <span className="font-medium text-white/75">누적 탐지</span>
          <span className="tnum text-[13.5px] font-extrabold">
            {formatK(cumulative)}건
          </span>
        </div>
        <div className="h-3.5 w-px bg-white/15" />
        <div className="hidden items-center gap-2 text-white/95 md:flex">
          <Satellite className="h-3.5 w-3.5 text-sky-300" />
          <span className="font-medium text-white/75">위성 분석 커버리지</span>
          <span className="tnum text-[13.5px] font-extrabold">98.4%</span>
        </div>
        <div className="hidden h-3.5 w-px bg-white/15 md:block" />
        <div className="hidden items-center gap-2 text-white/95 md:flex">
          <Zap className="h-3.5 w-3.5 text-amber-300" />
          <span className="font-medium text-white/75">한전 데이터 연계</span>
          <span className="tnum text-[13.5px] font-extrabold">실시간</span>
        </div>
        <div className="ml-auto hidden items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold text-white/85 lg:flex">
          현재 화면: <span className="tnum font-extrabold text-white">{total}건</span>
        </div>
      </div>
    </div>
  );
}
