import React from 'react';
import { useMode } from '../../contexts/ModeContext';
import { Database, TestTube, RefreshCw } from 'lucide-react';
import '../../styles/components/ModeSwitcher.css';

console.log('[ModeSwitcher] File loaded');

const ModeSwitcher = () => {
    const { mode, switchMode } = useMode();

    const handleModeChange = (newMode) => {
        if (newMode !== mode) {
            if (window.confirm(`আপনি কি ${newMode === 'demo' ? 'ডেমো' : 'প্রোডাকশন'} মোডে যেতে চান? পৃষ্ঠা পুনরায় লোড হবে।`)) {
                // Update mode
                switchMode(newMode);

                // Reload page to refresh data
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        }
    };

    return (
        <div className="mode-switcher-section">
            <div className="mode-switcher-header">
                <RefreshCw size={20} />
                <h3>মোড পরিবর্তন করুন</h3>
            </div>
            <p className="mode-switcher-description">
                প্রোডাকশন এবং ডেমো মোডের মধ্যে পরিবর্তন করুন। ডেমো মোডে নমুনা ডেটা প্রদর্শিত হবে।
            </p>

            <div className="mode-options">
                <button
                    className={`mode-option ${mode === 'production' ? 'active' : ''}`}
                    onClick={() => handleModeChange('production')}
                >
                    <div className="mode-option-icon production">
                        <Database size={24} />
                    </div>
                    <div className="mode-option-content">
                        <h4>প্রোডাকশন মোড</h4>
                        <p>আসল ডেটা এবং সম্পূর্ণ কার্যকারিতা</p>
                    </div>
                    {mode === 'production' && (
                        <div className="mode-checkmark">✓</div>
                    )}
                </button>

                <button
                    className={`mode-option ${mode === 'demo' ? 'active' : ''}`}
                    onClick={() => handleModeChange('demo')}
                >
                    <div className="mode-option-icon demo">
                        <TestTube size={24} />
                    </div>
                    <div className="mode-option-content">
                        <h4>ডেমো মোড</h4>
                        <p>নমুনা ডেটা দিয়ে পরীক্ষা করুন</p>
                    </div>
                    {mode === 'demo' && (
                        <div className="mode-checkmark">✓</div>
                    )}
                </button>
            </div>

            <div className="mode-current-status">
                <p>
                    <strong>বর্তমান মোড:</strong> {mode === 'demo' ? 'ডেমো মোড' : 'প্রোডাকশন মোড'}
                </p>
            </div>
        </div>
    );
};

export default ModeSwitcher;
