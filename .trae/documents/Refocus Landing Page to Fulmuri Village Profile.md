## Goals
- Remove all somiti/association-focused content from the landing page
- Replace with Bangladeshi rural village content centered on Fulmuri
- Use authoritative village facts (Union: Munshirhat, Upazila: Chauddagram, District: Cumilla, Division: Chattogram)
- Keep current UI aesthetic; add minimal components to enrich content
- Strengthen SEO for village discovery; link to amargram profile

## Content Replacement (BN-first)
- Hero
  - BN: "🤲 আস-সালামু আলাইকুম — ফুলমুড়ী গ্রামের অফিসিয়াল অনলাইন পোর্টালে আপনাকে স্বাগতম"
  - BN: "গ্রামঃ ফুলমুড়ী | ইউনিয়নঃ মুন্সীরহাট | উপজেলাঃ চৌদ্দগ্রাম | জেলাঃ কুমিল্লা | বিভাগঃ চট্টগ্রাম"
  - EN (short support): "Fulmuri Village — official online profile (Munshirhat Union, Chauddagram, Cumilla, Chattogram)"
- Remove/replace all occurrences of: সমিতি, সদস্যপদ, মুনাফা, শেয়ার, ফাউন্ডেশন, Member/Profit/Share wording
- About → Village Profile
  - BN: "ফুলমুড়ী গ্রামের পরিচিতি — ভূ-প্রকৃতি, মানুষ, কৃষি, শিক্ষা ও সংস্কৃতি"
  - EN support line: "Village profile: geography, people, agriculture, education, culture"
- Why → Why This Village Portal
  - BN bullets: "ডিজিটাল প্রোফাইল", "লোকেশন ও মানচিত্র", "ইতিহাস ও ঐতিহ্য", "কৃষি ও জীবিকা", "শিক্ষা ও সামাজিক প্রতিষ্ঠান"
- Features → Explore Fulmuri
  - Cards: "Village Facts", "History & Heritage", "Agriculture & Livelihood", "Education & Institutions", "Health & Services", "Events & Notices"
- Values → Identity
  - BN: "স্বচ্ছতা", "সংস্কৃতি", "কমিউনিটি"
- Steps → How to Explore
  - BN: "প্রোফাইল দেখুন → লোকেশন → ইতিহাস ও ইভেন্টস"
- Stats → Village Snapshots
  - BN: e.g., "৫০০+ পরিবার", "৩+ শিক্ষা প্রতিষ্ঠান" (placeholders, adjustable)
- CTA → Explore Digital Profile
  - BN: "আমাদের গ্রামের তথ্য দেখুন — Explore"

## New Sections
- Administrative Facts (Info Grid)
  - Union, Upazila, District, Division, Geo pointers
- Geography & Map (Map Embed placeholder)
  - BN copy; no external keys; link to map service
- Agriculture & Livelihood
  - Crops, occupations (BN text)
- History & Heritage
  - Local heritage notes (BN text)
- Education & Institutions
  - Schools/madrasa placeholders (BN text)
- Events & Notices
  - Village event timeline and notice teasers (non-somiti wording)
- External Link Block
  - "আমার গ্রাম" profile link: https://amargram.org/fulmuree

## SEO Updates
- Meta
  - Title: "ফুলমুড়ী গ্রাম — আমার শেকড়, আমার গর্ব | স্মার্ট গ্রাম"
  - Description (BN-first; includes union/upazila/district/division)
  - Canonical: `https://fulmurigram.site/`
  - Keywords: "ফুলমুড়ী গ্রাম, Munshirhat Union, Chauddagram, Cumilla, Chattogram, Bangladeshi rural village, ইতিহাস, কৃষি, শিক্ষা"
- JSON-LD
  - Place with `addressLocality: Fulmuri`, `addressRegion: Cumilla`, `addressCountry: BD`
  - Administrative containment: Upazila, District, Division via `containedInPlace`
  - WebSite + SearchAction
  - BreadcrumbList: Home → Explore → Profile → Map
  - sameAs: `https://amargram.org/fulmuree`
- Open Graph/Twitter
  - siteName: "আমার গ্রাম | ফুলমুড়ী"
  - large image fields (placeholder path)

## UI Components (minimal, matching existing style)
- InfoGrid.jsx (administrative facts with console logs)
- MapBlock.jsx (simple embed/placeholder with logs)
- Replace Feature card labels to village topics
- Keep FAQ/Testimonials if desired, but rewrite questions/quotes to village discovery (not somiti)
- Animated Stats via existing StatsCounter

## Implementation Steps
1. Edit `src/pages/LandingPage.jsx`
   - Remove all somiti/foundation/member/profit/share references
   - Update hero, About→Village Profile, Why→Portal reasons, Features→Explore Fulmuri, Steps→Explore flow, Stats, CTA, External Link block
   - Update SEO constants and JSON-LD with Place and `sameAs`
   - Keep existing styles and console logs, add new ones for interactions
2. Add small components under `src/components/ui/` (InfoGrid, MapBlock) if needed
3. Update `src/styles/LandingPage.css` minimally for new blocks
4. Validate: dev preview, console logs, inspect meta tags/JSON-LD

## Assumptions
- Stats and institution counts are placeholders until exact figures are provided
- We will not add external map keys; provide a link/open action instead

## On Approval
- I will implement the above edits and components, adhering to project conventions and keeping the current UI look.