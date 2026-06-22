"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar, type Filters } from "@/components/FilterSidebar";
import type { House } from "@/lib/types";

export function MobileFilterSheet({
  filters,
  setFilters,
  onReset,
  sidoList,
  visible,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
  sidoList: string[];
  visible: House[];
}) {
  const [open, setOpen] = useState(false);

  // 활성 필터 수 계산 (기본값 대비 변경된 필터 개수)
  const activeCount = (() => {
    let n = 0;
    const uses = filters.uses;
    if (filters.search.trim()) n += 1;
    if (!(uses["귀촌"] && uses["창업"] && uses["철거"])) n += 1;
    if (filters.sido) n += 1;
    if (filters.minConfidence > 0.6) n += 1;
    if (filters.disasterOnly) n += 1;
    if (filters.sort !== "priority") n += 1;
    return n;
  })();

  // ESC 닫기 + 바디 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* FAB — 모바일에서만 표시 */}
      <button
        onClick={() => setOpen(true)}
        className="pointer-events-auto fixed bottom-5 left-4 z-[1150] flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2.5 text-[13px] font-extrabold text-[color:var(--ink-strong)] shadow-[0_12px_32px_-12px_rgba(13,24,58,0.35)] transition-transform active:scale-95 lg:hidden"
        aria-label="필터 열기"
      >
        <SlidersHorizontal className="h-4 w-4 text-[color:var(--brand-700)]" />
        필터
        {activeCount > 0 && (
          <span className="tnum flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--brand-800)] px-1.5 text-[10.5px] font-extrabold text-white">
            {activeCount}
          </span>
        )}
        <span className="tnum hidden rounded-full bg-[color:var(--brand-50)] px-2 py-0.5 text-[11px] font-bold text-[color:var(--brand-800)] xs:inline">
          {visible.length}건
        </span>
      </button>

      {/* Backdrop + Sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex flex-col justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="필터 닫기 (배경)"
          />
          <div className="relative flex max-h-[88vh] flex-col overflow-hidden rounded-t-[22px] bg-white shadow-[0_-20px_60px_-20px_rgba(13,24,58,0.4)]">
            <div className="flex items-center justify-between border-b border-[color:var(--line)] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-1 w-10 rounded-full bg-[color:var(--line)]" />
              </div>
              <div className="absolute left-1/2 top-3.5 -translate-x-1/2 text-[14px] font-extrabold tracking-[-0.01em] text-[color:var(--ink-strong)]">
                탐지 필터
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--surface-muted)] text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--ink-strong)]"
                aria-label="필터 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={onReset}
                sidoList={sidoList}
                visible={visible}
              />
            </div>
            <div className="border-t border-[color:var(--line)] bg-[color:var(--surface-muted)] px-5 py-3">
              <button
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--brand-800)] px-4 py-3 text-[14px] font-extrabold text-white transition-colors hover:bg-[color:var(--brand-900)]"
              >
                {visible.length.toLocaleString()}건 결과 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
