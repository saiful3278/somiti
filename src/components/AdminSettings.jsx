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
  Upload,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Info,
  Users,
  Database,
  FileText,
  BarChart3,
  DollarSign,
  TrendingUp,
  HelpCircle,
  CheckCircle,
  Clock,
  Zap,
  AlertCircle,
  Home,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Key,
  Activity,
  Server,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  RefreshCw,
  Power,
  Archive,
  Filter,
  Search,
  Plus,
  Minus,
  Star,
  Award,
  Target,
  Layers,
  Grid,
  List,
  MoreHorizontal
} from 'lucide-react';

const AdminSettings = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Enhanced admin profile data - will be populated from real user data
  const [profileData, setProfileData] = useState({
    name: '',
    adminId: '',
    phone: '',
    email: '',
    address: '',
    joinDate: '',
    role: 'প্রধান অ্যাডমিন',
    nidNumber: '',
    emergencyContact: '',
    department: 'প্রশাসন',
    designation: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
    permissions: ['সকল অধিকার', 'ডেটা ব্যাকআপ', 'ব্যবহারকারী ব্যবস্থাপনা']
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
        address: currentUser.address || '',
        joinDate: currentUser.joinDate || '',
        nidNumber: currentUser.nid || '',
        emergencyContact: currentUser.emergencyContact || ''
      }));
    }
  }, [currentUser, userLoading]);

  // Enhanced notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    systemAlerts: true,
    memberUpdates: true,
    financialAlerts: true,
    securityAlerts: true,
    backupNotifications: true,
    reportGeneration: true,
    maintenanceAlerts: false,
    loginAttempts: true,
    dataChanges: true
  });

  // Enhanced security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    ipWhitelist: true,
    auditLogs: true,
    dataEncryption: true,
    autoLockout: true,
    secureBackup: true,
    failedLoginLimit: '5',
    passwordComplexity: 'high',
    deviceTracking: true
  });

  // Enhanced system preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '12',
    soundEnabled: true,
    autoLogout: true,
    autoBackup: true,
    reportFrequency: 'weekly',
    memberApproval: 'manual',
    transactionLimit: '১,০০,০০০',
    backupTime: '02:00',
    maintenanceMode: false,
    debugMode: false
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // System statistics
  const [systemStats, setSystemStats] = useState({
    totalMembers: 125,
    totalFunds: 545000,
    activeTransactions: 48,
    lastBackup: '২ ঘন্টা আগে',
    systemUptime: '৯৯.৮%',
    storageUsed: '৭৫%',
    activeUsers: 23,
    pendingApprovals: 5
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

  const exportSystemData = () => {
    alert('সিস্টেম ডেটা এক্সপোর্ট শুরু হচ্ছে...');
  };

  const generateSystemReport = () => {
    alert('সিস্টেম রিপোর্ট তৈরি হচ্ছে...');
  };

  const performBackup = () => {
    alert('ব্যাকআপ প্রক্রিয়া শুরু হচ্ছে...');
  };

  const restoreBackup = () => {
    alert('ব্যাকআপ পুনরুদ্ধার প্রক্রিয়া শুরু হচ্ছে...');
  };

  // Enhanced navigation items
  const navigationItems = [
    { 
      id: 'profile', 
      label: 'প্রোফাইল', 
      icon: User, 
      description: 'ব্যক্তিগত তথ্য ও যোগাযোগ',
      badge: isEditing ? 'সম্পাদনা' : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'security', 
      label: 'নিরাপত্তা', 
      icon: Shield, 
      description: 'পাসওয়ার্ড ও নিরাপত্তা সেটিংস',
      badge: securitySettings.twoFactorAuth ? 'সুরক্ষিত' : 'ঝুঁকিপূর্ণ',
      badgeColor: securitySettings.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    },
    { 
      id: 'notifications', 
      label: 'নোটিফিকেশন', 
      icon: Bell, 
      description: 'বিজ্ঞপ্তি ও সতর্কতা',
      badge: Object.values(notificationSettings).filter(Boolean).length + '/' + Object.keys(notificationSettings).length,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      id: 'system', 
      label: 'সিস্টেম', 
      icon: Settings, 
      description: 'অ্যাপ্লিকেশন কনফিগারেশন',
      badge: systemPreferences.autoBackup ? 'স্বয়ংক্রিয়' : 'ম্যানুয়াল',
      badgeColor: systemPreferences.autoBackup ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    },
    { 
      id: 'reports', 
      label: 'রিপোর্ট ও ডেটা', 
      icon: BarChart3, 
      description: 'ডেটা এক্সপোর্ট ও রিপোর্ট',
      badge: 'নতুন',
      badgeColor: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header */}
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
                        ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 mr-3 ${
                          activeTab === item.id ? 'text-red-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <span className="font-medium block">{item.label}</span>
                          <span className="text-xs text-gray-500 block">{item.description}</span>
                        </div>
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

              {/* Quick System Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">দ্রুত স্থিতি</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">সিস্টেম আপটাইম</span>
                    <span className="font-medium text-green-600">{systemStats.systemUptime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">সক্রিয় ব্যবহারকারী</span>
                    <span className="font-medium text-blue-600">{systemStats.activeUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">স্টোরেজ ব্যবহার</span>
                    <span className="font-medium text-orange-600">{systemStats.storageUsed}</span>
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

                  {/* Minimalist Profile Header */}
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

                  {/* Minimalist Profile Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        { key: 'name', label: 'নাম', type: 'text' },
                        { key: 'email', label: 'ইমেইল', type: 'email' },
                        { key: 'phone', label: 'ফোন', type: 'tel' },
                        { key: 'designation', label: 'পদবী', type: 'text' },
                        { key: 'department', label: 'বিভাগ', type: 'text' },
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

                    {/* Permissions - Minimalist Display */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                        অনুমতিসমূহ
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {profileData.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {permission}
                          </span>
                        ))}
                      </div>
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

                  {/* Security Status Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <Shield className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <p className="font-semibold text-green-900">নিরাপত্তা স্কোর</p>
                          <p className="text-2xl font-bold text-green-600">৯৫%</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-semibold text-blue-900">সক্রিয় সেশন</p>
                          <p className="text-2xl font-bold text-blue-600">৩</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                        <div>
                          <p className="font-semibold text-orange-900">সতর্কতা</p>
                          <p className="text-2xl font-bold text-orange-600">০</p>
                        </div>
                      </div>
                    </div>
                  </div>

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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
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

                  {/* Security Settings */}
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
                          key: 'auditLogs',
                          label: 'অডিট লগ',
                          desc: 'সকল প্রশাসনিক কার্যক্রম রেকর্ড করুন',
                          icon: FileText,
                          color: 'text-blue-600'
                        },
                        {
                          key: 'dataEncryption',
                          label: 'ডেটা এনক্রিপশন',
                          desc: 'সংবেদনশীল ডেটা এনক্রিপ্ট করুন',
                          icon: Lock,
                          color: 'text-purple-600'
                        },
                        {
                          key: 'deviceTracking',
                          label: 'ডিভাইস ট্র্যাকিং',
                          desc: 'লগইন ডিভাইসের তথ্য সংরক্ষণ করুন',
                          icon: Smartphone,
                          color: 'text-indigo-600'
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
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Security Configuration */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-gray-600" />
                      নিরাপত্তা কনফিগারেশন
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">সেশন টাইমআউট (মিনিট)</label>
                        <select
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="15">১৫ মিনিট</option>
                          <option value="30">৩০ মিনিট</option>
                          <option value="60">১ ঘন্টা</option>
                          <option value="120">২ ঘন্টা</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড মেয়াদ (দিন)</label>
                        <select
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="30">৩০ দিন</option>
                          <option value="60">৬০ দিন</option>
                          <option value="90">৯০ দিন</option>
                          <option value="180">১৮০ দিন</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ব্যর্থ লগইনের সীমা</label>
                        <select
                          value={securitySettings.failedLoginLimit}
                          onChange={(e) => handleSecurityChange('failedLoginLimit', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="3">৩ বার</option>
                          <option value="5">৫ বার</option>
                          <option value="10">১০ বার</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড জটিলতা</label>
                        <select
                          value={securitySettings.passwordComplexity}
                          onChange={(e) => handleSecurityChange('passwordComplexity', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="low">সহজ</option>
                          <option value="medium">মাঝারি</option>
                          <option value="high">কঠিন</option>
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
                      { key: 'emailNotifications', label: 'ইমেইল নোটিফিকেশন', desc: 'গুরুত্বপূর্ণ আপডেট ইমেইলে পান', icon: Mail, color: 'text-blue-600' },
                      { key: 'smsNotifications', label: 'SMS নোটিফিকেশন', desc: 'জরুরি বার্তা SMS এ পান', icon: Phone, color: 'text-green-600' },
                      { key: 'pushNotifications', label: 'পুশ নোটিফিকেশন', desc: 'ব্রাউজার নোটিফিকেশন পান', icon: Bell, color: 'text-purple-600' },
                      { key: 'systemAlerts', label: 'সিস্টেম সতর্কতা', desc: 'সিস্টেম ত্রুটি ও সমস্যার বিজ্ঞপ্তি', icon: AlertTriangle, color: 'text-red-600' },
                      { key: 'memberUpdates', label: 'সদস্য আপডেট', desc: 'নতুন সদস্য ও সদস্য পরিবর্তনের তথ্য', icon: Users, color: 'text-indigo-600' },
                      { key: 'financialAlerts', label: 'আর্থিক সতর্কতা', desc: 'বড় লেনদেন ও আর্থিক পরিবর্তনের বিজ্ঞপ্তি', icon: DollarSign, color: 'text-yellow-600' },
                      { key: 'securityAlerts', label: 'নিরাপত্তা সতর্কতা', desc: 'সন্দেহজনক কার্যক্রম ও নিরাপত্তা ঝুঁকি', icon: Shield, color: 'text-orange-600' },
                      { key: 'backupNotifications', label: 'ব্যাকআপ নোটিফিকেশন', desc: 'ব্যাকআপ সফল/ব্যর্থতার তথ্য', icon: Database, color: 'text-teal-600' },
                      { key: 'reportGeneration', label: 'রিপোর্ট তৈরি', desc: 'স্বয়ংক্রিয় রিপোর্ট তৈরির বিজ্ঞপ্তি', icon: FileText, color: 'text-gray-600' },
                      { key: 'maintenanceAlerts', label: 'রক্ষণাবেক্ষণ সতর্কতা', desc: 'সিস্টেম রক্ষণাবেক্ষণের পূর্ব বিজ্ঞপ্তি', icon: Settings, color: 'text-pink-600' },
                      { key: 'loginAttempts', label: 'লগইন প্রচেষ্টা', desc: 'ব্যর্থ লগইন প্রচেষ্টার বিজ্ঞপ্তি', icon: Lock, color: 'text-red-500' },
                      { key: 'dataChanges', label: 'ডেটা পরিবর্তন', desc: 'গুরুত্বপূর্ণ ডেটা পরিবর্তনের বিজ্ঞপ্তি', icon: Edit3, color: 'text-blue-500' }
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">সিস্টেম সেটিংস</h2>

                  {/* System Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">মোট সদস্য</p>
                          <p className="text-2xl font-bold text-blue-900">{systemStats.totalMembers}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">মোট তহবিল</p>
                          <p className="text-2xl font-bold text-green-900">৳ {systemStats.totalFunds.toLocaleString()}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-600 text-sm font-medium">সক্রিয় লেনদেন</p>
                          <p className="text-2xl font-bold text-yellow-900">{systemStats.activeTransactions}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">অপেক্ষমাণ অনুমোদন</p>
                          <p className="text-2xl font-bold text-purple-900">{systemStats.pendingApprovals}</p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* General Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-gray-600" />
                      সাধারণ সেটিংস
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ভাষা</label>
                        <select
                          value={systemPreferences.language}
                          onChange={(e) => handleSystemChange('language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="light">হালকা</option>
                          <option value="dark">গাঢ়</option>
                          <option value="auto">স্বয়ংক্রিয়</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">মুদ্রা</label>
                        <select
                          value={systemPreferences.currency}
                          onChange={(e) => handleSystemChange('currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                          <option value="USD">US Dollar ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ ফরম্যাট</label>
                        <select
                          value={systemPreferences.dateFormat}
                          onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                          <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                          <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">সময় ফরম্যাট</label>
                        <select
                          value={systemPreferences.timeFormat}
                          onChange={(e) => handleSystemChange('timeFormat', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="12">১২ ঘন্টা</option>
                          <option value="24">২৪ ঘন্টা</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">লেনদেনের সীমা</label>
                        <input
                          type="text"
                          value={systemPreferences.transactionLimit}
                          onChange={(e) => handleSystemChange('transactionLimit', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Automation Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      স্বয়ংক্রিয় সেটিংস
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          key: 'autoBackup',
                          label: 'স্বয়ংক্রিয় ব্যাকআপ',
                          desc: 'নিয়মিত ডেটা ব্যাকআপ নিন',
                          icon: Database,
                          color: 'text-blue-600'
                        },
                        {
                          key: 'autoLogout',
                          label: 'স্বয়ংক্রিয় লগআউট',
                          desc: 'নিষ্ক্রিয়তার পর স্বয়ংক্রিয় লগআউট',
                          icon: Power,
                          color: 'text-red-600'
                        },
                        {
                          key: 'soundEnabled',
                          label: 'সাউন্ড সক্রিয়',
                          desc: 'নোটিফিকেশন সাউন্ড চালু করুন',
                          icon: Volume2,
                          color: 'text-green-600'
                        },
                        {
                          key: 'maintenanceMode',
                          label: 'রক্ষণাবেক্ষণ মোড',
                          desc: 'সিস্টেম রক্ষণাবেক্ষণের জন্য বন্ধ করুন',
                          icon: Settings,
                          color: 'text-orange-600'
                        },
                        {
                          key: 'debugMode',
                          label: 'ডিবাগ মোড',
                          desc: 'ডেভেলপমেন্ট ও ডিবাগিং সক্রিয় করুন',
                          icon: Monitor,
                          color: 'text-purple-600'
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
                                checked={systemPreferences[item.key]}
                                onChange={() => handleSystemChange(item.key, !systemPreferences[item.key])}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Backup Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-blue-600" />
                      ব্যাকআপ সেটিংস
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ব্যাকআপের ফ্রিকোয়েন্সি</label>
                        <select
                          value={systemPreferences.reportFrequency}
                          onChange={(e) => handleSystemChange('reportFrequency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="daily">দৈনিক</option>
                          <option value="weekly">সাপ্তাহিক</option>
                          <option value="monthly">মাসিক</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ব্যাকআপের সময়</label>
                        <input
                          type="time"
                          value={systemPreferences.backupTime}
                          onChange={(e) => handleSystemChange('backupTime', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={performBackup}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        এখনই ব্যাকআপ নিন
                      </button>
                      <button
                        onClick={restoreBackup}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        ব্যাকআপ পুনরুদ্ধার করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">রিপোর্ট ও ডেটা ব্যবস্থাপনা</h2>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">সিস্টেম রিপোর্ট</h3>
                          <p className="text-sm text-gray-600">সম্পূর্ণ সিস্টেমের বিস্তারিত রিপোর্ট</p>
                        </div>
                      </div>
                      <button
                        onClick={generateSystemReport}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        রিপোর্ট তৈরি করুন
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <Database className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">ডেটা এক্সপোর্ট</h3>
                          <p className="text-sm text-gray-600">সকল ডেটা CSV/Excel ফরম্যাটে</p>
                        </div>
                      </div>
                      <button
                        onClick={exportSystemData}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        ডেটা এক্সপোর্ট করুন
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <Archive className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">ডেটা আর্কাইভ</h3>
                          <p className="text-sm text-gray-600">পুরাতন ডেটা আর্কাইভ করুন</p>
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Archive className="h-4 w-4 mr-2" />
                        আর্কাইভ করুন
                      </button>
                    </div>
                  </div>

                  {/* Report Configuration */}
                   <div className="border border-gray-200 rounded-xl p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                       <FileText className="h-5 w-5 mr-2 text-gray-600" />
                       রিপোর্ট কনফিগারেশন
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">রিপোর্ট ফ্রিকোয়েন্সি</label>
                         <select
                           value={systemPreferences.reportFrequency}
                           onChange={(e) => handleSystemChange('reportFrequency', e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                         >
                           <option value="daily">দৈনিক</option>
                           <option value="weekly">সাপ্তাহিক</option>
                           <option value="monthly">মাসিক</option>
                           <option value="quarterly">ত্রৈমাসিক</option>
                           <option value="yearly">বার্ষিক</option>
                         </select>
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">রিপোর্ট ফরম্যাট</label>
                         <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                           <option value="pdf">PDF</option>
                           <option value="excel">Excel</option>
                           <option value="csv">CSV</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   {/* Data Export Options */}
                   <div className="border border-gray-200 rounded-xl p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                       <Download className="h-5 w-5 mr-2 text-blue-600" />
                       ডেটা এক্সপোর্ট বিকল্প
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { title: 'সদস্য তালিকা', description: 'সকল সদস্যের সম্পূর্ণ তথ্য', icon: Users, color: 'text-blue-600' },
                         { title: 'আর্থিক রিপোর্ট', description: 'লেনদেন ও তহবিলের বিবরণ', icon: DollarSign, color: 'text-green-600' },
                         { title: 'সভার কার্যবিবরণী', description: 'সভার সিদ্ধান্ত ও আলোচনা', icon: FileText, color: 'text-purple-600' },
                         { title: 'নোটিশ ও ঘোষণা', description: 'সকল নোটিশ ও ঘোষণার তালিকা', icon: Bell, color: 'text-orange-600' }
                       ].map((item, index) => {
                         const Icon = item.icon;
                         return (
                           <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center space-x-3">
                                 <Icon className={`h-6 w-6 ${item.color}`} />
                                 <div>
                                   <h4 className="font-medium text-gray-900">{item.title}</h4>
                                   <p className="text-sm text-gray-600">{item.description}</p>
                                 </div>
                               </div>
                               <button
                                 onClick={exportSystemData}
                                 className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                               >
                                 <Download className="h-4 w-4 mr-1" />
                                 এক্সপোর্ট
                               </button>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>

                   {/* System Analytics */}
                   <div className="border border-gray-200 rounded-xl p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                       <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                       সিস্টেম বিশ্লেষণ
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       {[
                         { label: 'মোট সদস্য', value: systemStats.totalMembers, icon: Users, color: 'blue', trend: '+৫%' },
                         { label: 'মোট তহবিল', value: `৳ ${systemStats.totalFunds.toLocaleString()}`, icon: DollarSign, color: 'green', trend: '+১২%' },
                         { label: 'সক্রিয় লেনদেন', value: systemStats.activeTransactions, icon: TrendingUp, color: 'yellow', trend: '+৮%' },
                         { label: 'শেষ ব্যাকআপ', value: systemStats.lastBackup, icon: Database, color: 'purple', trend: 'সফল' }
                       ].map((stat, index) => {
                         const Icon = stat.icon;
                         const getColorClasses = (color) => {
                           switch(color) {
                             case 'blue':
                               return {
                                 bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                                 border: 'border-blue-200',
                                 icon: 'text-blue-600',
                                 badge: 'bg-blue-200 text-blue-800',
                                 value: 'text-blue-900',
                                 label: 'text-blue-700'
                               };
                             case 'green':
                               return {
                                 bg: 'bg-gradient-to-br from-green-50 to-green-100',
                                 border: 'border-green-200',
                                 icon: 'text-green-600',
                                 badge: 'bg-green-200 text-green-800',
                                 value: 'text-green-900',
                                 label: 'text-green-700'
                               };
                             case 'yellow':
                               return {
                                 bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
                                 border: 'border-yellow-200',
                                 icon: 'text-yellow-600',
                                 badge: 'bg-yellow-200 text-yellow-800',
                                 value: 'text-yellow-900',
                                 label: 'text-yellow-700'
                               };
                             case 'purple':
                               return {
                                 bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
                                 border: 'border-purple-200',
                                 icon: 'text-purple-600',
                                 badge: 'bg-purple-200 text-purple-800',
                                 value: 'text-purple-900',
                                 label: 'text-purple-700'
                               };
                             default:
                               return {
                                 bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                                 border: 'border-gray-200',
                                 icon: 'text-gray-600',
                                 badge: 'bg-gray-200 text-gray-800',
                                 value: 'text-gray-900',
                                 label: 'text-gray-700'
                               };
                           }
                         };
                         const colorClasses = getColorClasses(stat.color);
                         return (
                           <div key={index} className={`${colorClasses.bg} p-4 rounded-xl border ${colorClasses.border}`}>
                             <div className="flex items-center justify-between mb-2">
                               <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
                               <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses.badge}`}>
                                 {stat.trend}
                               </span>
                             </div>
                             <div className={`text-2xl font-bold ${colorClasses.value} mb-1`}>{stat.value}</div>
                             <div className={`text-sm ${colorClasses.label}`}>{stat.label}</div>
                           </div>
                         );
                       })}
                     </div>
                   </div>

                   {/* Advanced Actions */}
                   <div className="border border-gray-200 rounded-xl p-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                       <Settings className="h-5 w-5 mr-2 text-gray-600" />
                       উন্নত কার্যক্রম
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <button
                         onClick={performBackup}
                         className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                       >
                         <Database className="h-6 w-6 text-blue-600 mr-3" />
                         <div className="text-left">
                           <div className="font-medium text-blue-900">সম্পূর্ণ ব্যাকআপ</div>
                           <div className="text-sm text-blue-600">সকল ডেটার ব্যাকআপ নিন</div>
                         </div>
                       </button>

                       <button
                         onClick={restoreBackup}
                         className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                       >
                         <Upload className="h-6 w-6 text-green-600 mr-3" />
                         <div className="text-left">
                           <div className="font-medium text-green-900">ব্যাকআপ পুনরুদ্ধার</div>
                           <div className="text-sm text-green-600">পূর্বের ব্যাকআপ পুনরুদ্ধার করুন</div>
                         </div>
                       </button>

                       <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                         <Archive className="h-6 w-6 text-purple-600 mr-3" />
                         <div className="text-left">
                           <div className="font-medium text-purple-900">ডেটা আর্কাইভ</div>
                           <div className="text-sm text-purple-600">পুরাতন ডেটা সংরক্ষণ করুন</div>
                         </div>
                       </button>

                       <button className="flex items-center justify-center p-4 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
                         <RefreshCw className="h-6 w-6 text-red-600 mr-3" />
                         <div className="text-left">
                           <div className="font-medium text-red-900">সিস্টেম রিসেট</div>
                           <div className="text-sm text-red-600">সিস্টেম পুনরায় চালু করুন</div>
                         </div>
                       </button>
                     </div>
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