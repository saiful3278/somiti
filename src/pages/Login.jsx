import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';
import LoadingAnimation from '../components/common/LoadingAnimation';
import Meta from '../components/Meta'; // Import the Meta component
import '../styles/Login.css';
import BubbleBackground from '../components/ui/BubbleBackground';
import '../styles/BengaliContent.css';

// Console log for file load (per workspace rule)
console.log('[Login] File loaded');

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logMetrics = () => {
      console.log('[Login] viewport metrics', {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio
      });
    };
    logMetrics();
    window.addEventListener('resize', logMetrics);
    return () => {
      window.removeEventListener('resize', logMetrics);
    };
  }, []);

  // If already authenticated, redirect to role-based dashboard rather than non-existent /dashboard
  if (isAuthenticated()) {
    const target = user?.role ? `/${user.role}` : '/member';
    console.log('[Login] Already authenticated, redirecting to:', target);
    return <Navigate to={target} replace />;
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
      console.log('[Login] Submitting login with email:', formData.email);
      const response = await loginUser(formData.email, formData.password);

      if (response.success) {
        const result = await login(response.token, response.user_id);

        if (result.user) {
          // Navigate to role dashboard
          const { role } = result.user;
          navigate(`/${role}`, { replace: true });
          console.log('[Login] Login successful; navigating to dashboard');
        } else {
          setError(result.error || 'লগইন ব্যর্থ হয়েছে');
        }
      } else {
        setError(response.message || 'লগইন ব্যর্থ হয়েছে');
      }
    } catch (err) {
      setError(err.message || 'একটি ত্রুটি ঘটেছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('[Login] Bubble background enabled');
  return (
    <BubbleBackground interactive={true} colors={{ first: '18,113,255', second: '221,74,255', third: '0,220,255', fourth: '200,50,50', fifth: '180,180,50', sixth: '140,100,255' }}>
      <div className="login-container">
        <Meta
          title="লগইন - ফুলমুড়ী যুব ফাউন্ডেশন"
          description="ফুলমুড়ী যুব ফাউন্ডেশন-এর অ্যাকাউন্টে লগইন করুন"
        />
        <div className="login-wrapper">
          <div className="login-header">
            {/* Welcome Animation - Centered */}
            <div className="welcome-animation" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <lottie-player
                src="/Welcome_login.json"
                background="transparent"
                speed="1"
                style={{ width: '300px', height: '90px' }}
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>

          <div className="login-form-container">
            {/* Login Animation inside the card */}
            <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <lottie-player
                src="/login_animation.json"
                background="transparent"
                speed="1"
                style={{ width: '100px', height: '100px' }}
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
                    <><Loader2 className="h-5 w-5 animate-spin" /> লগইন করা হচ্ছে...</>
                  ) : (
                    <><LogIn className="h-5 w-5" /> লগইন করুন</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bengali-content">
          <p>ওয়েবসাইটে সংরক্ষিত রয়েছে সমিতির নোটিশ, আপডেট, এবং কার্যক্রম সম্পর্কিত তথ্য, যা অনুমোদন ছাড়া প্রবেশ করা সম্ভব নয়। ফুলমুড়ী যুব ফাউন্ডেশনের এই অনলাইন প্ল্যাঠফর্ম নিশ্চিত করে যে শুধুমাত্র অনুমোদিত সদস্যরাই সব তথ্য অ্যাক্সেস করতে পারে।</p>
        </div>
      </div>
    </BubbleBackground>
  );
};

export default Login;