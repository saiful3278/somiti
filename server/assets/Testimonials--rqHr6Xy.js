import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
function Testimonials({ items = [] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    console.log("[Testimonials] mounted", { count: items.length });
  }, [items.length]);
  const next = () => {
    const n = (idx + 1) % items.length;
    console.log("[Testimonials] next", { from: idx, to: n });
    setIdx(n);
  };
  const prev = () => {
    const p = (idx - 1 + items.length) % items.length;
    console.log("[Testimonials] prev", { from: idx, to: p });
    setIdx(p);
  };
  if (!items.length) return null;
  const t = items[idx];
  return /* @__PURE__ */ jsxs("div", { className: "testimonials", children: [
    /* @__PURE__ */ jsxs("div", { className: "testimonial-card ui-card card-people", onMouseEnter: () => console.log("[Testimonials] hover card", { idx, quote: t.quote }), onMouseLeave: () => console.log("[Testimonials] leave card", { idx, quote: t.quote }), children: [
      /* @__PURE__ */ jsxs("p", { className: "testimonial-quote", children: [
        "“",
        t.quote,
        "”"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "testimonial-author", children: [
        "— ",
        t.author
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "testimonial-actions", children: [
      /* @__PURE__ */ jsx("button", { className: "btn-outline", onClick: prev, children: "Prev" }),
      /* @__PURE__ */ jsx("button", { className: "btn-secondary", onClick: next, children: "Next" })
    ] })
  ] });
}
export {
  Testimonials as default
};
