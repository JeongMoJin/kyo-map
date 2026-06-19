import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7FAFC",
          color: "#0F2A44",
          padding: "72px",
          fontFamily: "Noto Sans KR, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#0F2A44",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            空
          </div>
          공가지도
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              color: "#2F80ED",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            공공데이터 기반 빈집 후보 탐지
          </div>
          <div
            style={{
              maxWidth: 900,
              fontSize: 62,
              lineHeight: 1.18,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            현장조사 전 사전 스크리닝으로 우선조사를 추천합니다
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            color: "#4B5563",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <span>빈집 후보</span>
          <span>AI 추정</span>
          <span>정책 의사결정 보조</span>
        </div>
      </div>
    ),
    size,
  );
}
