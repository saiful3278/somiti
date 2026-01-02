import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { MapPin } from "lucide-react";
function InfoGrid({ facts = [] }) {
  useEffect(() => {
    console.log("[InfoGrid] mounted", { count: facts.length });
  }, [facts.length]);
  return /* @__PURE__ */ jsx("div", { className: "info-grid", children: facts.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "info-item ui-card card-profile", onMouseEnter: () => console.log("[InfoGrid] hover card", { item: f.label }), onMouseLeave: () => console.log("[InfoGrid] leave card", { item: f.label }), children: [
    /* @__PURE__ */ jsxs("div", { className: "info-label", children: [
      /* @__PURE__ */ jsx("span", { className: "ui-card-icon", "aria-hidden": true, children: /* @__PURE__ */ jsx(MapPin, { size: 16 }) }),
      f.label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "info-value", children: f.value }),
    /* @__PURE__ */ jsx("span", { className: "ui-card-fx", "aria-hidden": "true" })
  ] }, i)) });
}
export {
  InfoGrid as default
};
