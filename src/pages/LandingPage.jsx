import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Megaphone, MapPin, BookOpen, Sprout, Landmark, Sun, CloudRain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Meta from '../components/Meta';
import BubbleBackground from '../components/ui/BubbleBackground';
import ThemeSwitcher from '../components/ui/theme-switcher';
import Lottie from 'lottie-react';
const FaqAccordion = React.lazy(() => import('../components/ui/FaqAccordion'));
const Testimonials = React.lazy(() => import('../components/ui/Testimonials'));
const StatsCounter = React.lazy(() => import('../components/ui/StatsCounter'));
const InfoGrid = React.lazy(() => import('../components/ui/InfoGrid'));
const MapBlock = React.lazy(() => import('../components/ui/MapBlock'));
import '../styles/LandingPage.css';
import { RainbowButton } from '../components/ui/rainbow-button';
import ImgSphere from '@/components/img-sphere';
import '../styles/components/img-sphere.tailwind.css';
import { MemberService } from '../firebase/memberService';

console.log('[LandingPage] File loaded');

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const seasonsRef = useRef(null);
  const rainRef = useRef(null);
  const leavesRef = useRef(null);
  const landingSphereRef = useRef(null);
  const [rainData, setRainData] = useState(null);
  const [leavesData, setLeavesData] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [rainInView, setRainInView] = useState(false);
  const [leavesInView, setLeavesInView] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sphereImages, setSphereImages] = useState([]);
  const buildPlaceholderAvatar = (name, size = 128) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    const initials = (parts.slice(0, 2).map(p => p[0] || '').join('') || 'M').toUpperCase();
    const bg = '#e2e8f0';
    const text = '#1e293b';
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n  <defs>\n    <clipPath id="clip">\n      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" />\n    </clipPath>\n  </defs>\n  <rect width="${size}" height="${size}" fill="${bg}"/>\n  <g clip-path="url(#clip)">\n    <rect width="${size}" height="${size}" fill="${bg}"/>\n  </g>\n  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(size*0.4)}" font-weight="700" fill="${text}">${initials}</text>\n</svg>`;
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return dataUrl;
  };
  useEffect(() => {
    let mounted = true;
    console.log('[LandingPage] fetching members for sphere images');
    MemberService.getActiveMembers().then(result => {
      if (!mounted) return;
      if (result.success) {
        const sorted = [...(result.data || [])].sort((a, b) => {
          const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
          const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
          if (createdA.getTime() !== createdB.getTime()) return createdB - createdA;
          return (b.id || '').localeCompare(a.id || '');
        });
        const imgs = sorted.map(m => ({
          id: m.id,
          src: m.photoURL || m.avatar || buildPlaceholderAvatar(m.name),
          alt: m.name || m.membershipId || 'Member',
          title: m.name,
          description: m.membershipId ? `ID: ${m.membershipId}` : undefined,
        }));
        console.log('[LandingPage] sphere images prepared', { count: imgs.length });
        setSphereImages(imgs);
      } else {
        console.log('[LandingPage] members fetch failed, using minimal assets');
        setSphereImages([
          { id: 'footer_logo', src: '/footer_logo.svg', alt: 'Footer Logo', title: 'Footer' },
          { id: 'vite', src: '/vite.svg', alt: 'Vite', title: 'Vite' },
          { id: 'pdf_logo', src: '/logo_pdf.png', alt: 'PDF Logo', title: 'PDF' }
        ]);
      }
    }).catch(e => {
      console.log('[LandingPage] members fetch error', e);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!shouldAnimate) { console.log('[LandingPage] skip auto scroll due to reduced motion'); return; }
    const el = landingSphereRef.current;
    if (!el) { console.log('[LandingPage] sphere ref not ready'); return; }
    const current = parseInt(localStorage.getItem('lpSphereScrollCount') || '0', 10) || 0;
    if (current >= 3) { console.log('[LandingPage] auto scroll skipped (limit reached)', { current }); return; }
    const doScroll = () => {
      try {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const delta = centerY - viewportCenter;
        window.scrollBy({ top: delta, behavior: 'smooth' });
        const next = current + 1;
        localStorage.setItem('lpSphereScrollCount', String(next));
        console.log('[LandingPage] auto scrolled to sphere center', { delta, next });
      } catch (e) {
        console.log('[LandingPage] auto scroll failed, using scrollIntoView', e);
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const next = current + 1;
          localStorage.setItem('lpSphereScrollCount', String(next));
        } catch {}
      }
    };
    const delayMs = 2000;
    let timerId = null;
    const schedule = () => {
      console.log('[LandingPage] auto-scroll scheduled with delay', { delayMs });
      timerId = setTimeout(() => {
        requestAnimationFrame(doScroll);
      }, delayMs);
    };
    const onLoad = () => schedule();
    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
        console.log('[LandingPage] auto-scroll timer cleared');
      }
      window.removeEventListener('load', onLoad);
    };
  }, [shouldAnimate]);

  useEffect(() => {
    console.log('[LandingPage] mounted');
    console.log('[LandingPage] UI tweak applied: season card slightly enlarged');
    console.log('[LandingPage] UI tweak applied: season card enlarged a bit more');
    console.log('[LandingPage] viewport', { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio });
  }, []);

  useEffect(() => {
    try {
      const m = window.matchMedia('(prefers-reduced-motion: reduce)');
      const value = !(m && m.matches);
      setShouldAnimate(value);
      console.log('[LandingPage] motion preference', { shouldAnimate: value });
    } catch {}
  }, []);

  useEffect(() => {
    const rainSpeed = 0.35;
    const leafSpeed = 0.35;
    console.log('[LandingPage] Lottie speed update requested: make even slower');
    if (rainData && rainRef.current) {
      rainRef.current.setSpeed(rainSpeed);
      try { rainRef.current.setSubframe?.(true); console.log('[LandingPage] Lottie subframe enabled', { type: 'rain' }); } catch {}
      console.log('[LandingPage] Lottie speed set', { type: 'rain', speed: rainSpeed });
    } else if (rainData && !rainRef.current) {
      setTimeout(() => {
        if (rainRef.current) {
          rainRef.current.setSpeed(rainSpeed);
          try { rainRef.current.setSubframe?.(true); console.log('[LandingPage] Lottie subframe enabled (retry)', { type: 'rain' }); } catch {}
          console.log('[LandingPage] Lottie speed set (retry)', { type: 'rain', speed: rainSpeed });
        }
      }, 150);
    }
    if (leavesData && leavesRef.current) {
      leavesRef.current.setSpeed(leafSpeed);
      try { leavesRef.current.setSubframe?.(true); console.log('[LandingPage] Lottie subframe enabled', { type: 'leaves' }); } catch {}
      console.log('[LandingPage] Lottie speed set', { type: 'leaves', speed: leafSpeed });
    } else if (leavesData && !leavesRef.current) {
      setTimeout(() => {
        if (leavesRef.current) {
          leavesRef.current.setSpeed(leafSpeed);
          try { leavesRef.current.setSubframe?.(true); console.log('[LandingPage] Lottie subframe enabled (retry)', { type: 'leaves' }); } catch {}
          console.log('[LandingPage] Lottie speed set (retry)', { type: 'leaves', speed: leafSpeed });
        }
      }, 150);
    }
  }, [rainData, leavesData]);

  useEffect(() => {
    console.log('[LandingPage] footer section configured');
  }, []);

  useEffect(() => {
    let aborted = false;
    console.log('[LandingPage] Lottie fetch start');
    const rainUrl = `${import.meta.env.BASE_URL}ফুলমুড়ী_গ্রাম_ল্যান্ডিং_মেঘের_অ্যানিমেশন.json`;
    const leavesUrl = `${import.meta.env.BASE_URL}ফুলমুড়ী_গ্রাম_ল্যান্ডিং_পাতার_অ্যানিমেশন.json`;
    console.log('[LandingPage] asset urls', { rainUrl, leavesUrl });
    if (!shouldAnimate) { console.log('[LandingPage] skip Lottie fetch due to reduced motion'); return () => { aborted = true; }; }
    fetch(rainUrl)
      .then((r) => r.json())
      .then((json) => { if (!aborted) { setRainData(json); console.log('[LandingPage] rain JSON loaded', { layers: Array.isArray(json.layers) ? json.layers.length : undefined }); } })
      .catch((e) => console.log('[LandingPage] rain JSON load error', e));
    fetch(leavesUrl)
      .then((r) => r.json())
      .then((json) => { if (!aborted) { setLeavesData(json); console.log('[LandingPage] leaves JSON loaded', { layers: Array.isArray(json.layers) ? json.layers.length : undefined }); } })
      .catch((e) => console.log('[LandingPage] leaves JSON load error', e));
    return () => { aborted = true; console.log('[LandingPage] Lottie fetch aborted'); };
  }, [shouldAnimate]);

  useEffect(() => {
    const root = seasonsRef.current;
    if (!root) {
      console.log('[LandingPage] seasons section not found');
      return;
    }
    console.log('[LandingPage] init IntersectionObserver for seasons (one-time start)');
    const items = Array.from(root.querySelectorAll('.season-item'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.classList.contains('animated')) {
            el.classList.add('animated');
            console.log('[LandingPage] season animated-start', { text: el.textContent?.trim() });
          }
          const season = el.getAttribute('data-season');
          if (season === 'বর্ষা') { setRainInView(true); console.log('[LandingPage] rain in view'); }
          if (season === 'শরৎ') { setLeavesInView(true); console.log('[LandingPage] leaves in view'); }
          io.unobserve(el);
        }
      });
    }, { root: null, threshold: 0.6, rootMargin: '0px' });
    items.forEach((el) => io.observe(el));
    return () => {
      items.forEach((el) => io.unobserve(el));
      io.disconnect();
      console.log('[LandingPage] seasons observer disconnected');
    };
  }, []);

  const rolePath = user?.role ? `/${user.role}` : '/member';

  const seoTitle = useMemo(() => 'ফুলমুড়ী গ্রাম — আমার শেকড়, আমার গর্ব | স্মার্ট গ্রাম', []);
  const seoDescription = useMemo(() => 'ফুলমুড়ী গ্রামের অফিসিয়াল প্রোফাইল — গ্রামঃ ফুলমুড়ী, ইউনিয়নঃ মুন্সীরহাট, উপজেলাঃ চৌদ্দগ্রাম, জেলাঃ কুমিল্লা, বিভাগঃ চট্টগ্রাম। Village profile: geography, people, agriculture, education, culture.', []);
  const seoCanonical = useMemo(() => 'https://fulmurigram.site/', []);
  const seoKeywords = useMemo(() => 'ফুলমুড়ী গ্রাম, Fulmuri village, Munshirhat Union, Chauddagram Upazila, Cumilla District, Chattogram Division, Bangladeshi rural village, ইতিহাস, কৃষি, শিক্ষা, সংস্কৃতি, পল্লীগীতি, নকশিকাঁথা, পিঠা, হাট-বাজার, ধানক্ষেত, উৎসব', []);

  const seoJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        'name': 'ফুলমুড়ী',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Fulmuri',
          'addressRegion': 'Cumilla',
          'addressCountry': 'BD'
        },
        'containedInPlace': {
          '@type': 'AdministrativeArea',
          'name': 'Chauddagram (Upazila)',
          'containedInPlace': {
            '@type': 'AdministrativeArea',
            'name': 'Cumilla (District)',
            'containedInPlace': { '@type': 'AdministrativeArea', 'name': 'Chattogram (Division)' }
          }
        },
        'sameAs': ['https://amargram.org/fulmuree']
      },
      {
        '@type': 'WebSite',
        'name': 'ফুলমুড়ী গ্রাম',
        'url': seoCanonical,
        'inLanguage': 'bn-BD',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://fulmurigram.site/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': seoCanonical },
          { '@type': 'ListItem', 'position': 2, 'name': 'Explore', 'item': seoCanonical + '#features' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Profile', 'item': seoCanonical + '#profile' },
          { '@type': 'ListItem', 'position': 4, 'name': 'Map', 'item': seoCanonical + '#contact' }
        ]
      }
    ]
  }), [seoCanonical]);

  const openGraph = useMemo(() => ({
    type: 'website',
    title: seoTitle,
    description: seoDescription,
    url: seoCanonical,
    siteName: 'আমার গ্রাম | ফুলমুড়ী',
    locale: 'bn_BD',
    image: seoCanonical + 'logo_pdf.png'
  }), [seoTitle, seoDescription, seoCanonical]);

  const twitterCard = useMemo(() => ({
    card: 'summary_large_image',
    title: seoTitle,
    description: seoDescription,
    image: seoCanonical + 'logo_pdf.png'
  }), [seoTitle, seoDescription, seoCanonical]);

  console.log('[LandingPage] SEO prepared', { seoTitle, seoCanonical });

  return (
    <BubbleBackground interactive={true}>
      <div className={`landing-root ${isDark ? 'dark' : ''}`}>
        <Meta
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          canonicalUrl={seoCanonical}
          jsonLd={seoJsonLd}
          openGraph={openGraph}
          twitterCard={twitterCard}
        />

        <header className="landing-hero" aria-label="Village hero" onMouseEnter={() => console.log('[LandingPage] hover hero header')} onMouseLeave={() => console.log('[LandingPage] leave hero header')}>
            <div className="hero-theme-toggle hero-theme-toggle-fixed">
              <ThemeSwitcher isDark={isDark} onToggle={(next) => { console.log('[LandingPage] theme toggle', { next }); setIsDark(next); }} />
            </div>
            <div className="hero-content" onMouseEnter={() => console.log('[LandingPage] hover hero-content')} onMouseLeave={() => console.log('[LandingPage] leave hero-content')}>
              <div className="hero-headers" onMouseEnter={() => console.log('[LandingPage] hover hero-headers')} onMouseLeave={() => console.log('[LandingPage] leave hero-headers')}>
                <h1 className="landing-title">ফুলমুড়ী গ্রাম</h1>
                <h2 className="landing-subtitle">আমার শেকড়, আমার গর্ব</h2>
                <p className="landing-intro">ফুলমুড়ী · মুন্সীরহাট · চৌদ্দগ্রাম · কুমিল্লা · চট্টগ্রাম</p>
              </div>
              <ul className="landing-highlights" role="list" aria-label="Village values">
                <li className="pill">স্বচ্ছতা</li>
                <li className="pill">দায়িত্বশীলতা</li>
                <li className="pill">কমিউনিটি</li>
              </ul>
              <div className="landing-actions" onMouseEnter={() => console.log('[LandingPage] hover landing-actions')} onMouseLeave={() => console.log('[LandingPage] leave landing-actions')}>
                <RainbowButton to={rolePath} onClick={() => console.log('[LandingPage] CTA click: RainbowButton', { to: rolePath })}>
                  সদস্য পোর্টাল
                </RainbowButton>
              </div>
            </div>
        </header>

        <section className="panel" id="history">
          <h2 className="section-title">ইতিহাস ও উৎপত্তি</h2>
          <p className="section-text">ফুলমুড়ীর নামের উৎপত্তি নিয়ে স্থানীয়দের নানা গল্প আছে— ফুলের সৌরভে ভরা মাঠ, পানির মড়ান ঘিরে গড়ে ওঠা বসতি; প্রজন্মের পর প্রজন্ম ধরে কৃষি, কারিগরি ও সংস্কৃতির ধারায় গড়ে ওঠা আমাদের গ্রাম।</p>
          <p className="section-text">গ্রামের পুরোনো পথ, বটগাছের ছায়া, পুকুরঘাট ও মসজিদের মিনার— এইসব নিদর্শন ফুলমুড়ীর পরিচয়ের অংশ। সামাজিক মিলনমেলা, উৎসব ও ঐতিহ্য আজও আমাদের কমিউনিটিকে একসূত্রে বেঁধে রাখে।</p>
        </section>

        <section className="panel" id="seasons" ref={seasonsRef}>
          <h2 className="section-title">ঋতুচক্র</h2>
          <div className="season-grid">
            <div
              className="season-item season-summer"
              style={{ '--fx-delay': '.1s', '--fx-speed': '2.6s' }}
              data-season="গ্রীষ্ম"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'গ্রীষ্ম' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'গ্রীষ্ম' })}
            >
              <span className="season-icon"><Sun size={22} /></span>গ্রীষ্ম
              <span className="fx fx-sun" aria-hidden="true" />
            </div>
            <div
              className="season-item season-monsoon"
              style={{ '--fx-delay': '0s', '--fx-speed': '2.2s' }}
              data-season="বর্ষা"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'বর্ষা' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'বর্ষা' })}
            >
              <span className="season-icon"><CloudRain size={22} /></span>বর্ষা
              {(shouldAnimate && rainData && rainInView) && (
                <Lottie
                  animationData={rainData}
                  loop
                  autoplay
                  className="fx fx-rain-lottie"
                  lottieRef={rainRef}
                  renderer="canvas"
                  rendererSettings={{ preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true }}
                  onDOMLoaded={() => {
                    console.log('[LandingPage] rain Lottie DOM loaded');
                    try {
                      rainRef.current?.setSpeed(0.35);
                      rainRef.current?.setSubframe?.(true);
                      rainRef.current?.goToAndPlay?.(0, true);
                      console.log('[LandingPage] Lottie speed set (DOM load)', { type: 'rain', speed: 0.35 });
                    } catch (e) {
                      console.log('[LandingPage] rain speed set error', e);
                    }
                  }}
                />
              )}
            </div>
            <div
              className="season-item season-autumn"
              style={{ '--fx-delay': '.2s', '--fx-speed': '6.5s' }}
              data-season="শরৎ"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'শরৎ' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'শরৎ' })}
            >
              শরৎ
              {(shouldAnimate && leavesData && leavesInView) && (
                <Lottie
                  animationData={leavesData}
                  loop
                  autoplay
                  className="fx fx-leaves-lottie"
                  lottieRef={leavesRef}
                  renderer="canvas"
                  rendererSettings={{ preserveAspectRatio: 'xMidYMid slice', progressiveLoad: true }}
                  onDOMLoaded={() => {
                    console.log('[LandingPage] leaves Lottie DOM loaded');
                    try {
                      leavesRef.current?.setSpeed(0.35);
                      leavesRef.current?.setSubframe?.(true);
                      leavesRef.current?.goToAndPlay?.(0, true);
                      console.log('[LandingPage] Lottie speed set (DOM load)', { type: 'leaves', speed: 0.35 });
                    } catch (e) {
                      console.log('[LandingPage] leaves speed set error', e);
                    }
                  }}
                />
              )}
            </div>
            <div
              className="season-item season-hemanta"
              style={{ '--fx-delay': '.15s', '--fx-speed': '10s' }}
              data-season="হেমন্ত"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'হেমন্ত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'হেমন্ত' })}
            >
              হেমন্ত
              <span className="fx fx-stripes" aria-hidden="true" />
            </div>
            <div
              className="season-item season-winter"
              style={{ '--fx-delay': '.3s', '--fx-speed': '6.8s' }}
              data-season="শীত"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'শীত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'শীত' })}
            >
              শীত
              <span className="fx fx-snow" aria-hidden="true" />
            </div>
            <div
              className="season-item season-spring"
              style={{ '--fx-delay': '.25s', '--fx-speed': '6s' }}
              data-season="বসন্ত"
              onMouseEnter={() => console.debug('[LandingPage] hover season', { season: 'বসন্ত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave season', { season: 'বসন্ত' })}
            >
              বসন্ত
              <span className="fx fx-blossom" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section>
          {console.log('[LandingPage] ImgSphere below ঋতুচক্র rendered')}
          <div className="img-sphere-page-wrapper" style={{ background: 'transparent' }} ref={landingSphereRef}>
            <ImgSphere
              images={sphereImages}
              containerSize={360}
              sphereRadius={160}
              autoRotate={true}
              baseImageScale={0.1}
              performanceMode={true}
              disableSpotlight={true}
              onImageClick={(img) => { console.log('[LandingPage] sphere image clicked', img); }}
            />
          </div>
        </section>

        <section className="panel" id="agriculture-details">
          <h2 className="section-title">কৃষি ও মৌসুমি ফসল</h2>
          <div className="crop-grid">
            <div
              className="crop-item crop-summer"
              data-season="গ্রীষ্ম"
              onMouseEnter={() => console.debug('[LandingPage] hover crop', { season: 'গ্রীষ্ম' })}
              onMouseLeave={() => console.debug('[LandingPage] leave crop', { season: 'গ্রীষ্ম' })}
            >
              <div className="crop-title"><span className="crop-icon"><Sun size={18} /></span>গ্রীষ্ম</div>
              <div className="crop-body">বেগুন, লাউ, করলা, শসা</div>
              <span className="crop-fx" aria-hidden="true" />
            </div>
            <div
              className="crop-item crop-monsoon"
              data-season="বর্ষা"
              onMouseEnter={() => console.debug('[LandingPage] hover crop', { season: 'বর্ষা' })}
              onMouseLeave={() => console.debug('[LandingPage] leave crop', { season: 'বর্ষা' })}
            >
              <div className="crop-title"><span className="crop-icon"><CloudRain size={18} /></span>বর্ষা</div>
              <div className="crop-body">ধান, কচু, ডাল জাতীয়</div>
              <span className="crop-fx" aria-hidden="true" />
            </div>
            <div
              className="crop-item crop-autumn"
              data-season="শরৎ/হেমন্ত"
              onMouseEnter={() => console.debug('[LandingPage] hover crop', { season: 'শরৎ/হেমন্ত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave crop', { season: 'শরৎ/হেমন্ত' })}
            >
              <div className="crop-title"><span className="crop-icon"><Sprout size={18} /></span>শরৎ/হেমন্ত</div>
              <div className="crop-body">ধান কাটার মৌসুম, আলু চাষ</div>
              <span className="crop-fx" aria-hidden="true" />
            </div>
            <div
              className="crop-item crop-winter"
              data-season="শীত"
              onMouseEnter={() => console.debug('[LandingPage] hover crop', { season: 'শীত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave crop', { season: 'শীত' })}
            >
              <div className="crop-title"><span className="crop-icon"><Sprout size={18} /></span>শীত</div>
              <div className="crop-body">মটর, বাঁধাকপি, ফুলকপি</div>
              <span className="crop-fx" aria-hidden="true" />
            </div>
            <div
              className="crop-item crop-spring"
              data-season="বসন্ত"
              onMouseEnter={() => console.debug('[LandingPage] hover crop', { season: 'বসন্ত' })}
              onMouseLeave={() => console.debug('[LandingPage] leave crop', { season: 'বসন্ত' })}
            >
              <div className="crop-title"><span className="crop-icon"><Sprout size={18} /></span>বসন্ত</div>
              <div className="crop-body">মৌসুমি ফলফলাদি</div>
              <span className="crop-fx" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="panel" id="institutions">
          <h2 className="section-title">শিক্ষা ও সামাজিক প্রতিষ্ঠান</h2>
          <ul className="inst-list">
            <li className="ui-card card-institutions" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'institutions', item: 'প্রাথমিক বিদ্যালয়' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'institutions', item: 'প্রাথমিক বিদ্যালয়' })}>
              <h5><span className="ui-card-icon"><BookOpen size={18} /></span>প্রাথমিক বিদ্যালয়</h5>
              <p>গ্রামের শিশুদের প্রাথমিক শিক্ষা কেন্দ্র।</p>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-institutions" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'institutions', item: 'মাদ্রাসা' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'institutions', item: 'মাদ্রাসা' })}>
              <h5><span className="ui-card-icon"><BookOpen size={18} /></span>মাদ্রাসা</h5>
              <p>ধর্মীয় ও সাধারণ শিক্ষার সমন্বয়।</p>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-institutions" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'institutions', item: 'মসজিদ/ঈদগাহ' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'institutions', item: 'মসজিদ/ঈদগাহ' })}>
              <h5><span className="ui-card-icon"><Landmark size={18} /></span>মসজিদ/ঈদগাহ</h5>
              <p>ধর্মীয় অনুশাসন ও সামাজিক বন্ধন।</p>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-institutions" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'institutions', item: 'স্বাস্থ্য কেন্দ্র' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'institutions', item: 'স্বাস্থ্য কেন্দ্র' })}>
              <h5><span className="ui-card-icon"><ShieldCheck size={18} /></span>স্বাস্থ্য কেন্দ্র</h5>
              <p>প্রাথমিক চিকিৎসা ও জনস্বাস্থ্য সচেতনতা।</p>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-institutions" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'institutions', item: 'হাট-বাজার' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'institutions', item: 'হাট-বাজার' })}>
              <h5><span className="ui-card-icon"><Megaphone size={18} /></span>হাট-বাজার</h5>
              <p>স্থানীয় অর্থনীতি ও জীবিকার কেন্দ্র।</p>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
          </ul>
        </section>

        {console.log('[LandingPage] transport section removed per request')}


        <section className="panel" id="language">
          <h2 className="section-title">ভাষা ও অভিধান</h2>
          <p className="section-text">কুমিল্লা অঞ্চলের আঞ্চলিক ভাষার স্বাদ— উচ্চারণে মিঠে টান, শব্দে গ্রামীণ রঙ। লোকগাথা ও প্রবাদে ফুটে ওঠে ফুলমুড়ীর সাংস্কৃতিক পরিচয়।</p>
        </section>

        <section className="panel" id="crafts">
          <h2 className="section-title">কারুশিল্প ও জীবিকা</h2>
          <ul className="why-list">
            <li>নকশিকাঁথা ও সেলাই</li>
            <li>মৃৎশিল্প ও বাঁশ-বেত</li>
            <li>কৃষি, দোকানদারি ও ক্ষুদ্র উদ্যোগ</li>
          </ul>
        </section>

        <section className="panel" id="people">
          <h2 className="section-title">প্রতিভা ও সম্মাননা</h2>
          <div className="notable-grid">
            <div className="notable-item ui-card card-people" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'people', item: 'শিক্ষক' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'people', item: 'শিক্ষক' })} onClick={() => console.log('[LandingPage] click notable: teacher')}>
              <span className="ui-card-icon"><Users size={18} /></span>শিক্ষক — কমিউনিটি লিডার
              <span className="ui-card-fx" aria-hidden="true" />
            </div>
            <div className="notable-item ui-card card-people" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'people', item: 'কৃষক' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'people', item: 'কৃষক' })} onClick={() => console.log('[LandingPage] click notable: farmer')}>
              <span className="ui-card-icon"><Users size={18} /></span>কৃষক — স্থানীয় উদ্ভাবক
              <span className="ui-card-fx" aria-hidden="true" />
            </div>
            <div className="notable-item ui-card card-people" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'people', item: 'কারিগর' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'people', item: 'কারিগর' })} onClick={() => console.log('[LandingPage] click notable: artisan')}>
              <span className="ui-card-icon"><Users size={18} /></span>কারিগর — হস্তশিল্পী
              <span className="ui-card-fx" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section id="profile" className="panel">
          <h2 className="section-title">গ্রামের পরিচিতি</h2>
          <p className="section-text">ফুলমুড়ী গ্রামের পরিচিতি — ভূ-প্রকৃতি, মানুষ, কৃষি, শিক্ষা ও সংস্কৃতি। স্থানীয় ইতিহাস, ঐতিহ্য এবং কমিউনিটির দৈনন্দিন জীবন এখানে তুলে ধরা হয়।</p>
          <Suspense fallback={<div className="section-text">Loading info…</div>}>
            <InfoGrid
              facts={[
                { label: 'গ্রাম', value: 'ফুলমুড়ী' },
                { label: 'ইউনিয়ন', value: 'মুন্সীরহাট' },
                { label: 'উপজেলা', value: 'চৌদ্দগ্রাম' },
                { label: 'জেলা', value: 'কুমিল্লা' },
                { label: 'বিভাগ', value: 'চট্টগ্রাম' }
              ]}
            />
          </Suspense>
        </section>

        <section className="panel">
          <h2 className="section-title">কেন এই ভিলেজ পোর্টাল</h2>
          <ul className="why-list">
            <li className="ui-card card-why" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'why', item: 'ডিজিটাল প্রোফাইল' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'why', item: 'ডিজিটাল প্রোফাইল' })}>
              <span className="ui-card-icon"><ShieldCheck size={18} /></span>ডিজিটাল প্রোফাইল ও তথ্য
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-why" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'why', item: 'লোকেশন ও মানচিত্র' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'why', item: 'লোকেশন ও মানচিত্র' })}>
              <span className="ui-card-icon"><MapPin size={18} /></span>লোকেশন ও মানচিত্র
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-why" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'why', item: 'ইতিহাস ও ঐতিহ্য' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'why', item: 'ইতিহাস ও ঐতিহ্য' })}>
              <span className="ui-card-icon"><Landmark size={18} /></span>ইতিহাস ও ঐতিহ্য
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-why" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'why', item: 'কৃষি ও জীবিকা' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'why', item: 'কৃষি ও জীবিকা' })}>
              <span className="ui-card-icon"><Sprout size={18} /></span>কৃষি ও জীবিকা
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-why" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'why', item: 'শিক্ষা ও সামাজিক প্রতিষ্ঠান' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'why', item: 'শিক্ষা ও সামাজিক প্রতিষ্ঠান' })}>
              <span className="ui-card-icon"><BookOpen size={18} /></span>শিক্ষা ও সামাজিক প্রতিষ্ঠান
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
          </ul>
        </section>

        

        

        

        

        <section className="panel" id="testimonials">
          <h2 className="section-title">আমাদের গ্রামের কথা</h2>
          <Suspense fallback={<div className="section-text">Loading testimonials…</div>}>
            <Testimonials
              items={[
                { quote: 'ফুলমুড়ী আমাদের শেকড় — ঐতিহ্য ও সংস্কৃতির গ্রাম।', author: 'বাসিন্দা, ফুলমুড়ী' },
                { quote: 'কৃষি ও কমিউনিটি — আমাদের জীবনের প্রধান অংশ।', author: 'স্থানীয়, ফুলমুড়ী' },
                { quote: 'শিক্ষা ও সামাজিক প্রতিষ্ঠান গ্রামের উন্নয়নে অবদান রাখছে।', author: 'শিক্ষার্থী, ফুলমুড়ী' }
              ]}
            />
          </Suspense>
        </section>

        <section className="landing-stats">
          <div className="stat-card ui-card card-stats" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'stats', item: 'লোকসংখ্যা' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'stats', item: 'লোকসংখ্যা' })}>
            <div className="stat-value"><span className="ui-card-icon"><Users size={18} /></span><Suspense fallback={<span>…</span>}><StatsCounter value={1403} suffix="" /></Suspense></div>
            <div className="stat-label">লোকসংখ্যা</div>
            <span className="ui-card-fx" aria-hidden="true" />
          </div>
          <div className="stat-card ui-card card-stats" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'stats', item: 'শিক্ষা প্রতিষ্ঠান' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'stats', item: 'শিক্ষা প্রতিষ্ঠান' })}>
            <div className="stat-value"><span className="ui-card-icon"><BookOpen size={18} /></span><Suspense fallback={<span>…</span>}><StatsCounter value={3} suffix="+" /></Suspense></div>
            <div className="stat-label">শিক্ষা প্রতিষ্ঠান</div>
            <span className="ui-card-fx" aria-hidden="true" />
          </div>
        </section>

        <section className="panel" id="faq">
          <h2 className="section-title">প্রশ্নোত্তর</h2>
          <div className="section-text">ফুলমুড়ী গ্রামের অবস্থান, ইতিহাস, কৃষি ও শিক্ষাসংক্রান্ত সাধারণ প্রশ্নের উত্তর।</div>
          <Suspense fallback={<div className="section-text">Loading FAQ…</div>}>
            <FaqAccordion
              items={[
                { question: 'ফুলমুড়ী কোথায় অবস্থিত?', answer: 'মুন্সীরহাট ইউনিয়ন, চৌদ্দগ্রাম উপজেলা, কুমিল্লা জেলা, চট্টগ্রাম বিভাগ।' },
                { question: 'কৃষি প্রধান ফসল কী?', answer: 'ধানসহ মৌসুমি ফসল; স্থানীয় কৃষির বৈশিষ্ট্য অনুযায়ী পরিবর্তিত।' },
                { question: 'শিক্ষা প্রতিষ্ঠান কী কী আছে?', answer: 'স্কুল, মাদ্রাসা ও সামাজিক প্রতিষ্ঠান — বিস্তারিত প্রোফাইলে দেখুন।' },
                { question: 'গ্রামের মানচিত্র কোথায়?', answer: 'লোকেশন সেকশনে মানচিত্র ও দিকনির্দেশনা পাওয়া যাবে।' }
              ]}
            />
          </Suspense>
        </section>

        {console.log('[LandingPage] notices section removed per request')}

        

        <section className="panel" id="contact">
          <h2 className="section-title">লোকেশন ও মানচিত্র</h2>
          <p className="section-text">ফুলমুড়ী — মুন্সীরহাট ইউনিয়ন, চৌদ্দগ্রাম, কুমিল্লা, চট্টগ্রাম। মানচিত্র ও দিকনির্দেশনা দেখতে নিচের বোতাম ব্যবহার করুন।</p>
          {console.log('[LandingPage] contact actions removed per request')}
          <Suspense fallback={<div className="section-text">Loading map…</div>}>
            <MapBlock />
          </Suspense>
        </section>


        <section className="panel" id="culture">
          <h2 className="section-title">লোকসংস্কৃতি ও ঐতিহ্য</h2>
          <p className="section-text">পল্লীগীতি, পিঠা-পুলির উৎসব, নকশিকাঁথা, গ্রামীণ খেলাধুলা— ফুলমুড়ীর ঐতিহ্য ও আনন্দের গল্প।</p>
          <ul className="why-list">
            <li className="ui-card card-culture" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'culture', item: 'পল্লীগীতি' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'culture', item: 'পল্লীগীতি' })}>
              <span className="ui-card-icon"><Sprout size={18} /></span>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log('[LandingPage] click culture: folk-song'); }}>পল্লীগীতি ও লোকসঙ্গীত</a>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-culture" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'culture', item: 'নকশিকাঁথা' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'culture', item: 'নকশিকাঁথা' })}>
              <span className="ui-card-icon"><Sprout size={18} /></span>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log('[LandingPage] click culture: nakshi-katha'); }}>নকশিকাঁথা ও হস্তশিল্প</a>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-culture" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'culture', item: 'গ্রামীণ খেলাধুলা' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'culture', item: 'গ্রামীণ খেলাধুলা' })}>
              <span className="ui-card-icon"><Sprout size={18} /></span>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log('[LandingPage] click culture: village-games'); }}>গ্রামীণ খেলাধুলা</a>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-culture" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'culture', item: 'উৎসব' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'culture', item: 'উৎসব' })}>
              <span className="ui-card-icon"><Sprout size={18} /></span>
              <a href="#" onClick={(e) => { e.preventDefault(); console.log('[LandingPage] click culture: festivals'); }}>উৎসব ও মিলনমেলা</a>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
          </ul>
        </section>


        <section className="panel" id="nature">
          <h2 className="section-title">প্রাকৃতিক নিদর্শন</h2>
          <ul className="why-list">
            <li className="ui-card card-nature" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'nature', item: 'ধানক্ষেত' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'nature', item: 'ধানক্ষেত' })}><span className="ui-card-icon"><Sun size={18} /></span>ধানক্ষেত ও সবুজ প্রান্তর<span className="ui-card-fx" aria-hidden="true" /></li>
            <li className="ui-card card-nature" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'nature', item: 'পুকুর' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'nature', item: 'পুকুর' })}><span className="ui-card-icon"><CloudRain size={18} /></span>পুকুর, বিল ও জলাশয়<span className="ui-card-fx" aria-hidden="true" /></li>
            <li className="ui-card card-nature" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'nature', item: 'বটগাছ' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'nature', item: 'বটগাছ' })}><span className="ui-card-icon"><Sun size={18} /></span>বটগাছ, শ্বেতছায়া ও গ্রামের পথ<span className="ui-card-fx" aria-hidden="true" /></li>
            <li className="ui-card card-nature" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'nature', item: 'কুয়াশা' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'nature', item: 'কুয়াশা' })}><span className="ui-card-icon"><CloudRain size={18} /></span>ভোরের কুয়াশা ও সন্ধ্যার হাওয়া<span className="ui-card-fx" aria-hidden="true" /></li>
          </ul>
        </section>

        

        <section className="panel" id="market">
          <h2 className="section-title">হাট-বাজার দিন</h2>
          <ul className="step-list">
            <li className="ui-card card-market" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'market', item: 'Mon' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'market', item: 'Mon' })}>
              <span className="step-badge">Mon</span>
              <div><h5>মুন্সীরহাট</h5><p>সবজি ও মাছের বাজার— সকাল থেকে দুপুর।</p></div>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-market" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'market', item: 'Thu' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'market', item: 'Thu' })}>
              <span className="step-badge">Thu</span>
              <div><h5>চৌদ্দগ্রাম</h5><p>কৃষি উপকরণ ও দৈনন্দিন বাজার— দুপুর থেকে বিকাল।</p></div>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
            <li className="ui-card card-market" onMouseEnter={() => console.log('[LandingPage] hover card', { section: 'market', item: 'Sat' })} onMouseLeave={() => console.log('[LandingPage] leave card', { section: 'market', item: 'Sat' })}>
              <span className="step-badge">Sat</span>
              <div><h5>স্থানীয় হাট</h5><p>গৃহস্থালি জিনিস ও হস্তশিল্প— সাপ্তাহিক আড্ডা।</p></div>
              <span className="ui-card-fx" aria-hidden="true" />
            </li>
          </ul>
        </section>



        <section className="panel" id="festival">
          <h2 className="section-title">উৎসবের ক্যালেন্ডার</h2>
          <div className="festival-grid">
            <div className="festival-item ui-card card-festival" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'festival', item: 'বৈশাখ — নবান্ন' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'festival', item: 'বৈশাখ — নবান্ন' })}>বৈশাখ — নবান্ন<span className="ui-card-fx" aria-hidden="true" /></div>
            <div className="festival-item ui-card card-festival" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'festival', item: 'জিলহজ — কোরবানি' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'festival', item: 'জিলহজ — কোরবানি' })}>জিলহজ — কোরবানি<span className="ui-card-fx" aria-hidden="true" /></div>
            <div className="festival-item ui-card card-festival" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'festival', item: 'শাবান/রমজান — ইফতার মিলন' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'festival', item: 'শাবান/রমজান — ইফতার মিলন' })}>শাবান/রমজান — ইফতার মিলন<span className="ui-card-fx" aria-hidden="true" /></div>
            <div className="festival-item ui-card card-festival" onMouseEnter={() => console.debug('[LandingPage] hover card', { section: 'festival', item: 'ফাল্গুন — বসন্ত উৎসব' })} onMouseLeave={() => console.debug('[LandingPage] leave card', { section: 'festival', item: 'ফাল্গুন — বসন্ত উৎসব' })}>ফাল্গুন — বসন্ত উৎসব<span className="ui-card-fx" aria-hidden="true" /></div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="footer-bottom">
            <img src="/ফুলমুড়ী_গ্রাম.svg" alt="ফুলমুড়ী গ্রাম লোগো" className="footer-logo" onClick={() => console.log('[LandingPage] footer logo click')} />
            <div className="footer-copy">© 2025 ফুলমুড়ী গ্রাম</div>
            <div className="footer-meta">স্মার্ট গ্রাম | কমিউনিটি পোর্টাল</div>
          </div>
        </footer>

      </div>
    </BubbleBackground>
  );
}
