## Goal
Remove all custom animation logic and overlays for leaves and rain; render only the provided Lottie JSONs with default looping. No speed/segment/lifecycle code.

## Changes
1. Simplify LeafLottie component
- Remove useEffect speed/direction configuration
- Remove lifecycle handlers (onDOMLoaded/onComplete)
- Keep only: JSON fetch, render `<Lottie animationData={data} loop autoplay />`
- Minimal console log (file load + JSON loaded) retained per project rule

2. Update LandingPage usages
- Autumn (leaves): `<LeafLottie className="fx fx-leaves-lottie" src="/ফুলমুড়ী_গ্রাম_ল্যান্ডিং_পাতার_অ্যানিমেশন.json" />`
- Monsoon (rain): `<LeafLottie className="fx fx-rain-lottie" src="/ফুলমুড়ী_গ্রাম_ল্যান্ডিং_মেঘের_অ্যানিমেশন.json" />`
- Remove `speed`, `segment`, and any extra props

3. Remove residual non-Lottie overlays
- Confirm and keep removed: `.fx-rain::before/::after`, old leaf `.fx-leaves .leaf` and `@keyframes leafFallReal`
- Leave other season CSS intact (sun/stripes/snow/blossom) unless you want those switched to Lottie later

## Verification
- Open `http://localhost:5174/` and scroll to ঋতুচক্র
- Leaves and rain should:
  - Render only via Lottie JSON
  - Loop continuously with default Lottie behavior
  - Have no custom speed/segment reconfiguration

## Notes
- If later you want slower/faster, we can reintroduce a simple `speed` prop, but for now we will keep only the raw Lottie playback.
- This ensures predictable behavior across refreshes by eliminating runtime overrides.