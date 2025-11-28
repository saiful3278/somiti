import { useState, useEffect, useRef, useCallback } from 'react';

// Swipe Gesture Hook
export const useSwipeGesture = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const elementRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return elementRef;
};

// Long Press Hook
export const useLongPress = (onLongPress, delay = 500) => {
  const timeoutRef = useRef(null);
  const elementRef = useRef(null);

  const handleTouchStart = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return elementRef;
};

// Pinch to Zoom Hook
export const usePinchZoom = (minZoom = 0.5, maxZoom = 3) => {
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState(0);
  const elementRef = useRef(null);

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      setLastDistance(getDistance(e.touches));
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      const ratio = distance / lastDistance;
      
      setScale(prevScale => {
        const newScale = prevScale * ratio;
        return Math.min(Math.max(newScale, minZoom), maxZoom);
      });
      
      setLastDistance(distance);
    }
  }, [lastDistance, minZoom, maxZoom]);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove]);

  return {
    elementRef,
    scale,
    resetZoom
  };
};

// Mobile Scroll Hook with momentum
export const useMobileScroll = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const elementRef = useRef(null);
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);

  const handleScroll = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const currentScrollTop = element.scrollTop;
    
    setIsScrolling(true);
    setScrollDirection(currentScrollTop > lastScrollTop.current ? 'down' : 'up');
    lastScrollTop.current = currentScrollTop;

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set new timeout to detect scroll end
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      setScrollDirection(null);
    }, 150);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  return {
    elementRef,
    isScrolling,
    scrollDirection
  };
};

export default {
  useSwipeGesture,
  useLongPress,
  usePinchZoom,
  useMobileScroll
};