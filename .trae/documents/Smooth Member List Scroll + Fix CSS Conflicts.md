## Goals
- Make member list scrolling feel smooth and responsive.
- Fix CSS conflicts and redundant rules in the list/card styles.
- Eliminate jank from the sticky image sphere fade.

## Issues Identified
- Duplicate CSS selectors causing overrides and extra recalculations (`.member-card-content`, `.member-address`, `.member-role-badge`).
- Heavy hover effects (`box-shadow`, `transform`) on many cards that trigger costly paints while scrolling.
- Static transforms on card content and avatars (`translateY`) increase compositing layers unnecessarily.
- Sticky sphere wrapper has `transition` on `transform/opacity` while JS rAF also updates those properties.
- Excess console logging during scroll (we already throttled; we will reduce further per convention).

## Changes to MemberList.jsx
1. Scroll listener
- Keep rAF updates; further reduce console logs by logging only at large deltas (e.g., ≥300px) or once after attach/detach.
- No change to data flow or layout.

2. Sphere wrapper
- Remove reliance on CSS transitions; JS rAF updates `transform/opacity` only.
- Keep it clickable and sticky.

## Changes to member-list.css
1. Consolidate duplicate selectors
- Keep a single definition for `.member-card-content`, `.member-address`, `.member-role-badge` and remove duplicates.

2. Reduce hover cost
- Move intense hover styles under `@media (hover: hover)`.
- Lighten hover `box-shadow` and remove hover `transform` lift on cards.

3. Remove static transforms
- Remove `transform: translateY(-3px)` from `.member-card-content`.
- Remove `transform: translateY(-10px)` from `.member-avatar` and `.member-avatar-placeholder` and adjust with small margins instead.

4. Optimize scroll container
- Add `overscroll-behavior: contain;` to `.member-scroll-container`.
- Add `content-visibility: auto; contain: paint;` to `.member-card` to skip offscreen rendering.

5. Sticky sphere wrapper
- Remove `transition: opacity/transform` from `.img-sphere-page-wrapper`.
- Keep `will-change`, `translateZ(0)`, `backface-visibility: hidden`.

## Verification
- Run dev server and scroll the list: observe smoothness improvement.
- Confirm sphere fades and slides smoothly without animation stutter.
- Check hover effects still look acceptable but do not cause scroll repaint spikes.
- Ensure bottom navigation no longer obscures last cards.

## Notes
- No behavioral changes to data fetching or modals.
- All updates maintain project conventions and include concise console logs for diagnostics.