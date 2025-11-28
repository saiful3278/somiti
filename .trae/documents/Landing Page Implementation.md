## কী বানাবো
- `src/pages/LandingPage.jsx`: পাবলিক ল্যান্ডিং পেজ (React + CSS)
- `src/styles/LandingPage.css`: আলাদা স্টাইল ফাইল
- `src/App.jsx`: রাউটিং-এ `/` রুটকে পাবলিক হিসেবে যুক্ত করা

## কনটেন্ট ও ফিচার
- হিরো সেকশন: “ফুলমুড়ী যুব ফাউন্ডেশন – Fulmuri Youth Foundation” শিরোনাম ও সাবটাইটেল
- কল-টু-অ্যাকশন: `Login` (`/login`), `Explore` (`/new`), এবং লগইন থাকলে `Go to Dashboard`
- ফিচার গ্রিড: Member Management, Finance Tracking, Notice Board ইত্যাদি
- ব্যাকগ্রাউন্ড: বিদ্যমান `BubbleBackground` ব্যবহার করে কুল ভিজ্যুয়াল
- SEO: `Meta` কম্পোনেন্ট দিয়ে টাইটেল/ডেস্ক্রিপশন সেট

## রাউটিং পরিবর্তন
- `src/App.jsx`-এ `<Routes>` ব্লকে পাবলিক রুট যোগ করা যাতে `/` এ গেলে ল্যান্ডিং পেজ দেখায়
- নতুন রুটটি `/*` প্রোটেক্টেড রুটের আগে থাকবে

উদাহরণ পরিবর্তন:
```jsx
// src/App.jsx
import LandingPage from './pages/LandingPage';
...
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/secret3278" element={<SecretRoleSwitcher />} />
  <Route path="/new" element={<New />} />
  <Route path="/" element={<LandingPage />} />
  <Route path="/*" element={<ProtectedRoute><MainApp /></ProtectedRoute>} />
</Routes>
```

## কম্পোনেন্ট স্ট্রাকচার
```jsx
// src/pages/LandingPage.jsx
import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Meta from '../components/Meta';
import BubbleBackground from '../components/ui/BubbleBackground';
import '../styles/LandingPage.css';

console.log('[LandingPage] File loaded');

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('[LandingPage] mounted');
  }, []);

  const rolePath = user?.role ? `/${user.role}` : '/member';

  return (
    <BubbleBackground interactive={true}>
      <div className="landing-root">
        <Meta
          title="হোম - ফুলমুড়ী যুব ফাউন্ডেশন"
          description="ফুলমুড়ী যুব ফাউন্ডেশন-এর অফিসিয়াল ওয়েবসাইট"
          canonicalUrl="https://fulmurigram.site/"
        />

        <section className="landing-hero">
          <h1 className="landing-title">ফুলমুড়ী যুব ফাউন্ডেশন</h1>
          <p className="landing-subtitle">কমিউনিটি, স্বচ্ছতা, উন্নতি</p>
          <div className="landing-actions">
            <Link to="/login" className="btn-primary" onClick={() => console.log('[LandingPage] click login')}>Login</Link>
            <Link to="/new" className="btn-secondary" onClick={() => console.log('[LandingPage] click explore')}>Explore</Link>
            {isAuthenticated() && (
              <Link to={rolePath} className="btn-outline" onClick={() => console.log('[LandingPage] go dashboard')}>Go to Dashboard</Link>
            )}
          </div>
        </section>

        <section className="landing-features">
          <div className="feature-card">
            <h3>Member Management</h3>
            <p>সদস্য তথ্য ও প্রোফাইল ম্যানেজমেন্ট</p>
          </div>
          <div className="feature-card">
            <h3>Finance Tracking</h3>
            <p>লেনদেন, ট্রেজারি, শেয়ার ট্র্যাকিং</p>
          </div>
          <div className="feature-card">
            <h3>Notice Board</h3>
            <p>আপডেট ও ঘোষণা এক জায়গায়</p>
          </div>
        </section>
      </div>
    </BubbleBackground>
  );
}
```

## CSS স্টাইলিং
```css
/* src/styles/LandingPage.css */
:root { font-family: var(--font-family-primary); }

.landing-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.landing-hero {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.landing-title {
  font-size: 2.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.landing-subtitle {
  margin-top: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

.landing-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-outline {
  padding: 0.8rem 1.4rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: var(--shadow-soft);
  font-weight: 600;
}

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

.btn-secondary { background: var(--secondary); color: white; }
.btn-secondary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

.btn-outline { border: 2px solid var(--primary); color: var(--primary); background: transparent; }
.btn-outline:hover { background: var(--primary-50); }

.landing-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-xl);
  max-width: 1100px;
  margin: 0 auto;
}

.feature-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.feature-card h3 { color: var(--text-primary); font-size: var(--font-size-xl); }
.feature-card p { color: var(--text-secondary); margin-top: var(--spacing-sm); }

@media (max-width: 900px) { .landing-features { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) {
  .landing-features { grid-template-columns: 1fr; }
  .landing-title { font-size: 2rem; }
}
```

## কনভেনশন
- ফাইল লোকেশন: কম্পোনেন্ট `src/pages/`, স্টাইল `src/styles/`
- বিদ্যমান CSS ভ্যারিয়েবল/শেডো/স্পেসিং ব্যবহার
- প্রতিটি নতুন ফাইলে `console.log`

## ভেরিফিকেশন
- ডেভ সার্ভার চলমান আছে; ব্রাউজারে `/` ওপেন করলে নতুন ল্যান্ডিং দেখা যাবে
- `/login`, `/new` CTA কাজ করছে কি না যাচাই
- মোবাইল ব্রেকপয়েন্টে রেসপন্সিভ গ্রিড পরীক্ষা

## কোড রেফারেন্স
- রাউটিং এন্ট্রি: `src/App.jsx:32-53`
- প্রোটেক্টেড ব্লকের শুরু: `src/App.jsx:41-49`
- লগইন পেজ স্টাইলিং কনভেনশন: `src/pages/Login.jsx:8`, `src/styles/Login.css`
- বেস স্টাইল ভ্যারিয়েবল: `src/styles/base/variables.css:4-12, 64-78`