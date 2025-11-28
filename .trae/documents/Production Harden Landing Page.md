## Objectives
- Reduce runtime cost and improve stability without changing visual/UX intent
- Keep logs (per project rule) but make noisy logs less intrusive
- Make asset loading and animations robust in production builds (sub-path safe and reduced-motion aware)

## Changes in `src/pages/LandingPage.jsx`
- Asset paths: replace absolute `fetch('/…json')` with `${import.meta.env.BASE_URL}…json` so it works when deployed under a non-root base path.
- Lazy load heavy components: switch `Testimonials`, `StatsCounter`, `InfoGrid`, `MapBlock`, `FaqAccordion` to `React.lazy` with `Suspense` fallbacks to cut initial bundle size.
- Defer Lottie mounts: render rain/leaves Lottie only when their season card enters viewport (tie into existing IntersectionObserver) to avoid loading animations before visible.
- Reduced motion: check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip Lottie init when true; keep CSS `@media (prefers-reduced-motion)` intact.
- Memoize SEO objects: wrap `seoJsonLd`, `openGraph`, `twitterCard` and derived strings with `useMemo` to avoid re-creating every render.
- Logging hygiene: keep key lifecycle logs as `console.log`; change high-frequency hover logs to `console.debug` to reduce noise while satisfying “always add console logs”.
- Anchor clicks: prevent default on `href="#"` links and convert them to buttons where appropriate to avoid accidental page jumps.
- Safety on refs: guard `rainRef.current`/`leavesRef.current` calls and consolidate duplicate retries.

## Changes in `src/styles/LandingPage.css`
- No visual overhaul; preserve design
- Minor performance tweaks: limit `will-change` usage to animated elements already present; keep existing reduced-motion rules
- Ensure grid breakpoints remain; no selector renames to avoid regressions

## Verification Plan
- Run dev server and verify on desktop and mobile widths
- Test deploy under a non-root base path to confirm JSON asset loads via `BASE_URL`
- Toggle system “Reduce motion” to verify animations/lotties don’t play
- Check console output level: lifecycle logs visible, hover logs downgraded to debug
- Validate anchors don’t jump page when used as action triggers

If approved, I’ll implement the changes, run the app, and share a preview URL for you to review.