import React from 'react';
import '../../styles/components/theme-toggle.css';
import ThemeSwitcher from './theme-switcher';

console.log('[CinematicThemeSwitcher] File loaded');

export default function CinematicThemeSwitcher({ isDark = false, onToggle = () => {} }) {
  return (
    <div>
      <ThemeSwitcher isDark={isDark} onToggle={onToggle} />
    </div>
  );
}

