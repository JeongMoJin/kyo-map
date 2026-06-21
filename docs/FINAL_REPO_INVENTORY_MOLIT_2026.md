# 공가지도 최종 레포 인벤토리 - 2026 국토교통 데이터 활용 경진대회

작성일: 2026-06-21
감사 범위: `C:\Users\wlswj\Desktop\AllisWell\JinJeongMo\Contest\kyo-map` 전체 레포, 로컬 실행/빌드 결과, 공개 웹 출처 일부 확인
주의: HWP 제출서류는 개인정보/제출 민감정보 가능성이 있어 파일 존재와 위치만 확인하고 본문 내용은 노출하지 않았다.
최종 업데이트: 2026-06-21 실서비스 전환 구현 반영

## 0. 실서비스 전환으로 추가된 핵심 파일

| 구분 | 파일/라우트 | 역할 | 심사 영향 |
| --- | --- | --- | --- |
| 공공데이터 카탈로그 | `lib/public-data/catalog.ts` | 영주시 빈집 현황, 건축HUB, 법정동, 한전, VWorld 소스와 env 키 정의 | 데이터 출처와 확장 경로가 코드에 명확해짐 |
| 영주시 데이터 수집 | `lib/public-data/yeongju.ts` | `data.go.kr` CSV/API 수집, 인코딩 처리, 리 단위 후보군/위험점수 생성 | 실제 공공데이터 사용 증거 |
| AI 분석 레이어 | `lib/ai/vacancy-analysis.ts` | OpenAI Responses API 구조화 JSON 호출 및 fallback | 실제 AI 연동 경로 확보 |
| 공공데이터 API | `app/api/public-data/yeongju/route.ts` | 영주시 빈집 현황 950건 수집 결과와 후보군 반환 | 데모에서 직접 확인 가능 |
| 상태 API | `app/api/public-data/status/route.ts` | 소스/환경변수 설정 여부 반환 | 키 노출 없이 운영 준비도 표시 |
| AI API | `app/api/ai/analyze/route.ts` | 후보 1건 AI 분석 실행 | 상세 화면 실시간 분석 데모 가능 |
| 운영 패널 | `components/ProductionStatusPanel.tsx` | 홈/대시보드에 원천 데이터, 950건, 키 상태 표시 | 첫 화면 신뢰성 상승 |
| AI 패널 | `components/RealAiAnalysisPanel.tsx` | 상세 후보에서 OpenAI/fallback 분석 표시 | AI가 장식이 아니라 결과물을 생성함 |
| 환경 예시 | `.env.example` | 운영 키 변수명 정리 | 배포/인수인계 필수 |

## 1. 한 줄 결론

공가지도는 이제 Next.js 기반 지도형 시제품을 넘어, 실제 영주시 공개 빈집 현황 950건을 서버에서 수집하고 OpenAI Responses API 분석 경로를 갖춘 실서비스 PoC다. 다만 현재 실행 환경은 운영 키가 없어 OpenAI/건축물대장/VWorld 확장 연동은 키 설정 후 재검증이 필요하다.

## 2. 기술스택

| 항목 | 확인 결과 | 심사 영향 |
| --- | --- | --- |
| 프레임워크 | Next.js `16.2.9`, App Router | 제품/서비스 개발 부문에 맞는 웹 시제품 |
| 런타임/UI | React `19.2.4`, TypeScript strict | 최신 스택, 빌드 안정성 긍정 |
| 스타일 | Tailwind CSS v4, `app/globals.css` | 공공 SaaS형 디자인 구현 |
| 지도 | Leaflet `1.9.4`, react-leaflet `5.0.0` | 지도 기반 서비스 핵심 |
| 차트 | Recharts `3.8.1` | 대시보드/상세 근거 시각화 |
| 아이콘 | lucide-react | UI 완성도 보강 |
| 브라우저 검증 | Playwright devDependency | 테스트 스크립트는 없지만 수동 검증 가능 |
| 배포 | Vercel 설정 `vercel.json` | 실제 URL 운영 가능성 있음 |

## 3. 패키지/명령어

| 파일 | 내용 |
| --- | --- |
| `package.json` | `dev`, `build`, `start`만 정의. `lint`, `typecheck`, `test` 스크립트 없음 |
| `package-lock.json` | npm lockfile 존재. 패키지 매니저는 npm으로 판정 |
| `tsconfig.json` | `strict: true`, `moduleResolution: bundler`, `paths: "@/*"` |
| `next.config.ts` | `devIndicators: false`만 설정 |
| `vercel.json` | `framework: nextjs`, `buildCommand: next build` |

