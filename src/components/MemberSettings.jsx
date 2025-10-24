import React, { useState, useEffect } from 'react';
import { User, Bell, Settings, Save, CheckCircle, Shield, FileText } from 'lucide-react';
import '../styles/components/MemberSettings.css';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import LoadingAnimation from './common/LoadingAnimation';

const MemberSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  // Profile data - expanded to include all Firestore fields
  const [profileData, setProfileData] = useState({
    name: '',
    somiti_user_id: '',
    phone: '',
    email: '',
    address: '',
    role: '',
    status: '',
    shareCount: '',
    joiningDate: '',
    nomineeName: '',
    nomineePhone: '',
    nomineeRelation: '',
    user_id: '',
    createdAt: '',
    updatedAt: ''
  });
  useEffect(() => {
    const fetchMemberData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const memberDocRef = doc(db, 'members', currentUser.uid);
          const memberDocSnap = await getDoc(memberDocRef);

          if (memberDocSnap.exists()) {
            const data = memberDocSnap.data();
            
            // Fetch all members to determine the somiti_user_id
            const allMembersSnap = await getDocs(collection(db, 'members'));
            const allMembers = allMembersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const sortedMembers = allMembers.sort((a, b) => {
              // Ensure we have valid dates
              const joiningDateA = a.joiningDate || a.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
              const joiningDateB = b.joiningDate || b.createdAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0];
              
              const dateA = new Date(joiningDateA);
              const dateB = new Date(joiningDateB);
              
              // First sort by joining date
              if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
              }
              
              // If joining dates are same, sort by createdAt timestamp
              const createdA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
              const createdB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
              
              // If creation times are also same, sort by document ID for consistency
              if (createdA.getTime() === createdB.getTime()) {
                return a.id.localeCompare(b.id);
              }
              
              return createdA - createdB;
            });
            const currentUserIndex = sortedMembers.findIndex(member => member.id === currentUser.uid);
            const somiti_user_id = currentUserIndex !== -1 ? currentUserIndex + 1 : '';

            setProfileData({
              name: data.name || '',
              somiti_user_id: somiti_user_id,
              phone: data.phone || '',
              email: data.email || '',
              address: data.address || '',
              role: data.role || 'member',
              status: data.status || 'active',
              shareCount: data.shareCount || '0',
              joiningDate: data.joiningDate || '',
              nomineeName: data.nomineeName || '',
              nomineePhone: data.nomineePhone || '',
              nomineeRelation: data.nomineeRelation || '',
              user_id: data.user_id || currentUser.uid,
              createdAt: data.createdAt || '',
              updatedAt: data.updatedAt || ''
            });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching member data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [currentUser]);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    accountUpdates: true,
    paymentReminders: true,
    meetingNotifications: true,
    loanAlerts: true
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    passwordExpiry: '90'
  });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    dateFormat: 'dd/mm/yyyy'
  });

  const handleProfileChange = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSystemChange = (key, value) => {
    setSystemPreferences(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("No user logged in or user ID is missing");
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
      return;
    }

    setSaveStatus('saving');
    try {
      const memberDocRef = doc(db, 'members', currentUser.uid);
      await updateDoc(memberDocRef, {
        ...profileData,
        notificationSettings,
        securitySettings,
        systemPreferences,
        updatedAt: new Date().toISOString(),
      });
      setSaveStatus('success');
    } catch (error) {
      console.error("Error updating document: ", error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'প্রোফাইল', icon: User },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'security', label: 'নিরাপত্তা', icon: Shield },
    { id: 'system', label: 'সিস্টেম', icon: Settings }
  ];

  const notificationItems = [
    { key: 'accountUpdates', title: 'অ্যাকাউন্ট আপডেট', desc: 'অ্যাকাউন্ট ও ব্যালেন্স পরিবর্তনের বিজ্ঞপ্তি' },
    { key: 'paymentReminders', title: 'পেমেন্ট রিমাইন্ডার', desc: 'পেমেন্ট ও জমার তারিখ মনে করিয়ে দেওয়া' },
    { key: 'meetingNotifications', title: 'সভার বিজ্ঞপ্তি', desc: 'সমিতির সভা ও অনুষ্ঠানের তথ্য' },
    { key: 'loanAlerts', title: 'ঋণ সতর্কতা', desc: 'ঋণ পরিশোধ ও নতুন ঋণের তথ্য' }
  ];

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="member-settings">
      <div className="member-settings-container">
        <div className="member-settings-header">
          <h1 className="member-settings-title">সদস্য সেটিংস</h1>
          <p className="member-settings-subtitle">আপনার অ্যাকাউন্ট এবং পছন্দসমূহ পরিচালনা করুন</p>
        </div>

        {/* Tab Navigation */}
        <div className="member-settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`member-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="w-5 h-5 mr-2 inline" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="member-tab-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
            <div className="readonly-notice">
              <span className="readonly-notice-icon">ℹ️</span>
              <p className="readonly-notice-text">
                এই তথ্যগুলি শুধুমাত্র দেখার জন্য। পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।
              </p>
            </div>
            
            <div className="profile-section-header">
              <div className="profile-icon">
                <User />
              </div>
              <div>
                <h2 className="profile-section-title">প্রোফাইল তথ্য</h2>
                <p className="profile-section-subtitle">আপনার ব্যক্তিগত এবং সদস্যপদ সংক্রান্ত তথ্য</p>
              </div>
            </div>
            
            <div className="profile-grid">
              {/* Basic Information */}
              <div className="profile-group">
                <h3 className="profile-group-title">মৌলিক তথ্য</h3>
                <div className="profile-field">
                  <label className="profile-label">নাম</label>
                  <span className="profile-value">{profileData.name || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">সদস্য আইডি</label>
                  <span className="profile-value">{profileData.somiti_user_id || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">ফোন নম্বর</label>
                  <span className="profile-value">{profileData.phone || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">ইমেইল</label>
                  <span className="profile-value">{profileData.email || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">ভূমিকা</label>
                  <span className="profile-value">{profileData.role === 'member' ? 'সদস্য' : profileData.role || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">স্ট্যাটাস</label>
                  <span className={`profile-status ${
                    profileData.status === 'active' 
                      ? 'profile-status-active' 
                      : 'profile-status-inactive'
                  }`}>
                    {profileData.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>

                <div className="profile-field profile-field-full">
                  <label className="profile-label">ঠিকানা</label>
                  <span className="profile-value profile-value-address">
                    {profileData.address || 'তথ্য নেই'}
                  </span>
                </div>
              </div>

              {/* Share Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-3">শেয়ার তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">শেয়ার সংখ্যা</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.shareCount || '০'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">যোগদানের তারিখ</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.joiningDate || 'তথ্য নেই'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-3">নমিনি তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">নমিনির নাম</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.nomineeName || 'তথ্য নেই'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">নমিনির ফোন</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.nomineePhone || 'তথ্য নেই'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">নমিনির সাথে সম্পর্ক</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.nomineeRelation || 'তথ্য নেই'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-3">অ্যাকাউন্ট তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ইউজার আইডি</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 font-mono text-sm">
                      {profileData.somiti_user_id || 'তথ্য নেই'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">তৈরির তারিখ</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সর্বশেষ আপডেট</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                      {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Note */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    এই তথ্যগুলি শুধুমাত্র দেখার জন্য। কোনো পরিবর্তনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">নোটিফিকেশন সেটিংস</h2>
            
            <div className="space-y-4">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings[item.key] ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <p className="text-sm text-green-800">সেটিংস স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">নিরাপত্তা সেটিংস</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">দ্বি-ফ্যাক্টর প্রমাণীকরণ</h3>
                  <p className="text-sm text-gray-500">অতিরিক্ত নিরাপত্তার জন্য সক্রিয় করুন</p>
                </div>
                <button
                  onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.twoFactorAuth ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">লগইন সতর্কতা</h3>
                  <p className="text-sm text-gray-500">নতুন ডিভাইস থেকে লগইনের বিজ্ঞপ্তি</p>
                </div>
                <button
                  onClick={() => handleSecurityChange('loginAlerts', !securitySettings.loginAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.loginAlerts ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড মেয়াদ (দিন)</label>
                <select
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="30">৩০ দিন</option>
                  <option value="60">৬০ দিন</option>
                  <option value="90">৯০ দিন</option>
                  <option value="never">কখনো নয়</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">সিস্টেম সেটিংস</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ভাষা</label>
                <select
                  value={systemPreferences.language}
                  onChange={(e) => handleSystemChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">থিম</label>
                <select
                  value={systemPreferences.theme}
                  onChange={(e) => handleSystemChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="light">হালকা</option>
                  <option value="dark">গাঢ়</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">মুদ্রা</label>
                <select
                  value={systemPreferences.currency}
                  onChange={(e) => handleSystemChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                  <option value="USD">US Dollar ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ ফরম্যাট</label>
                <select
                  value={systemPreferences.dateFormat}
                  onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>

              <button
                onClick={saveChanges}
                className="flex items-center justify-center w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}

          {/* Save Status */}
          {saveStatus && (
            <div className="save-status success">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>সংরক্ষিত হয়েছে!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberSettings;