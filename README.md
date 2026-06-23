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
| `/` | 빈집 후보 지도 데모 |
| `/house/[id]` | 빈집 후보 상세 |
| `/dashboard` | 지자체 후보 관리 대시보드 |
| `/api/health` | 서비스 상태 확인 |
| `/api/houses` | 후보 목록 조회 API |
| `/api/houses/[id]` | 후보 상세 조회 API |

## 운영형 MVP 기능

- 지도 검색, 지역·용도·신뢰도·안심구역 필터, 우선순위 정렬
- 지자체 대시보드 상태 필터와 후보별 업무 상태 변경
- 우선순위 Top 10 CSV 내보내기와 월간 리포트 인쇄
- 상세 화면의 상담/제보 케이스 생성, 업무 메모, 처리 이력 저장
- API 키 없이 동작하는 로컬 샘플 데이터 기반 Route Handler

업무 상태와 메모는 현재 브라우저 `localStorage`에 저장됩니다. 추후 DB와 인증을 연결할 때 동일한 상태 모델을 서버 저장소로 이전할 수 있습니다.

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

## API 키 설정

현재 코드에서 실제로 호출하는 외부 API는 OpenAI입니다. 건축물대장, 전력사용량, 위성영상 같은 공공데이터는 아직 샘플 데이터로 동작하며, 다음 데이터 연동 단계에서 별도 Route Handler로 붙이면 됩니다.

### 필수 환경변수

| 환경변수 | 필수 | 권장값 | 설명 |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | 필수 | `sk-...` | 상세 화면의 GPT 실시간 분석 생성에 사용합니다. 서버 Route Handler에서만 읽습니다. |
| `OPENAI_MODEL` | 선택 | `gpt-5-nano` | 비용을 가장 낮게 잡은 기본 모델입니다. 품질을 더 올리고 싶으면 `gpt-5.4-nano`로 바꿔 비교합니다. |
| `OPENAI_MAX_COMPLETION_TOKENS` | 선택 | `500` | GPT 응답 최대 토큰 수입니다. 비용 관리를 위해 500으로 시작합니다. |

프로젝트 루트의 `.env.local`에 아래처럼 넣습니다. `.env.local`과 `api.txt`는 커밋하지 않습니다.

```bash
OPENAI_API_KEY=sk-여기에_발급받은_키
OPENAI_MODEL=gpt-5-nano
OPENAI_MAX_COMPLETION_TOKENS=500
```

### OpenAI API 키 발급 방법

1. [OpenAI Platform](https://platform.openai.com/)에 로그인합니다.
2. 결제 수단이 없으면 Billing에서 결제 정보를 먼저 등록합니다.
3. Project를 선택한 뒤 API Keys 화면으로 이동합니다.
4. `Create new secret key`를 눌러 새 키를 만듭니다.
5. 생성 직후 한 번만 전체 키가 보이므로 바로 안전한 곳에 보관합니다.
6. 로컬은 `.env.local`, Vercel 배포는 Project Settings → Environment Variables에 같은 이름으로 등록합니다.
7. Vercel 환경변수를 바꾼 뒤에는 새 배포를 해야 적용됩니다.

브라우저에서 쓰는 값이 아니므로 `NEXT_PUBLIC_OPENAI_API_KEY`처럼 만들면 안 됩니다. `NEXT_PUBLIC_` 접두사가 붙으면 클라이언트 번들에 노출될 수 있습니다.

### 실서비스 데이터 연동 시 추가 후보

지금 MVP에는 아직 연결하지 않았지만, 실서비스 단계에서는 아래 키 또는 이용승인이 필요합니다.

| 후보 | 어디서 받나 | 용도 | 비고 |
| --- | --- | --- | --- |
| 건축물대장 OpenAPI 인증키 | [공공데이터포털](https://www.data.go.kr/)에서 `국토교통부_건축HUB_건축물대장정보 서비스` 활용 신청 | 준공연도, 면적, 용도, 대장 상태 조회 | 개발계정은 보통 자동승인 후 사용합니다. |
| 건물에너지/전력 데이터 | 건축HUB 건물에너지 API 또는 한국전력 EDS | 장기 미사용 후보 판단 보조 | 개인정보·고객번호 기반 데이터는 정보제공 동의가 필요할 수 있습니다. |
| 지도/지오코딩 API | 카카오, 네이버, VWorld 등 | 주소→좌표 변환, 행정구역 매칭, 고품질 지도 | 현재 화면은 샘플 좌표와 Leaflet 지도를 사용합니다. |
| 위성/항공영상 데이터 | 국토지리정보원, VWorld, 지자체 GIS 등 | 지붕 훼손, 식생 침투 등 영상 분석 입력 | 실제 영상 분석 모델을 붙일 때 필요합니다. |

추가 API를 붙일 때는 키 이름을 서버 전용 환경변수로 만들고, Route Handler에서만 읽도록 구현합니다.

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
