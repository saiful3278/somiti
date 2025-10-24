import React, { useState } from 'react';
import { Bell, Settings, Save, CheckCircle, Shield, DollarSign } from 'lucide-react';
import '../styles/components/CashierSettings.css';

const CashierSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [saveStatus, setSaveStatus] = useState('');

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    transactionAlerts: true,
    dailyReports: true,
    paymentReminders: true,
    lowBalanceAlerts: true
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    transactionPin: true
  });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    receiptPrint: 'auto'
  });

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

  const saveChanges = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const tabs = [
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'security', label: 'নিরাপত্তা', icon: Shield },
    { id: 'system', label: 'সিস্টেম', icon: Settings }
  ];

  const notificationItems = [
    { key: 'transactionAlerts', title: 'লেনদেন সতর্কতা', desc: 'নতুন লেনদেন ও আর্থিক কার্যক্রম' },
    { key: 'dailyReports', title: 'দৈনিক রিপোর্ট', desc: 'দৈনিক কার্যক্রমের সারসংক্ষেপ' },
    { key: 'paymentReminders', title: 'পেমেন্ট রিমাইন্ডার', desc: 'পেমেন্ট ও জমার তারিখ মনে করিয়ে দেওয়া' },
    { key: 'lowBalanceAlerts', title: 'কম ব্যালেন্স সতর্কতা', desc: 'অ্যাকাউন্টে কম ব্যালেন্সের সতর্কতা' }
  ];

  return (
    <div className="cashier-settings">
      <div className="cashier-settings-container">
        {/* Header */}
        <div className="cashier-settings-header">
          <h1 className="cashier-settings-title">ক্যাশিয়ার সেটিংস</h1>
          <p className="cashier-settings-subtitle">ক্যাশিয়ার প্যানেল ও কার্যক্রম সেটিংস পরিচালনা করুন</p>
        </div>

        {/* Tab Navigation */}
        <div className="cashier-settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cashier-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="cashier-tab-content">
        
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

            <div className="cashier-notice">
              <CheckCircle className="cashier-notice-icon" />
              <p className="cashier-notice-text">সেটিংস স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়</p>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <Shield />
              </div>
              <div>
                <h2 className="settings-section-title">নিরাপত্তা সেটিংস</h2>
                <p className="settings-section-subtitle">আপনার অ্যাকাউন্টের নিরাপত্তা পরিচালনা করুন</p>
              </div>
            </div>
            
            <div className="settings-grid">
              <div className="settings-group">
                <h3 className="settings-group-title">
                  <Shield className="h-4 w-4" />
                  নিরাপত্তা বিকল্প
                </h3>
                
                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>দ্বি-ফ্যাক্টর প্রমাণীকরণ</h4>
                    <p>অতিরিক্ত নিরাপত্তার জন্য সক্রিয় করুন</p>
                  </div>
                  <button
                    onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                    className={`toggle-switch ${securitySettings.twoFactorAuth ? 'active' : ''}`}
                  >
                  </button>
                </div>

                <div className="settings-item">
                  <div className="settings-item-info">
                    <h4>লেনদেন পিন</h4>
                    <p>লেনদেনের জন্য পিন প্রয়োজন</p>
                  </div>
                  <button
                    onClick={() => handleSecurityChange('transactionPin', !securitySettings.transactionPin)}
                    className={`toggle-switch ${securitySettings.transactionPin ? 'active' : ''}`}
                  >
                  </button>
                </div>

                <div className="settings-field">
                  <label className="settings-label">সেশন টাইমআউট (মিনিট)</label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="settings-dropdown"
                  >
                    <option value="15">১৫ মিনিট</option>
                    <option value="30">৩০ মিনিট</option>
                    <option value="60">৬০ মিনিট</option>
                  </select>
                </div>
              </div>
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
                  <DollarSign className="h-4 w-4" />
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

                <div className="settings-field">
                  <label className="settings-label">রসিদ প্রিন্ট</label>
                  <select
                    value={systemPreferences.receiptPrint}
                    onChange={(e) => handleSystemChange('receiptPrint', e.target.value)}
                    className="settings-dropdown"
                  >
                    <option value="auto">স্বয়ংক্রিয়</option>
                    <option value="manual">ম্যানুয়াল</option>
                    <option value="disabled">নিষ্ক্রিয়</option>
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

export default CashierSettings;