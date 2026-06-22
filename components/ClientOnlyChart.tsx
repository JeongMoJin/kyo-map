"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function ClientOnlyChart({
  children,
  label,
  minHeight = 240,
}: {
  children: ReactNode;
  label: string;
  minHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      setIsReady(container.clientWidth > 0 && container.clientHeight > 0);
    };

    update();
    const frame = requestAnimationFrame(update);
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ minHeight, minWidth: 0, width: "100%", height: "100%" }}
    >
      {isReady ? (
        children
      ) : (
        <div
          className="flex h-full items-center justify-center rounded-xl bg-[color:var(--surface-muted)] text-[12px] font-bold text-[color:var(--ink-muted)]"
          style={{ minHeight }}
        >
          {label} 준비 중
        </div>
      )}
    </div>
  );
}
