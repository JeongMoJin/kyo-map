# Before Cleanup Status

Recorded at: 2026-06-19 (Asia/Seoul)

## Current Branch

- Branch before cleanup: `main`
- Tracking: `origin/main`
- Remote: `origin https://github.com/JeongMoJin/kyo-map.git`

## Package Manager and Commands

- Package manager: `npm`
- Lock file: `package-lock.json`
- Dev command: `npm run dev`
- Build command: `npm run build`
- Start command: `npm run start`
- Deploy config: `vercel.json`
- Deploy target: Vercel, `framework: nextjs`, `buildCommand: next build`

## Current Git Status

Tracked changes already present before this cleanup:

- `next.config.ts`
  - Existing diff adds `devIndicators: false`.
- `package.json`
  - Existing diff adds `pitch:export` and `pitch:export:2x` scripts.

Untracked folders and files present before this cleanup:

- `6_공가지도 ㅋㅅㅌ_260618/`
- `app/pitch-deck/`
- `docs/pitch/`
- `exports/`
- `outputs/`
- `pitch-assets/`
- `pitch-deck/`
- `scripts/capture-pitch-deck.js`

## Main Folder Structure

Core application folders:

- `app/`
- `components/`
- `data/`
- `lib/`
- `public/`
- `scripts/`

Documentation and config:

- `docs/`
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `next.config.ts`
- `postcss.config.mjs`
- `tsconfig.json`
- `vercel.json`
- `package.json`
- `package-lock.json`

Generated/local folders:

- `.next/`
- `.vercel/`
- `node_modules/`

## Actual Service Routes

- `/`
  - Main map interface with filters, ticker, candidate markers, and detail navigation.
- `/dashboard`
  - Administrative dashboard with priority list and charts.
- `/house/[id]`
  - Candidate detail route.
- `/house/[id]/not-found`
  - Not found state for unknown candidate IDs.

Temporary/generated route found:

- `/pitch-deck`
  - Web slide route; deletion candidate because PPT/web-slide auto generation is no longer the final direction.

## Large File List

Large generated or cleanup-relevant files outside `node_modules`, `.git`, and `.next`:

- `exports/png-2x/13-closing-thank-you.png` (~2.91 MB)
- `exports/png-2x/01-cover.png` (~1.74 MB)
- `outputs/공가지도_IR피치덱_진정모_20260617.pptx` (~1.54 MB)
- `outputs/gonggajido_final_pitchdeck_winning_2026.pptx` (~1.54 MB)
- `outputs/gonggajido_story_consulting_pitchdeck_2026.pptx` (~1.29 MB)
- `exports/png-2x/07-data-ai-architecture.png` (~1.25 MB)
- `exports/png-2x/04-core-insight.png` (~1.04 MB)
- `exports/png-2x/12-roadmap-team.png` (~0.99 MB)
- `6_공가지도 ㅋㅅㅌ_260618/흐름구성 기본_ 양식_ 국토교통부_진정모.pptx` (~0.99 MB)

Large local/generated folders:

- `.next/`
- `node_modules/`

## Suspected Temporary Folders

Clearly generated or presentation/demo related:

- `exports/`
- `outputs/`
- `pitch-assets/`
- `pitch-deck/`
- `app/pitch-deck/`
- `docs/pitch/`
- `6_공가지도 ㅋㅅㅌ_260618/`

Generated local folders that should remain ignored, not committed:

- `.next/`
- `.vercel/`
- `node_modules/`

## Deletion Candidate List

Safe deletion candidates based on the current final direction:

- `app/pitch-deck/`
- `docs/pitch/`
- `exports/`
- `outputs/`
- `pitch-assets/`
- `pitch-deck/`
- `scripts/capture-pitch-deck.js`
- `package.json` pitch export scripts:
  - `pitch:export`
  - `pitch:export:2x`
- `6_공가지도 ㅋㅅㅌ_260618/`

Tracked cleanup candidates that are not required by the live service:

- `scripts/generate-submission.ts`
  - Generates demo video, GIF, screenshots, and evidence PDF.
- `scripts/finalize-submission.ts`
  - Packages generated PDF/MP4 submission files.
- `scripts/check-mobile.ts`
  - Generates screenshot artifacts under `submission/mobile-check`.

## Preserve List

Core application:

- `app/page.tsx`
- `app/dashboard/page.tsx`
- `app/house/[id]/page.tsx`
- `app/house/[id]/not-found.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/favicon.ico`
- `components/`
- `lib/`
- `data/houses.json`
- `scripts/generate-houses.mjs`

Package/config/deploy:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `vercel.json`
- `.gitignore`

Static assets:

- `public/`

Documentation to keep or replace with final versions:

- `README.md`
- `AGENTS.md`
- `docs/final-polish-implementation-brief.md`
- New final docs under `docs/maintenance/`
- New final docs under `docs/presentation/`
- New root `DESIGN.md`

## Notes Before Deletion

- Do not run `git clean -fd`.
- Delete only listed generated/presentation/demo artifacts.
- If a file appears connected to the running service after inspection, move it to `docs/maintenance/DELETE_REVIEW_LIST.md` instead of deleting it.
- Final presentation files should not be stored in this repository; they will be made manually in PowerPoint or MiriCanvas.
