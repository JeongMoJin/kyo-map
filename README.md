# 공가지도 (空家地圖)

**2026 국토교통 데이터활용 경진대회 제출 시제품(MVP)**

🌐 **라이브 데모 →** https://kyo-map.vercel.app

위성영상·전력사용량·건축물대장 등 데이터를 AI로 융합 분석해 **전국 빈집을 자동 탐지하고 재생 용도(귀촌/창업/철거)를 추천**하는 지도 기반 웹 서비스입니다.

## 빠른 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

샘플 데이터를 다시 생성하려면:

```bash
node scripts/generate-houses.mjs
```

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/` | 전국 공가 탐지 지도 + 필터 사이드바 + 실시간 티커 |
| `/house/[id]` | 빈집 상세 — AI 분석, 전력사용량 차트, 기본정보 탭 |
| `/dashboard` | 경상북도 빈집 관리 대시보드 (Top 10 + 3개 차트) |

## 기술 스택

- **Next.js 16 (App Router) · TypeScript**
- **Tailwind CSS v4** + 커스텀 디자인 토큰
- **지도:** react-leaflet v5 + CARTO Light 타일
- **차트:** Recharts (PieChart · AreaChart · BarChart)
- **아이콘:** lucide-react
- **폰트:** Pretendard Variable (CDN)
- **배포:** Vercel

## AI 파이프라인 (개념 설계)

코드 주석 및 UI에 표기된 개념적 파이프라인:

1. **ViT (Vision Transformer)** — 위성영상에서 빈집 후보 분류 (지붕 손상률 · 식생 침투율 · 인프라 근접성)
2. **LSTM** — 월별 전력사용 시계열을 학습해 거주/비거주 패턴 탐지
3. **GPT-4o** — 건축물대장·교통·관광자원 맥락을 융합해 재생 용도(귀촌/창업/철거)를 추천

본 시제품은 데모 목적이며, 실제 모델 호출은 포함되어 있지 않습니다. 샘플 데이터는 `data/houses.json`에 있으며 실제 물건과 무관합니다.

## 데이터 출처 (컨셉)

- 국토교통부 건축물대장
- 한국전력 가명정보 (전력사용량)
- 국토지리정보원 위성영상
- 안심구역 API

## 프로젝트 구조

```
app/
  layout.tsx               # Pretendard + ToastProvider
  page.tsx                 # 메인 지도
  dashboard/page.tsx       # 지자체 대시보드
  house/[id]/page.tsx      # 빈집 상세 (100개 SSG)
components/
  SiteHeader.tsx
  LiveTicker.tsx
  FilterSidebar.tsx
  HouseMap.tsx             # Leaflet (CSR 전용)
  HouseDetailView.tsx
  ConfidenceGauge.tsx
  Toast.tsx
lib/
  types.ts
  houses.ts
data/
  houses.json              # 100건 샘플
scripts/
  generate-houses.mjs      # seeded 생성기
```

## 배포

- **프로덕션 URL:** https://kyo-map.vercel.app
- **검수 전용 URL:** https://kyo-p3epxc9hf-jeongmoflag-6585s-projects.vercel.app

재배포:

```bash
npx vercel deploy --prod --yes
```

