"use client";

import { useEffect, useState } from "react";

export function ConfidenceGauge({
  value,
  label = "빈집 확률",
  size = 168,
  color = "#1E40AF",
}: {
  value: number;
  label?: string;
  size?: number;
  color?: string;
}) {
  const [display, setDisplay] = useState(0);
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = pct;
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const offset = c * (1 - display);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#e6ebf3"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display tnum text-[44px] font-black leading-none tracking-[-0.05em] text-[color:var(--ink-strong)]">
          {Math.round(display * 100)}
          <span className="text-[22px] font-bold text-[color:var(--ink-muted)]">
            %
          </span>
        </div>
        <div className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--ink-muted)]">
          {label}
        </div>
      </div>
    </div>
  );
}
