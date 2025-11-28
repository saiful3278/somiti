## Goals

* Add a dynamic gradient glow behind the cashier avatar that animates s
* Glow appears only when a photo is present.

* Glow colors match the dominant/average colors of the uploaded photo.

## Approach

* Compute average color from the avatar image with a lightweight canvas method (no new library).

* Set CSS variables (`--glow-start`, `--glow-end`) on the avatar wrapper based on the detected color.

* Toggle a glow class only when `photoURL` exists; remove when absent.

* Animate the glow via CSS keyframes with a subtle pulsing effect.

* Keep all existing console logs and add logs for color extraction.

## Implementation (JSX)

* In `src/components/CashierDashboard.jsx`:

  1. Add a `const avatarRef = React.useRef(null);`.
  2. Watch `photoURL` in a `useEffect`:

     * If present, load image to a hidden canvas (e.g., 32×32), compute average RGB.

     * Derive two gradient stops: a slightly brighter tone for `--glow-start` and a dimmer tone for `--glow-end`.

     * `avatarRef.current?.style.setProperty('--glow-start', 'rgba(r,g,b,0.6)')` and `--glow-end` with lower alpha.

     * Add class `avatar-glow-on` to the avatar wrapper; log computed colors.

     * If not present, remove `avatar-glow-on` and clear variables; log disabled state.
  3. Attach `ref={avatarRef}` to the avatar wrapper `<div className="cashier-header-avatar ..." ref={avatarRef}>`.
  4. Keep existing interactions and logs.

### Sample JS code

```jsx
const avatarRef = React.useRef(null);

useEffect(() => {
  if (!photoURL || !avatarRef.current) {
    console.log('[CashierDashboard] avatar glow disabled');
    avatarRef.current?.classList.remove('avatar-glow-on');
    avatarRef.current?.style.removeProperty('--glow-start');
    avatarRef.current?.style.removeProperty('--glow-end');
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = photoURL;
  img.onload = () => {
    try {
      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
      }
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
      const brighten = (v) => Math.min(255, Math.round(v * 1.15));
      const dim = (v) => Math.max(0, Math.round(v * 0.85));
      const start = `rgba(${brighten(r)}, ${brighten(g)}, ${brighten(b)}, 0.65)`;
      const end = `rgba(${dim(r)}, ${dim(g)}, ${dim(b)}, 0.18)`;
      console.log('[CashierDashboard] avatar glow colors', { r, g, b, start, end });
      avatarRef.current.style.setProperty('--glow-start', start);
      avatarRef.current.style.setProperty('--glow-end', end);
      avatarRef.current.classList.add('avatar-glow-on');
    } catch (e) {
      console.log('[CashierDashboard] avatar glow error', e);
    }
  };
  img.onerror = (e) => console.log('[CashierDashboard] avatar img load error', e);
}, [photoURL]);
```

## Implementation (CSS)

* In `src/styles/components/CashierProfileCard.css` add minimal glow styles:

```css
.cashier-header-avatar { position: relative; }
.cashier-header-photo { position: relative; z-index: 1; }
.cashier-header-avatar.avatar-glow-on::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, var(--glow-start, rgba(59,130,246,0.35)) 0%, var(--glow-end, rgba(14,165,233,0.12)) 70%, transparent 100%);
  filter: blur(14px);
  z-index: 0;
  animation: glowPulse 6s ease-in-out infinite;
}
@keyframes glowPulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
}
```

* Keeps stylesheet lightweight and focused; no heavy gradients across the whole card.

## Behavior

* No glow when no photo.

* When a photo is set/updated, glow appears and animates, using colors derived from the photo.

* All existing logs remain; new logs added for glow init/disable and color values.

## Validation

* Run `npm run dev -- --host`.

* Upload/set a photo; confirm glow appears and pulses.

* Remove photo or set null; glow disappears.

* Inspect element: CSS variables `--glow-start/end` present with values from the image.

## Notes

* No third-party libraries added.

* Minimal code footprint; no new files.

* Accessible and performant (small canvas, lightweight CSS).