## 4. 주요 라우트

| 라우트 | 파일 | 기능 | 심사 포인트 |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | 지도, 필터, 후보 마커, 실시간처럼 보이는 티커, 상세 이동 | 첫 화면 데모 중심. 제품처럼 보이나 일부 실시간/AI 표현 과장 위험 |
| `/dashboard` | `app/dashboard/page.tsx` | 지자체 대시보드, KPI, 공식 근거 패널, Top 10, 지역/용도 차트, CSV 내보내기 | 제품/서비스 부문 어필 핵심 화면 |
| `/house/[id]` | `app/house/[id]/page.tsx`, `components/HouseDetailView.tsx` | 후보 상세, AI 분석 탭, 전력사용량 차트, 행정 조치 요약 | 후보 탐지-근거-우선조사 흐름이 가장 잘 보이는 화면 |
| `/house/[id]` 404 | `app/house/[id]/not-found.tsx` | 알 수 없는 후보 ID 안내 | 데모 중 잘못된 URL 대응 가능 |
| API 라우트 | 없음 | `app/**/route.ts` 없음 | 외부 서비스/API형 제품은 아님 |

## 5. 핵심 컴포넌트

| 파일 | 역할 | 감사 메모 |
| --- | --- | --- |
| `components/SiteHeader.tsx` | 공통 헤더, 지도/대시보드 내비게이션 | "AI 엔진 가동 중" 표현은 실제 AI 호출 부재와 충돌 |
| `components/LiveTicker.tsx` | 오늘 탐지/누적 탐지/커버리지/한전 실시간 표시 | 정적 샘플 대비 가장 큰 과장 리스크 |
| `components/HouseMap.tsx` | Leaflet 지도, CARTO 타일, 후보 마커/팝업 | 외부 타일 의존. 네트워크 장애 백업 필요 |
| `components/FilterSidebar.tsx` | 용도/시도/신뢰도/안심구역 필터 및 분포 차트 | 심사위원이 직접 만져보기 좋은 요소 |
| `components/MobileFilterSheet.tsx` | 모바일 필터 바텀시트 | 모바일 데모 대응 가능 |
| `components/HouseDetailView.tsx` | 상세 분석, 전력 차트, 행정 조치, 문의/제보 버튼 | 데모 설득의 핵심. 단, `picsum.photos` 외부 이미지 사용 |
| `components/PublicEvidencePanel.tsx` | 공식 통계/정책 근거 카드 | 대시보드에서 공공 문제 규모를 설명 |
| `components/ClientOnlyChart.tsx` | Recharts hydration 방지 래퍼 | 브라우저 콘솔에서 크기 경고 발생 |
| `components/ConfidenceGauge.tsx` | AI 확률 게이지 | 시각적 설득력은 좋지만 "확률" 표현은 과장 주의 |
| `components/Toast.tsx` | CSV/버튼 동작 피드백 | 데모 상호작용 완성도 보강 |

## 6. 데이터 파일/생성 로직

| 파일 | 내용 | 심사 영향 |
| --- | --- | --- |
| `data/houses.json` | 후보 100건 정적 샘플. 필드: `id`, `lat`, `lng`, `address`, `buildYear`, `area`, `usageType`, `ownerType`, `aiConfidence`, `recommendedUse`, `reason`, `isDisasterZone`, `powerUsage`, `nearestIC`, `nearestStation` | 실제 원천 데이터가 아니라 샘플. 발표에서 반드시 명시 필요 |
| `scripts/generate-houses.mjs` | seeded PRNG 기반 샘플 생성. 주석에 ViT/LSTM/GPT-4o "개념적 파이프라인" 명시 | 데이터 생성 재현성은 좋지만 AI 모델 실행 증거는 아님 |
| `lib/houses.ts` | JSON import, ID 조회, 시도 목록 생성 | 모든 화면의 데이터 공급원 |
| `lib/priority.ts` | 우선순위/안전위험/재생적합도/현장확인 필요 산식 | 설명 가능한 스코어링 로직. AI 실시간 추론은 아님 |
| `lib/types.ts` | `House`, 추천 용도 타입/라벨/색상 | 데이터 모델 정의 |
| `lib/public-evidence.ts` | 문제 규모/가점/검증 계획 카드 데이터 | 출처 링크를 UI에 직접 노출 |

데이터 정량 요약:

