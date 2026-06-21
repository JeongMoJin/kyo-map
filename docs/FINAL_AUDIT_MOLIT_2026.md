# 공가지도 최종 발표심사 대비 종합 감사 보고서

작성일: 2026-06-21
역할: 제품·서비스 개발 부문 최종감사관
대회: 2026 국토교통 데이터 활용 경진대회
프로젝트: 공가지도
최종 업데이트: 2026-06-21 실서비스 전환 구현 반영

## 0. 실서비스 전환 후 감사관 메모

판정은 기존보다 한 단계 올라갔다. 이제 공가 지도는 단순 정적 시제품이 아니라, `data.go.kr` 공개 파일을 실제 서버에서 읽고, OpenAI Responses API 호출 경로를 갖춘 실서비스 PoC로 볼 수 있다. 다만 현재 실행 환경에는 운영 키가 없어 OpenAI는 fallback이고, 건축물대장/VWorld/전력 데이터는 카탈로그와 확장 경로만 구현된 상태다.

현재 최종 판정: **CONDITIONAL PASS**. 발표 가능성은 충분하지만, 수상권으로 올리려면 발표 전 `OPENAI_API_KEY`, `DATA_GO_KR_SERVICE_KEY`, `VWORLD_API_KEY` 설정과 실제 API 호출 화면 캡처가 필요하다.

가장 중요한 증거:

- `/api/public-data/yeongju?limit=0`: 영주시 공개 빈집 현황 `950건`, 기준일 `2025-07-10` 수집 확인
- `/api/ai/analyze`: OpenAI Responses API 연동 코드 구현, 현재 키 미설정 시 `local_policy_scoring` fallback 확인
- 홈/대시보드 `Production data` 패널: 원천 데이터, 키 상태, 우선 조사 후보군 표시
- Playwright 검증: 홈/대시보드/상세 AI fallback 흐름 통과, 콘솔 경고 0건

## 1. 최종 판정

- 판정: CONDITIONAL PASS
- 현재 수상 가능성: 보통
- 핵심 이유: 제품 화면, 실행 안정성, 문제 정의는 강하지만 실제 공공데이터/AI 증거와 화면 표현의 정합성이 약하다.

## 2. 한 문장 평가

공가지도는 "등록된 빈집 조회"가 아니라 "미등록 빈집 후보를 공공데이터와 AI 분석 흐름으로 사전에 좁히고 행정 우선순위를 제안하는 시제품"이라는 방향이 좋다. 다만 현재 코드 기준 실제 구현은 정적 샘플 데이터와 스코어링 산식 중심이므로, 최종심사에서는 이 사실을 숨기지 않고 "실증 전 MVP"로 정확히 설명해야 한다.

## 3. 감사 산출물

| 문서 | 목적 |
| --- | --- |
| `docs/FINAL_REPO_INVENTORY_MOLIT_2026.md` | 레포 구조, 라우트, 데이터, 문서, 배포 설정 인벤토리 |
| `docs/FINAL_TECH_AUDIT_MOLIT_2026.md` | 설치/타입체크/빌드/서버/브라우저 검증 결과 |
| `docs/FINAL_SERVICE_READINESS_MOLIT_2026.md` | 제품·서비스 부문 적합성, 내부 점수, P0/P1 판정 |
| `docs/DATA_AI_EVIDENCE_MOLIT_2026.md` | 공공데이터/AI 활용 증거 표 |
| `docs/COMPETITOR_DIFFERENTIATION_MOLIT_2026.md` | 빈집애/기존 체계 대비 차별성 |
| `docs/FINAL_DEMO_RUNBOOK_MOLIT_2026.md` | 3/5/7분 데모 흐름과 장애 대응 |
| `docs/JUDGE_QNA_MOLIT_2026.md` | 최종심사 예상 질문 50개와 답변 초안 |
| `docs/UIUX_FINAL_REVIEW_MOLIT_2026.md` | UI/UX 발표 완성도 리뷰 |
| `docs/FINAL_FIX_PLAN_MOLIT_2026.md` | 발표 전 수정 계획과 승인 필요 작업 |

## 4. 실제 확인한 기술 상태

| 항목 | 결과 |
| --- | --- |
| `npm ci` | 성공 |
| `npm audit --json` | moderate 2건: Next 내부 PostCSS 관련. 강제 수정 금지 |
| `npx tsc --noEmit` | 성공 |
| `npm run build` | 성공. 105개 static page 생성 |
| `npm run dev` | 성공. `http://127.0.0.1:3000` |
| `npm run start` | `3017` 포트에서 성공. 응답 200 |
| Playwright 검증 | `/`, `/dashboard`, `/house/H00001`, 404, 모바일, CSV, 필터 동작 확인 |
| 주요 경고 | Recharts width/height 경고 다수 |

## 5. 가장 치명적인 문제 3개

1. 실제 구현보다 강한 실시간/AI/연동 표현
   `LiveTicker`, `SiteHeader`, metadata, dashboard 카피가 실제 API/AI/DB 없는 정적 샘플 앱보다 강하게 말한다.

2. 공공데이터 원천과 가공 관계 증거 부족
   UI에는 건축물대장, 한전 가명정보, 국토지리정보원 위성영상, 안심구역 API가 보이지만 레포에는 원천 파일/API 응답/가공 파이프라인 증거가 없다.

