# Deployment Report

Recorded at: 2026-06-19 (Asia/Seoul)

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
  - `/map`
  - `/opengraph-image`
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
- `/map`
- `/dashboard`
- `/house/H00018`

Result:

- Landing page rendered with final hero copy.
- Hero CTA navigated to `/map`.
- Map page rendered candidate filters and markers.
- Dashboard rendered without new console warnings/errors.
- Detail page rendered `AI 추정 점수` wording and back-to-map navigation.
- Mobile viewport check passed for landing and map.

## Production Deploy

Command:

```bash
npx vercel deploy --prod --yes
```

Deployment result:

- Success.
- Deployment ID: `dpl_46E5tT2sVTm1HTs4cMYpeRoM81s6`
- Deployment URL: `https://kyo-mdo1rkjfo-jeongmoflag-6585s-projects.vercel.app`
- Production alias: `https://kyo-map.vercel.app`
- Vercel inspector: `https://vercel.com/jeongmoflag-6585s-projects/kyo-map/46E5tT2sVTm1HTs4cMYpeRoM81s6`

Live URL checks:

- `https://kyo-map.vercel.app` -> `200`
- `https://kyo-map.vercel.app/map` -> `200`
- `https://kyo-map.vercel.app/dashboard` -> `200`

## Remaining Issues

- Moderate npm audit advisory remains in Next's bundled PostCSS dependency. Do not run `npm audit fix --force` without reviewing the resulting dependency plan.
- The service still uses sample data. Presentation and README clearly state this is a candidate detection/decision-support MVP, not a legal vacancy judgment.

## Home Follow-Up

- Open `https://kyo-map.vercel.app` and capture the final landing, map, dashboard, and detail screenshots for PPT.
- Use `docs/presentation/PITCH_DECK_MANUAL.md` and `docs/presentation/ASSET_CHECKLIST.md` to build slides manually.
- Re-run deploy only after further code changes:

```bash
npm run build
npx vercel deploy --prod --yes
```
