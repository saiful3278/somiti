import React, { useState } from 'react';
import { Bell, Settings, Save, CheckCircle, Shield, Globe } from 'lucide-react';
import '../styles/components/AdminSettings.css';
import ModeSwitcher from './common/ModeSwitcher';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [saveStatus, setSaveStatus] = useState('');

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    transactionAlerts: true,
    membershipAlerts: true,
    securityAlerts: true
  });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT'
  });

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSystemChange = (key, value) => {
    setSystemPreferences(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const tabs = [
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'system', label: 'সিস্টেম', icon: Settings }
  ];

  const notificationItems = [
    { key: 'systemAlerts', title: 'সিস্টেম সতর্কতা', desc: 'সিস্টেম ত্রুটি ও রক্ষণাবেক্ষণ', icon: Globe, color: 'text-blue-500' },
    { key: 'transactionAlerts', title: 'লেনদেন সতর্কতা', desc: 'নতুন লেনদেন ও আর্থিক কার্যক্রম', icon: Save, color: 'text-green-500' },
    { key: 'membershipAlerts', title: 'সদস্যপদ সতর্কতা', desc: 'নতুন সদস্য ও সদস্যপদ পরিবর্তন', icon: Bell, color: 'text-yellow-500' },
    { key: 'securityAlerts', title: 'নিরাপত্তা সতর্কতা', desc: 'সন্দেহজনক কার্যকলাপ ও নিরাপত্তা', icon: Shield, color: 'text-red-500' }
  ];

  return (
    <div className="admin-settings">
      <div className="admin-settings-container">
        {/* Header */}
        <div className="admin-settings-header">
          <h1 className="admin-settings-title">অ্যাডমিন সেটিংস</h1>
          <p className="admin-settings-subtitle">সিস্টেম ও প্রশাসনিক সেটিংস পরিচালনা করুন</p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="admin-tab-content">

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <div className="settings-icon">
                  <Bell />
                </div>
                <div>
                  <h2 className="settings-section-title">নোটিফিকেশন সেটিংস</h2>
                  <p className="settings-section-subtitle">আপনার নোটিফিকেশন পছন্দ পরিচালনা করুন</p>
                </div>
              </div>

              <div className="settings-grid">
                <div className="settings-group">
                  <h3 className="settings-group-title">
                    <Bell className="h-4 w-4" />
                    সতর্কতা সেটিংস
                  </h3>
                  {notificationItems.map((item) => (
                    <div key={item.key} className="settings-item">
                      <div className="settings-item-info">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(item.key)}
                        className={`toggle-switch ${notificationSettings[item.key] ? 'active' : ''}`}
                      >
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-notice">
                <CheckCircle className="admin-notice-icon" />
                <p className="admin-notice-text">সেটিংস স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়</p>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="settings-section">
              <div className="settings-section-header">
                <div className="settings-icon">
                  <Settings />
                </div>
                <div>
                  <h2 className="settings-section-title">সিস্টেম সেটিংস</h2>
                  <p className="settings-section-subtitle">সিস্টেম পছন্দ কনফিগার করুন</p>
                </div>
              </div>

              <div className="settings-grid">
                <div className="settings-group">
                  <h3 className="settings-group-title">
                    <Globe className="h-4 w-4" />
                    সাধারণ সেটিংস
                  </h3>

                  <div className="settings-field">
                    <label className="settings-label">ভাষা</label>
                    <select
                      value={systemPreferences.language}
                      onChange={(e) => handleSystemChange('language', e.target.value)}
                      className="settings-dropdown"
                    >
                      <option value="bn">বাংলা</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">থিম</label>
                    <select
                      value={systemPreferences.theme}
                      onChange={(e) => handleSystemChange('theme', e.target.value)}
                      className="settings-dropdown"
                    >
                      <option value="light">হালকা</option>
                      <option value="dark">গাঢ়</option>
                    </select>
                  </div>

                  <div className="settings-field">
                    <label className="settings-label">মুদ্রা</label>
                    <select
                      value={systemPreferences.currency}
                      onChange={(e) => handleSystemChange('currency', e.target.value)}
                      className="settings-dropdown"
                    >
                      <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>

                  <button
                    onClick={saveChanges}
                    className="settings-button settings-button-primary"
                  >
                    <Save className="h-4 w-4" />
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </div>

              {/* Mode Switcher */}
              <ModeSwitcher />
            </div>
          )}
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`save-status ${saveStatus === 'saving' ? 'error' : 'success'}`}>
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>সংরক্ষণ করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>সংরক্ষিত হয়েছে!</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSettings;