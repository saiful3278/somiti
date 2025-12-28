import React, { useEffect, useRef } from 'react';
import '../../styles/components/BubbleBackground.css';
console.log('[BubbleBackground] File loaded');

const defaultColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '200,50,50',
  fifth: '180,180,50',
  sixth: '140,100,255',
};

const BubbleBackground = ({ interactive = false, colors = defaultColors, transition = { stiffness: 100, damping: 20 }, isDark = false, children, ...props }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let mx = 0;
    let my = 0;
    let raf = null;
    let driftRaf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mx = x * 2 - 1;
      my = y * 2 - 1;
      if (!raf) raf = requestAnimationFrame(applyMouse);
    };
    const applyMouse = () => {
      raf = null;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    };
    const startDrift = () => {
      if (driftRaf) return;
      console.log('[BubbleBackground] Touch drift started');
      let t = 0;
      const step = () => {
        t += 0.016;
        const dx = Math.sin(t * 0.6) * 0.15;
        const dy = Math.cos(t * 0.8) * 0.15;
        el.style.setProperty('--mx', dx.toFixed(3));
        el.style.setProperty('--my', dy.toFixed(3));
        driftRaf = requestAnimationFrame(step);
      };
      driftRaf = requestAnimationFrame(step);
    };
    const onTouchStart = () => {
      startDrift();
    };
    if (interactive) {
      el.addEventListener('mousemove', onMove);
      el.addEventListener('touchstart', onTouchStart, { passive: true });
    }
    console.log('[BubbleBackground] Mounted');
    return () => {
      if (interactive) el.removeEventListener('mousemove', onMove);
      if (interactive) el.removeEventListener('touchstart', onTouchStart);
      if (raf) cancelAnimationFrame(raf);
      if (driftRaf) cancelAnimationFrame(driftRaf);
    };
  }, [interactive, transition]);

  const styleVars = {
    '--c1': colors.first,
    '--c2': colors.second,
    '--c3': colors.third,
    '--c4': colors.fourth,
    '--c5': colors.fifth,
    '--c6': colors.sixth,
  };

  return (
    <div ref={rootRef} className={`bubble-background-root ${isDark ? 'dark' : ''}`} style={styleVars} {...props}>
      <div className="bubble-background">
        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
        <div className="bubble b4" />
        <div className="bubble b5" />
        <div className="bubble b6" />
      </div>
      <div className="bubble-content">
        {children}
      </div>
    </div>
  );
};

export default BubbleBackground;