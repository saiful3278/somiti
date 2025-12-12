## Objectives
- Create a cleaner, modern hero with clearer hierarchy and fewer distractions
- Keep content scope the same; reorganize and refine wording for clarity and SEO
- Improve accessibility, semantic structure, and interaction logging

## Current Context
- Hero lives in `src/pages/LandingPage.jsx` at `LandingPage.jsx:214–231`
- SEO meta handled via `Meta` component at `LandingPage.jsx:204–212` plus JSON-LD/openGraph/twitter
- Visual classes come from `../styles/LandingPage.css`

## UI Changes
- Replace `.hero-card` block with a semantic `header.hero` container
- Left column: title (`h1`), short Bangla tagline (`h2` visually smaller), single descriptive intro sentence
- Highlights: keep the existing three pills, render as a short `ul` for semantics
- CTA group: 1 primary `Link /login`, 2 secondary anchors to `#features` and `#profile`; streamline labels; keep click logs
- Remove the `brand-badge FG` and reduce extra text duplication to minimize visual noise
- Add small helper text under CTAs (visually subtle) only if necessary; default is no extra content

## Copy Refinement (Bangla-first)
- Title `h1`: "ফুলমুড়ী গ্রাম"
- Tagline `h2`: "আমার শেকড়, আমার গর্ব"
- Intro: One concise line combining location details (kept from current lines 219–220, condensed)
- CTA labels: "লগইন", "এক্সপ্লোর", "গ্রাম সম্পর্কে" (unchanged but reordered for focus)

## Accessibility & Semantics
- Use `header` element for hero, `nav`-like role for CTA group
- Add `aria-label` to CTA container and descriptive `aria-label`s on anchors
- Render highlights as an unordered list with `role="list"`
- Keep `h1` unique; use `h2` only as visual subheading (CSS adjusts size)

## SEO Enhancements
- Shorten `title` while preserving keywords: keep existing `seoTitle` but streamline hero text so primary keywords appear early on page
- Ensure `openGraph.image` uses an absolute URL (update from `/logo_pdf.png` to `seoCanonical + 'logo_pdf.png'`)
- Add `og:image:alt` via `Meta` if supported; otherwise add `meta name="image:alt"` through `Meta`
- Tighten `seoDescription` wording (no content expansion, just clarity); ensure Bangla keywords appear naturally in hero copy
- Keep JSON-LD as-is; adjust `BreadcrumbList` only if anchors change (anchors remain `#features`, `#profile`)

## Performance & Behavior
- No additional network calls; reuse existing assets
- Maintain bubble background and existing animations; hero itself stays static for performance
- Maintain existing logging style; add logs for focus/blur to CTAs

## Implementation Outline
1. Update hero markup (structure, classes, semantics) at `LandingPage.jsx:214–231`
2. Refine text strings (title remains; rewrite subtitle and intro lines)
3. Convert highlights to an `ul` with the same pill visuals
4. Add `aria-label`s and keep/expand console logs for interactions
5. Adjust `openGraph.image` to absolute URL in `LandingPage.jsx:182–190`
6. Keep styles in `LandingPage.css`; add minimal new class names following project conventions

## Verification
- Run dev server and visually confirm alignment, spacing, and responsiveness
- Inspect page with Lighthouse/DevTools: check h1/h2 structure, canonical, OG tags
- Confirm console logs on hover/focus/click across CTAs and pills

## Notes
- No extra content will be added; only rearranged and refined
- All logs maintained and expanded per project rule
- CSS changes stay within existing stylesheet; no new files