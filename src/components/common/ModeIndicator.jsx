import React from 'react';
import { useMode } from '../../contexts/ModeContext';
import { TestTube, Database } from 'lucide-react';
import '../../styles/components/ModeIndicator.css';

console.log('[ModeIndicator] File loaded');

const ModeIndicator = () => {
    const { mode, isDemo } = useMode();

    if (mode === 'production') {
        return null; // Don't show indicator in production mode
    }

    return (
        <div className={`mode-indicator ${mode}`}>
            <div className="mode-indicator-content">
                {isDemo() ? (
                    <>
                        <TestTube size={16} />
                        <span className="mode-text">ডেমো মোড</span>
                    </>
                ) : (
                    <>
                        <Database size={16} />
                        <span className="mode-text">প্রোডাকশন</span>
                    </>
                )}
            </div>
            <div className="mode-indicator-pulse" />
        </div>
    );
};

export default ModeIndicator;
