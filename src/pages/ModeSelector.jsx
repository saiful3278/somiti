import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMode } from '../contexts/ModeContext';
import { Database, TestTube, ArrowRight, Sparkles, Shield } from 'lucide-react';
import '../styles/ModeSelector.css';
import BubbleBackground from '../components/ui/BubbleBackground';
import Meta from '../components/Meta';

console.log('[ModeSelector] File loaded');

const ModeSelector = () => {
    const { user } = useAuth();
    const { switchMode } = useMode();
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [hoveredMode, setHoveredMode] = useState(null);

    // Mode selector is now shown when accessed directly from landing page

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
            // Production mode - redirect to login
            switchMode('production');
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 500);
        }
    };

    const modes = [
        {
            id: 'production',
            title: 'প্রোডাকশন মোড',
            subtitle: 'Production Mode',
            description: 'আসল ডেটা এবং সম্পূর্ণ কার্যকারিতা',
            features: [
                'আসল সদস্য এবং লেনদেন',
                'সম্পূর্ণ ডেটা অ্যাক্সেস',
                'সকল বৈশিষ্ট্য সক্রিয়'
            ],
            icon: Database,
            color: 'production',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            id: 'demo',
            title: 'ডেমো মোড',
            subtitle: 'Demo Mode',
            description: 'নমুনা ডেটা দিয়ে পরীক্ষা করুন',
            features: [
                'নমুনা সদস্য এবং লেনদেন',
                'নিরাপদ পরীক্ষা পরিবেশ',
                'সম্পূর্ণ কার্যকারিতা'
            ],
            icon: TestTube,
            color: 'demo',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }
    ];

    return (
        <BubbleBackground
            interactive={true}
            colors={{
                first: '102,126,234',
                second: '118,75,162',
                third: '240,147,251',
                fourth: '245,87,108',
                fifth: '100,200,255',
                sixth: '255,150,100'
            }}
        >
            <div className="mode-selector-container">
                <Meta
                    title="মোড নির্বাচন - ফুলমুড়ী যুব ফাউন্ডেশন"
                    description="প্রোডাকশন বা ডেমো মোড নির্বাচন করুন"
                />

                <div className="mode-selector-content">
                    {/* Header */}
                    <div className="mode-selector-header">
                        <div className="welcome-animation">
                            <Sparkles className="sparkle-icon" size={48} />
                        </div>
                        <h1 className="mode-selector-title">স্বাগতম, {user?.name || 'ব্যবহারকারী'}</h1>
                        <p className="mode-selector-subtitle">
                            আপনি কোন মোডে কাজ করতে চান?
                        </p>
                    </div>

                    {/* Mode Cards */}
                    <div className="mode-cards-container">
                        {modes.map((mode) => {
                            const Icon = mode.icon;
                            const isSelected = selectedMode === mode.id;
                            const isHovered = hoveredMode === mode.id;

                            return (
                                <div
                                    key={mode.id}
                                    className={`mode-card ${mode.color} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                                    onClick={() => handleModeSelect(mode.id)}
                                    onMouseEnter={() => setHoveredMode(mode.id)}
                                    onMouseLeave={() => setHoveredMode(null)}
                                    style={{
                                        '--gradient': mode.gradient
                                    }}
                                >
                                    <div className="mode-card-inner">
                                        {/* Icon Section */}
                                        <div className="mode-icon-wrapper">
                                            <div className="mode-icon-bg" style={{ background: mode.gradient }}>
                                                <Icon size={48} strokeWidth={2} />
                                            </div>
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
                                                        <Shield size={16} />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mode-action">
                                            <button
                                                className="mode-select-btn"
                                                style={{ background: mode.gradient }}
                                            >
                                                <span>নির্বাচন করুন</span>
                                                <ArrowRight size={20} />
                                            </button>
                                        </div>

                                        {/* Selection Indicator */}
                                        {isSelected && (
                                            <div className="selection-indicator">
                                                <div className="selection-pulse" style={{ background: mode.gradient }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info Footer */}
                    <div className="mode-selector-footer">
                        <p className="bengali-content">
                            আপনি যেকোনো সময় সেটিংস থেকে মোড পরিবর্তন করতে পারবেন
                        </p>
                    </div>
                </div>
            </div>
        </BubbleBackground>
    );
};

export default ModeSelector;
