# Final Polish Implementation Brief

## Goal

Make Gonggajido feel like a deployable administrative decision product, not only a contest demo.

## Scope

- Add a transparent priority scoring model for vacant-house action ranking.
- Turn dashboard report controls into working interactions.
- Add administrative workflow evidence to each house detail page.
- Keep sample data unchanged and avoid new dependencies.

## Acceptance Criteria

- Dashboard Top 10 explains why each item is urgent.
- CSV export, print/report, and filter-focus controls perform visible actions.
- Detail pages show assigned department, recommended next action, field-check priority, and evidence trail.
- `npm run build` passes.
- Rendered QA covers map, dashboard, detail, and at least one interaction.