3. AI 활용 증거 부족
   ViT/LSTM/GPT-4o는 개념 파이프라인으로 제시되어 있으나 실제 모델 코드, API 호출, 추론 로그, 평가 지표가 없다.

## 6. 발표 전 반드시 고칠 것 5개

1. 발표 첫 30초에 "샘플 데이터 기반 MVP, 확정 판정 아님, 현장조사 전 후보 추천"을 선제 고지.
2. 앱/발표자료의 `실시간`, `자동 탐지`, `AI 엔진 가동 중`, `한전 실시간 연계`, `자동 연계` 표현 보정.
3. 공공데이터 표를 "현재 샘플 구현"과 "실증 연동 예정"으로 분리.
4. AI 활용을 "현재 구현된 산식/시제품"과 "향후 모델 추론/검증"으로 분리.
5. 데모 백업 스크린샷 10장과 30-60초 영상 3개 이상 준비.

## 7. 발표에서 반드시 강조할 것 5개

1. 공가지도는 등록 빈집 조회가 아니라 미등록 후보 사전 스크리닝이다.
2. 최종 판정이 아니라 우선조사 추천 도구다.
3. 상세 화면은 후보별 근거, 전력사용 패턴, 위험도, 행정 조치까지 보여준다.
4. 대시보드는 지자체 담당자의 Top10 선정, CSV 공유, 정책 검토 흐름을 지원한다.
5. 실증 단계에서는 지자체 빈집대장과 현장 확인 결과로 정확도와 기준을 검증한다.

## 8. 지금 당장 만들 발표 백업자료 5개

1. `/` 지도 전체 캡처.
2. `/house/H00018` 철거/위험 후보 상세 캡처.
3. `/house/H00018` 전력사용량 탭 캡처.
4. `/dashboard` KPI+Official evidence+Top10 캡처.
5. 지도 -> 상세 -> 대시보드 -> CSV 다운로드 45초 영상.

## 9. 내가 직접 수정한 파일

이번 감사에서 직접 수정한 것은 문서 추가뿐이다. 앱 코드, 데이터 구조, 제출 HWP, 배포 설정은 변경하지 않았다.

- `docs/FINAL_AUDIT_MOLIT_2026.md`
- `docs/FINAL_REPO_INVENTORY_MOLIT_2026.md`
- `docs/FINAL_TECH_AUDIT_MOLIT_2026.md`
- `docs/FINAL_SERVICE_READINESS_MOLIT_2026.md`
- `docs/DATA_AI_EVIDENCE_MOLIT_2026.md`
- `docs/COMPETITOR_DIFFERENTIATION_MOLIT_2026.md`
- `docs/FINAL_DEMO_RUNBOOK_MOLIT_2026.md`
- `docs/JUDGE_QNA_MOLIT_2026.md`
- `docs/UIUX_FINAL_REVIEW_MOLIT_2026.md`
- `docs/FINAL_FIX_PLAN_MOLIT_2026.md`

## 10. 내가 수정하지 않고 승인 요청하는 파일/작업

| 작업 | 이유 |
| --- | --- |
| `components/LiveTicker.tsx` 문구 보정 | 실시간/누적/한전 표현이 실제 구현과 다름 |
| `components/SiteHeader.tsx` 문구 보정 | "AI 엔진 가동 중"은 실제 모델 호출 부재와 충돌 |
| `app/layout.tsx` metadata 보정 | "전국 빈집 자동 탐지" 표현 과장 위험 |
| `app/dashboard/page.tsx` 문구 보정 | "자동 연계", "실시간 운영" 표현 보정 필요 |
| `components/HouseDetailView.tsx` 히어로 대비/이미지 보정 | 발표 캡처 품질과 실물성 |
| 테스트/린트 스크립트 추가 | 발표 전 회귀 검증 안정화 |
| 실제 공공데이터/AI 산출물 추가 | 제출 자료와 불일치 가능성이 있어 승인 필요 |
| Vercel 재배포 | 코드 변경 후에만 승인 하 진행 |

## 11. 다음에 해야 할 일

1. P0 문구 수정 승인 여부 결정.
2. 승인되면 앱 카피를 "데모/샘플/실증 예정" 기준으로 즉시 보정.
3. 상세 히어로 대비와 차트 경고를 최소 수정.
4. 발표자료에 데이터/AI 증거 표와 검증 로드맵 삽입.
5. 최종 캡처/영상 백업 제작 후 로컬/배포 양쪽 리허설.

## 12. 외부 확인 출처

- 2026 국토교통 데이터 활용 경진대회 공식 페이지: https://www.bigdata-transportation.kr/pageant/dashboard/CMPE_000000000020042
- 연합뉴스 대회 보도: https://www.yna.co.kr/view/AKR20260405012500003
- 빈집애: https://www.binzibe.kr/main/
- 한국부동산원 빈집정보시스템: https://www.reb.or.kr/reb/cm/cntnts/cntntsView.do?cntntsId=1238&mi=9871
- 대한민국 정책브리핑 2024 인구주택총조사: https://www.korea.kr/briefing/policyBriefingView.do?newsId=156721680
- 국토연구원 국토정책Brief PDF: https://www.krihs.re.kr/boardDownload.es?bid=0008&list_no=398058&seq=1
