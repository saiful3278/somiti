import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Star, Heart } from 'lucide-react';
import '../../styles/components/success-animation.css';

const SuccessAnimation = ({ 
  isVisible, 
  onClose, 
  title = "সফল!", 
  message = "আপনার কাজটি সফলভাবে সম্পন্ন হয়েছে।",
  autoClose = true,
  duration = 3000,
  type = "default" // default, member, transaction
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      generateParticles();
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, duration]);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1000,
        duration: 2000 + Math.random() * 1000,
        size: 8 + Math.random() * 16
      });
    }
    setParticles(newParticles);
  };

  const handleClose = () => {
    setShowAnimation(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'member':
        return <Heart className="success-icon" />;
      case 'transaction':
        return <Star className="success-icon" />;
      default:
        return <CheckCircle className="success-icon" />;
    }
  };

  const getThemeClass = () => {
    switch (type) {
      case 'member':
        return 'success-animation-member';
      case 'transaction':
        return 'success-animation-transaction';
      default:
        return 'success-animation-default';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`success-animation-overlay ${showAnimation ? 'show' : ''}`}>
      <div className={`success-animation-container ${getThemeClass()} ${showAnimation ? 'animate' : ''}`}>
        {/* Background particles */}
        <div className="success-particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="success-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}ms`,
                animationDuration: `${particle.duration}ms`,
                width: `${particle.size}px`,
                height: `${particle.size}px`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="success-content">
          {/* Icon with pulse effect */}
          <div className="success-icon-container">
            {getIcon()}
            <div className="success-pulse-ring"></div>
            <div className="success-pulse-ring-2"></div>
          </div>

          {/* Text content */}
          <div className="success-text">
            <h2 className="success-title">{title}</h2>
            <p className="success-message">{message}</p>
          </div>

          {/* Sparkle effects */}
          <div className="success-sparkles">
            <Sparkles className="sparkle sparkle-1" />
            <Sparkles className="sparkle sparkle-2" />
            <Sparkles className="sparkle sparkle-3" />
            <Sparkles className="sparkle sparkle-4" />
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && (
            <div className="success-progress-container">
              <div 
                className="success-progress-bar"
                style={{ animationDuration: `${duration}ms` }}
              ></div>
            </div>
          )}

          {/* Close button */}
          {!autoClose && (
            <button 
              className="success-close-btn"
              onClick={handleClose}
            >
              বন্ধ করুন
            </button>
          )}
        </div>

        {/* Confetti effect */}
        <div className="success-confetti">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`confetti confetti-${i % 4 + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2000}ms`,
                animationDuration: `${3000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;