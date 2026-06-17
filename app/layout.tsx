import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans-kr",
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-hanja",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-tech-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "공가지도 (空家地圖) — AI가 찾아주는 전국 빈집 재생 플랫폼",
  description:
    "위성영상·전력사용량·건축물대장 데이터를 AI로 융합 분석해 전국 빈집을 자동 탐지하고 재생 용도를 추천합니다.",
  metadataBase: new URL("https://kyo-map.vercel.app"),
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
    <html
      lang="ko"
      className={`h-full antialiased ${notoSansKr.variable} ${notoSerifKr.variable} ${plexMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans text-[15.5px] leading-[1.62] text-[color:var(--ink)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
