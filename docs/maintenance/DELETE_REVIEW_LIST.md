# Delete Review List

These files were not removed because they are not clearly generated pitch/demo artifacts or because they may still be useful project context.

## Kept for Manual Review

- `docs/final-polish-implementation-brief.md`
  - Reason: Old implementation brief, but it documents the previous product-polish scope. Keep unless the final docs fully replace it.
- `CLAUDE.md`
  - Reason: Small compatibility pointer to `AGENTS.md`. Keep unless this repo no longer uses Claude-compatible agent tooling.
- `next.config.ts`
  - Reason: Existing pre-cleanup change sets `devIndicators: false`. It is not related to cleanup and is harmless for the app, so it was preserved.

## Local Folders Not Deleted

- `.next/`
  - Reason: Local Next build/dev cache. Ignored by Git. Can be removed locally if disk cleanup is needed.
- `.vercel/`
  - Reason: Local Vercel project metadata. Ignored by Git. Not committed.
- `node_modules/`
  - Reason: Local dependency install. Ignored by Git. Not committed.

## Removed Instead of Reviewed

The following were removed because they were clearly generated presentation/demo artifacts or direct generators for those artifacts:

- `app/pitch-deck/`
- `docs/pitch/`
- `exports/`
- `outputs/`
- `pitch-assets/`
- `pitch-deck/`
- `scripts/capture-pitch-deck.js`
- `scripts/generate-submission.ts`
- `scripts/finalize-submission.ts`
- `scripts/check-mobile.ts`
- `6_공가지도 ㅋㅅㅌ_260618/`
- default unused SVG assets under `public/`
