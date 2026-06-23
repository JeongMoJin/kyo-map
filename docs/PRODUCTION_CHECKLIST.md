# 실서비스 배포 체크리스트

공가지도는 현재 샘플 공공데이터와 OpenAI GPT 분석을 결합한 운영형 MVP입니다. 실제 지자체 서비스로 전환할 때는 아래 순서대로 확인합니다.

## 1. 필수 환경변수

로컬은 `.env.local`, Vercel은 Project Settings > Environment Variables에 등록합니다.

| 이름 | 필수 | 예시 | 확인 방법 |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | 필수 | `sk-...` | `/api/health`의 `ai.openAiConfigured`가 `true` |
| `OPENAI_MODEL` | 선택 | `gpt-5-nano` | `/api/health`의 `ai.model` |
| `OPENAI_MAX_COMPLETION_TOKENS` | 선택 | `500` | `/api/health`의 `ai.maxOutputTokens` |
| `OPENAI_TIMEOUT_MS` | 선택 | `20000` | `/api/health`의 `ai.timeoutMs` |

비밀키는 절대 `NEXT_PUBLIC_` 접두사로 만들지 않습니다.

## 2. 배포 전 로컬 검증

```bash
npm install
npm run build
npm run dev
```

브라우저에서 확인합니다.

- `/` 지도 후보 목록, 검색, 필터
- `/dashboard` 지자체 대시보드, 상태 변경, CSV 내보내기
- `/house/H00001` 상세 화면, GPT 분석 생성 버튼
- `/api/health` 운영 상태 JSON
- `/api/ai/recommendation`은 버튼 클릭 시에만 호출

## 3. 비용 보호

- GPT 분석은 상세 화면에서 버튼을 누를 때만 호출합니다.
- `/api/ai/recommendation`은 IP 기준 10분에 12회로 제한합니다.
- OpenAI 응답이 실패하거나 타임아웃되면 로컬 fallback 분석을 반환합니다.
- 기본 모델은 `gpt-5-nano`, 기본 출력 제한은 500 토큰입니다.

## 4. Vercel 배포

1. Vercel 프로젝트 환경변수에 `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MAX_COMPLETION_TOKENS`를 등록합니다.
2. 환경변수 수정 후 반드시 새 배포를 실행합니다.
3. 배포 후 `/api/health`에서 `status`, `checks`, `ai` 값을 확인합니다.
4. 상세 화면에서 GPT 분석을 한 번만 생성해 OpenAI 응답 여부를 확인합니다.

```bash
npx vercel deploy --prod --yes
```

## 5. 아직 기관 승인 또는 계정이 필요한 항목

아래 항목은 코드만으로 완료할 수 없고, 실제 운영 주체의 계정과 데이터 이용 승인이 필요합니다.

| 항목 | 필요한 것 | 연결 후 기대 효과 |
| --- | --- | --- |
| 건축물대장 OpenAPI | 공공데이터포털 활용 신청 인증키 | 준공연도, 용도, 면적, 대장 상태 자동 갱신 |
| 전력/건물에너지 데이터 | 건축HUB 또는 한전 EDS 이용 승인, 필요 시 정보제공 동의 | 장기 미사용 후보 판단 고도화 |
| 지도/지오코딩 | 카카오, 네이버, VWorld 등 API 키 | 주소 검색, 좌표 보정, 행정구역 매칭 |
| 업무 DB와 로그인 | Supabase, Postgres, 또는 기관 내부 DB 계정 | 메모, 상태, 상담 접수의 다중 사용자 저장 |

## 6. 최종 운영 판단

현재 버전은 공개 데모와 제안/실증 MVP로 배포 가능합니다. 실제 민원/행정 업무에 투입하려면 DB, 인증, 기관 공공데이터 연계, 개인정보 처리방침, 현장 확인 프로세스가 함께 승인되어야 합니다.
