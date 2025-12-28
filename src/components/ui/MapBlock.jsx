import React, { useEffect } from 'react';

export default function MapBlock() {
  useEffect(() => {
    console.log('[MapBlock] mounted');
  }, []);

  return (
    <div className="map-block">
      <iframe
        title="Map of Fulmuri"
        src="https://maps.google.com/maps?q=Fulmuri%20Munshirhat%20Chauddagram%20Comilla&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="350"
        style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="map-actions">
        <a href="https://maps.google.com/?q=Fulmuri,+Cumilla" target="_blank" rel="noopener noreferrer" className="btn-secondary">
          গুগল ম্যাপে দেখুন
        </a>
      </div>
    </div>
  );
}

