## What I’ll Implement
- Create a `ThemeSwitcher` component that mirrors the Cinematic Theme Switcher visuals and behavior without external packages (`framer-motion`, `next-themes`).
- Toggle only the Landing Page theme by adding/removing a `dark` class on the Landing Page root container.
- Place the switch at the top-right of the hero area in `LandingPage.jsx`.
- Follow project conventions: component in `src/components/ui`, styles in `src/styles/components/theme-switcher.css`, import via `src/styles/index.css`. Add console logs in the component and page.

## Files To Add/Modify
- Add `src/components/ui/theme-switcher.jsx`: stateful switch with Sun/Moon icons, particle burst using CSS keyframes, hover/press effects, `onToggle` callback.
- Add `src/styles/components/theme-switcher.css`: track, thumb, overlays, particles animations, and focus/hover transitions.
- Update `src/styles/index.css`: import the new `theme-switcher.css`.
- Update `src/pages/LandingPage.jsx`: mount the switch in a `hero-theme-toggle` container at top-right; keep local `isDark` state to add `dark` class to `.landing-root` only; console log interactions.
- Update `src/styles/LandingPage.css`: make `.landing-hero` `position: relative` and add `.hero-theme-toggle` positioning.

## Implementation Details
- No `next-themes`: local React `useState` for `isDark`.
- No `framer-motion`: use CSS transitions for thumb movement (`transform: translateX(...)`) and `@keyframes` for particles.
- Accessibility: `role="switch"`, `aria-checked`, focus ring, keyboard support.

## Verification
- Visual correctness: appears top-right in hero, smooth toggle animation.
- Local-only theme: confirms `dark` class applies to `landing-root` without affecting other routes.
- Dev server already running; verify via `http://localhost:5174/`.

## Notes
- Reuses `lucide-react` already present.
- Organized files per project rules; no Markdown files; includes console logs.