| 지표 | 값 |
| --- | --- |
| 총 후보 | 100건 |
| 추천 용도 분포 | 귀촌 49, 철거 38, 창업 13 |
| 지역 분포 | 경상북도 24, 강원특별자치도 23, 전라남도 22, 충청북도 18, 전라북도 6, 경상남도 4, 인천광역시 2, 경기도 1 |
| 붕괴위험 안심구역 플래그 | 28건 |
| 평균 AI 신뢰도 | 약 80.9% |
| 신뢰도 범위 | 60% - 99% |
| 준공연도 범위 | 1960 - 2005 |
| 최근 6개월 평균 전력 | 약 1.26kWh |
| 이전 6개월 평균 전력 | 약 10.46kWh |
| 우선순위 점수 범위 | 48 - 99 |
| 현장확인 필요 80점 이상 | 41건 |

## 7. 공공데이터/외부 API/DB/AI 사용 여부

| 항목 | 확인 결과 |
| --- | --- |
| Supabase | 코드 검색 결과 없음 |
| DB | 없음. 정적 JSON import |
| OpenAI/GPT API 호출 | 없음. `GPT-4o`는 UI/주석의 개념 파이프라인 표현 |
| 외부 지도 타일 | `https://{s}.basemaps.cartocdn.com/light_all/...` |
| 외부 이미지 | 상세 히어로 `https://picsum.photos/seed/${house.id}/1600/520` |
| 환경변수 | `.env*` 파일 없음. `process.env` 사용 검색 결과 없음 |
| API Key/Secret | 코드상 없음. `.gitignore`는 `.env*`, `.vercel`, `*.pem` 제외 |

## 8. 발표/문서/제출 자료 위치

| 파일/폴더 | 역할 |
| --- | --- |
| `README.md` | 프로젝트 개요, 실행법, 배포 URL, 주의 문구 |
| `DESIGN.md` | 공공기관 제안서 톤, 디자인/문구 원칙 |
| `docs/presentation/SPEAKER_SCRIPT.md` | 발표 대본 |
| `docs/presentation/QA_DEFENSE.md` | 기존 예상 Q&A |
| `docs/presentation/PITCH_DECK_MANUAL.md` | 사람이 직접 PPT/미리캔버스 제작하는 상세 지침 |
| `docs/presentation/ASSET_CHECKLIST.md` | 발표자료 캡처/출처 체크리스트 |
| `docs/maintenance/DEPLOYMENT_REPORT.md` | 이전 배포/빌드/QA 기록 |
| `docs/maintenance/CLEANUP_REPORT.md` | 발표 생성물 정리 기록 |
| `경진대회_참가서류/2026경진대회_기획서(최종).hwp` | 제출 기획서로 추정. 내용 미노출 |
| `경진대회_참가서류/2026경진대회_참가신청서(최종).hwp` | 제출 신청서로 추정. 내용 미노출 |
| `경진대회_참가서류/2026경진대회_서약서(최종).hwp` | 제출 서약서로 추정. 내용 미노출 |
| `경진대회_참가서류.zip` | 제출서류 묶음으로 추정 |

## 9. 스크린샷/영상/시연자료 존재 여부

초기 레포 기준으로 발표용 PNG/PPTX/영상 산출물은 정리되어 있으며, `docs/presentation/ASSET_CHECKLIST.md`가 캡처해야 할 화면 목록을 안내한다. `.gitignore`는 `/screenshots/`, `/recordings/`, `/demo-videos/`, `*.mp4`, `*.pptx`, `*.pdf` 등을 제외하도록 되어 있다. 즉, 최종 발표 전 백업 스크린샷과 30-60초 영상은 별도 생성이 필요하다.

## 10. 외부 확인 출처

| 출처 | URL | 인벤토리 반영 |
| --- | --- | --- |
| 2026 국토교통 데이터 활용 경진대회 공식 페이지 | https://www.bigdata-transportation.kr/pageant/dashboard/CMPE_000000000020042 | 대회/가점 맥락 확인 |
| 연합뉴스 대회 기사 | https://www.yna.co.kr/view/AKR20260405012500003 | 대회 주제, 제품/서비스 개발 부문, 후속지원 맥락 확인 |
| 빈집애 | https://www.binzibe.kr/main/ | 기존 공식 플랫폼 역할 비교 |
| 한국부동산원 빈집정보시스템 | https://www.reb.or.kr/reb/cm/cntnts/cntntsView.do?cntntsId=1238&mi=9871 | 빈집추정/현황관리 시스템 역할 비교 |
| 대한민국 정책브리핑 2024 인구주택총조사 | https://www.korea.kr/briefing/policyBriefingView.do?newsId=156721680 | 미거주 주택 160만 호 근거 |
| 국토연구원 국토정책Brief | https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=398058&seq=1 | 법령상 빈집 약 13만 호, 기존 조사 한계 근거 |
