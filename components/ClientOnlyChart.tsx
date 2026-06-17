"use client";

import { useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-[color:var(--surface-muted)] text-[12px] font-bold text-[color:var(--ink-muted)]"
        style={{ minHeight }}
      >
        {label} 준비 중
      </div>
    );
  }

  return <>{children}</>;
}
