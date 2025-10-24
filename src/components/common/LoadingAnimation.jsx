import React from 'react';

const LoadingAnimation = ({ 
  size = 150, 
  className = '', 
  style = {},
  centered = true 
}) => {
  const baseStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: centered ? '100vh' : 'auto',
    position: centered ? 'fixed' : 'relative',
    top: centered ? 0 : 'auto',
    left: centered ? 0 : 'auto',
    right: centered ? 0 : 'auto',
    bottom: centered ? 0 : 'auto',
    zIndex: centered ? 9999 : 'auto',
    ...style
  };

  // Always enforce consistent background when centered
  const containerStyle = centered ? {
    ...baseStyle,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)'
  } : {
    ...baseStyle,
    backgroundColor: 'transparent',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none'
  };

  return (
    <div style={containerStyle} className={className}>
      <lottie-player
        src="/loading_animation.json"
        background="transparent"
        speed="1"
        style={{ width: `${size}px`, height: `${size}px` }}
        loop
        autoplay
      />
    </div>
  );
};

export default LoadingAnimation;