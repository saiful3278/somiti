## Goal
Ensure clicking an image in the 3D sphere opens only one member card: a simple overlay showing photo and name, with the footer hidden. Avoid the current double-overlay behavior.

## Approach
1. Prevent ImgSphere’s own modal from opening when used inside MemberList.
2. Show MemberList’s overlay in a simplified variant (header only: avatar + name). Hide its footer section.
3. Keep full overlay for list-card clicks. Use simplified overlay for sphere clicks only.

## Implementation Steps
### 1) Update ImgSphere
- Add optional prop: `disableSpotlight?: boolean` (default: false).
- In `onClick` handler for an image, call `onImageClick(image)` as before.
- If `disableSpotlight` is true, do not set `selectedImage` and do not render the spotlight modal (`renderSpotlightModal`).
- Add console logs for click and modal suppression.

### 2) Wire MemberList to use simplified overlay
- In `src/components/MemberList.jsx`, add state: `detailSimple` (boolean, default false).
- In `onImageClick` passed to `ImgSphere`, set `detailSimple = true`, map `image.id` to `member` and call `handleMemberClick(member)`. Log mapping results.
- In `handleMemberClick` invoked from list-card clicks, ensure `detailSimple = false` so normal overlay renders for list interactions.
- In overlay render (`showDetailCard && selectedMember`):
  - If `detailSimple` is true, render only the header block (avatar + name + role badge) and omit all other sections and the footer (`member-detail-footer`).
  - If `detailSimple` is false, render the full overlay (existing behavior).
- In `closeDetailCard`, reset `detailSimple = false`.

### 3) Apply ImgSphere with spotlight disabled
- In `MemberList.jsx` where `ImgSphere` is used, pass `disableSpotlight={true}` and keep `onImageClick={...}`. This guarantees only one overlay opens.

## File References
- ImgSphere internal modal: `src/components/img-sphere.jsx:462-503`.
- MemberList overlay header/content/footer: `src/components/MemberList.jsx:929-1176`.
- MemberList footer to be hidden in simplified mode: `src/components/MemberList.jsx:1127-1175`.

## Diagnostics & UX
- Add console logs for: sphere image click, member mapping, simplified-mode toggles, and overlay open/close.
- No backend changes; purely UI behavior.

## Verification
- Click sphere image → only one overlay opens, showing photo and name; no footer.
- Click member list card → full overlay with details and footer (for admin/cashier) appears.
- Closing overlay resets simplified mode; subsequent list-card clicks work normally.

## Notes
- No new files created; changes limited to existing components.
- Styling remains consistent; no CSS changes required beyond existing overlay layout.
- Code will follow project conventions and avoid inline comments.