import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function InfoGrid({ facts = [] }) {
  useEffect(() => {
    console.log('[InfoGrid] mounted', { count: facts.length });
  }, [facts.length]);

  return (
    <div className="info-grid">
      {facts.map((f, i) => (
        <div key={i} className="info-item ui-card card-profile" onMouseEnter={() => console.log('[InfoGrid] hover card', { item: f.label })} onMouseLeave={() => console.log('[InfoGrid] leave card', { item: f.label })}>
          <div className="info-label"><span className="ui-card-icon" aria-hidden><MapPin size={16} /></span>{f.label}</div>
          <div className="info-value">{f.value}</div>
          <span className="ui-card-fx" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
