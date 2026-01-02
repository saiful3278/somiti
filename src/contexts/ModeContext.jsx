import React, { createContext, useContext, useState, useEffect } from 'react';

console.log('[ModeContext] File loaded');

const ModeContext = createContext();

export const useMode = () => {
    const context = useContext(ModeContext);
    if (!context) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState('production'); // 'production' or 'demo'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // SSR Check: ensure window is defined
        if (typeof window === 'undefined') return;

        // Load saved mode from localStorage
        const savedMode = localStorage.getItem('somiti_mode');
        if (savedMode === 'demo' || savedMode === 'production') {
            setMode(savedMode);
            console.log('[ModeContext] Mode restored from localStorage:', savedMode);
        }
        setLoading(false);
    }, []);

    const switchMode = (newMode) => {
        if (newMode === 'demo' || newMode === 'production') {
            setMode(newMode);
            localStorage.setItem('somiti_mode', newMode);
            console.log('[ModeContext] Mode switched to:', newMode);

            // Don't reload - let the component handle navigation
            // Page reload is only needed when switching modes from settings
        }
    };

    const isDemo = () => mode === 'demo';
    const isProduction = () => mode === 'production';

    const value = {
        mode,
        loading,
        switchMode,
        isDemo,
        isProduction,
    };

    return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
};
