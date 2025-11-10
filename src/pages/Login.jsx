import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';
import LoadingAnimation from '../components/common/LoadingAnimation';
import Meta from '../components/Meta'; // Import the Meta component
import '../styles/Login.css';
import '../styles/BengaliContent.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

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
        description="ফুলমুড়ী যুব ফাউন্ডেশন-এর অ্যাকাউন্টে লগইন করুন"
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
      </div>
      <div className="bengali-content">
        <p>ফুলমুড়ী যুব ফাউন্ডেশন হলো ফুলমুড়ী গ্রামের একটি বৈধ সমিতি, যা গ্রামের যুবকদের উন্নয়নমূলক কার্যক্রম, নোটিশ এবং গুরুত্বপূর্ণ তথ্য শেয়ার করে। এই ওয়েবসাইটটি কেবলমাত্র অনুমোদিত সদস্যদের জন্য যাদের লগইন আইডি এবং পাসওয়ার্ড সরাসরি প্রশাসক বা ক্যাশিয়ার কর্তৃক প্রদান করা হয়েছে।</p>
        <p>ওয়েবসাইটে সংরক্ষিত রয়েছে সমিতির নোটিশ, আপডেট, এবং কার্যক্রম সম্পর্কিত তথ্য, যা অনুমোদন ছাড়া প্রবেশ করা সম্ভব নয়। ফুলমুড়ী যুব ফাউন্ডেশনের এই অনলাইন প্ল্যাঠফর্ম নিশ্চিত করে যে শুধুমাত্র অনুমোদিত সদস্যরাই সহজে সব গুরুত্বপূর্ণ তথ্য অ্যাক্সেস করতে পারে।</p>
      </div>
    </div>
  );
};

export default Login;