import React from 'react';
import { Link } from 'react-router-dom';

console.log('[RainbowButton] File loaded');

export function RainbowButton({ to = '/member', children = 'সদস্য পোর্টাল', className = '', onClick }) {
  const handleClick = (e) => {
    console.log('[RainbowButton] click', { to });
    if (onClick) onClick(e);
  };
  return (
    <Link to={to} onClick={handleClick} className={`magic-rainbow-btn ${className}`} aria-label="সদস্য পোর্টাল">
      <span className="magic-rainbow-inner">{children}</span>
    </Link>
  );
}

