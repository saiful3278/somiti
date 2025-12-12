import React, { useEffect } from 'react';

export default function MapBlock() {
  useEffect(() => {
    console.log('[MapBlock] mounted');
  }, []);

  return (
    <div className="map-block">
      <div className="map-placeholder">Map placeholder — Fulmuri (Munshirhat, Chauddagram, Cumilla, Chattogram)</div>
      <div className="map-actions">
        <a href="#" className="btn-secondary" onClick={() => console.log('[MapBlock] open map')}>মানচিত্র দেখুন</a>
      </div>
    </div>
  );
}

