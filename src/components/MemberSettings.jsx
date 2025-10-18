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
  Lock,
  Download,
  Edit3,
  DollarSign,
  CreditCard,
  PieChart,
  FileText,
  Clock,
  Heart,
  Users,
  Calendar,
  Gift,
  Star,
  Award,
  Target,
  TrendingUp,
  HelpCircle,
  CheckCircle,
  Zap,
  AlertCircle,
  Home,
  MapPin,
  Briefcase
} from 'lucide-react';

const MemberSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Enhanced state management
  const [profileData, setProfileData] = useState({
    name: 'মোহাম্মদ রহিম',
    email: 'rahim@email.com',
    phone: '০১৭১২৩৪৫৬৭৮',
    address: 'ঢাকা, বাংলাদেশ',
    occupation: 'ব্যবসায়ী',
    nid: '১২৩৪৫৬৭৮৯০',
    emergencyContact: '০১৮১২৩৪৫৬৭৮'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    meetingReminders: true,
    paymentReminders: true,
    loanUpdates: true,
    savingsUpdates: true,
    eventNotifications: false,
    birthdayWishes: true,
    monthlyStatements: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    profileVisibility: 'members',
    contactVisibility: 'committee',
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: false
  });

  const [preferences, setPreferences] = useState({
    statementFrequency: 'monthly',
    reminderDays: 3,
    language: 'bn'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Handler functions
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
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

  const downloadStatement = () => {
    alert('স্টেটমেন্ট ডাউনলোড শুরু হচ্ছে...');
  };

  const downloadLoanHistory = () => {
    alert('ঋণের ইতিহাস ডাউনলোড শুরু হচ্ছে...');
  };

  // Navigation items with enhanced badges
  const navigationItems = [
    { 
      id: 'profile', 
      label: 'প্রোফাইল', 
      icon: User, 
      badge: isEditing ? 'সম্পাদনা' : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'security', 
      label: 'নিরাপত্তা', 
      icon: Shield, 
      badge: securitySettings.twoFactorAuth ? 'সক্রিয়' : 'নিষ্ক্রিয়',
      badgeColor: securitySettings.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    },
    { 
      id: 'notifications', 
      label: 'নোটিফিকেশন', 
      icon: Bell, 
      badge: Object.values(notificationSettings).filter(Boolean).length + '/' + Object.keys(notificationSettings).length,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      id: 'financial', 
      label: 'আর্থিক তথ্য', 
      icon: DollarSign, 
      badge: 'সক্রিয়',
      badgeColor: 'bg-green-100 text-green-800'
    },
    { 
      id: 'documents', 
      label: 'ডকুমেন্ট', 
      icon: FileText, 
      badge: null,
      badgeColor: ''
    }
  ];

  // Financial summary data
  const financialSummary = {
    totalSavings: 125000,
    monthlyDeposit: 5000,
    loanAmount: 50000,
    loanRemaining: 30000,
    shareCount: 10,
    membershipFee: 1000
  };

  // Recent activities
  const recentActivities = [
    { type: 'deposit', amount: 5000, date: '২০২৪-০১-১৫', status: 'completed' },
    { type: 'loan_payment', amount: 2000, date: '২০২৪-০১-১০', status: 'completed' },
    { type: 'profit_share', amount: 1500, date: '২০২৪-০১-০৫', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">সদস্য সেটিংস</h1>
                <p className="text-gray-600 mt-1">আপনার প্রোফাইল এবং পছন্দসমূহ পরিচালনা করুন</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>সর্বশেষ আপডেট: আজ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">সেটিংস মেনু</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`h-5 w-5 mr-3 ${
                        activeTab === item.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              
              {/* Profile Tab - Minimalist Design */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Minimalist Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-medium text-gray-900">প্রোফাইল তথ্য</h2>
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

                  {/* Minimalist Profile Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                      <p className="text-sm text-gray-500">সক্রিয় সদস্য</p>
                      <p className="text-xs text-gray-400">আইডি: #১২৩৪৫</p>
                    </div>
                  </div>

                  {/* Minimalist Profile Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        { key: 'name', label: 'নাম', type: 'text' },
                        { key: 'email', label: 'ইমেইল', type: 'email' },
                        { key: 'phone', label: 'ফোন', type: 'tel' },
                        { key: 'occupation', label: 'পেশা', type: 'text' },
                        { key: 'nid', label: 'এনআইডি', type: 'text' },
                        { key: 'emergencyContact', label: 'জরুরি যোগাযোগ', type: 'tel' }
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

                    {/* Address Field */}
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

                  {/* Minimalist Save Button */}
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

                  {/* Password Change Section */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-red-600" />
                      পাসওয়ার্ড পরিবর্তন
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'currentPassword', label: 'বর্তমান পাসওয়ার্ড', show: showPassword },
                        { key: 'newPassword', label: 'নতুন পাসওয়ার্ড', show: showPassword },
                        { key: 'confirmPassword', label: 'নতুন পাসওয়ার্ড নিশ্চিত করুন', show: showConfirmPassword }
                      ].map((field) => (
                        <div key={field.key} className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={field.show ? 'text' : 'password'}
                              value={passwordData[field.key]}
                              onChange={(e) => setPasswordData({...passwordData, [field.key]: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => field.key === 'confirmPassword' ? setShowConfirmPassword(!field.show) : setShowPassword(!field.show)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {field.show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="mt-4 flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      পাসওয়ার্ড পরিবর্তন করুন
                    </button>
                  </div>

                  {/* Privacy Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-blue-600" />
                      গোপনীয়তা সেটিংস
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">প্রোফাইল দৃশ্যমানতা</label>
                        <select
                          value={securitySettings.profileVisibility}
                          onChange={(e) => handleSecurityChange('profileVisibility', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="public">সবার জন্য</option>
                          <option value="members">শুধু সদস্যদের জন্য</option>
                          <option value="committee">শুধু কমিটির জন্য</option>
                          <option value="private">ব্যক্তিগত</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">যোগাযোগ তথ্য দৃশ্যমানতা</label>
                        <select
                          value={securitySettings.contactVisibility}
                          onChange={(e) => handleSecurityChange('contactVisibility', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="public">সবার জন্য</option>
                          <option value="members">শুধু সদস্যদের জন্য</option>
                          <option value="committee">শুধু কমিটির জন্য</option>
                          <option value="private">ব্যক্তিগত</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security Options */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      নিরাপত্তা বিকল্পসমূহ
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'twoFactorAuth',
                          label: 'দ্বি-ফ্যাক্টর প্রমাণীকরণ',
                          desc: 'অতিরিক্ত নিরাপত্তার জন্য SMS কোড ব্যবহার করুন',
                          icon: Shield,
                          color: 'text-green-600'
                        },
                        {
                          key: 'loginAlerts',
                          label: 'লগইন সতর্কতা',
                          desc: 'নতুন ডিভাইস থেকে লগইনের সময় ইমেইল পান',
                          icon: AlertCircle,
                          color: 'text-orange-600'
                        },
                        {
                          key: 'dataSharing',
                          label: 'ডেটা শেয়ারিং',
                          desc: 'তৃতীয় পক্ষের সাথে ডেটা শেয়ার করার অনুমতি দিন',
                          icon: Users,
                          color: 'text-blue-600'
                        }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Icon className={`h-5 w-5 ${item.color}`} />
                              <div>
                                <p className="font-medium text-gray-900">{item.label}</p>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={securitySettings[item.key]}
                                onChange={() => handleSecurityChange(item.key, !securitySettings[item.key])}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        );
                      })}
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
                      { key: 'emailNotifications', label: 'ইমেইল নোটিফিকেশন', desc: 'গুরুত্বপূর্ণ আপডেট ইমেইলে পান', icon: Mail, color: 'text-blue-600' },
                      { key: 'smsNotifications', label: 'SMS নোটিফিকেশন', desc: 'জরুরি বার্তা SMS এ পান', icon: Phone, color: 'text-green-600' },
                      { key: 'meetingReminders', label: 'সভার রিমাইন্ডার', desc: 'আসন্ন সভার আগে রিমাইন্ডার পান', icon: Calendar, color: 'text-purple-600' },
                      { key: 'paymentReminders', label: 'পেমেন্ট রিমাইন্ডার', desc: 'মাসিক জমার রিমাইন্ডার পান', icon: CreditCard, color: 'text-red-600' },
                      { key: 'loanUpdates', label: 'ঋণ আপডেট', desc: 'ঋণ সংক্রান্ত তথ্য পান', icon: DollarSign, color: 'text-yellow-600' },
                      { key: 'savingsUpdates', label: 'সঞ্চয় আপডেট', desc: 'সঞ্চয় হিসাবের আপডেট পান', icon: PieChart, color: 'text-indigo-600' },
                      { key: 'eventNotifications', label: 'ইভেন্ট নোটিফিকেশন', desc: 'সামাজিক অনুষ্ঠানের খবর পান', icon: Star, color: 'text-pink-600' },
                      { key: 'birthdayWishes', label: 'জন্মদিনের শুভেচ্ছা', desc: 'সদস্যদের জন্মদিনের শুভেচ্ছা পান', icon: Gift, color: 'text-orange-600' },
                      { key: 'monthlyStatements', label: 'মাসিক স্টেটমেন্ট', desc: 'মাসিক আর্থিক বিবরণী পান', icon: FileText, color: 'text-gray-600' }
                    ].map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${notification.color}`} />
                            <div>
                              <p className="font-medium text-gray-900">{notification.label}</p>
                              <p className="text-sm text-gray-600">{notification.desc}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[notification.key]}
                              onChange={() => handleNotificationChange(notification.key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">আর্থিক তথ্য</h2>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">মোট সঞ্চয়</p>
                          <p className="text-2xl font-bold text-green-900">৳ {financialSummary.totalSavings.toLocaleString()}</p>
                        </div>
                        <PieChart className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">মাসিক জমা</p>
                          <p className="text-2xl font-bold text-blue-900">৳ {financialSummary.monthlyDeposit.toLocaleString()}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600 text-sm font-medium">ঋণের পরিমাণ</p>
                          <p className="text-2xl font-bold text-red-900">৳ {financialSummary.loanAmount.toLocaleString()}</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-red-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">বাকি ঋণ</p>
                          <p className="text-2xl font-bold text-purple-900">৳ {financialSummary.loanRemaining.toLocaleString()}</p>
                        </div>
                        <Target className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Statement Preferences */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-gray-600" />
                      স্টেটমেন্ট পছন্দসমূহ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">স্টেটমেন্টের ফ্রিকোয়েন্সি</label>
                        <select
                          value={preferences.statementFrequency}
                          onChange={(e) => handlePreferenceChange('statementFrequency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="weekly">সাপ্তাহিক</option>
                          <option value="monthly">মাসিক</option>
                          <option value="quarterly">ত্রৈমাসিক</option>
                          <option value="yearly">বার্ষিক</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">রিমাইন্ডার দিন</label>
                        <select
                          value={preferences.reminderDays}
                          onChange={(e) => handlePreferenceChange('reminderDays', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={1}>১ দিন আগে</option>
                          <option value={3}>৩ দিন আগে</option>
                          <option value={7}>৭ দিন আগে</option>
                          <option value={15}>১৫ দিন আগে</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      সাম্প্রতিক কার্যক্রম
                    </h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {activity.type === 'deposit' ? 'মাসিক জমা' : 
                                 activity.type === 'loan_payment' ? 'ঋণ পরিশোধ' : 'লাভ বণ্টন'}
                              </p>
                              <p className="text-sm text-gray-600">{activity.date}</p>
                            </div>
                          </div>
                          {activity.amount && (
                            <span className={`font-medium ${
                              activity.type === 'deposit' || activity.type === 'profit_share' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {activity.type === 'deposit' || activity.type === 'profit_share' ? '+' : '-'}৳ {activity.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">ডকুমেন্ট ও সার্টিফিকেট</h2>

                  {/* Download Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">মাসিক স্টেটমেন্ট</h3>
                          <p className="text-sm text-gray-600">আপনার আর্থিক লেনদেনের বিস্তারিত</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadStatement}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        ডাউনলোড করুন
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <CreditCard className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">ঋণের ইতিহাস</h3>
                          <p className="text-sm text-gray-600">সকল ঋণ ও পরিশোধের তথ্য</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadLoanHistory}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        ডাউনলোড করুন
                      </button>
                    </div>
                  </div>

                  {/* Membership Information */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-yellow-600" />
                      সদস্যপদ তথ্য
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 font-medium">যোগদানের তারিখ</p>
                        <p className="text-lg font-bold text-blue-900">১৫ জানুয়ারি, ২০২০</p>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-600 font-medium">সদস্যপদের অবস্থা</p>
                        <p className="text-lg font-bold text-green-900">সক্রিয়</p>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">শেয়ার সংখ্যা</p>
                        <p className="text-lg font-bold text-purple-900">{financialSummary.shareCount} টি</p>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm text-orange-600 font-medium">ভোটাধিকার</p>
                        <p className="text-lg font-bold text-orange-900">হ্যাঁ</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Save Status Notification */}
        {saveStatus && (
          <div className={`fixed bottom-4 right-4 flex items-center px-4 py-2 rounded-lg text-white ${
            saveStatus === 'saving' ? 'bg-blue-600' : 'bg-green-600'
          } shadow-lg transition-all duration-300`}>
            {saveStatus === 'saving' && <Clock className="h-4 w-4 mr-2 animate-spin" />}
            {saveStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
            {saveStatus === 'saving' ? 'সংরক্ষণ হচ্ছে...' : 'সফলভাবে সংরক্ষিত হয়েছে!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSettings;