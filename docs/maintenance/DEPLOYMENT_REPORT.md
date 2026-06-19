# Deployment Report

Recorded at: 2026-06-19 (Asia/Seoul)

Latest update:

- Restored the previous map-first service design after the final cleanup redesign branch was reviewed.
- The public home route is again the service map screen.
- The temporary `/map` route and generated OpenGraph image route were removed from the app.

## Build and Checks

Package manager:

- `npm`

Commands run:

```bash
npm run build
npm audit --audit-level=moderate
```

Build result:

- Passed.
- Next.js version after security patch update: `16.2.9`.
- Static routes generated:
  - `/`
  - `/dashboard`
  - `/house/[id]` with 100 generated sample paths.

Lint result:

- No `lint` script is defined in `package.json`.
- TypeScript checking ran as part of `next build` and passed.

Audit result:

- `next` was updated from `16.2.4` to `16.2.9` to remove the high severity advisories reported by npm.
- `npm audit --audit-level=moderate` still reports a moderate PostCSS advisory bundled under Next.
- npm suggests `npm audit fix --force`, but that path proposes a breaking/uncontrolled dependency change, so it was not run.

## Rendered QA

Local QA URL:

- `http://127.0.0.1:3001`

Checked routes:

- `/`
- `/dashboard`
- `/house/H00018`

Result:

- Home rendered the restored previous map-first UI with `전국 공가` and `LIVE · 실시간 탐지 결과`.
- Home navigation exposes `/dashboard` through the `지자체 대시보드` link.
- Dashboard route rendered the restored previous heading `경상북도 빈집 관리 대시보드`.
- Fresh browser console checks after reload/direct route load reported no new errors or warnings.
- Browser screenshot capture timed out in the in-app browser runtime, so rendered proof was collected from DOM snapshots, console logs, HTTP checks, and production HTML checks.

## Production Deploy

Command:

```bash
npx vercel deploy --prod --yes
```

Deployment result:

- Success.
- Deployment ID: `dpl_FZvFi56u6NkuDeSwFqGRNfqjvthk`
- Deployment URL: `https://kyo-54elyogtm-jeongmoflag-6585s-projects.vercel.app`
- Production alias: `https://kyo-map.vercel.app`
- Vercel inspector: `https://vercel.com/jeongmoflag-6585s-projects/kyo-map/FZvFi56u6NkuDeSwFqGRNfqjvthk`

Live URL checks:

- `https://kyo-map.vercel.app` -> `200`
- `https://kyo-map.vercel.app/dashboard` -> `200`
- `https://kyo-map.vercel.app/house/H00018` -> `200`
- `https://kyo-map.vercel.app/map` -> `404` after route removal.
- Production HTML includes restored home text `전국 공가` and `LIVE · 실시간 탐지 결과`.
- Production dashboard HTML includes `경상북도 빈집 관리 대시보드`.

## Remaining Issues

- Moderate npm audit advisory remains in Next's bundled PostCSS dependency. Do not run `npm audit fix --force` without reviewing the resulting dependency plan.
- The service still uses sample data. Presentation and README clearly state this is a candidate detection/decision-support MVP, not a legal vacancy judgment.
- Some documentation such as `DESIGN.md` still records the safer final-pitch language direction. The live product UI has intentionally been restored to the previous map-first design.

## Home Follow-Up

- Open `https://kyo-map.vercel.app` and capture the restored map-first home, dashboard, and detail screenshots for PPT.
- Use `docs/presentation/PITCH_DECK_MANUAL.md` and `docs/presentation/ASSET_CHECKLIST.md` to build slides manually.
- Re-run deploy only after further code changes:

```bash
npm run build
npx vercel deploy --prod --yes
```
