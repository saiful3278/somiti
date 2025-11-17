import React, { useState } from 'react';
import { Settings, Save, CheckCircle, DollarSign } from 'lucide-react';
import '../styles/components/CashierSettings.css';

const CashierSettings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [saveStatus, setSaveStatus] = useState('');
  console.log('CashierSettings render', { activeTab });

  // System preferences
  const [systemPreferences, setSystemPreferences] = useState({
    language: 'bn',
    theme: 'light',
    currency: 'BDT',
    receiptPrint: 'auto'
  });

  const handleSystemChange = (key, value) => {
    setSystemPreferences(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = () => {
    setSaveStatus('saving');
    console.log('CashierSettings saveChanges', { systemPreferences });
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  const tabs = [
    { id: 'system', label: 'সিস্টেম', icon: Settings }
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