# 공가지도 발표 영상 작업 공간

이 폴더는 2차 심사용 5분 이내 발표 영상과 발표자료 제작을 위한 HyperFrames topic입니다.

## 목표

- 서비스명: 공가지도
- 발표 포지션: 공공데이터와 AI로 미등록 빈집 후보를 찾아내는 지자체 사전 스크리닝 플랫폼
- 핵심 표현: `빈집 확정 판정`이 아니라 `현장조사 전 우선조사 추천`
- 최종 산출물: 16:9 발표용 슬라이드, 정적 overview, 필요 시 mp4 영상

## 주요 원본 자료

- 발표 구조: `../../../../docs/presentation/PITCH_DECK_MANUAL.md`
- 발표 대본: `../../../../docs/presentation/SPEAKER_SCRIPT.md`
- 자료 체크리스트: `../../../../docs/presentation/ASSET_CHECKLIST.md`
- 운영 상태: `../../../../docs/PRODUCTION_CHECKLIST.md`
- 배포 URL: `https://kyo-map.vercel.app`

## 작업 순서

1. `assets/`에 서비스 캡처와 공식 통계 이미지를 넣습니다.
2. `index.html`에 16:9 애니메이션 슬라이드를 만듭니다.
3. `overview.html`을 만들어 먼저 정적으로 검토합니다.
4. 내용 검토가 끝난 뒤에만 mp4 렌더를 실행합니다.

## 권장 명령

```bash
npx hyperframes lint tools/agent-slide-maker-easy/topics/kyo-map-pitch
npx hyperframes preview tools/agent-slide-maker-easy/topics/kyo-map-pitch
npx hyperframes render tools/agent-slide-maker-easy/topics/kyo-map-pitch
```
