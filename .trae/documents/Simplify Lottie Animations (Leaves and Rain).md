## Goal
Remove the current complex Lottie logic for both leaves and rain and keep them simple: continuous loop and slightly slow playback.

## Changes
1. Simplify LeafLottie component
- Keep only minimal props: `src`, `speed` (default 0.4), `loop=true`, `autoplay=true`
- Internally set: `setDirection(1)` once and `setSpeed(speed)` in a single `useEffect`
- Remove segment support, `onDOMLoaded`, `onComplete` handlers and any re-assert logic
- Keep concise console logs to meet project rules

2. Update usages on LandingPage
- Autumn (leaves): `<LeafLottie className="fx fx-leaves-lottie" src="/ফুলমুড়ী_গ্রাম_ল্যান্ডিং_পাতার_অ্যানিমেশন.json" speed={0.35} />`
- Monsoon (rain): `<LeafLottie className="fx fx-rain-lottie" src="/ফুলমুড়ী_গ্রাম_ল্যান্ডিং_মেঘের_অ্যানিমেশন.json" speed={0.4} />`
- Remove any `segment` props and extra configuration

3. Clean up old non-Lottie logic
- Remove `.fx-rain::before/::after` CSS rules so only Lottie renders rain
- Confirm old leaf CSS is already removed (it is)

## Verification
- Load `http://localhost:5174/` and scroll to ঋতুচক্র
- Confirm both animations run continuously, at visibly slower speed, without up/down segment tricks
- Console logs show component load and configuration once; no repeated reconfiguration

## Notes
- If you want slower/faster later, just adjust `speed` values on the two `<LeafLottie>` usages.
- This keeps behavior consistent across refreshes without extra lifecycle hooks.