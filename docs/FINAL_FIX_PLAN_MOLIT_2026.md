# 공가지도 최종 발표 전 수정 계획

작성일: 2026-06-21
최종 업데이트: 2026-06-21 실서비스 전환 구현 반영
원칙: 저위험/고효과 항목은 직접 반영했고, 운영 키/DB/스키마/대규모 데이터 조인은 승인 후 진행한다.

## 0. 완료된 즉시 수정

| 상태 | 항목 | 파일 |
| --- | --- | --- |
| 완료 | `data.go.kr` 영주시 공개 빈집 현황 CSV/API 수집 레이어 추가 | `lib/public-data/yeongju.ts`, `app/api/public-data/yeongju/route.ts` |
| 완료 | 공공데이터/운영 키 상태 패널 추가 | `components/ProductionStatusPanel.tsx`, `app/page.tsx`, `app/dashboard/page.tsx` |
| 완료 | OpenAI Responses API 분석 경로와 fallback 추가 | `lib/ai/vacancy-analysis.ts`, `app/api/ai/analyze/route.ts`, `components/RealAiAnalysisPanel.tsx` |
| 완료 | 과장 표현 정리: `실시간`, `GPT-4o`, `ViT/LSTM` 직접 실행 표현 제거 | `app/page.tsx`, `components/HouseDetailView.tsx`, `components/LiveTicker.tsx`, `components/SiteHeader.tsx` |
| 완료 | Recharts 크기 경고 제거 | `components/ClientOnlyChart.tsx`, `components/FilterSidebar.tsx`, `app/dashboard/page.tsx` |
| 완료 | 운영 환경변수 예시 추가 | `.env.example`, `.gitignore` |

## 0-1. 아직 승인/키가 필요한 작업

| 우선순위 | 작업 | 필요한 것 |
| --- | --- | --- |
| P0 | `OPENAI_API_KEY` 설정 후 실제 OpenAI 분석 화면 캡처 | OpenAI API key |
| P1 | `DATA_GO_KR_SERVICE_KEY` 설정 후 ODCloud API 경로 검증 | 공공데이터포털 service key |
| P1 | `VWORLD_API_KEY` 설정 후 지오코딩/공간 중첩 구현 | VWorld key |
| P1 | 건축HUB 건축물대장 API 실제 조인 | 공공데이터포털 key, 주소/법정동 정규화 |
| P1 | 운영 DB/Supabase 또는 Postgres 저장소 설계 | 스키마 승인 |

## 1. 최우선 P0

| 우선순위 | 작업 | 대상 파일 | 이유 | 예상 난이도 |
| --- | --- | --- | --- | --- |
| P0-1 | 실시간/AI/연동 과장 문구 보정 | `components/LiveTicker.tsx`, `components/SiteHeader.tsx`, `app/layout.tsx`, `app/dashboard/page.tsx` | 실제 구현과 화면 표현 정합성 확보 | 낮음-중간 |
| P0-2 | 데이터 출처/샘플 여부 UI 표기 강화 | `components/FilterSidebar.tsx`, `components/HouseDetailView.tsx`, `app/dashboard/page.tsx` | 공공데이터 질문 방어 | 낮음 |
| P0-3 | AI 활용 증거 문서/슬라이드 추가 | `docs/presentation/*`, 발표자료 | AI가 장식이라는 공격 방어 | 중간 |
| P0-4 | 발표 첫 30초 멘트 수정 | `docs/presentation/SPEAKER_SCRIPT.md` | "확정 판정 아님/샘플 MVP" 선제 고지 | 낮음 |
| P0-5 | 백업 캡처/영상 생성 | repo 밖 또는 ignore된 `/screenshots`, `/demo-videos` | 네트워크 장애 대응 | 낮음 |

## 2. 중요 P1

| 우선순위 | 작업 | 대상 파일 | 이유 | 예상 난이도 |
| --- | --- | --- | --- | --- |
| P1-1 | 상세 히어로 텍스트 대비 수정 | `components/HouseDetailView.tsx`, `app/globals.css` | 발표 캡처 품질 | 낮음 |
| P1-2 | Recharts 경고 완화 | `components/ClientOnlyChart.tsx`, 차트 부모 컨테이너 | 데모 안정성 | 중간 |
| P1-3 | `picsum.photos` 의존 제거 또는 샘플 표기 | `components/HouseDetailView.tsx`, `public/` | 실물성/네트워크 리스크 | 중간 |
| P1-4 | 대시보드 "자동 연계" 문구 보정 | `app/dashboard/page.tsx` | 실제 연동 없음 | 낮음 |
| P1-5 | 데이터 원천/가공 표를 README 또는 별도 문서에 추가 | `README.md` 또는 `docs/` | 심사위원 질문 대비 | 낮음 |

## 3. P2

| 작업 | 이유 |
| --- | --- |
| `typecheck` 스크립트 추가 | 반복 검증 편의 |
| Playwright smoke 스크립트 추가 | 발표 전 자동 화면 점검 |
| 글로벌 에러 UI 추가 | 런타임 오류 대응 |
| 모바일 첫 화면 목적 문구 추가 | 휴대폰 확인 대응 |
| CSV 컬럼 설명 문서화 | 행정 활용 설득력 |

## 4. 내가 직접 수정한 항목

이번 턴에서 직접 수정한 것은 심사 대비 문서 추가뿐이다.

- `docs/FINAL_REPO_INVENTORY_MOLIT_2026.md`
- `docs/FINAL_TECH_AUDIT_MOLIT_2026.md`
- `docs/FINAL_SERVICE_READINESS_MOLIT_2026.md`
- `docs/DATA_AI_EVIDENCE_MOLIT_2026.md`
- `docs/COMPETITOR_DIFFERENTIATION_MOLIT_2026.md`
- `docs/FINAL_DEMO_RUNBOOK_MOLIT_2026.md`
- `docs/JUDGE_QNA_MOLIT_2026.md`
- `docs/UIUX_FINAL_REVIEW_MOLIT_2026.md`
- `docs/FINAL_FIX_PLAN_MOLIT_2026.md`
- `docs/FINAL_AUDIT_MOLIT_2026.md`

## 5. 승인 요청 작업

아래는 사용자의 승인 없이 진행하지 않았다.

1. 앱 화면 문구 변경.
2. 상세 페이지 CSS/디자인 수정.
3. `picsum.photos` 이미지 제거/대체.
4. 테스트/린트 스크립트와 의존성 변경.
5. 실제 공공데이터 샘플 추가 또는 데이터 구조 변경.
6. HWP 제출서류 내용 수정.
7. Vercel 재배포.

## 6. 발표 전 추천 실행 순서

1. P0 문구 보정 승인 여부 결정.
2. 발표 대본 첫 30초에 "샘플 MVP/후보 추천/현장확인 전" 문장 반영.
3. 핵심 화면 캡처 10장 생성.
4. 30-60초 백업 영상 3개 생성.
5. `npm ci`, `npx tsc --noEmit`, `npm run build` 재실행.
6. 배포 URL과 로컬 `next start` 양쪽 확인.
7. 발표자료 PDF와 로컬 영상 파일을 USB/클라우드/노트북에 중복 저장.
