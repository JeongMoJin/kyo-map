import Link from "next/link";
import { MapPinned, LayoutDashboard, Trophy } from "lucide-react";

export function SiteHeader({ active }: { active?: "map" | "dashboard" }) {
  return (
    <header className="sticky top-0 z-[1200] border-b border-[color:var(--line)] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--brand-700)] to-[color:var(--brand-900)] shadow-[0_10px_30px_-10px_rgba(30,64,175,0.7)]">
            <span className="font-hanja text-[19px] font-black text-white">
              空
            </span>
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="leading-none">
            <div className="font-display text-[19px] font-extrabold text-[color:var(--ink-strong)]">
              공가지도{" "}
              <span className="font-hanja text-[14px] font-bold text-[color:var(--brand-800)]">
                空家地圖
              </span>
            </div>
            <div className="mt-1.5 text-[12px] font-medium text-[color:var(--ink-muted)]">
              AI가 찾아주는 전국 빈집 재생 플랫폼
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-[color:var(--surface-muted)] p-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors ${
              active === "map"
                ? "bg-white text-[color:var(--brand-800)] shadow-sm"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]"
            }`}
          >
            <MapPinned className="h-3.5 w-3.5" /> 탐지 지도
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-bold transition-colors ${
              active === "dashboard"
                ? "bg-white text-[color:var(--brand-800)] shadow-sm"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> 지자체 대시보드
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            AI 엔진 가동 중
          </div>
          <div
            className="hidden items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white px-3 py-1.5 text-[11px] font-bold text-[color:var(--brand-800)] md:flex"
            title="2026 국토교통 데이터활용 경진대회 제출 시제품"
          >
            <Trophy className="h-3 w-3 text-amber-500" />
            2026 국토교통 경진대회
          </div>
        </div>
      </div>
    </header>
  );
}
