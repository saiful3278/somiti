import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';
import { Database, TestTube, ArrowRight, Check } from 'lucide-react';
import '../styles/ModeSelector.css';
import Meta from '../components/Meta';

const ModeSelector = () => {
    const { user } = useAuth();
    const { switchMode } = useMode();
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);

        // Mark that user has seen mode selector
        sessionStorage.setItem('hasSeenModeSelector', 'true');

        if (mode === 'demo') {
            // Auto-login for demo mode with random role
            const roles = ['admin', 'cashier', 'member'];
            const randomRole = roles[Math.floor(Math.random() * roles.length)];

            // Store demo user credentials in localStorage
            localStorage.setItem('somiti_token', 'demo-token');
            localStorage.setItem('somiti_uid', 'demo-user');
            localStorage.setItem('somiti_role', randomRole);

            // Switch to demo mode
            switchMode('demo');

            console.log('[ModeSelector] Demo mode selected, reloading to initialize demo user');

            // Reload the page so AuthContext can pick up the demo user from localStorage
            setTimeout(() => {
                window.location.href = `/#/${randomRole}`;
                window.location.reload();
            }, 300);
        } else {
            // Production mode - CRITICAL: Clear demo credentials first!
            console.log('[ModeSelector] Production mode selected, clearing all credentials');

            // Clear ALL localStorage to remove demo credentials
            localStorage.removeItem('somiti_token');
            localStorage.removeItem('somiti_uid');
            localStorage.removeItem('somiti_role');

            // Switch to production mode
            switchMode('production');

            // Navigate to login
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 300);
        }
    };

    const modes = [
        {
            id: 'production',
            title: 'প্রোডাকশন মোড',
            subtitle: 'Production Mode',
            description: 'আসল ডেটা এবং সম্পূর্ণ কার্যকারিতা সহ লগইন করুন',
            features: [
                'আসল সদস্য এবং লেনদেন',
                'Firebase ডেটাবেস সংযোগ',
                'সম্পূর্ণ সুরক্ষা এবং অনুমতি'
            ],
            icon: Database,
            color: '#3b82f6',
            bgColor: '#eff6ff'
        },
        {
            id: 'demo',
            title: 'ডেমো মোড',
            subtitle: 'Demo Mode',
            description: 'লগইন ছাড়াই নমুনা ডেটা দিয়ে অ্যাপ্লিকেশন পরীক্ষা করুন',
            features: [
                'নমুনা সদস্য এবং লেনদেন',
                'কোনো লগইনের প্রয়োজন নেই',
                'নিরাপদ পরীক্ষা পরিবেশ'
            ],
            icon: TestTube,
            color: '#10b981',
            bgColor: '#f0fdf4'
        }
    ];

    return (
        <div className="mode-selector-container">
            <Meta
                title="মোড নির্বাচন - ফুলমুড়ী যুব ফাউন্ডেশন"
                description="প্রোডাকশন বা ডেমো মোড নির্বাচন করুন"
            />

            <div className="mode-selector-content">
                {/* Header */}
                <div className="mode-selector-header">
                    <h1 className="mode-selector-title">মোড নির্বাচন করুন</h1>
                    <p className="mode-selector-subtitle">
                        আপনি কীভাবে অ্যাপ্লিকেশন ব্যবহার করতে চান?
                    </p>
                </div>

                {/* Mode Cards */}
                <div className="mode-cards-container">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const isSelected = selectedMode === mode.id;

                        return (
                            <div
                                key={mode.id}
                                className={`mode-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleModeSelect(mode.id)}
                            >
                                {/* Icon Section */}
                                <div
                                    className="mode-icon-wrapper"
                                    style={{ backgroundColor: mode.bgColor }}
                                >
                                    <Icon
                                        size={32}
                                        strokeWidth={2}
                                        style={{ color: mode.color }}
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="mode-content">
                                    <h2 className="mode-title">{mode.title}</h2>
                                    <p className="mode-subtitle-en">{mode.subtitle}</p>
                                    <p className="mode-description">{mode.description}</p>

                                    {/* Features List */}
                                    <ul className="mode-features">
                                        {mode.features.map((feature, index) => (
                                            <li key={index} className="mode-feature">
                                                <Check size={16} style={{ color: mode.color }} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <button
                                    className="mode-select-btn"
                                    style={{
                                        backgroundColor: mode.color,
                                        color: 'white'
                                    }}
                                >
                                    <span>নির্বাচন করুন</span>
                                    <ArrowRight size={20} />
                                </button>

                                {/* Selection Checkmark */}
                                {isSelected && (
                                    <div
                                        className="selection-checkmark"
                                        style={{ backgroundColor: mode.color }}
                                    >
                                        <Check size={16} color="white" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="mode-selector-footer">
                    <p>আপনি যেকোনো সময় সেটিংস থেকে মোড পরিবর্তন করতে পারবেন</p>
                </div>
            </div>
        </div>
    );
};

export default ModeSelector;
