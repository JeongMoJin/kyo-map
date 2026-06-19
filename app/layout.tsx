import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "공가지도 - 공공데이터 기반 빈집 후보 탐지 플랫폼",
  description:
    "공가지도는 현장조사 전 사전 스크리닝으로 지자체의 우선조사 추천과 정책 의사결정을 돕는 도시 데이터 플랫폼입니다.",
  metadataBase: new URL("https://kyo-map.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "공가지도 - 공공데이터와 AI로 미등록 빈집 후보를 찾아냅니다",
    description:
      "지자체 실태조사를 위한 빈집 후보 탐지, 우선조사 추천, 정책 의사결정 보조 플랫폼입니다.",
    url: "https://kyo-map.vercel.app",
    siteName: "공가지도",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "공가지도",
    description:
      "공공데이터 기반 빈집 후보 탐지와 지자체 우선조사 추천 플랫폼",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F2A44",
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-[15.5px] leading-[1.62] text-[color:var(--ink)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
