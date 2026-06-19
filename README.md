# 공가지도

공공데이터와 AI로 미등록 빈집 후보를 찾아내는 도시 데이터 플랫폼입니다.

공가지도는 빈집을 확정 판정하는 서비스가 아니라, 현장조사 전 사전 스크리닝으로 지자체의 우선조사 추천과 정책 의사결정을 돕는 MVP입니다.

## 핵심 기능

- 공공데이터 기반 빈집 후보 지도
- 후보별 AI 추정 점수와 판단 근거 확인
- 위험도와 활용 가능성을 반영한 우선조사 추천
- 지자체 대시보드 기반 후보 분포와 행정 검토 흐름
- 후보 상세 화면의 전력 사용 패턴, 기본 정보, 정책 활용 시나리오

## 주요 경로

| 경로 | 설명 |
| --- | --- |
| `/` | 프로젝트 소개 랜딩 페이지 |
| `/map` | 빈집 후보 지도 데모 |
| `/house/[id]` | 빈집 후보 상세 |
| `/dashboard` | 지자체 후보 관리 대시보드 |

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Leaflet / react-leaflet
- Recharts
- Vercel 배포

## 실행 방법

```bash
npm install
npm run dev
```

로컬 실행 후 `http://localhost:3000`에서 확인합니다.

프로덕션 빌드:

```bash
npm run build
npm run start
```

## 배포

- 프로덕션 URL: `https://kyo-map.vercel.app`
- 배포 설정: `vercel.json`
- 빌드 명령: `next build`

재배포가 필요하면 Vercel 인증 상태를 확인한 뒤 실행합니다.

```bash
npx vercel deploy --prod --yes
```

## 발표자료 제작 문서

PPT는 자동 생성하지 않습니다. 발표자료는 PowerPoint 또는 미리캔버스에서 직접 제작합니다.

- `docs/presentation/PITCH_DECK_MANUAL.md`
- `docs/presentation/ASSET_CHECKLIST.md`
- `docs/presentation/SPEAKER_SCRIPT.md`
- `docs/presentation/QA_DEFENSE.md`

## 디자인 시스템

- `DESIGN.md`

공공기관 제안서 톤, 행정 SaaS UI, 네이비/블루/그린 중심의 디자인 규칙을 정의합니다.

## 공공데이터 활용 방향

입력 데이터 후보:

- 건축물대장
- 에너지 사용량
- 위성영상
- 인구·상권·교통 데이터
- 정책·정비 데이터

출력 정보:

- 빈집 후보 점수
- 위험도
- 활용 가능성
- 우선조사 추천
- 정책 활용 추천

## 주의

본 서비스는 빈집 확정 판정 도구가 아닙니다. 모든 후보와 점수는 현장조사 전 검토를 돕는 참고 정보이며, 실제 판단은 지자체 절차와 현장 확인을 통해 이루어져야 합니다.
