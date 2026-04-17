"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
}

const ToastCtx = createContext<(t: Omit<ToastItem, "id">) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = nextId.current++;
    setItems((s) => [...s, { ...t, id }]);
    setTimeout(() => {
      setItems((s) => s.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[3000] flex flex-col gap-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="card pointer-events-auto fade-in-up flex min-w-[280px] max-w-[380px] items-start gap-3 p-3.5 pr-8"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-[color:var(--foreground)]">
                {it.title}
              </div>
              {it.description && (
                <div className="mt-0.5 text-[12px] text-[color:var(--ink-muted)]">
                  {it.description}
                </div>
              )}
            </div>
            <button
              className="absolute right-2 top-2 rounded-md p-1 text-[color:var(--ink-muted)] hover:bg-[color:var(--surface-muted)]"
              onClick={() =>
                setItems((s) => s.filter((x) => x.id !== it.id))
              }
              aria-label="닫기"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
