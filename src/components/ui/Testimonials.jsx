import React, { useEffect, useState } from 'react';

export default function Testimonials({ items = [] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    console.log('[Testimonials] mounted', { count: items.length });
  }, [items.length]);

  const next = () => {
    const n = (idx + 1) % items.length;
    console.log('[Testimonials] next', { from: idx, to: n });
    setIdx(n);
  };
  const prev = () => {
    const p = (idx - 1 + items.length) % items.length;
    console.log('[Testimonials] prev', { from: idx, to: p });
    setIdx(p);
  };

  if (!items.length) return null;

  const t = items[idx];

  return (
    <div className="testimonials">
      <div className="testimonial-card ui-card card-people" onMouseEnter={() => console.log('[Testimonials] hover card', { idx, quote: t.quote })} onMouseLeave={() => console.log('[Testimonials] leave card', { idx, quote: t.quote })}>
        <p className="testimonial-quote">“{t.quote}”</p>
        <div className="testimonial-author">— {t.author}</div>
      </div>
      <div className="testimonial-actions">
        <button className="btn-outline" onClick={prev}>Prev</button>
        <button className="btn-secondary" onClick={next}>Next</button>
      </div>
    </div>
  );
}
