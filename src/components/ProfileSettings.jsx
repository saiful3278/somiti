import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield,
  Eye,
  EyeOff,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Lock,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // User profile data
  const [profileData, setProfileData] = useState({
    name: 'মোহাম্মদ রহিম উদ্দিন',
    memberId: 'SM-001',
    phone: '০১৭১২৩৪৫৬৭৮',
    email: 'rahim@example.com',
    address: 'ঢাকা, বাংলাদেশ',
    joinDate: '২০২২-০১-১৫',
    membershipType: 'নিয়মিত সদস্য',
    nidNumber: '১২৩৪৫৬৭৮৯০',
    emergencyContact: '০১৮১২৩৪৫৬৭৮',
    occupation: 'ব্যবসায়ী'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    monthlyStatements: true,
    paymentReminders: true,
    meetingNotifications: true,
    profitDistribution: true,
    systemUpdates: false
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  // App preferences
  const [appPreferences, setAppPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    dateFormat: 'dd/mm/yyyy',
    soundEnabled: true,
    autoLogout: true
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = () => {
    console.log('Profile updated:', profileData);
    setIsEditing(false);
    // Show success message
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }
    console.log('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // Show success message
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setAppPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportData = () => {
    console.log('Exporting user data...');
    // Implementation for data export
  };

  const deleteAccount = () => {
    if (confirm('আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট মুছে ফেলতে চান?')) {
      console.log('Account deletion requested');
      // Implementation for account deletion
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">সেটিংস ও প্রোফাইল</h1>
          <p className="text-gray-600 mt-1">আপনার প্রোফাইল ও অ্যাপ্লিকেশন সেটিংস পরিচালনা করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-card p-4">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'প্রোফাইল তথ্য', icon: User },
                { id: 'security', label: 'নিরাপত্তা', icon: Shield },
                { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
                { id: 'preferences', label: 'পছন্দসমূহ', icon: Settings },
                { id: 'data', label: 'ডেটা ব্যবস্থাপনা', icon: Download }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-card p-6">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">প্রোফাইল তথ্য</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? 'বাতিল' : 'সম্পাদনা'}
                  </button>
                </div>

                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-blue-600">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                    <p className="text-gray-600">সদস্য আইডি: {profileData.memberId}</p>
                    <p className="text-gray-600">{profileData.membershipType}</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">জাতীয় পরিচয়পত্র</label>
                    <input
                      type="text"
                      value={profileData.nidNumber}
                      onChange={(e) => setProfileData({...profileData, nidNumber: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                    <textarea
                      rows={3}
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পেশা</label>
                    <input
                      type="text"
                      value={profileData.occupation}
                      onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">জরুরি যোগাযোগ</label>
                    <input
                      type="tel"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                      className="form-input disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
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

                {/* Password Change */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">পাসওয়ার্ড পরিবর্তন</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">বর্তমান পাসওয়ার্ড</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      পাসওয়ার্ড পরিবর্তন করুন
                    </button>
                  </div>
                </div>

                {/* Security Options */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">নিরাপত্তা বিকল্পসমূহ</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">দ্বি-ফ্যাক্টর অথেন্টিকেশন</p>
                        <p className="text-sm text-gray-600">অতিরিক্ত নিরাপত্তার জন্য SMS কোড</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorAuth}
                          onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">লগইন সতর্কতা</p>
                        <p className="text-sm text-gray-600">নতুন ডিভাইস থেকে লগইনের সময় ইমেইল পাঠান</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.loginAlerts}
                          onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">সেশন টাইমআউট</p>
                        <p className="text-sm text-gray-600">নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট</p>
                      </div>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                        className="form-select"
                      >
                        <option value="15">১৫ মিনিট</option>
                        <option value="30">৩০ মিনিট</option>
                        <option value="60">১ ঘন্টা</option>
                        <option value="120">২ ঘন্টা</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">নোটিফিকেশন সেটিংস</h2>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'ইমেইল নোটিফিকেশন', desc: 'গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান' },
                    { key: 'smsNotifications', label: 'SMS নোটিফিকেশন', desc: 'পেমেন্ট রিমাইন্ডার ও জরুরি বার্তা' },
                    { key: 'pushNotifications', label: 'পুশ নোটিফিকেশন', desc: 'অ্যাপে তাৎক্ষণিক বিজ্ঞপ্তি' },
                    { key: 'monthlyStatements', label: 'মাসিক বিবৃতি', desc: 'প্রতি মাসে আর্থিক বিবৃতি পান' },
                    { key: 'paymentReminders', label: 'পেমেন্ট রিমাইন্ডার', desc: 'বকেয়া পেমেন্টের জন্য অনুস্মারক' },
                    { key: 'meetingNotifications', label: 'সভার বিজ্ঞপ্তি', desc: 'আসন্ন সভা ও ইভেন্টের তথ্য' },
                    { key: 'profitDistribution', label: 'লাভ বিতরণ', desc: 'লাভ বিতরণের সময় বিজ্ঞপ্তি' },
                    { key: 'systemUpdates', label: 'সিস্টেম আপডেট', desc: 'নতুন ফিচার ও আপডেটের তথ্য' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key]}
                          onChange={() => handleNotificationChange(item.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">অ্যাপ্লিকেশন পছন্দসমূহ</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ভাষা</label>
                    <select
                      value={appPreferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="bn">বাংলা</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">থিম</label>
                    <select
                      value={appPreferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="light">হালকা</option>
                      <option value="dark">গাঢ়</option>
                      <option value="auto">স্বয়ংক্রিয়</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">মুদ্রা</label>
                    <select
                      value={appPreferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ ফরম্যাট</label>
                    <select
                      value={appPreferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="dd/mm/yyyy">দিন/মাস/বছর</option>
                      <option value="mm/dd/yyyy">মাস/দিন/বছর</option>
                      <option value="yyyy-mm-dd">বছর-মাস-দিন</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">সাউন্ড ইফেক্ট</p>
                      <p className="text-sm text-gray-600">বোতাম ক্লিক ও নোটিফিকেশন সাউন্ড</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appPreferences.soundEnabled}
                        onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">স্বয়ংক্রিয় লগআউট</p>
                      <p className="text-sm text-gray-600">নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appPreferences.autoLogout}
                        onChange={(e) => handlePreferenceChange('autoLogout', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">ডেটা ব্যবস্থাপনা</h2>

                <div className="space-y-4">
                  {/* Export Data */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">ডেটা এক্সপোর্ট</h3>
                        <p className="text-sm text-gray-600">আপনার সমস্ত ডেটা ডাউনলোড করুন</p>
                      </div>
                      <button
                        onClick={exportData}
                        className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-teal-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        এক্সপোর্ট করুন
                      </button>
                    </div>
                  </div>

                  {/* Import Data */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">ডেটা ইমপোর্ট</h3>
                        <p className="text-sm text-gray-600">ব্যাকআপ ফাইল থেকে ডেটা পুনরুদ্ধার করুন</p>
                      </div>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />
                        ইমপোর্ট করুন
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-900">অ্যাকাউন্ট মুছে ফেলুন</h3>
                        <p className="text-sm text-red-700 mt-1">
                          এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। আপনার সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।
                        </p>
                        <button
                          onClick={deleteAccount}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-3"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          অ্যাকাউন্ট মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;