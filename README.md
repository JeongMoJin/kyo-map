# 공가지도 (空家地圖)

**2026 국토교통 데이터활용 경진대회 제출 시제품(MVP)**

🌐 **라이브 데모 →** https://kyo-map.vercel.app

위성영상·전력사용량·건축물대장 등 데이터를 AI로 융합 분석해 **전국 빈집을 자동 탐지하고 재생 용도(귀촌/창업/철거)를 추천**하는 지도 기반 웹 서비스입니다.

핵심 메시지는 단순한 지도 시각화가 아니라, 흩어져 있는 빈집 후보를 **정책 집행 가능한 우선순위 목록**으로 바꾸는 것입니다. 심사 포인트인 데이터융합, 안심구역 결합, AI 활용을 제품 구조 안에서 바로 확인할 수 있도록 구성했습니다.

## 공식 근거와 문제 정의

- 2024년 인구주택총조사 기준 미거주 주택은 약 **160만 호**, 전체 주택의 **8.0%** 수준입니다.
- 국토연구원 자료 기준 법적 빈집 관리 대상은 약 **13만 호**로, 국가 통계와 행정 관리 대상 사이에 큰 간극이 있습니다.
- 공가지도는 이 간극을 줄이기 위해 빈집 후보 탐지, 위험도 우선순위화, 재생 용도 추천, 지자체 조치 흐름을 하나의 화면으로 연결합니다.

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
- **폰트:** Noto Sans KR · Noto Serif KR · IBM Plex Mono (`next/font` self-hosted)
- **배포:** Vercel

## AI 파이프라인 (개념 설계)

코드 주석 및 UI에 표기된 개념적 파이프라인:

1. **ViT (Vision Transformer)** — 위성영상에서 빈집 후보 분류 (지붕 손상률 · 식생 침투율 · 인프라 근접성)
2. **LSTM** — 월별 전력사용 시계열을 학습해 거주/비거주 패턴 탐지
3. **GPT-4o** — 건축물대장·교통·관광자원 맥락을 융합해 재생 용도(귀촌/창업/철거)를 추천

본 시제품은 데모 목적이며, 실제 모델 호출은 포함되어 있지 않습니다. 샘플 데이터는 `data/houses.json`에 있으며 실제 물건과 무관합니다.

## 실증 계획

1. 지자체 빈집대장과 탐지 후보 주소를 매칭해 정답 데이터를 구축합니다.
2. 한국전력 가명 전력사용 패턴으로 장기 미거주 후보를 교차 검증합니다.
3. 현장 확인 결과를 모델 학습 데이터로 환류해 AI 신뢰도와 추천 기준을 보정합니다.
4. 붕괴위험/안심구역 후보는 Top 10 운영 목록으로 분리해 행정 조치 시간을 줄입니다.

## 데이터 출처 (컨셉)

- 국토교통부 건축물대장
- 한국전력 가명정보 (전력사용량)
- 국토지리정보원 위성영상
- 안심구역 API

## 참고 자료

- [2026 국토교통 데이터 활용 경진대회](https://www.bigdata-transportation.kr/pageant/dashboard/CMPE_000000000020042)
- [대한민국 정책브리핑: 2024년 인구주택총조사](https://www.korea.kr/briefing/policyBriefingView.do?newsId=156721680)
- [국토연구원 빈집 관련 자료](https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=398058&seq=1)

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
  priority.ts              # 행정 우선순위 점수 산정
data/
  houses.json              # 100건 샘플
scripts/
  generate-houses.mjs      # seeded 생성기
docs/
  final-polish-implementation-brief.md
```

## 배포

- **프로덕션 URL:** https://kyo-map.vercel.app
- **검수 전용 URL:** https://kyo-p3epxc9hf-jeongmoflag-6585s-projects.vercel.app

재배포:

```bash
npx vercel deploy --prod --yes
```

