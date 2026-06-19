# Cleanup Report

Recorded at: 2026-06-19 (Asia/Seoul)

## Deleted Files and Folders

Generated pitch/deck/export artifacts:

- `app/pitch-deck/`
- `docs/pitch/`
- `exports/`
- `outputs/`
- `pitch-assets/`
- `pitch-deck/`
- `scripts/capture-pitch-deck.js`
- `6_공가지도 ㅋㅅㅌ_260618/`

Demo/submission artifact generators:

- `scripts/generate-submission.ts`
- `scripts/finalize-submission.ts`
- `scripts/check-mobile.ts`

Unused starter static assets:

- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

Package cleanup:

- Removed `pitch:export` and `pitch:export:2x` scripts from `package.json`.
- Removed no-longer-used dev dependencies:
  - `@ffmpeg-installer/ffmpeg`
  - `tsx`

## Held for Review

See `docs/maintenance/DELETE_REVIEW_LIST.md`.

Held items:

- `docs/final-polish-implementation-brief.md`
- `CLAUDE.md`
- Existing `next.config.ts` change: `devIndicators: false`
- Local-only `.next/`, `.vercel/`, `node_modules/`

## Preserved Core Files

Application:

- `app/`
- `components/`
- `lib/`
- `data/houses.json`
- `scripts/generate-houses.mjs`

Configuration:

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `vercel.json`
- `.gitignore`

Brand/runtime assets:

- `app/favicon.ico`

Documentation:

- `README.md`
- `AGENTS.md`
- `docs/maintenance/`
- `docs/presentation/`
- `DESIGN.md`

## Repository Structure Result

After cleanup, the repository focuses on the actual Next.js service, sample data, core generator for sample houses, and final documentation. The removed folders were presentation exports, PPTX outputs, web slide code, generated screenshots, and demo video submission tooling.

## Artifacts That Should Not Be Generated Into Git

- PPTX / Keynote files
- PDF presentation exports
- web slide routes
- PNG slide exports
- demo videos
- recording outputs
- screenshot exports
- generated submission packages
- local build/cache folders

## `.gitignore` Additions

Added or reinforced ignore rules for:

- `dist/`
- `Thumbs.db`
- `*.log`
- `/exports/`
- `/outputs/`
- `/pitch-assets/`
- `/pitch-deck/`
- `/screenshots/`
- `/recordings/`
- `/demo-videos/`
- `/playwright-report/`
- `/test-results/`
- `/.cache/`
- `/.tmp/`
- `/temp/`
- `*.mp4`
- `*.mov`
- `*.webm`
- `*.gif`
- `*.pptx`
- `*.key`
- `*.pdf`

## Notes

- `git clean -fd` was not used.
- Ambiguous files were kept and documented instead of deleted.
- Final presentation production should happen manually in PowerPoint or MiriCanvas using the new docs under `docs/presentation/`.
