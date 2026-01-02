import { jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
function StatsCounter({ value = 0, duration = 1200, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  useEffect(() => {
    console.log("[StatsCounter] start", { value, duration });
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const current = Math.floor(progress * value);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
      else console.log("[StatsCounter] done", { value });
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return /* @__PURE__ */ jsxs("span", { children: [
    prefix,
    display,
    suffix
  ] });
}
export {
  StatsCounter as default
};
