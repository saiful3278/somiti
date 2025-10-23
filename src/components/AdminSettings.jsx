import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  User, 
  Settings, 
  Bell, 
  Shield,
  Eye,
  EyeOff,
  Save,
  Phone,
  Mail,
  Lock,
  Edit3,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Home,
  MapPin
} from 'lucide-react';

const AdminSettings = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Simplified admin profile data
  const [profileData, setProfileData] = useState({
    name: '',
    adminId: '',
    phone: '',
    email: '',
    address: '',
    role: 'প্রধান অ্যাডমিন'
  });

  // Load real user data when currentUser changes
  useEffect(() => {
    if (currentUser && !userLoading) {
      setProfileData(prev => ({
        ...prev,
        name: currentUser.name || 'অজানা অ্যাডমিন',
        adminId: currentUser.id || 'ADM-001',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || ''
      }));
    }
  }, [currentUser, userLoading]);

  // Basic notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    systemAlerts: true
  });

  // Basic security settings - password change only
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Basic system preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT'
  });

  // Handler functions
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSystemChange = (key, value) => {
    setSystemPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না');
      return;
    }
    alert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const saveChanges = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // Simplified navigation items
  const navigationItems = [
    { 
      id: 'profile', 
      label: 'প্রোফাইল', 
      icon: User, 
      description: 'ব্যক্তিগত তথ্য ও যোগাযোগ'
    },
    { 
      id: 'security', 
      label: 'নিরাপত্তা', 
      icon: Shield, 
      description: 'পাসওয়ার্ড পরিবর্তন'
    },
    { 
      id: 'notifications', 
      label: 'নোটিফিকেশন', 
      icon: Bell, 
      description: 'বিজ্ঞপ্তি সেটিংস'
    },
    { 
      id: 'system', 
      label: 'সিস্টেম', 
      icon: Settings, 
      description: 'মৌলিক সেটিংস'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">অ্যাডমিন সেটিংস</h1>
                <p className="text-gray-600 mt-1">সিস্টেম ও প্রশাসনিক সেটিংস পরিচালনা করুন</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="h-4 w-4 text-green-500" />
                <span>সিস্টেম সক্রিয়</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>সর্বশেষ আপডেট: আজ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">সেটিংস মেনু</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`h-5 w-5 mr-3 ${
                        activeTab === item.id ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <span className="font-medium block">{item.label}</span>
                        <span className="text-xs text-gray-500 block">{item.description}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-medium text-gray-900">অ্যাডমিন প্রোফাইল</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isEditing 
                          ? 'text-gray-600 hover:text-gray-800' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {isEditing ? 'বাতিল' : 'সম্পাদনা'}
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                      <p className="text-sm text-gray-500">{profileData.role}</p>
                      <p className="text-xs text-gray-400">আইডি: {profileData.adminId}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        { key: 'name', label: 'নাম', type: 'text' },
                        { key: 'email', label: 'ইমেইল', type: 'email' },
                        { key: 'phone', label: 'ফোন', type: 'tel' }
                      ].map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            value={profileData[field.key]}
                            onChange={(e) => handleProfileChange(field.key, e.target.value)}
                            disabled={!isEditing}
                            className={`w-full px-0 py-2 text-sm border-0 border-b focus:ring-0 focus:border-gray-400 transition-colors ${
                              isEditing 
                                ? 'border-gray-200 bg-transparent' 
                                : 'border-transparent bg-transparent text-gray-700'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                        ঠিকানা
                      </label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        disabled={!isEditing}
                        rows={2}
                        className={`w-full px-0 py-2 text-sm border-0 border-b focus:ring-0 focus:border-gray-400 resize-none transition-colors ${
                          isEditing 
                            ? 'border-gray-200 bg-transparent' 
                            : 'border-transparent bg-transparent text-gray-700'
                        }`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={saveChanges}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">নিরাপত্তা সেটিংস</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <Shield className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-blue-900">পাসওয়ার্ড পরিবর্তন</p>
                        <p className="text-sm text-blue-600">আপনার অ্যাকাউন্টের নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড পরিবর্তন করুন</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">বর্তমান পাসওয়ার্ড</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">নতুন পাসওয়ার্ড</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="নতুন পাসওয়ার্ড লিখুন"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      পাসওয়ার্ড পরিবর্তন করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">নোটিফিকেশন সেটিংস</h2>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {key === 'emailNotifications' && 'ইমেইল নোটিফিকেশন'}
                            {key === 'smsNotifications' && 'এসএমএস নোটিফিকেশন'}
                            {key === 'systemAlerts' && 'সিস্টেম সতর্কতা'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === 'emailNotifications' && 'ইমেইলের মাধ্যমে বিজ্ঞপ্তি পান'}
                            {key === 'smsNotifications' && 'এসএমএসের মাধ্যমে বিজ্ঞপ্তি পান'}
                            {key === 'systemAlerts' && 'গুরুত্বপূর্ণ সিস্টেম সতর্কতা পান'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">সিস্টেম সেটিংস</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ভাষা</label>
                      <select
                        value={systemPreferences.language}
                        onChange={(e) => handleSystemChange('language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="bn">বাংলা</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">থিম</label>
                      <select
                        value={systemPreferences.theme}
                        onChange={(e) => handleSystemChange('theme', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="light">হালকা</option>
                        <option value="dark">গাঢ়</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">মুদ্রা</label>
                      <select
                        value={systemPreferences.currency}
                        onChange={(e) => handleSystemChange('currency', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>

                    <button
                      onClick={saveChanges}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      সেটিংস সংরক্ষণ করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Save Status Notification */}
              {saveStatus && (
                <div className="fixed bottom-6 right-6 z-50">
                  <div className={`flex items-center px-6 py-3 rounded-xl shadow-lg text-white transition-all duration-300 ${
                    saveStatus === 'saving' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span className="font-medium">সংরক্ষণ করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-3" />
                        <span className="font-medium">সফলভাবে সংরক্ষিত হয়েছে!</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;