# 공가지도 DESIGN.md

This document defines the visual and product language for 공가지도. It follows the DESIGN.md pattern popularized by `awesome-design-md`: plain markdown that agents and contributors can read before changing UI, copy, or presentation assets.

## Active Implementation Note

The live product has been restored to the previous map-first service design.

- Treat `/` as the primary map demo screen.
- Do not reintroduce a landing-first redesign or `/map` split route unless explicitly requested.
- Keep future visual changes small and compatible with the restored blue/emerald operational dashboard style.
- The language guidance below remains useful for pitch safety, but it must not override the restored product layout.

## 1. Visual Theme & Atmosphere

공가지도 is a public-data urban decision-support service.

The interface should feel like:

- A city data platform built for local government teams.
- An administrative SaaS product that a 담당자 can trust during 실태조사 planning.
- A map-based public-data tool, not a speculative AI toy.
- A calm proposal for public institutions: clear, accountable, and restrained.
- Lightly technical, but never noisy or exaggerated.

The mood is:

- Structured.
- Quietly premium.
- Evidence-first.
- Policy-aware.
- Practical.

Avoid:

- Overheated AI marketing.
- Oversized startup hero typography.
- Decorative gradient-heavy visuals.
- Slide-deck effects on the website.
- Claims that suggest official legal judgment.

## 2. Design References

Do not copy any brand directly. Use only these high-level principles:

- IBM / Carbon: public-data clarity, enterprise grids, disciplined information density.
- Vercel: precise typography, clean whitespace, deliberate hierarchy.
- Linear: tidy B2B SaaS surfaces, compact cards, readable grids.
- Coinbase: institutional trust, financial-grade restraint, confident blue usage.
- Webflow / Intercom: simple product explanation flow and easy-to-scan sections.

## 3. Color Palette

Use these tokens as the source of truth.

| Token | Hex | Role |
| --- | --- | --- |
| Primary Navy | `#0F2A44` | main headings, high-trust areas, footer |
| Deep Navy | `#09233B` | deepest emphasis and dark text blocks |
| Primary Blue | `#2F80ED` | primary CTAs, links, selected states |
| Soft Blue | `#EAF4FF` | informational backgrounds |
| Green Accent | `#2EAD73` | positive status, policy opportunity, viable reuse |
| Soft Green | `#EAF8F1` | positive background |
| Warning Orange | `#F2994A` | caution, pending review |
| Danger Red | `#EB5757` | high-risk candidate, urgent review |
| Background | `#F7FAFC` | page background |
| Card Background | `#FFFFFF` | content surfaces |
| Border | `#D8E5F2` | dividers, card borders, table lines |
| Body Text | `#4B5563` | paragraph text |
| Muted Text | `#7A8A9A` | captions, labels, supporting copy |

Usage rules:

- Navy is for authority and structure.
- Blue is for navigation and action.
- Green is for opportunity or reuse, not generic decoration.
- Orange and red are sparse warning colors.
- The site should read as a light public SaaS interface, not a dark AI dashboard.
- Do not introduce dominant purple, neon gradients, beige editorial palettes, or heavy black sections.

## 4. Typography

Font stack:

```css
font-family: Pretendard, "Noto Sans KR", Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

Current project fallback may use `Noto Sans KR` through `next/font`; that is acceptable. Prefer Pretendard if local or hosted assets are added later.

Rules:

- Korean text must use `word-break: keep-all`.
- Use `overflow-wrap: anywhere` only for URLs, IDs, and narrow controls.
- Headings should be confident but not giant.
- Body copy should stay readable at 15-17px on web.
- Avoid negative letter spacing for small Korean text.
- Use tabular numbers for metrics, candidate IDs, scores, and tables.
- Use sentence-style headings, not excessive title case.

Suggested web scale:

| Role | Size |
| --- | --- |
| Hero H1 | 38-56px desktop, 30-38px mobile |
| Section H2 | 28-38px desktop, 24-30px mobile |
| Card title | 17-22px |
| Body | 15-17px |
| Small label | 11-13px |

## 5. Components

### Header

- Sticky, compact, and white or very light.
- Logo links to `/`.
- Navigation must clearly expose:
  - 서비스 데모 or 탐지 지도
  - 지자체 대시보드
  - 발표자료 제작 가이드 when used as a docs link.
- Active state uses white surface, navy/blue text, and subtle border/shadow.

### Hero

- One clear message.
- Required headline:
  - `공공데이터와 AI로 미등록 빈집 후보를 찾아냅니다`
- Required description:
  - `공가지도는 현장조사 전 사전 스크리닝으로 지자체의 우선조사 추천과 정책 의사결정을 돕는 도시 데이터 플랫폼입니다.`
- Primary CTA:
  - `서비스 데모 보기`
- Secondary CTA:
  - `프로젝트 소개 보기` or `발표자료 제작 가이드 보기`
- Show a real product preview, not an abstract illustration.

### Problem Section

- Title:
  - `빈집 문제는 늘어나지만, 발견과 대응은 늦습니다`
- Cover:
  - 지역 안전
  - 도시 미관
  - 생활 만족도
  - 행정 조사비용
- Use sourced statistics only.

### Service Demo Section

- Title:
  - `지도에서 후보와 판단 근거를 확인합니다`
- Must lead users to the actual map/service route.
- Show sample states such as filters, candidate details, risk/usage labels.

### Data Architecture Section

- Title:
  - `여러 공공데이터를 교차 분석합니다`
- Inputs:
  - 건축물대장
  - 에너지 사용량
  - 위성영상
  - 인구·상권·교통 데이터
  - 정책·정비 데이터
- Outputs:
  - 빈집 후보 점수
  - 위험도
  - 활용 가능성
  - 우선조사 추천
  - 정책 활용 추천

### Competitive Comparison

- Title:
  - `기존 플랫폼과 공가지도는 역할이 다릅니다`
- Compare existing platforms as registered-vacancy lookup tools.
- Position 공가지도 as 미등록 빈집 후보 탐지 and 우선조사 추천.
- Do not imply official systems are inferior; describe role difference.

### Policy Use Case

- Title:
  - `지자체는 조사 전 우선순위를 판단할 수 있습니다`
- Flow:
  - 후보 탐지
  - 우선조사 대상 선정
  - 현장 확인
  - 정비·매입 검토
  - 활용 연계

### Roadmap

- Title:
  - `프로토타입에서 실증 단계로 이동합니다`
- Steps:
  - 프로토타입 구현
  - 공공데이터 추가 연동
  - 지역 단위 실증
  - 지자체 SaaS
  - 유휴공간 확장

### Contact CTA

- Title:
  - `방치되는 공간을 다시 도시의 가능성으로 연결하겠습니다`
- Include service URL, email placeholder, and QR placeholder when needed.

### Card

- Radius: 8-12px for dense product UI, 12-16px for larger landing modules.
- Border: `#D8E5F2`.
- Shadow: minimal or none.
- Avoid nested cards.
- Each card should carry one message.

