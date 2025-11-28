import React, { useState, useEffect } from 'react';
import { User, Bell, Settings, Save, CheckCircle, Shield, FileText } from 'lucide-react';
import '../styles/components/MemberSettings.css';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import LoadingAnimation from './common/LoadingAnimation';
import { fetchLoginHistory } from '../firebase/loginHistoryService';

const MemberSettings = () => {
  console.log("MemberSettings component module loaded.");
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loginHistoryError, setLoginHistoryError] = useState('');
  const { currentUser } = useUser();

  console.log("MemberSettings component rendered.");

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
          console.log("Fetching member data for UID:", currentUser.uid);
          const memberDocRef = doc(db, 'members', currentUser.uid);
          const memberDocSnap = await getDoc(memberDocRef);

          if (memberDocSnap.exists()) {
            const data = memberDocSnap.data();
            console.log("Member data found:", data);
            
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
            console.log("Calculated somiti_user_id:", somiti_user_id);

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
        console.log("No current user found.");
      }
    };

    fetchMemberData();

    const loadLoginHistory = async () => {
      const uid = currentUser?.uid || localStorage.getItem('somiti_uid')
      const { data, error } = await fetchLoginHistory(uid)
      if (error) {
        setLoginHistoryError('লগইন ইতিহাস লোড করা যায়নি')
      } else {
        setLoginHistory(data || [])
      }
    }

    loadLoginHistory();

    return () => {
      console.log("MemberSettings component unmounted.");
    };
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
    console.log(`Profile data changed: ${key} = ${value}`);
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key) => {
    console.log(`Notification setting toggled: ${key}`);
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityChange = (key, value) => {
    console.log(`Security setting changed: ${key} = ${value}`);
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSystemChange = (key, value) => {
    console.log(`System preference changed: ${key} = ${value}`);
    setSystemPreferences(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    if (!currentUser || !currentUser.uid) {
      console.error("No user logged in or user ID is missing");
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
      return;
    }

    console.log("Saving changes for user:", currentUser.uid);
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
      console.log("Changes saved successfully.");
    } catch (error) {
      console.error("Error updating document: ", error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'প্রোফাইল', icon: User },
    { id: 'system', label: 'সিস্টেম', icon: Settings },
    { id: 'history', label: 'লগইন ইতিহাস', icon: FileText },
  ];

  const notificationItems = [
    { key: 'accountUpdates', title: 'অ্যাকাউন্ট আপডেট', desc: 'অ্যাকাউন্ট ও ব্যালেন্স পরিবর্তনের বিজ্ঞপ্তি' },
    { key: 'paymentReminders', title: 'পেমেন্ট রিমাইন্ডার', desc: 'পেমেন্ট ও জমার তারিখ মনে করিয়ে দেওয়া' },
    { key: 'meetingNotifications', title: 'সভার বিজ্ঞপ্তি', desc: 'সমিতির সভা ও অনুষ্ঠানের তথ্য' },
    { key: 'loanAlerts', title: 'ঋণ সতর্কতা', desc: 'ঋণ পরিশোধ ও নতুন ঋণের তথ্য' }
  ];

  if (loading) {
    console.log("Loading state is true, showing loading animation.");
    return <LoadingAnimation />;
  }

  console.log("Final render of MemberSettings component.");
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
              onClick={() => {
                console.log(`Switched to tab: ${tab.id}`);
                setActiveTab(tab.id);
              }}
              className={`member-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="tab-icon" />
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
                  }`}>{profileData.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                </div>

                <div className="profile-field profile-field-full">
                  <label className="profile-label">ঠিকানা</label>
                  <span className="profile-value profile-value-address">
                    {profileData.address || 'তথ্য নেই'}
                  </span>
                </div>
              </div>

              {/* Share Information */}
              <div className="profile-group">
                <h3 className="profile-group-title">শেয়ার তথ্য</h3>
                <div className="profile-field">
                  <label className="profile-label">শেয়ার সংখ্যা</label>
                  <span className="profile-value">{profileData.shareCount || '০'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">যোগদানের তারিখ</label>
                  <span className="profile-value">{profileData.joiningDate || 'তথ্য নেই'}</span>
                </div>
              </div>

              {/* Nominee Information */}
              <div className="profile-group">
                <h3 className="profile-group-title">নমিনি তথ্য</h3>
                <div className="profile-field">
                  <label className="profile-label">নমিনির নাম</label>
                  <span className="profile-value">{profileData.nomineeName || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">নমিনির ফোন</label>
                  <span className="profile-value">{profileData.nomineePhone || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">নমিনির সাথে সম্পর্ক</label>
                  <span className="profile-value">{profileData.nomineeRelation || 'তথ্য নেই'}</span>
                </div>
              </div>

              {/* Account Information */}
              <div className="profile-group">
                <h3 className="profile-group-title">অ্যাকাউন্ট তথ্য</h3>
                <div className="profile-field">
                  <label className="profile-label">ইউজার আইডি</label>
                  <span className="profile-value profile-value-mono">{profileData.somiti_user_id || 'তথ্য নেই'}</span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">তৈরির তারিখ</label>
                  <span className="profile-value">
                    {profileData.createdAt && profileData.createdAt.toDate 
                      ? new Date(profileData.createdAt.toDate()).toLocaleDateString('bn-BD') 
                      : 'তথ্য নেই'}
                  </span>
                </div>
                <div className="profile-field">
                  <label className="profile-label">সর্বশেষ আপডেট</label>
                  <span className="profile-value">
                    {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString('bn-BD') : 'তথ্য নেই'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="settings-section-title">নোটিফিকেশন সেটিংস</h2>
            <div className="settings-list">
              {notificationItems.map((item) => (
                <div key={item.key} className="settings-item">
                  <div className="settings-item-text">
                    <h3 className="settings-item-title">{item.title}</h3>
                    <p className="settings-item-description">{item.desc}</p>
                  </div>
                  <div className="settings-item-control">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key]}
                        onChange={() => handleNotificationChange(item.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="settings-section">
            <h2 className="settings-section-title">সিস্টেম সেটিংস</h2>
            <div className="settings-grid">
              <div className="settings-item">
                <div className="settings-item-text">
                  <h3 className="settings-item-title">ভাষা</h3>
                </div>
                <div className="settings-item-control">
                  <select
                    className="settings-dropdown"
                    value={systemPreferences.language}
                    onChange={(e) => handleSystemChange('language', e.target.value)}
                  >
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="settings-item">
                <div className="settings-item-text">
                  <h3 className="settings-item-title">থিম</h3>
                </div>
                <div className="settings-item-control">
                  <select
                    className="settings-dropdown"
                    value={systemPreferences.theme}
                    onChange={(e) => handleSystemChange('theme', e.target.value)}
                  >
                    <option value="light">হালকা</option>
                    <option value="dark">গাঢ়</option>
                  </select>
                </div>
              </div>
              <div className="settings-item">
                <div className="settings-item-text">
                  <h3 className="settings-item-title">মুদ্রা</h3>
                </div>
                <div className="settings-item-control">
                  <select
                    className="settings-dropdown"
                    value={systemPreferences.currency}
                    onChange={(e) => handleSystemChange('currency', e.target.value)}
                  >
                    <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                    <option value="USD">US Dollar ($)</option>
                  </select>
                </div>
              </div>
              <div className="settings-item">
                <div className="settings-item-text">
                  <h3 className="settings-item-title">তারিখ ফরম্যাট</h3>
                </div>
                <div className="settings-item-control">
                  <select
                    className="settings-dropdown"
                    value={systemPreferences.dateFormat}
                    onChange={(e) => handleSystemChange('dateFormat', e.target.value)}
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="settings-footer">
              <button onClick={saveChanges} className="btn btn-primary">
                <Save className="btn-icon" />
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="settings-section">
            <h2 className="settings-section-title">লগইন ইতিহাস</h2>
            {loginHistoryError && (
              <div className="inline-error">
                <span>{loginHistoryError}</span>
              </div>
            )}
            <div className="history-list">
              {loginHistory.length === 0 ? (
                <div className="history-item">
                  <div className="history-meta-line">কোনো ইতিহাস পাওয়া যায়নি বা সেশন নেই</div>
                </div>
              ) : (
                loginHistory.map((row, idx) => (
                  <div key={idx} className="history-item">
                    <div className="history-date">{row.created_at?.toDate ? new Date(row.created_at.toDate()).toLocaleString('bn-BD') : (row.created_at ? new Date(row.created_at).toLocaleString('bn-BD') : '')}</div>
                    <div className="history-meta-line">ডিভাইস: {row.meta?.ua || 'অজানা'}</div>
                    <div className="history-meta-line">আইপি: {row.ip || 'অজানা'} | {row.meta?.country || ''}{row.meta?.city ? ', ' + row.meta.city : ''}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

          {/* Save Status */}
          {saveStatus && (
            <div className={`save-status ${saveStatus === 'success' ? 'success' : 'error'}`}>
              {saveStatus === 'success' ? (
                <>
                  <CheckCircle className="status-icon" />
                  <span>সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <>
                  <Shield className="status-icon" />
                  <span>ত্রুটি হয়েছে!</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberSettings;