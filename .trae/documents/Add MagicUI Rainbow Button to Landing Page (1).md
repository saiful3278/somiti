## What I’ll Implement

* Create a reusable `RainbowButton` component that matches MagicUI’s Rainbow Button (animated conic-gradient border + subtle glow).

* Keep it dependency-free: no external packages; Tailwind + a few CSS keyframes in our existing styles.

* Place the button near the top hero section of `LandingPage.jsx` (under highlights) so it’s visible immediately.

* Follow project conventions: component in `src/components/ui`, styles in `src/styles/components/buttons.css`, and add console logs in both files.

## Files To Add/Modify

* Add `src/components/ui/rainbow-button.jsx`: implements the rainbow button with props `children`, `className`, and `onClick`. Uses a `Link` or `button`, no `cn` dependency.

* Update `src/styles/components/buttons.css`: define `.magic-rainbow-border`, `.magic-rainbow-fill`, and `@keyframes rainbow-shift` for the animated gradient.

* Update `src/pages/LandingPage.jsx`: render the button inside the hero’s `.landing-actions` with a link to `/member` and required console logs.

## Implementation Details

* Structure: outer wrapper `relative group inline-flex items-center justify-center rounded-full p-[2px]` with a pseudo element/background for the animated conic gradient; inner `span` for the actual clickable pill (`px-6 py-3 rounded-full font-medium text-white`).

* Animation: `@keyframes rainbow-shift` and a class that applies `animation: rainbow-shift 6s linear infinite`. Add a slight blur glow on hover.

* Accessibility: `aria-label` on the button; visible focus ring.

* Text: label the button “সদস্য পোর্টাল” and link to `/member` (safest default). If you want a different route/text, I can swap quickly.

## Verification

* Visual check in the landing hero: button renders at the top and animates smoothly.

* Verify responsive behavior across mobile widths; ensure the pill doesn’t overflow.

* Confirm router link works and ProtectedRoute handles auth correctly.

## Notes

* I’ll avoid using `cn` to prevent import issues; use `className` directly.

* No Markdown files will be created; styles are organized by function per your rules.

* Dev run command remains `npm run dev -- --host` when you want me to verify live.

