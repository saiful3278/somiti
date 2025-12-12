## Goal
Add the MagicUI Rainbow Button (same style as the shared link) to the top of the landing page.

## Component
- Create `src/components/ui/RainbowButton.jsx` as a reusable React component implemented with Tailwind utility classes to match MagicUI’s rainbow effect.
- Props: `children`, `onClick`, `className`, optional `to` (renders a `Link` when provided).
- Add `console.log` on file load and inside the click handler.

## Styles
- Reuse existing Tailwind setup in `src/styles/index.css` and theme tokens from `tailwind.config.js`.
- If the rainbow effect requires extra keyframes or CSS variables, add them to `src/styles/components/buttons.css` (imported by `src/styles/index.css`), keeping naming consistent with existing animation tokens (like `--animate-*`).

## Placement
- Insert the button inside the hero section in `src/pages/LandingPage.jsx`, directly below the headers and above the highlights list, within a `div` using the existing `landing-actions` class for layout.
- Code reference for insertion context: `src/pages/LandingPage.jsx:214–226`.

## Integration
- Import the component in `LandingPage.jsx` using project conventions: `import RainbowButton from '../components/ui/RainbowButton';`.
- Initial label: `Rainbow Button` (can be adjusted to Bengali if preferred).
- Default behavior: log clicks to the console; optionally link to `rolePath` (`/member`) if navigation is desired.

## Conventions
- Organize the component under `components/ui` and styles under `styles/components` as per project folder rules.
- Avoid adding comments; ensure required `console.log` entries are present.
- Do not change dev command; when verifying, run `npm run dev -- --host`.

## Verification
- Start the app and open the root route (`#/` via `HashRouter`).
- Confirm the button appears at the top of the hero, animates properly, and logs on click.
- Check responsiveness and that existing hero layout remains intact.

## Optional Adjustments
- If you want a different placement (e.g., above the title or right-aligned), I can adjust position and spacing using existing `LandingPage.css` rules.

Please confirm and I will implement, wire it into the landing page, and validate end-to-end.