import { useEffect, type RefObject } from "react";

/** Very subtle vertical parallax via transform — no layout change */
export function useSubtleParallax<T extends HTMLElement>(
  ref: RefObject<T | null>,
  factor = 0.06,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top - window.innerHeight * 0.32) * factor;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const enable = window.setTimeout(() => {
      if (!active) return;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
    }, 1200);

    return () => {
      active = false;
      window.clearTimeout(enable);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [ref, factor]);
}
