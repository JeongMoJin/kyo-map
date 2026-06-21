# 공가지도 최종 기술 감사 - 2026 국토교통 데이터 활용 경진대회

작성일: 2026-06-21
검증 환경: Windows PowerShell, Node.js `v24.13.1`, npm, Next.js `16.2.9`
패키지 매니저 판정: `package-lock.json` 존재로 npm 사용
최종 업데이트: 2026-06-21 실서비스 전환 구현 및 재검증 반영

## 0. 실서비스 전환 후 재검증 결과

| 항목 | 결과 |
| --- | --- |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS. API 라우트 3개가 Dynamic route로 생성됨 |
| `next start --hostname 127.0.0.1 --port 3017` | PASS |
| `/api/public-data/yeongju?limit=0` | PASS. `data_go_kr_file_download`, 총 `950건`, 기준일 `2025-07-10`, 상위 후보군 `풍기읍 삼가리`, `안정면 묵리`, `안정면 오계리` 확인 |
| `/api/ai/analyze` | PASS. 현재 `OPENAI_API_KEY` 미설정으로 `local_policy_scoring` fallback 반환 |
| Playwright 홈/대시보드/상세 검증 | PASS. 공공데이터 패널, 950건, AI fallback 표시 확인 |
| 브라우저 콘솔 경고/에러 | PASS. Recharts 크기 경고 제거 후 `messageCount: 0` |

신규/변경 API:

- `/api/public-data/status`: 공공데이터 소스와 서버 환경변수 설정 여부 반환
- `/api/public-data/yeongju`: 영주시 공개 빈집 현황 CSV/API 수집 및 리 단위 후보군 집계 반환
- `/api/ai/analyze`: OpenAI Responses API 또는 로컬 정책 산식 fallback으로 후보지 분석 반환

## 1. 최종 기술 판정

CONDITIONAL PASS. 로컬 설치, 타입체크, 프로덕션 빌드, 개발 서버, 프로덕션 서버 실행, 주요 화면 렌더링은 통과했다. 다만 테스트/린트 스크립트 부재, Recharts 콘솔 경고, UI 카피의 과장 리스크, 외부 이미지/지도 타일 의존, 실제 AI/API/공공 원천 데이터 부재는 최종 발표 전 관리해야 한다.

## 2. 실행한 명령어와 결과

| 순서 | 명령어 | 결과 | 로그 요약 |
| --- | --- | --- | --- |
| 1 | `npm ci` | 성공 | 94 packages 설치. `npm audit` 기준 moderate 2건 |
| 2 | `npm audit --json` | 취약점 보고 | `next` direct moderate, `postcss <8.5.10` moderate. `npm audit fix --force`는 `next@9.3.3` 제안이라 실행 금지 |
| 3 | `npx tsc --noEmit` | 성공 | 출력 없음. TypeScript strict 기준 통과 |
| 4 | `npm run build` | 성공 | Next.js 16.2.9 Turbopack. static pages 105개 생성: `/`, `/_not-found`, `/dashboard`, `/house/[id]` 100개 |
| 5 | `npm run lint --if-present` | 실행 항목 없음 | `lint` 스크립트가 없어 출력 없음 |
| 6 | `npm test --if-present` | 실행 항목 없음 | `test` 스크립트가 없어 출력 없음 |
| 7 | `npm run dev -- --hostname 127.0.0.1 --port 3000` | 성공 | `http://127.0.0.1:3000`, Ready in 1844ms |
| 8 | Playwright 브라우저 검증 | 부분 성공 | 주요 페이지 로드/상호작용 성공. Recharts 크기 경고 다수 |
| 9 | `npm run start -- --hostname 127.0.0.1 --port 3001` | 포트 충돌 | `EADDRINUSE 127.0.0.1:3001`. 앱 오류 아님 |
| 10 | `npm run start -- --hostname 127.0.0.1 --port 3017` | 성공 | `http://127.0.0.1:3017` 응답 200 |

## 3. 빌드 결과

`npm run build` 결과:

```text
✓ Compiled successfully
✓ Running TypeScript
✓ Generating static pages (105/105)
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /dashboard
└ ● /house/[id]
  ├ /house/H00001
  ├ /house/H00002
  ├ /house/H00003
  └ [+97 more paths]
```

