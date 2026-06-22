export default function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[color:var(--surface-muted)] px-6">
      <div className="card flex w-full max-w-[360px] flex-col items-center p-6 text-center">
        <div className="relative h-9 w-9">
          <div className="absolute inset-0 animate-ping rounded-full bg-[color:var(--brand-500)] opacity-30" />
          <div className="relative h-9 w-9 rounded-full border-2 border-[color:var(--brand-700)] border-t-transparent animate-spin" />
        </div>
        <h1 className="mt-4 text-[17px] font-extrabold text-[color:var(--ink-strong)]">
          후보 데이터를 불러오는 중입니다
        </h1>
        <p className="mt-1.5 text-[12.5px] font-medium leading-[1.6] text-[color:var(--ink-muted)]">
          지도와 행정 검토 화면을 준비하고 있습니다.
        </p>
      </div>
    </main>
  );
}
