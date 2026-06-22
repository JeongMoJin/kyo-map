import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "공가지도 (空家地圖) — 공공데이터 기반 빈집 후보 검토 플랫폼",
  description:
    "위성영상·전력사용량·건축물대장 데이터를 융합 분석해 빈집 후보를 추정하고 현장조사 우선순위와 재생 용도를 검토합니다.",
  metadataBase: new URL("https://kyo-map.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "공가지도 (空家地圖) — 공공데이터 기반 빈집 후보 검토 플랫폼",
    description:
      "위성영상·전력사용량·건축물대장 데이터를 융합 분석해 빈집 후보를 추정하고 현장조사 우선순위와 재생 용도를 검토합니다.",
    url: "https://kyo-map.vercel.app",
    siteName: "공가지도",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "공가지도 (空家地圖)",
    description:
      "공공데이터 기반 빈집 후보 검토 플랫폼",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e40af",
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
