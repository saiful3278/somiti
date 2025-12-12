import React, { useState, useEffect } from 'react';

export default function FaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    console.log('[FaqAccordion] mounted', { count: items.length });
  }, [items.length]);

  const toggle = (idx) => {
    const next = openIndex === idx ? null : idx;
    console.log('[FaqAccordion] toggle', { idx, next });
    setOpenIndex(next);
  };

  return (
    <div className="faq-accordion">
      {items.map((it, idx) => (
        <div key={idx} className={`faq-item ui-card card-faq ${openIndex === idx ? 'open' : ''}`} onMouseEnter={() => console.log('[FaqAccordion] hover card', { idx, question: it.question })} onMouseLeave={() => console.log('[FaqAccordion] leave card', { idx, question: it.question })}>
          <button className="faq-question" onClick={() => toggle(idx)}>
            {it.question}
            <span className="faq-chevron" aria-hidden>{openIndex === idx ? '–' : '+'}</span>
          </button>
          {openIndex === idx && (
            <div className="faq-answer">
              <p>{it.answer}</p>
            </div>
          )}
          <span className="ui-card-fx" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