### Badge

- Use for status, source, or candidate type.
- Avoid novelty labels like `New`, `Beta`, or loud AI badges.
- Prefer square-ish rounded badges over pill-heavy decoration.

### Table

- Strong header row.
- Thin borders.
- Left-align Korean text.
- Use blue/green emphasis sparingly.
- Keep row heights compact but readable.

### Map Preview

- The map is the product, so it should be visible early.
- Preserve realistic controls, markers, and detail panels.
- Avoid fake map screenshots unless clearly labeled as conceptual.

## 6. Layout Rules

- Use enough whitespace, but keep information density appropriate for administrative software.
- One section, one message.
- Do not overuse cards; use full-width sections and structured rows.
- Use responsive grids that collapse cleanly on mobile.
- Keep text lines narrow enough for Korean readability.
- Make mobile CTAs full-width when needed.
- Do not use visible instructional text about keyboard shortcuts or design features unless it is necessary for product operation.
- Avoid arbitrary decorative blobs, bokeh, or orbs.
- Avoid oversized hero sections that hide the next section entirely.
- Data dashboards may be denser than marketing sections.

## 7. Copywriting Rules

Required expressions:

- 빈집 후보
- AI 추정
- 우선조사 추천
- 현장조사 전 사전 스크리닝
- 정책 의사결정 보조
- 공공데이터 기반 후보 탐지
- 지자체 실태조사 지원

Forbidden expressions:

- 빈집 확정
- AI가 100% 판별
- 공식 판정
- 정확도 99%
- 무조건 절감
- 출처 없는 숫자
- 과장된 AI 표현

Tone:

- Plain Korean.
- Administrative and concrete.
- No exaggerated AI certainty.
- Repeat that the service supports field investigation, not replaces it.

Preferred phrasing:

- `AI가 빈집 여부를 확정합니다` -> `AI가 빈집 후보를 추정합니다`
- `정확도 99%` -> `실증 단계에서 지자체 빈집대장과 현장 확인 결과로 검증합니다`
- `전국 빈집 자동 탐지` -> `공공데이터 기반 빈집 후보 탐지`
- `담당 부서와 자동 연계` -> `담당 부서 검토 흐름에 연결할 수 있습니다`

## 8. Responsive Behavior

- Desktop content max width: 1200-1440px.
- Mobile padding: 20-24px.
- Touch target minimum: 40px.
- Tables can become stacked comparison blocks on mobile.
- Map surfaces must maintain useful height on mobile.
- Buttons must not wrap awkwardly; use icon-only only when the icon is standard and accessible labels are present.

## 9. Accessibility

- Maintain visible focus states.
- Use semantic landmarks: `header`, `main`, `section`, `nav`, `footer`.
- Meaningful images need alt text.
- External links need clear labels.
- Color must not be the only indicator of risk or status.

## 10. Agent Prompt Guide

Before changing UI, read this file and check:

- Is the copy about 후보 탐지, not 확정 판정?
- Are all numbers sourced or clearly labeled as sample/demo?
- Does the page feel like public-sector SaaS rather than AI marketing?
- Does the route still lead to the real map/product screen?
- Are generated slides, PPTX, PNG slide exports, and demo videos excluded from the repo?

Use the palette, tokens, and copy rules above as the default answer whenever design choices are unclear.
