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
  Camera,
  Phone,
  Mail,
  Lock,
  Download,
  Edit3,
  DollarSign,
  Calculator,
  Receipt,
  CreditCard,
  PieChart,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Printer
} from 'lucide-react';

const CashierSettings = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Cashier profile data - will be populated from real user data
  const [profileData, setProfileData] = useState({
    name: '',
    cashierId: '',
    phone: '',
    email: '',
    address: '',
    joinDate: '',
    role: 'ক্যাশিয়ার',
    nidNumber: '',
    emergencyContact: '',
    designation: 'প্রধান ক্যাশিয়ার'
  });

  // Load real user data when currentUser changes
  useEffect(() => {
    if (currentUser && !userLoading) {
      setProfileData(prev => ({
        ...prev,
        name: currentUser.name || 'অজানা ক্যাশিয়ার',
        cashierId: currentUser.id || 'CSH-001',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        joinDate: currentUser.joinDate || '',
        nidNumber: currentUser.nid || '',
        emergencyContact: currentUser.emergencyContact || ''
      }));
    }
  }, [currentUser, userLoading]);

  // Cashier-specific notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    dailyReports: true,
    paymentReminders: true,
    lowBalanceAlerts: true,
    depositNotifications: true,
    withdrawalNotifications: true,
    meetingNotifications: true
  });

  // Cashier security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    transactionPin: true,
    dailyLimitAlert: true
  });

  // Cashier preferences
  const [cashierPreferences, setCashierPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    dateFormat: 'dd/mm/yyyy',
    soundEnabled: true,
    autoLogout: true,
    receiptPrint: 'auto',
    transactionLimit: '25000',
    dailyReportTime: '18:00'
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      console.log('Cashier profile updated:', profileData);
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('নতুন পাসওয়ার্ড মিলছে না');
      return;
    }
    setSaveStatus('saving');
    setTimeout(() => {
      console.log('Cashier password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
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
    setCashierPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportTransactionData = () => {
    console.log('Exporting transaction data...');
    // Implementation for transaction data export
  };

  const generateDailyReport = () => {
    console.log('Generating daily report...');
    // Implementation for daily report generation
  };

  // Navigation items with badges
  const navigationItems = [
    { 
      id: 'profile', 
      label: 'প্রোফাইল তথ্য', 
      icon: User,
      badge: isEditing ? 'সম্পাদনা' : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'security', 
      label: 'নিরাপত্তা', 
      icon: Shield,
      badge: securitySettings.twoFactorAuth ? 'সুরক্ষিত' : 'ঝুঁকিপূর্ণ',
      badgeColor: securitySettings.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    },
    { 
      id: 'notifications', 
      label: 'নোটিফিকেশন', 
      icon: Bell,
      badge: Object.values(notificationSettings).filter(Boolean).length + '/১০',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      id: 'transaction', 
      label: 'লেনদেন সেটিংস', 
      icon: DollarSign,
      badge: 'সক্রিয়',
      badgeColor: 'bg-green-100 text-green-800'
    },
    { 
      id: 'reports', 
      label: 'রিপোর্ট ও ডেটা', 
      icon: FileText,
      badge: 'নতুন',
      badgeColor: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ক্যাশিয়ার সেটিংস</h1>
                <p className="text-gray-600 mt-1">লেনদেন ও প্রোফাইল সেটিংস পরিচালনা করুন</p>
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
              {saveStatus && (
                <div className={`flex items-center px-4 py-2 rounded-lg ${
                  saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {saveStatus === 'saving' ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      সংরক্ষণ করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      সফলভাবে সংরক্ষিত!
                    </>
                  )}
                </div>
              )}
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
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 mr-3 ${
                          activeTab === item.id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
              
              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">আজকের পরিসংখ্যান</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">লেনদেন:</span>
                    <span className="font-medium text-green-600">২৮টি</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">মোট পরিমাণ:</span>
                    <span className="font-medium">৮৫,০০০ টাকা</span>
                  </div>
                </div>
              </div>
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
                  <h2 className="text-lg font-medium text-gray-900">ক্যাশিয়ার প্রোফাইল</h2>
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
                    <p className="text-sm text-gray-500">{profileData.role}</p>
                    <p className="text-xs text-gray-400">আইডি: {profileData.cashierId}</p>
                  </div>
                </div>

                {/* Minimalist Profile Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      { key: 'name', label: 'নাম', type: 'text' },
                      { key: 'email', label: 'ইমেইল', type: 'email' },
                      { key: 'phone', label: 'ফোন', type: 'tel' },
                      { key: 'designation', label: 'পদবী', type: 'text' },
                      { key: 'nidNumber', label: 'এনআইডি', type: 'text' },
                      { key: 'emergencyContact', label: 'জরুরি যোগাযোগ', type: 'tel' },
                      { key: 'joinDate', label: 'যোগদানের তারিখ', type: 'date' }
                    ].map((field) => (
                      <div key={field.key} className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={profileData[field.key]}
                          onChange={(e) => setProfileData({...profileData, [field.key]: e.target.value})}
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
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
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
                      onClick={handleProfileUpdate}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">নিরাপত্তা সেটিংস</h2>
                </div>

                {/* Security Status */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  securitySettings.twoFactorAuth 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}>
                  <div className="flex items-center">
                    {securitySettings.twoFactorAuth ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                    )}
                    <p className="font-medium">
                      {securitySettings.twoFactorAuth 
                        ? 'আপনার অ্যাকাউন্ট সুরক্ষিত' 
                        : 'নিরাপত্তা উন্নতি প্রয়োজন'
                      }
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {securitySettings.twoFactorAuth 
                      ? 'দ্বি-ফ্যাক্টর অথেন্টিকেশন সক্রিয় রয়েছে' 
                      : 'দ্বি-ফ্যাক্টর অথেন্টিকেশন সক্রিয় করুন'
                    }
                  </p>
                </div>

                {/* Enhanced Password Change */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">পাসওয়ার্ড পরিবর্তন</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">বর্তমান পাসওয়ার্ড</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      <p className="text-xs text-gray-500 mt-1">কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর এবং একটি সংখ্যা</p>
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
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                {/* Enhanced Security Options */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">নিরাপত্তা বিকল্পসমূহ</h3>
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'twoFactorAuth', 
                        label: 'দ্বি-ফ্যাক্টর অথেন্টিকেশন', 
                        desc: 'অতিরিক্ত নিরাপত্তার জন্য SMS কোড',
                        icon: Shield,
                        recommended: true
                      },
                      { 
                        key: 'loginAlerts', 
                        label: 'লগইন সতর্কতা', 
                        desc: 'নতুন ডিভাইস থেকে লগইনের সময় ইমেইল পাঠান',
                        icon: Bell
                      },
                      { 
                        key: 'transactionPin', 
                        label: 'লেনদেন PIN', 
                        desc: 'বড় লেনদেনের জন্য অতিরিক্ত PIN',
                        icon: Lock,
                        recommended: true
                      },
                      { 
                        key: 'dailyLimitAlert', 
                        label: 'দৈনিক সীমা সতর্কতা', 
                        desc: 'দৈনিক লেনদেনের সীমা অতিক্রমের সতর্কতা',
                        icon: AlertTriangle
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <item.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{item.label}</p>
                              {item.recommended && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  প্রস্তাবিত
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings[item.key]}
                            onChange={(e) => handleSecurityChange(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">ক্যাশিয়ার নোটিফিকেশন</h2>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.values(notificationSettings).filter(Boolean).length}/১০ সক্রিয়
                  </div>
                </div>

                {/* Notification Categories */}
                <div className="space-y-6">
                  {/* Essential Notifications */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                      অত্যাবশ্যক বিজ্ঞপ্তি
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'transactionAlerts', label: 'লেনদেন সতর্কতা', desc: 'প্রতিটি লেনদেনের বিজ্ঞপ্তি', priority: 'high' },
                        { key: 'lowBalanceAlerts', label: 'কম ব্যালেন্স সতর্কতা', desc: 'তহবিল কম হলে বিজ্ঞপ্তি', priority: 'high' },
                        { key: 'dailyReports', label: 'দৈনিক রিপোর্ট', desc: 'দিনের শেষে লেনদেনের সারসংক্ষেপ', priority: 'medium' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              item.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
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

                  {/* Communication Notifications */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 text-blue-500 mr-2" />
                      যোগাযোগ বিজ্ঞপ্তি
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'ইমেইল নোটিফিকেশন', desc: 'গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান' },
                        { key: 'smsNotifications', label: 'SMS নোটিফিকেশন', desc: 'জরুরি বিষয়ের জন্য SMS পান' },
                        { key: 'pushNotifications', label: 'পুশ নোটিফিকেশন', desc: 'ব্রাউজার বিজ্ঞপ্তি' }
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
                </div>
              </div>
            )}

            {/* Enhanced Transaction Settings Tab */}
            {activeTab === 'transaction' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">লেনদেন সেটিংস</h2>
                </div>
                
                {/* Transaction Limits */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calculator className="h-5 w-5 text-blue-500 mr-2" />
                    লেনদেনের সীমা
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">দৈনিক লেনদেনের সীমা (টাকা)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={cashierPreferences.transactionLimit}
                          onChange={(e) => handlePreferenceChange('transactionLimit', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">বর্তমান সীমা: ২৫,০০০ টাকা</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">দৈনিক রিপোর্টের সময়</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          value={cashierPreferences.dailyReportTime}
                          onChange={(e) => handlePreferenceChange('dailyReportTime', e.target.value)}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receipt & Printing */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Printer className="h-5 w-5 text-purple-500 mr-2" />
                    রসিদ ও প্রিন্টিং
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">রসিদ প্রিন্ট</label>
                      <select
                        value={cashierPreferences.receiptPrint}
                        onChange={(e) => handlePreferenceChange('receiptPrint', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="auto">স্বয়ংক্রিয়</option>
                        <option value="manual">ম্যানুয়াল</option>
                        <option value="ask">জিজ্ঞাসা করুন</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">সেশন টাইমআউট (মিনিট)</label>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="15">১৫ মিনিট</option>
                        <option value="30">৩০ মিনিট</option>
                        <option value="60">১ ঘন্টা</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">দ্রুত সেটিংস</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">স্বয়ংক্রিয় লগআউট</p>
                          <p className="text-sm text-gray-600">নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cashierPreferences.autoLogout}
                          onChange={(e) => handlePreferenceChange('autoLogout', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">রিপোর্ট ও ডেটা</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Data Export */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Download className="h-5 w-5 text-blue-500 mr-2" />
                      ডেটা এক্সপোর্ট
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={exportTransactionData}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        লেনদেন ডেটা এক্সপোর্ট
                      </button>
                      <button
                        onClick={generateDailyReport}
                        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        দৈনিক রিপোর্ট তৈরি করুন
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Calendar className="h-4 w-4 mr-2" />
                        মাসিক রিপোর্ট
                      </button>
                    </div>
                  </div>

                  {/* Today's Summary */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      আজকের সারসংক্ষেপ
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">মোট জমা:</span>
                        </div>
                        <span className="font-medium text-green-600">৮৫,০০০ টাকা</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">মোট উত্তোলন:</span>
                        </div>
                        <span className="font-medium text-red-600">৪৫,০০০ টাকা</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">মোট লেনদেন:</span>
                        </div>
                        <span className="font-medium text-blue-600">২৮টি</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">হাতে নগদ:</span>
                        </div>
                        <span className="font-medium text-yellow-600">১,২৫,০০০ টাকা</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 text-purple-500 mr-2" />
                    কর্মক্ষমতা মেট্রিক্স
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">৯৮%</div>
                      <div className="text-sm text-gray-600">নির্ভুলতার হার</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">২.৫ মিনিট</div>
                      <div className="text-sm text-gray-600">গড় লেনদেনের সময়</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">৪.৮/৫</div>
                      <div className="text-sm text-gray-600">গ্রাহক সন্তুষ্টি</div>
                    </div>
                  </div>
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

export default CashierSettings;