의미:

- `/house/[id]`는 `generateStaticParams()`로 100개 후보 상세가 SSG 생성된다.
- API/DB가 없는 정적 앱 구조라 데모 안정성은 높다.
- 반대로 실시간 분석/실시간 데이터 연동 주장은 현재 빌드 결과와 맞지 않는다.

## 4. Playwright 화면 검증 결과

| 화면 | URL | 상태 | 오류 오버레이 | 콘솔/렌더링 메모 |
| --- | --- | --- | --- | --- |
| 홈 데스크톱 | `/` | 200 | 없음 | Leaflet 지도/마커/필터 렌더링. Recharts width/height 경고 2회 |
| 대시보드 | `/dashboard` | 200 | 없음 | KPI/근거 카드/Top10/차트 렌더링. Recharts width/height 경고 6회 |
| 상세 | `/house/H00001` | 200 | 없음 | AI 분석/전력사용량/행정 요약 렌더링. 콘솔 오류 없음 |
| 알 수 없는 상세 | `/house/NOPE` | 404 | 없음 | 커스텀 not-found UI 표시. 404 resource console error는 정상 범주 |
| 홈 모바일 | `/` 390x844 | 200 | 없음 | 지도/상단 요약/필터 버튼 렌더링. 목적 설명은 매우 짧게 보임. Recharts 크기 경고 6회 |
| CSV 다운로드 | `/dashboard` 버튼 | 성공 | 없음 | `gonggajido-priority-top10.csv` 다운로드, 토스트 표시 |
| 모바일 필터 | `/` 모바일 | 성공 | 없음 | 바텀시트 열림, 필터 입력 표시 |

## 5. 발견 문제

### P0: 데이터/AI/실시간 표현과 실제 구현의 불일치

- 근거 파일: `components/LiveTicker.tsx`, `components/SiteHeader.tsx`, `app/layout.tsx`, `app/dashboard/page.tsx`, `components/HouseDetailView.tsx`
- 현상: "오늘 새로 탐지", "누적 탐지 1,453,827건", "위성 분석 커버리지 98.4%", "한전 데이터 연계 실시간", "AI 엔진 가동 중", "전국 빈집 자동 탐지", "담당 부서와 자동 연계" 표현이 있다.
- 실제 구현: 정적 `data/houses.json` 100건, 모델/API/DB/실시간 수집 없음.
- 심사 리스크: 심사위원이 "실제 연동인가요?"라고 물으면 신뢰도 하락. 과장으로 보이면 수상 가능성에 직접 타격.
- 최소 조치: 발표 전 화면 문구를 `데모`, `샘플`, `시뮬레이션`, `실증 예정`으로 재정렬하거나 발표에서 먼저 선제 고지.

### P0: 실제 AI 활용 증거 부족

- 근거 파일: `scripts/generate-houses.mjs`, `lib/priority.ts`, `data/houses.json`
- 현상: `ViT`, `LSTM`, `GPT-4o`가 주석/UI에 등장하지만 모델 코드, 추론 로그, API 호출, 학습 산출물, 평가 지표는 없다.
- 실제 구현: `aiConfidence`는 샘플 JSON 값이며, 우선순위는 명시적 산식.
- 최소 조치: "현재 시제품은 개념 파이프라인과 설명 가능한 스코어링을 제품 화면으로 구현했다"로 표현. AI 가점을 노리려면 최소한 추론 예시/노트북/모델 산출물/평가 설계 문서가 필요하다.

### P0: 공공데이터 원천 파일/가공 관계 증거 부족

- 근거 파일: `data/houses.json`, `scripts/generate-houses.mjs`, `lib/public-evidence.ts`
- 현상: UI에는 건축물대장, 한전 가명정보, 국토지리정보원 위성영상, 안심구역 API가 표시되지만 레포에는 원본 파일이나 API 응답 샘플이 없다.
- 최소 조치: 발표자료와 문서에 "프로토타입 샘플 데이터"와 "실증 연동 예정 데이터"를 분리 표기.

### P1: Recharts 크기 경고

- 근거: Playwright 콘솔 경고
- 현상: `The width(-1) and height(-1) of chart should be greater than 0` 경고가 홈/대시보드/모바일에서 발생.
- 영향: 화면은 렌더링되지만 심사장 노트북/해상도에서 차트가 순간 빈 상태로 보일 수 있다.
- 최소 조치: 차트 컨테이너에 명시적 `minWidth`, `minHeight`, `width:100%`, hydration 후 렌더링 조건 강화.

### P1: 상세 페이지 히어로 텍스트 대비 문제

- 근거: Playwright 스크린샷 수동 확인, `app/globals.css`, `components/HouseDetailView.tsx`
- 현상: 상세 페이지 주소 H1이 어두운 이미지 위에서 충분히 읽히지 않는다. 전역 `h1,h2,h3 { color: var(--ink-strong) }`가 Tailwind `text-white` 의도를 덮을 가능성이 있다.
- 영향: 발표자료 캡처 시 핵심 주소/후보 정보가 잘 안 보인다.
- 최소 조치: 상세 히어로 H1/메타 영역에 더 구체적인 색상 클래스 또는 CSS 선택자 적용.

### P1: 외부 이미지/타일 의존

- 근거 파일: `components/HouseMap.tsx`, `components/HouseDetailView.tsx`
- 현상: 지도 타일은 CARTO/OSM, 상세 이미지는 `picsum.photos`.
- 영향: 심사장 네트워크 장애 시 지도/이미지 품질 저하. `picsum`은 실제 위성/빈집과 무관해 심사위원에게 가짜 느낌을 줄 수 있다.
- 최소 조치: 핵심 화면 캡처/백업 영상 준비. 상세 이미지는 로컬 샘플 이미지나 지도 기반 정적 백업으로 대체 검토.

### P2: lint/test 스크립트 부재

- 근거: `package.json`
- 현상: `lint`, `typecheck`, `test` 스크립트 없음.
- 영향: 최종 발표 전 회귀 검증 루틴이 약하다.
- 최소 조치: `typecheck`, `smoke` 또는 Playwright 검증 스크립트 추가. 단, 발표 직전에는 승인 후 진행.

### P2: 글로벌 에러 UI 부족

- 근거: `app/error.tsx`, `app/global-error.tsx` 없음.
- 영향: 예기치 않은 런타임 오류 발생 시 기본 오류 화면 가능.
- 현재 정적 앱이라 위험은 낮지만 발표 데모 안정성 차원에서 보완 가치 있음.

## 6. 보안/환경변수

| 항목 | 결과 |
| --- | --- |
| `.env*` 파일 | 없음 |
| `process.env` 사용 | 검색 결과 없음 |
| Secret/API Key 노출 | 확인되지 않음 |
| `.gitignore` | `.env*`, `.vercel`, `*.pem`, `node_modules`, `.next` 제외 |
| 개인정보 | 샘플 데이터에는 이름/연락처 없음. 다만 실제 주소처럼 보이는 후보 주소/좌표는 발표에서 샘플임을 명시해야 함 |

## 7. 배포 리스크

| 리스크 | 수준 | 설명 |
| --- | --- | --- |
| Vercel 빌드 | 낮음 | `next build` 성공, `vercel.json` 단순 |
| Node 버전 | 중간 | 로컬은 Node 24. Vercel은 프로젝트 설정에 따라 Node 20/22 계열일 수 있음. Next 16은 Node 20.9+ 필요 |
| 외부 타일/이미지 | 중간 | 네트워크 의존 |
| PostCSS moderate advisory | 중간 | `next` 내부 의존성. 강제 수정은 위험 |
| 실시간/AI 주장 | 높음 | 기술 문제가 아니라 신뢰 리스크 |

## 8. 발표 전 권장 검증 루틴

```bash
npm ci
npx tsc --noEmit
npm run build
npm run start -- --hostname 127.0.0.1 --port 3017
```

브라우저에서 반드시 확인:

- `/`
- `/dashboard`
- `/house/H00018`
- `/house/NOPE`
- 모바일 390x844에서 `/`
- 대시보드 CSV 다운로드
- 상세 `AI 분석`/`전력사용량` 탭 전환
