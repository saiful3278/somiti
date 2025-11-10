import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';
import LoadingAnimation from '../components/common/LoadingAnimation';
import Meta from '../components/Meta'; // Import the Meta component
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ফুলমুড়ী যুব ফাউন্ডেশন',
    url: 'https://fulmurigram.site',
    logo: 'https://fulmurigram.site/footer_logo.svg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ফুলমুড়ী',
      addressLocality: 'Fulmuri',
      addressRegion: 'Mymensingh',
      postalCode: '2262',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '24.743448',
      longitude: '90.398384',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801711-111111',
      contactType: 'customer service',
    },
  };

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('ইমেইল এবং পাসওয়ার্ড প্রয়োজন');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await loginUser(formData.email, formData.password);

      if (response.success) {
        const result = await login(response.token, response.user_id);

        if (result.user) {
          const { role } = result.user;
          // Navigate based on role
          switch (role) {
            case 'admin':
              navigate('/admin', { replace: true });
              break;
            case 'cashier':
              navigate('/cashier', { replace: true });
              break;
            default:
              navigate('/member', { replace: true });
          }
        } else {
          setError(result.error || 'লগইন ব্যর্থ হয়েছে');
        }
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.message || 'লগইন ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setError(err.message || 'একটি ত্রুটি ঘটেছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Meta
        title="লগইন - ফুলমুড়ী যুব ফাউন্ডেশন"
        description="ফুলমুড়ী যুব ফাউন্ডেশন-এ লগইন করুন।"
        keywords="লগইন, ফুলমুড়ী, ফুলমুড়ী গ্রাম, ফুলমুড়ী যুব ফাউন্ডেশন, Fulmuri, fulmuri gram, fulmuri"
        canonicalUrl="https://fulmurigram.site/"
        jsonLd={jsonLd}
      />
      <div className="login-wrapper">
        <div className="login-header">
          {/* Welcome Animation - Centered */}
          <div className="welcome-animation" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <lottie-player
              src="/Welcome_login.json"
              background="transparent"
              speed="1"
              style={{width: '400px', height: '120px'}}
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>

        <div className="login-form-container">
          {/* Login Animation inside the card */}
          <div className="login-logo" style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
            <lottie-player
              src="/login_animation.json"
              background="transparent"
              speed="1"
              style={{width: '120px', height: '120px'}}
              loop
              autoplay
            ></lottie-player>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="আপনার ইমেইল লিখুন"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle className="h-5 w-5 error-icon" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="loading-spinner h-5 w-5" /> লগইন করা হচ্ছে...</>
                ) : (
                  <><LogIn className="h-5 w-5" /> লগইন করুন</>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bengali-content">
          <h1>ফুলমুড়ী যুব ফাউন্ডেশন</h1>
          <p>
           আমাদের ফুলমুড়ী যুব ফাউন্ডেশন-এ আপনাকে আন্তরিকভাবে স্বাগত জানাই। ফুলমুড়ী গ্রাম, যা আমাদের ভালোবাসার Fulmuri, তার قلبস্থলে অবস্থিত এই প্রতিষ্ঠানটি গ্রামের প্রতিটি মানুষের জীবনযাত্রার মানোন্নয়নে প্রতিশ্রুতিবদ্ধ। আমাদের মূল লক্ষ্য হলো ফুলমুড়ী গ্রামের সকল স্তরের মানুষের মধ্যে সমবায় চেতনা জাগিয়ে তোলা এবং তাদের অর্থনৈতিকভাবে স্বাবলম্বী করে তোলা। এই সমিতির মাধ্যমে আমরা সদস্যদের জন্য সঞ্চয়, সুলভ মূল্যে ঋণ এবং বিভিন্ন লাভজনক প্রকল্পে বিনিয়োগের সুযোগ সৃষ্টি করেছি।
          </p>
          <p>
            ফুলমুড়ী যুব ফাউন্ডেশন (Fulmuri Youth Foundation) শুধু একটি আর্থিক প্রতিষ্ঠান নয়, এটি আমাদের গ্রামের সামাজিক বন্ধনকে আরও সুদৃঢ় করার একটি প্ল্যাটফর্ম। আমরা বিশ্বাস করি, পারস্পরিক সহযোগিতা ও স্বচ্ছতার মাধ্যমেই একটি আদর্শ সমাজ গঠন করা সম্ভব। আমাদের সকল কার্যক্রম পরিচালিত হয় গণতান্ত্রিক পদ্ধতিতে, যেখানে প্রতিটি সদস্যের মতামতকে গুরুত্ব দেওয়া হয়। Fulmuri Gram-এর যুবসমাজকে স্বনির্ভর করতে এবং তাদের নতুন উদ্যোগকে উৎসাহিত করতে আমরা বিশেষ পরিকল্পনা গ্রহণ করেছি।
          </p>
          <p>
           আমাদের ওয়েবসাইটে (fulmurigram.site) আপনি সমিতি সম্পর্কিত সকল তথ্য, যেমন—আমাদের কার্যক্রম, নতুন প্রকল্প, এবং সদস্য হওয়ার নিয়মাবলী সম্পর্কে বিস্তারিত জানতে পারবেন। আমরা ডিজিটাল প্ল্যাটফর্মের মাধ্যমে আমাদের কার্যক্রমকে আরও সহজ ও স্বচ্ছ করতে চাই, যাতে ফুলমুড়ী গ্রামের যেকোনো প্রান্ত থেকে সদস্যরা আমাদের সাথে যুক্ত থাকতে পারেন। fulmuri-এর উন্নয়নে আপনার অংশগ্রহণ আমাদের জন্য অত্যন্ত মূল্যবান। আসুন, আমরা সবাই মিলে আমাদের ফুলমুড়ী গ্রামকে একটি মডেল গ্রাম হিসেবে গড়ে তুলি। আপনার যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন। ফুলমুড়ী যুব ফাউন্ডেশন আপনার পাশে আছে, সবসময়।
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;