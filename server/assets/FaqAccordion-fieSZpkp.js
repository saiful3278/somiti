import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
function FaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    console.log("[FaqAccordion] mounted", { count: items.length });
  }, [items.length]);
  const toggle = (idx) => {
    const next = openIndex === idx ? null : idx;
    console.log("[FaqAccordion] toggle", { idx, next });
    setOpenIndex(next);
  };
  return /* @__PURE__ */ jsx("div", { className: "faq-accordion", children: items.map((it, idx) => /* @__PURE__ */ jsxs("div", { className: `faq-item ui-card card-faq ${openIndex === idx ? "open" : ""}`, onMouseEnter: () => console.log("[FaqAccordion] hover card", { idx, question: it.question }), onMouseLeave: () => console.log("[FaqAccordion] leave card", { idx, question: it.question }), children: [
    /* @__PURE__ */ jsxs("button", { className: "faq-question", onClick: () => toggle(idx), children: [
      it.question,
      /* @__PURE__ */ jsx("span", { className: "faq-chevron", "aria-hidden": true, children: openIndex === idx ? "–" : "+" })
    ] }),
    openIndex === idx && /* @__PURE__ */ jsx("div", { className: "faq-answer", children: /* @__PURE__ */ jsx("p", { children: it.answer }) }),
    /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
  ] }, idx)) });
}
export {
  FaqAccordion as default
};
