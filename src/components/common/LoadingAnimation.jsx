import React from 'react';

const LoadingAnimation = ({ 
  size = 150, 
  className = '', 
  style = {},
  centered = true 
}) => {
  const containerStyle = {
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
    backgroundColor: centered ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
    ...style
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