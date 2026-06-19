import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[640px] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
          H-404
        </div>
        <h1 className="mt-3 text-[28px] font-bold">
          해당 빈집 후보 데이터를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--ink-muted)]">
          ID가 올바른지 확인하거나 지도에서 다시 선택해 주세요.
        </p>
        <Link
          href="/map"
          className="mt-6 rounded-full bg-[color:var(--brand-800)] px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-[color:var(--brand-900)]"
        >
          지도로 돌아가기
        </Link>
      </main>
    </>
  );
}
