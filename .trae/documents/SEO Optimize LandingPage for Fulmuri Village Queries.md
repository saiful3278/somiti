## লক্ষ্য
ফুলমুড়ী গ্রাম সম্পর্কিত কিওয়ার্ডে ("ফুলমুড়ী গ্রাম", "ফুলমুড়ী", "Fulmuri", "gram") আপনার ল্যান্ডিং পেজকে Google-এ শীর্ষ অবস্থানে আনার জন্য অন-পেজ SEO, স্ট্রাকচার্ড ডেটা, ইনডেক্সিং এবং পারফরম্যান্স উন্নতি।

## অন-পেজ আপডেট (LandingPage.jsx)
1. শিরোনাম/বর্ণনা শক্তিশালীকরণ:
- `src/pages/LandingPage.jsx:131–135` এ `seoTitle`, `seoDescription`, `seoKeywords` আপডেট করে বাংলা+ইংরেজি ভেরিয়েশন যুক্ত করা: "ফুলমুড়ী", "ফুলমুড়ি", "Fulmuri", "Fulmuree", "Fulmuri Gram", "Village"।
- টাইটেলে কিওয়ার্ড সামনে রেখে: "ফুলমুড়ী গ্রাম (Fulmuri) — অফিসিয়াল প্রোফাইল"।
2. কন্টেন্টে কিওয়ার্ড সিগন্যাল:
- প্রথম প্যারাগ্রাফে "ফুলমুড়ী গ্রাম", "Fulmuri village" উল্লেখ (প্রাকৃতিক ভাষায় বিদ্যমান টেক্সট অক্ষুন্ন রেখে সামান্য সংযোজন)।
- ১টি ছোট ইংরেজি ট্যাগলাইন যোগ: "Fulmuri village — official profile" (হিরো অংশে সাবটাইটেল বা ইন্ট্রোতে)।
3. OG/Twitter উন্নতি:
- `openGraph` অবজেক্টে `image:alt`, `og:locale:alternate` (`en_US`) যোগ।
- Twitter কার্ডে `site` হ্যান্ডেল সেট (উপলব্ধ হলে) এবং একই ইমেজ ব্যবহার।

## স্ট্রাকচার্ড ডেটা (JSON-LD)
1. Place স্কিমা সমৃদ্ধকরণ:
- `src/pages/LandingPage.jsx:136–180` এর `seoJsonLd` এ `geo` যুক্ত: `GeoCoordinates` (latitude: 23.23433, longitude: 91.27152) — Munshirhat/Chauddagram অঞ্চলের নির্দেশক (সূত্র: Mindat; Chauddagram Wikipedia)।
- `areaServed`, `addressRegion`/`addressLocality` রাখা, `sameAs` এ সরকারি/উইকি/মানচিত্র লিংক যোগ (উপলব্ধ হলে)।
2. FAQPage স্কিমা:
- `#faq` সেকশনের প্রশ্নোত্তর থেকে একটি আলাদা `FAQPage` JSON-LD ব্লক যুক্ত করা যাতে Google FAQ রিচ রেজাল্ট পায়।
3. BreadcrumbList বজায় রাখা; WebSite স্কিমায় SearchAction রয়েছে — ঠিক আছে।

## ইনডেক্সিং ও সিগন্যাল
- `index.html` এ ইতিমধ্যেই `lang="bn"`, `canonical`, `alternate hreflang bn-BD`, `sitemap.xml`, `robots.txt` আছে — বজায় থাকবে।
- HashRouter ব্যবহার থাকলেও হোমপেজ `https://fulmurigram.site/` স্ট্যাটিক — ইনডেক্সিং-ফ্রেন্ডলি।
- গুগল সার্চ কনসোল ৭টি অ্যাকশন প্রস্তাব: ডোমেইন ভেরিফিকেশন, প্রপার্টি যোগ, সাইটম্যাপ সাবমিট, Mobile Usability চেক, Core Web Vitals রিপোর্ট, URL Inspect, Manual Actions রিভিউ।

## পারফরম্যান্স টিউন (LCP/CLS)
- Lottie লোড ইন-ভিউতে ট্রিগার — ভালো; `renderer="canvas"`, `progressiveLoad: true` ইতিমধ্যেই আছে।
- hero অংশে বড় ইমেজ না থাকায় LCP কম — বজায় রাখতে `preload` ফন্ট আছে; OG ইমেজ ওয়েব-অপ্টিমাইজড (public/logo_pdf.png)।

## কোড পরিবর্তনের সংক্ষিপ্ত তালিকা
- `src/pages/LandingPage.jsx`
  - `seoTitle`, `seoDescription`, `seoKeywords` আপডেট (লাইন: 131–135)।
  - `seoJsonLd` এ `Place.geo`, `sameAs` প্রসারিত; নতুন `FAQPage` ব্লক যোগ (লাইন: 136–180 পর)।
  - `openGraph`/`twitterCard` এ `image:alt`, `locale:alternate`, `site` (লাইন: 182–198)।
  - হিরো সাবটাইটেলে ক্ষুদ্র ইংরেজি ট্যাগলাইন (লাইন: 217–220 এর কাছাকাছি)।
- `src/components/Meta.jsx`
  - `og:image:alt` সাপোর্টের জন্য একটি ঐচ্ছিক `ogImageAlt` prop যোগ।

## ভেরিফিকেশন প্ল্যান
- লোকাল প্রিভিউতে head ট্যাগ যাচাই ও JSON-LD ভ্যালিডেট।
- Google Rich Results Test/Schema Markup Validator দিয়ে FAQ/Place স্কিমা টেস্ট।
- Lighthouse রিপোর্টে SEO/Performance স্কোর চেক।

## সূত্র
- Munshirhat (Chauddagram) কোঅর্ডিনেট: Mindat — https://www.mindat.org/feature-11286459.html
- Chauddagram Upazila সম্বন্ধে: Wikipedia — https://en.wikipedia.org/wiki/Chauddagram_Upazila

উপরের পরিকল্পনা নিশ্চিত করলে আমি কোড আপডেট, যাচাই এবং মেটাডাটা/স্কিমা ডেপ্লয় প্রস্তুত করব।