# Agent Slide Maker 세팅

`Canine89/agent-slide-maker-easy`는 `tools/agent-slide-maker-easy/`에 vendor 형태로 포함했다. 원격 저장소의 `.git` 폴더는 제외했기 때문에 현재 프로젝트 git과 충돌하지 않는다.

## 작업 위치

공가지도 발표용 HyperFrames topic:

```txt
tools/agent-slide-maker-easy/topics/kyo-map-pitch
```

현재 포함된 초기 파일:

- `index.html`: lint가 통과하는 최소 16:9 표지 composition
- `meta.json`, `hyperframes.json`: HyperFrames topic 설정
- `package.json`: topic 전용 실행 스크립트
- `assets/`: 서비스 캡처, 공식 통계 이미지 저장 위치
- `renders/`: mp4 렌더 결과 위치
- `snapshots/`: PNG 스냅샷 위치

## 실행 명령

루트에서 실행:

```bash
npm run slides:lint
npm run slides:dev
npm run slides:render
```

topic 폴더에서 직접 실행:

```bash
pnpm --dir tools/agent-slide-maker-easy/topics/kyo-map-pitch run lint
pnpm --dir tools/agent-slide-maker-easy/topics/kyo-map-pitch run dev
pnpm --dir tools/agent-slide-maker-easy/topics/kyo-map-pitch run render
```

## 주의

- 이 PC에서는 `npx hyperframes`가 OpenSSL cipher 오류로 실패했다.
- `pnpm dlx hyperframes@0.6.121`는 정상 동작하므로 스크립트는 pnpm 기준으로 고정했다.
- 영상 렌더는 시간이 걸릴 수 있으므로, 먼저 overview 또는 dev preview로 내용을 확인한 뒤 실행한다.
- `renders/`의 mp4 결과물은 tool `.gitignore`에서 무시된다.

## 다음 작업

1. `assets/`에 서비스 캡처와 공식 통계 이미지를 넣는다.
2. `docs/presentation/PITCH_DECK_MANUAL.md`의 12장 구조를 기준으로 `index.html`을 확장한다.
3. `npm run slides:lint`로 composition 오류를 잡는다.
4. preview 확인 후 `npm run slides:render`로 mp4를 생성한다.
