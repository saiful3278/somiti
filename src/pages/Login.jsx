import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';
import LoadingAnimation from '../components/common/LoadingAnimation';
import '../styles/Login.css';

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
    </div>
  );
};

export default Login;