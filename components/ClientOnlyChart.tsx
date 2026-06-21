"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ChartChild =
  | ReactNode
  | ((size: { width: number; height: number }) => ReactNode);

export function ClientOnlyChart({
  children,
  label,
  minHeight = 240,
}: {
  children: ChartChild;
  label: string;
  minHeight?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [size, setSize] = useState({ width: 1, height: minHeight });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height || minHeight));
      setSize({ width, height });
      setIsReady(width > 1 && height > 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isMounted]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight, minWidth: 1, width: "100%", height: minHeight }}
    >
      {isMounted && isReady ? (
        typeof children === "function" ? children(size) : children
      ) : (
        <div className="flex h-full min-h-full items-center justify-center rounded-xl bg-[color:var(--surface-muted)] text-[12px] font-bold text-[color:var(--ink-muted)]">
          {label} 준비 중
        </div>
      )}
    </div>
  );
}
