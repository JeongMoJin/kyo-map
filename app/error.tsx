"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[color:var(--surface-muted)] px-6">
      <div className="card w-full max-w-[440px] p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-[20px] font-extrabold text-[color:var(--ink-strong)]">
          화면을 불러오지 못했습니다
        </h1>
        <p className="mt-2 text-[13px] font-medium leading-[1.65] text-[color:var(--ink-muted)]">
          일시적인 렌더링 오류일 수 있습니다. 다시 시도하거나 지도로 이동해
          후보 목록을 확인해 주세요.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--brand-800)] px-4 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-[13px] font-extrabold text-[color:var(--ink-strong)] transition-colors hover:bg-[color:var(--surface-muted)]"
          >
            지도로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
