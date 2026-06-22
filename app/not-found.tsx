import Link from "next/link";
import { MapPinned } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[640px] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand-50)] text-[color:var(--brand-800)]">
          <MapPinned className="h-5 w-5" />
        </div>
        <div className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          404
        </div>
        <h1 className="mt-2 text-[26px] font-extrabold text-[color:var(--ink-strong)]">
          요청한 화면을 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-[14px] font-medium leading-[1.7] text-[color:var(--ink-muted)]">
          지도에서 후보를 다시 선택하거나 지자체 대시보드에서 검토 목록을 확인해
          주세요.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-[color:var(--brand-800)] px-5 py-2.5 text-[13.5px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)]"
        >
          탐지 지도로 이동
        </Link>
      </main>
    </>
  );
}
