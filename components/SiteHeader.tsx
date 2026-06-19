import Link from "next/link";
import { Home, LayoutDashboard, MapPinned, Trophy } from "lucide-react";

export function SiteHeader({
  active,
}: {
  active?: "home" | "map" | "dashboard";
}) {
  return (
    <header className="sticky top-0 z-[1200] border-b border-[color:var(--line)] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[color:var(--brand-700)] to-[color:var(--brand-900)] shadow-[0_10px_30px_-10px_rgba(30,64,175,0.7)] sm:h-11 sm:w-11 sm:rounded-xl">
            <span className="font-hanja text-[16px] font-black text-white sm:text-[19px]">
              空
            </span>
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="min-w-0 leading-none">
            <div className="font-display truncate text-[16px] font-extrabold text-[color:var(--ink-strong)] sm:text-[19px]">
              공가지도
              <span className="font-hanja ml-1 text-[12px] font-bold text-[color:var(--brand-800)] sm:text-[14px]">
                空家地圖
              </span>
            </div>
            <div className="mt-1 hidden truncate text-[12px] font-medium text-[color:var(--ink-muted)] sm:block">
              공공데이터 기반 빈집 후보 탐지
            </div>
          </div>
        </Link>

        <nav className="flex shrink-0 items-center gap-1 rounded-lg bg-[color:var(--surface-muted)] p-1">
          <Link
            href="/"
            aria-label="프로젝트 소개"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-bold transition-colors sm:px-3 sm:py-2 sm:text-[13.5px] ${
              active === "home"
                ? "bg-white text-[color:var(--brand-800)] shadow-sm"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden md:inline">프로젝트 소개</span>
          </Link>
          <Link
            href="/map"
            aria-label="서비스 데모"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-bold transition-colors sm:px-3 sm:py-2 sm:text-[13.5px] ${
              active === "map"
                ? "bg-white text-[color:var(--brand-800)] shadow-sm"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]"
            }`}
          >
            <MapPinned className="h-3.5 w-3.5" />
            <span className="hidden md:inline">서비스 데모</span>
          </Link>
          <Link
            href="/dashboard"
            aria-label="지자체 대시보드"
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-bold transition-colors sm:px-3 sm:py-2 sm:text-[13.5px] ${
              active === "dashboard"
                ? "bg-white text-[color:var(--brand-800)] shadow-sm"
                : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-strong)]"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden md:inline">대시보드</span>
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <div className="flex items-center gap-1.5 rounded-lg bg-[color:var(--soft-green)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--green-accent)]">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--green-accent)]" />
            </span>
            후보 탐지 MVP
          </div>
          <div
            className="flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-[11px] font-bold text-[color:var(--brand-800)]"
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
