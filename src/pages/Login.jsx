import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            সমিতি ওয়েবে স্বাগতম
          </h1>
          <p className="text-gray-600">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="আপনার ইমেইল লিখুন"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> লগইন করা হচ্ছে...</>
                ) : (
                  <><LogIn className="h-5 w-5 mr-2" /> লগইন করুন</>
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