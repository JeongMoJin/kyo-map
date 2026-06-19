import { Database, ExternalLink, ShieldCheck, Target } from "lucide-react";
import { OFFICIAL_EVIDENCE, VALIDATION_STEPS } from "@/lib/public-evidence";

const ICONS = [Database, ShieldCheck, Target] as const;

export function PublicEvidencePanel() {
  return (
    <section className="mb-4 rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-[0_14px_40px_-28px_rgba(13,24,58,0.22)] sm:mb-5 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[color:var(--brand-800)]">
            Official evidence
          </div>
          <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.018em] text-[color:var(--ink-strong)] sm:text-[20px]">
            문제 규모와 심사 가점이 바로 연결되는 구조
          </h2>
          <div className="mt-3 grid gap-2.5 md:grid-cols-3">
            {OFFICIAL_EVIDENCE.map((item, index) => {
              const Icon = ICONS[index];
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)]/55 p-3 transition-colors hover:border-[color:var(--brand-500)] hover:bg-[color:var(--brand-50)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[color:var(--ink-muted)]">
                      <Icon className="h-3.5 w-3.5 text-[color:var(--brand-700)]" />
                      {item.eyebrow}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-[color:var(--ink-subtle)] transition-colors group-hover:text-[color:var(--brand-700)]" />
                  </div>
                  <div className="font-display mt-2 text-[24px] font-extrabold leading-none text-[color:var(--brand-800)]">
                    {item.metric}
                  </div>
                  <div className="mt-1 text-[13px] font-extrabold text-[color:var(--ink-strong)]">
                    {item.title}
                  </div>
                  <p className="mt-1.5 text-[11.5px] font-medium leading-[1.55] text-[color:var(--ink-muted)]">
                    {item.detail}
                  </p>
                  <div className="mt-2 text-[10.5px] font-bold text-[color:var(--brand-800)]">
                    {item.sourceName}
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[color:var(--brand-100)] bg-[color:var(--brand-50)] p-4">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--brand-800)]">
            Validation plan
          </div>
          <h3 className="mt-1 text-[16px] font-extrabold text-[color:var(--ink-strong)]">
            지자체 실증 로드맵
          </h3>
          <ol className="mt-3 space-y-2.5">
            {VALIDATION_STEPS.map((step, index) => (
              <li
                key={step}
                className="flex gap-2 text-[12.5px] font-semibold leading-[1.55] text-[color:var(--ink)]"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10.5px] font-extrabold text-[color:var(--brand-800)] ring-1 ring-[color:var(--brand-100)]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
