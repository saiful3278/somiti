## Goals
- Switch all public-facing copy to Fulmuri village identity (Bangla-first, English-supported)
- Strengthen SEO (titles, descriptions, keywords, JSON-LD, OG/Twitter) for Fulmuri queries
- Keep the current UI look-and-feel, add lightweight components to enrich content
- Maintain project conventions (organized files, console logs, no MD files)

## Content Updates (Bangla + English)
- Hero
  - BN: "ফুলমুড়ী গ্রাম— আমাদের কমিউনিটি প্ল্যাটফর্ম। সদস্যপদ, লেনদেন, শেয়ার, নোটিশ ও আর্থিক স্বচ্ছতা— সব এক জায়গায়।"
  - EN: "Fulmuri Village community platform — membership, transactions, shares, notices, and transparency in one place."
  - Sub-badges: "স্বচ্ছতা", "দায়িত্বশীলতা", "কমিউনিটি" (unchanged)
- About
  - BN: "ফুলমুড়ী যুব ফাউন্ডেশন ফুলমুড়ী গ্রামের সদস্যদের জন্য তৈরি একটি স্বচ্ছ ও নিরাপদ কমিউনিটি প্ল্যাটফর্ম। সদস্যপদ ব্যবস্থাপনা, ট্রেজারি, নোটিশ এবং ডকুমেন্টেশন একত্রে।"
  - EN: "Fulmuri Youth Foundation is a transparent, secure platform for Fulmuri villagers — membership management, treasury, notices, and documentation together."
- Why This Website
  - BN bullets tailored: "ফুলমুড়ী-কেন্দ্রিক তথ্য", "নিরাপদ রোল-ভিত্তিক অ্যাক্সেস", "রিয়েল-টাইম ট্রেজারি ও ট্রানজ্যাকশন", "নোটিশ/ইভেন্ট আপডেট", "ডকুমেন্টেশন ও স্বচ্ছতা"
- Features (cards: keep icons/UI)
  - Member Directory: BN "সদস্যদের তথ্য ও যোগাযোগ"
  - Role-Based Dashboard: BN "Admin, Cashier, Member" অনুযায়ী
  - Transactions & Treasury: BN "ক্যাশ-ফ্লো ও রিপোর্ট"
  - Share Tracking: BN "শেয়ার ক্রয়-বিক্রয়"
  - Profit Distribution: BN "মুনাফা বণ্টন"
  - Notice Board: BN "কমিউনিটি আপডেট"
- Values
  - BN: "স্বচ্ছতা", "সমন্বয়", "দায়িত্ব"
- Steps
  - BN: "লগইন → ড্যাশবোর্ড → অ্যাকশন"
- Stats (placeholder, can be refined later)
  - BN: "৪০+ সদস্য", "৫০+ ঘোষণা"
- CTA
  - BN: "কমিউনিটির সাথে যুক্ত হন — লগইন করুন"

## SEO Enhancements
- Meta
  - Title (BN-first): "ফুলমুড়ী গ্রাম – কমিউনিটি প্ল্যাটফর্ম | ফুলমুড়ী যুব ফাউন্ডেশন"
  - Description: BN + short EN supporting Fulmuri keywords
  - Canonical: `https://fulmurigram.site/`
  - Keywords: BN+EN examples — "ফুলমুড়ী গ্রাম, Fulmuri village, সমিতি, সদস্যপদ, ট্রেজারি, লেনদেন, শেয়ার, মুনাফা, নোটিশ"
- JSON-LD
  - Organization: `name`, `alternateName`, `url`, `areaServed: "Fulmuri"`, `inLanguage: "bn-BD"`, `contactPoint` (placeholder)
  - Place: `name: "Fulmuri"` with `addressLocality` (if available)
  - WebSite + SearchAction (keep)
  - BreadcrumbList: Home → Features → About
- Open Graph
  - `type: website`, `locale: bn_BD`, `siteName: "ফুলমুড়ী যুব ফাউন্ডেশন | Fulmuri"`, `title/description` from meta
  - Add image fields (placeholder path) for share previews
- Twitter Card
  - `card: summary_large_image`, `title/description` from meta

## UI Additions (keep current styling)
- FAQ Accordion
  - Common Fulmuri questions (membership, shares, profit, notices)
- Notice Highlights
  - Small teaser list linking to full Notice page
- Events Timeline
  - Chronological updates for village/community events
- Testimonials Carousel
  - Short quotes from members (static placeholders)
- Map & Contact Block
  - Simple contact info; map embed placeholder (no external keys)
- Quick Links Grid
  - Shortcuts to login, member directory, treasury, notices
- Animated Stats Counter
  - Smooth count-up for members/announcements values
- Footer Enhancements
  - Village identity line, links, language toggle if applicable

## Implementation Plan
- Update `src/pages/LandingPage.jsx`
  - Replace copy with BN-first + EN support
  - Strengthen SEO constants and inject via `Meta`
  - Add new sections/components anchors; add onClick console logs for interactions
- Update `src/styles/LandingPage.css`
  - Minimal styles for accordion, carousel, timeline, stats counters
- Create small UI components in `src/components/ui/`
  - `FaqAccordion.jsx`, `Testimonials.jsx`, `StatsCounter.jsx`, `SectionHeader.jsx`
  - Follow existing patterns, no external libs; add console logs in each
- Meta component adjustments (if needed)
  - Accept `images`, `twitterCard.card`, `breadcrumbs` props; preserve existing behavior

## Validation
- Run dev server (already running with `--host`) and verify
- Check meta tags in HTML head and validate JSON-LD in browser console
- Click-test all new anchors; confirm console logs appear
- Visual pass: ensure current UI remains intact with added components

## Assumptions
- No dynamic backend data yet; we will use static placeholders for stats/testimonials/notices
- Social links and precise address can be added later if provided

## Next Step
- On approval, I will implement the content/SEO updates and add the listed UI components, adhering to project conventions and adding necessary console logs throughout.