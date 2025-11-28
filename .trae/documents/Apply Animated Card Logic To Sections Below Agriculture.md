## Scope
- Apply same light animation + icon + hover logs to all card-like sections below “কৃষি ও মৌসুমি ফসল”.
- Target sections: Institutions (`inst-list`), Transport (`why-list`), People (`notable-grid`), Profile Facts (`InfoGrid` items), Why section (`why-list`), Stats (`stat-card`), FAQ (`faq-item`), Notices (`why-list`), Culture/Nature (`why-list`), Market (`step-list`), Festival (`festival-grid`).

## Design Pattern
- Use a reusable card style: `ui-card`, `ui-card-icon`, `ui-card-fx` with category classes (e.g., `card-institutions`, `card-transport`).
- Light, non-intrusive background FX using existing keyframes: `heatPulse`, `stripeDrift`, `petalRise`, `snowFlake`, `rainDrop` from `LandingPage.css`.
- Add lucide icons per card title; keep imports consistent with current file.
- Add `onMouseEnter/onMouseLeave` per card with console logs: `console.log('[LandingPage] hover card', { section: 'institutions', item: '...' })`.
- Respect `prefers-reduced-motion` via existing media query.

## CSS Updates (in `src/styles/LandingPage.css`)
- Add base card utilities:
  - `.ui-card { position: relative; overflow: hidden; transition: transform/box-shadow/background; }`
  - `.ui-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }`
  - `.ui-card-icon { inline-flex circle badge; matches `crop-icon` style }`
  - `.ui-card-fx { position: absolute; inset: 0; pointer-events: none; }`
- Category themes (reuse existing gradients/keyframes):
  - `.card-institutions` → soft primary/secondary gradient; `.ui-card-fx` uses `stripeDrift`.
  - `.card-transport` → monsoon-like gradient; `.ui-card-fx::before` uses `rainDrop`.
  - `.card-people` → warm/pulse (`heatPulse`).
  - `.card-profile` (InfoGrid items) → subtle reveal only.
  - `.card-why` → secondary shimmer.
  - `.card-stats` → minimal pulse of header stripe.
  - `.card-faq` → none (accordion motion already present), only hover lift.
  - `.card-notices` → `megaphone` themed pulse.
  - `.card-culture`/`.card-nature` → `petalRise`/`snowFlake` respectively.
  - `.card-market` → add tiny `stripeDrift` behind `step-badge`.
  - `.card-festival` → light `petalRise` (festive confetti-like using petals).
- Keep all FX opacity low (0.15–0.35) to prevent distraction.

## JSX Updates (in `src/pages/LandingPage.jsx`)
- Institutions (`inst-list li`):
  - Wrap title with `<span className="ui-card-icon"><BookOpen size={18} /></span>` (schools), others with `<Landmark/>` or `<ShieldCheck/>` as appropriate.
  - Add `className="inst-item ui-card card-institutions"` and `<span className="ui-card-fx" aria-hidden />`.
  - Add `onMouseEnter/onMouseLeave` logs with item name.
- Transport (`why-list li` in transport panel):
  - Prepend `<span className="ui-card-icon"><MapPin size={18} /></span>`.
  - Add `ui-card card-transport` and `ui-card-fx`.
- People (`notable-item`):
  - Prepend `<span className="ui-card-icon"><Users size={18} /></span>`.
  - Add `ui-card card-people` and `ui-card-fx` + hover logs.
- Profile Facts (`InfoGrid`):
  - Inside `InfoGrid`, apply `ui-card card-profile` classes to each `.info-item` via prop or wrapper; prepend small `<MapPin/>`/`<Landmark/>` icons to labels.
- Why section (`why-list` below “কেন এই ভিলেজ পোর্টাল”):
  - Prepend `<ShieldCheck/>`/`<Megaphone/>` icons; add `ui-card card-why` + `ui-card-fx`.
- Stats (`stat-card`):
  - Add `ui-card card-stats`, prepend icons: population `<Users/>`, education `<BookOpen/>`.
- FAQ (`faq-item`):
  - Add `ui-card card-faq` for hover consistency; no animated FX.
- Notices (`why-list` links):
  - Wrap each in `ui-card card-notices` with `<Megaphone/>` icon; keep anchor inside.
- Culture/Nature lists:
  - Culture → `ui-card card-culture` + blossom FX; Nature → `ui-card card-nature` + snow FX as applicable to items.
- Market (`step-list li`):
  - Add `ui-card card-market`, insert `ui-card-fx` behind, keep `step-badge` intact.
- Festival items:
  - Add `ui-card card-festival` + `ui-card-fx` with light `petalRise`.

## Icons Mapping (using current imports)
- Institutions: `BookOpen`, `Landmark`, `ShieldCheck`
- Transport: `MapPin`
- People: `Users`
- Profile facts: `MapPin` / `Landmark`
- Why list: `ShieldCheck`, `Megaphone`
- Stats: `Users`, `BookOpen`
- Notices/FAQ: `Megaphone`
- Culture/Nature: `Sprout` (culture craft), `Sun`/`CloudRain` where thematic
- Market/Festival: `Sprout` (seasonal), or keep minimal

## Logging & Accessibility
- Add consistent logs on hover and click: `hover card`, `leave card`, `click card` with `{ section, item }`.
- Keep `aria-hidden` on FX spans; icons are decorative, so mark appropriately unless they convey meaning.

## Verification
- Open preview and hover each section to confirm:
  - Icons render, FX visible but subtle, logs print per card.
- Check `prefers-reduced-motion` disables animations.
- Ensure no import errors; reuse existing `lucide-react` icons only.

## Deliverables
- Updated `LandingPage.css` with `ui-card` utilities and category themes.
- Updated `LandingPage.jsx` markup across targeted sections with icons, FX spans, and logs.
- No new files or libraries added.