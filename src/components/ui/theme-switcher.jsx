import React, { useEffect, useMemo, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

console.log('[ThemeSwitcher] File loaded');

export default function ThemeSwitcher({ isDark, onToggle }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); console.log('[ThemeSwitcher] mounted'); }, []);

  const handleToggle = () => {
    console.log('[ThemeSwitcher] toggle', { next: !isDark });
    onToggle?.(!isDark);
  };

  if (!mounted) {
    return (
      <div className="theme-switcher-root" aria-hidden>
        <div className="ts-track ts-track--light" />
      </div>
    );
  }

  return (
    <div className="theme-switcher-root" role="switch" aria-checked={isDark} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <button className={`ts-button ${isDark ? 'ts-button--dark' : 'ts-button--light'}`} onClick={handleToggle} onMouseEnter={() => console.log('[ThemeSwitcher] hover')} onMouseLeave={() => console.log('[ThemeSwitcher] leave')}>
        <div className={`ts-track ${isDark ? 'ts-track--dark' : 'ts-track--light'}`}></div>
        <div className="ts-overlay ts-overlay--gloss" />
        <div className="ts-overlay ts-overlay--rim" />
        <div className="ts-icons">
          <Sun size={16} className={isDark ? 'ts-sun--dim' : 'ts-sun--bright'} />
          <Moon size={16} className={isDark ? 'ts-moon--bright' : 'ts-moon--dim'} />
        </div>
        <div className={`ts-thumb ${isDark ? 'ts-thumb--right' : 'ts-thumb--left'}`}>
          <div className="ts-thumb-gloss" />
          <div className={`ts-particle ${isDark ? 'ts-particle--dark' : 'ts-particle--light'}`} />
          <div className={`ts-particle ts-particle--delay ${isDark ? 'ts-particle--dark' : 'ts-particle--light'}`} />
          <div className={`ts-particle ts-particle--delay2 ${isDark ? 'ts-particle--dark' : 'ts-particle--light'}`} />
          <div className="ts-thumb-icon">{isDark ? <Moon size={16} className="ts-icon--moon" /> : <Sun size={16} className="ts-icon--sun" />}</div>
        </div>
      </button>
    </div>
  );
}
